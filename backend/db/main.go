package db

import (
	"errors"
	"log"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
)

var db *dynamodb.Client

func Setup(cfg *aws.Config) error {
	setupdb := dynamodb.NewFromConfig(*cfg)
	if setupdb == nil {
		return errors.New("failed to connect database")
	}

	db = setupdb
	return nil
}

func GetDB() *dynamodb.Client {
	if db == nil {
		log.Panic("Database not initialized. Call Setup first.")
	}
	return db
}
