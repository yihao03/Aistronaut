package chat

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/aws/aws-sdk-go-v2/service/lambda"
	"github.com/gin-gonic/gin"
	"github.com/yihao03/Aistronaut/m/v2/db"
	"github.com/yihao03/Aistronaut/m/v2/lda"
	"github.com/yihao03/Aistronaut/m/v2/models"
	"github.com/yihao03/Aistronaut/m/v2/params/chatparams"
)

func GetAccomodations(c *gin.Context,
	trip *models.Trip,
	chat chatparams.CreateParams,
	chatHistories *[]models.ChatHistory,
	accoms *[]models.Accommodations,
) (*FinalResponse, error) {
	lambdaClient := lda.GetLambda()
	db := db.GetDB()

	var user models.Users
	db.Find(&user, "user_id = ?", trip.UserID)

	tripString, err := json.Marshal(trip)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal trip: %v", err)
	}
	flightString, err := json.Marshal(accoms)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal accommodations: %v", err)
	}

	payload := LambdaPayload{
		UserPrompt:           chat.Content,
		FirstName:            user.Username,
		Today:                time.Now().Format("Monday, January 2, 2006"),
		UserCountry:          user.Nationality,
		ExistingContext:      string(tripString),
		ChatHistory:          models.ChatHistories(*chatHistories).ToString(),
		AccommodationOptions: string(flightString),
	}

	request := LambdaRequest{
		Body: payload,
	}

	marshaledPayload, err := json.Marshal(request)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal payload: %v", err)
	}

	output, err := lambdaClient.Invoke(c.Request.Context(), &lambda.InvokeInput{
		FunctionName: lda.FLIGHT,
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

	return finalResp, nil
}
