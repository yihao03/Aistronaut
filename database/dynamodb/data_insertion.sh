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

# Update sample data

# Method 1: If you know the exact sort key value
aws dynamodb update-item --table-name users --key "{\"user_id\":{\"S\":\"USR001\"},\"created_at\":{\"S\":\"2023-10-01T10:00:00Z\"}}" --update-expression "SET phone_number = :phone_number" --expression-attribute-values "{\":phone_number\":{\"S\":\"+1234567890\"}}"

# Method 2: Query first to get the sort key, then update
# Step 2a: Query to get the item with its full key
echo "Querying trips to get full key..."
aws dynamodb query --table-name trips --key-condition-expression "trip_id = :trip_id" --expression-attribute-values "{\":trip_id\":{\"S\":\"TRIP001\"}}" --select ALL_ATTRIBUTES

# Step 2b: Update using the full composite key (you'd get start_date from the query above)
aws dynamodb update-item --table-name trips --key "{\"trip_id\":{\"S\":\"TRIP001\"},\"start_date\":{\"S\":\"2025-02-15T00:00:00Z\"}}" --update-expression "SET trip_status = :trip_status" --expression-attribute-values "{\":trip_status\":{\"S\":\"Completed\"}}"

# Method 3: Use scan with filter for small datasets (less efficient but simpler)
echo "Alternative: Scan with filter to update trips..."
aws dynamodb scan --table-name trips --filter-expression "trip_id = :trip_id" --expression-attribute-values "{\":trip_id\":{\"S\":\"TRIP001\"}}"