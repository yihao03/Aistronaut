package chat

import (
	"encoding/json"
	"reflect"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go-v2/service/lambda"
	"github.com/gin-gonic/gin"
	"github.com/yihao03/Aistronaut/m/v2/db"
	"github.com/yihao03/Aistronaut/m/v2/lda"
	"github.com/yihao03/Aistronaut/m/v2/models"
	"github.com/yihao03/Aistronaut/m/v2/params/chatparams"
)

type LambdaPayload struct {
	Text            string `json:"text"`
	FirstName       string `json:"firstName"`
	Today           string `json:"today"`
	UserCountry     string `json:"user_country"`
	ExistingContext string `json:"existing_context"`
}

type FinalResponse struct {
	TripDetails models.Trip `json:"trip_details"`
	Response    string      `json:"response"`
}

type BodyResponse struct {
	Response string `json:"response"`
}

type LambdaResponse struct {
	Body       string            `json:"body"`
	Headers    map[string]string `json:"headers"`
	StatusCode int               `json:"statusCode"`
}

func getRequirements(c *gin.Context, trip *models.Trip, chat chatparams.CreateParams) {
	lambdaClient := lda.GetLambda()
	db := db.GetDB()

	var user models.Users
	db.Find(&user, "user_id = ?", trip.UserID)

	jsonString, err := json.Marshal(trip)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to marshal trip: " + err.Error()})
		return
	}

	payload := LambdaPayload{
		Text:            chat.Content,
		FirstName:       user.Username,
		Today:           time.Now().Format("Monday, January 2, 2006"),
		UserCountry:     user.Nationality,
		ExistingContext: string(jsonString),
	}

	marshaledPayload, err := json.Marshal(payload)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to marshal payload: " + err.Error()})
		return
	}

	output, err := lambdaClient.Invoke(c.Request.Context(), &lambda.InvokeInput{
		FunctionName: lda.PARSER,
		Payload:      marshaledPayload,
	})
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to invoke Lambda function: " + err.Error()})
		return
	}

	// Parse the Lambda response
	var lambdaResp LambdaResponse
	if err := json.Unmarshal(output.Payload, &lambdaResp); err != nil {
		c.JSON(500, gin.H{"error": "Failed to parse Lambda response: " + err.Error()})
		return
	}

	// Parse the body JSON string
	var bodyResp BodyResponse
	if err := json.Unmarshal([]byte(lambdaResp.Body), &bodyResp); err != nil {
		c.JSON(500, gin.H{"error": "Failed to parse body: " + err.Error()})
		return
	}

	// Parse the inner response JSON string
	var finalResp FinalResponse
	responseStr := strings.TrimPrefix(bodyResp.Response, "```json\n")
	responseStr = strings.TrimSuffix(responseStr, "\n```")
	if err := json.Unmarshal([]byte(responseStr), &finalResp); err != nil {
		c.JSON(500, gin.H{"error": "Failed to parse inner response: " + err.Error()})
		return
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
			tripField.Type() == sourceField.Type() &&
			sourceFieldType.Name != "UserID" &&
			sourceFieldType.Name != "TripID" {
			// Set the field value
			tripField.Set(sourceField)
		}
	}

	if err := db.Save(trip).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to update trip: " + err.Error()})
		return
	}
}
