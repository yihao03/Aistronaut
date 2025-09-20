package chat

import (
	"encoding/json"

	"github.com/aws/aws-sdk-go-v2/service/lambda"
	"github.com/gin-gonic/gin"
	"github.com/yihao03/Aistronaut/m/v2/lda"
)

// Define structs for the nested JSON response
type TripDetails struct {
	Budget          *int     `json:"budget"`
	Timeline        *string  `json:"timeline"`
	Location        string   `json:"location"`
	ModeTravel      *string  `json:"mode_travel"`
	Pax             *int     `json:"pax"`
	Places          []string `json:"places"`
	MainPurpose     *string  `json:"main_purpose"`
	DietRestriction *string  `json:"diet_restriction"`
}

type FinalResponse struct {
	TripDetails TripDetails `json:"trip_details"`
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

func getRequirements(c *gin.Context) {
	lambdaClient := lda.GetLambda()
	payload := []byte(`{"body":{"text":"i wish to visit japan.","firstName":"Chen","chat_history":"None"}}`)

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
	if err := json.Unmarshal([]byte(bodyResp.Response), &finalResp); err != nil {
		c.JSON(500, gin.H{"error": "Failed to parse inner response: " + err.Error()})
		return
	}

	c.JSON(200, gin.H{"response": finalResp})
}
