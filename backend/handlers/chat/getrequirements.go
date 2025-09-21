package chat

import (
	"encoding/json"
	"fmt"
	"reflect"
	"time"

	"github.com/aws/aws-sdk-go-v2/service/lambda"
	"github.com/gin-gonic/gin"
	"github.com/yihao03/Aistronaut/m/v2/db"
	"github.com/yihao03/Aistronaut/m/v2/lda"
	"github.com/yihao03/Aistronaut/m/v2/models"
	"github.com/yihao03/Aistronaut/m/v2/params/chatparams"
)

type LambdaPayload struct {
	UserPrompt      string `json:"user_prompt"`
	FirstName       string `json:"first_name"`
	Today           string `json:"today"`
	UserCountry     string `json:"user_country"`
	ExistingContext string `json:"existing_context"`
	ChatHistory     string `json:"chat_history"`
	FlightOptions   string `json:"flight_options,omitempty"`
}

type LambdaRequest struct {
	Body LambdaPayload `json:"body"`
}

type FinalResponse struct {
	FlightDetails       models.FlightBookings        `json:"flight_details"`
	TripDetails         models.Trip                  `json:"trip_details"`
	AccomodationDetails models.AccommodationBookings `json:"accomodation_details"`
	Response            string                       `json:"response"`
}

type BodyResponse struct {
	Response string `json:"response"`
}

type LambdaResponse struct {
	Body       string            `json:"body"`
	Headers    map[string]string `json:"headers"`
	StatusCode int               `json:"statusCode"`
}

func getRequirements(c *gin.Context, trip *models.Trip, chat chatparams.CreateParams, chatHistories *[]models.ChatHistory) (*FinalResponse, error) {
	lambdaClient := lda.GetLambda()
	db := db.GetDB()

	var user models.Users
	db.Find(&user, "user_id = ?", trip.UserID)

	jsonString, err := json.Marshal(trip)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal trip: %v", err)
	}

	payload := LambdaPayload{
		UserPrompt:      chat.Content,
		FirstName:       user.Username,
		Today:           time.Now().Format("Monday, January 2, 2006"),
		UserCountry:     user.Nationality,
		ExistingContext: string(jsonString),
		ChatHistory:     models.ChatHistories(*chatHistories).ToString(),
	}

	request := LambdaRequest{
		Body: payload,
	}

	marshaledPayload, err := json.Marshal(request)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal payload: %v", err)
	}

	output, err := lambdaClient.Invoke(c.Request.Context(), &lambda.InvokeInput{
		FunctionName: lda.PARSER,
		Payload:      marshaledPayload,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to invoke Lambda function: %v", err)
	}

	// Parse the Lambda response
	var lambdaResp LambdaResponse
	if err := json.Unmarshal(output.Payload, &lambdaResp); err != nil {
		return nil, fmt.Errorf("failed to parse Lambda response: %v", err)
	}

	// Parse the body JSON string
	var bodyResp BodyResponse
	if err := json.Unmarshal([]byte(lambdaResp.Body), &bodyResp); err != nil {
		return nil, fmt.Errorf("failed to parse body: %v", err)
	}

	// Parse the inner response JSON string
	finalResp, err := parseResponse(bodyResp.Response)
	if err != nil {
		return nil, fmt.Errorf("failed to parse inner response: %v", err)
	}

	// Get settable reflect.Value for the trip pointer
	tripValue := reflect.ValueOf(trip).Elem()
	// tripType := tripValue.Type()

	// Get reflect.Value for finalResp.TripDetails (source of updates)
	sourceValue := reflect.ValueOf(finalResp.TripDetails)
	sourceType := sourceValue.Type()

	for i := 0; i < sourceValue.NumField(); i++ {
		sourceField := sourceValue.Field(i)
		sourceFieldType := sourceType.Field(i)

		// Find the corresponding field in trip by name
		tripField := tripValue.FieldByName(sourceFieldType.Name)
		if tripField.IsValid() &&
			tripField.CanSet() &&
			tripField.IsZero() &&
			!sourceField.IsZero() &&
			tripField.Type() == sourceField.Type() {
			// Set the field value
			tripField.Set(sourceField)

			// Update this specific field in the database
			fieldName := sourceFieldType.Name
			if err := db.Model(trip).Update(fieldName, sourceField.Interface()).Error; err != nil {
				return nil, fmt.Errorf("failed to update field %s: %v", fieldName, err)
			}
		}
	}

	return finalResp, nil
}
