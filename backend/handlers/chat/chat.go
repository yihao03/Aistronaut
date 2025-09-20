package chat

import (
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/lambda"
	"github.com/gin-gonic/gin"
	"github.com/yihao03/Aistronaut/m/v2/lda"
	"github.com/yihao03/Aistronaut/m/v2/params/chatparams"
)

func ChatHandler(c *gin.Context) {
	var body chatparams.CreateParams

	if err := c.Bind(&body); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	lambdaClient := lda.GetLambda()
	payload := []byte(`{"body":{"text":"i wish to visit japan.","firstName":"Chen","chat_history":"None"}}`)

	output, err := lambdaClient.Invoke(c.Request.Context(), &lambda.InvokeInput{
		FunctionName: aws.String(lda.PARSER),
		Payload:      payload,
	})

	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to invoke Lambda function" + err.Error()})
	} else {
		c.JSON(200, gin.H{"response": string(output.Payload)})
	}
}
