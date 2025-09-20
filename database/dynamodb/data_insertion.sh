#!/bin/bash
# AWS CLI commands to insert sample data into DynamoDB tables
# Make sure AWS CLI is configured with proper credentials and region

echo "Inserting sample data into DynamoDB tables for Aistronaut Travel Booking System..."

# Insert users data
echo ""
echo "Inserting users data..."
aws dynamodb batch-write-item --request-items file://sample/users.json

# Insert user_preferences data
echo ""
echo "Inserting user_preferences data..."
aws dynamodb batch-write-item --request-items file://sample/user_preferences.json

# Insert chat_history data
echo ""
echo "Inserting chat_history data..."
aws dynamodb batch-write-item --request-items file://sample/chat_history.json

# Insert flights data
echo ""
echo "Inserting flights data..."
aws dynamodb batch-write-item --request-items file://sample/flights.json

# Insert flight_bookings data
echo ""
echo "Inserting flight_bookings data..."
aws dynamodb batch-write-item --request-items file://sample/flight_bookings.json

# Insert trips data
echo ""
echo "Inserting trips data..."
aws dynamodb batch-write-item --request-items file://sample/trips.json

# Insert accommodations data
echo ""
echo "Inserting accommodations data..."
aws dynamodb batch-write-item --request-items file://sample/accommodations.json

# Insert accommodation_bookings data
echo ""
echo "Inserting accommodation_bookings data..."
aws dynamodb batch-write-item --request-items file://sample/accommodation_bookings.json

echo ""
echo "All sample data inserted successfully!"
echo ""
echo "To verify the data, you can run:"
echo "aws dynamodb scan --table-name users --max-items 3"
echo "aws dynamodb scan --table-name flights --max-items 3"
echo "aws dynamodb scan --table-name accommodations --max-items 3"