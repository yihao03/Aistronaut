#!/bin/bash
# AWS CLI commands to insert sample data into DynamoDB tables
# Make sure AWS CLI is configured with proper credentials and region
aws dynamodb batch-write-item --request-items file://sample/users.json
aws dynamodb batch-write-item --request-items file://sample/user_preferences.json
aws dynamodb batch-write-item --request-items file://sample/chat_history.json
aws dynamodb batch-write-item --request-items file://sample/flights.json
aws dynamodb batch-write-item --request-items file://sample/flight_bookings.json
aws dynamodb batch-write-item --request-items file://sample/trips.json
aws dynamodb batch-write-item --request-items file://sample/accommodations.json
aws dynamodb batch-write-item --request-items file://sample/accommodation_bookings.json

aws dynamodb scan --table-name users --max-items 3
aws dynamodb scan --table-name user_preferences --max-items 3
aws dynamodb scan --table-name chat_history --max-items 3
aws dynamodb scan --table-name flights --max-items 3
aws dynamodb scan --table-name flight_bookings --max-items 3
aws dynamodb scan --table-name trips --max-items 3
aws dynamodb scan --table-name accommodations --max-items 3
aws dynamodb scan --table-name accommodation_bookings --max-items 3

aws dynamodb query --table-name users --key-condition-expression "user_id = :user_id" --expression-attribute-values "{\":user_id\":{\"S\":\"USR001\"}}"
aws dynamodb query --table-name trips --key-condition-expression "trip_id = :trip_id" --expression-attribute-values "{\":trip_id\":{\"S\":\"TRIP001\"}}"
aws dynamodb query --table-name trips --index-name user_id-index --key-condition-expression "user_id = :user_id" --expression-attribute-values "{\":user_id\":{\"S\":\"USR001\"}}"