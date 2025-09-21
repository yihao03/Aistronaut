package chat

import (
	"encoding/json"
	"reflect"
	"strings"

	"github.com/aws/aws-sdk-go-v2/service/lambda"
	"github.com/gin-gonic/gin"
	"github.com/yihao03/Aistronaut/m/v2/db"
	"github.com/yihao03/Aistronaut/m/v2/lda"
	"github.com/yihao03/Aistronaut/m/v2/models"
)

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

func getRequirements(c *gin.Context, trip *models.Trip) {
	lambdaClient := lda.GetLambda()
	payload := []byte(`{"body":{"text":"i wish to visit japan.I am travelling for business.I am travelling alone","firstName":"Chen","chat_history":"None"}}`)

	output, err := lambdaClient.Invoke(c.Request.Context(), &lambda.InvokeInput{
		FunctionName: lda.PARSER,
		Payload:      payload,
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

	db := db.GetDB()
	if err := db.Save(trip).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to update trip: " + err.Error()})
		return
	}

	c.JSON(200, gin.H{"response": finalResp})
}
