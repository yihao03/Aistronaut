package lda

import (
	"context"
	"fmt"
	"log"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/lambda"
)

var lambdaClient *lambda.Client

func Init(ctx context.Context, cfg aws.Config) {
	tempLambdaClient := lambda.NewFromConfig(cfg)
	result, err := tempLambdaClient.ListFunctions(ctx, &lambda.ListFunctionsInput{
		MaxItems: aws.Int32(int32(10)),
	})
	if err != nil {
		log.Fatal("Failed to list Lambda functions:", err)
	}

	for _, fun := range result.Functions {
		fmt.Println("Lambda Functions:", *fun.FunctionName)
	}

	lambdaClient = tempLambdaClient
}

func GetLambda() *lambda.Client {
	if lambdaClient == nil {
		log.Panic("Lambda client not initialized. Call Init first.")
	}
	return lambdaClient
}
