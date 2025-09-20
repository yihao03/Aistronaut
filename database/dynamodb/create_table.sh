#!/bin/bash
# AWS CLI commands to create DynamoDB tables for Aistronaut Travel Booking System
# Using ON-DEMAND billing mode for cost-effective development/testing
# Make sure AWS CLI is configured with proper credentials and region

echo "Creating DynamoDB tables for Aistronaut Travel Booking System (On-Demand Billing)..."

# Table 0: user
echo "Creating user table..."
aws dynamodb create-table \
    --table-name users \
    --attribute-definitions \
        AttributeName=user_id,AttributeType=S \
        AttributeName=username,AttributeType=S \
        AttributeName=email,AttributeType=S \
    --key-schema \
        AttributeName=user_id,KeyType=HASH \
    --global-secondary-indexes \
        IndexName=username-index,KeySchema='[{AttributeName=username,KeyType=HASH}]',Projection='{ProjectionType=ALL}' \
        IndexName=email-index,KeySchema='[{AttributeName=email,KeyType=HASH}]',Projection='{ProjectionType=ALL}' \
    --billing-mode PAY_PER_REQUEST

# Table 1: user_preferences
echo "Creating user_preferences table..."
aws dynamodb create-table \
    --table-name user_preferences \
    --attribute-definitions \
        AttributeName=preference_id,AttributeType=S \
        AttributeName=user_id,AttributeType=S \
    --key-schema \
        AttributeName=preference_id,KeyType=HASH \
    --global-secondary-indexes \
        IndexName=user_id-index,KeySchema='[{AttributeName=user_id,KeyType=HASH}]',Projection='{ProjectionType=ALL}' \
    --billing-mode PAY_PER_REQUEST

# Table 2: chat_history
echo "Creating chat_history table..."
aws dynamodb create-table \
    --table-name chat_history \
    --attribute-definitions \
        AttributeName=chat_history_id,AttributeType=S \
        AttributeName=user_id,AttributeType=S \
        AttributeName=timestamp,AttributeType=S \
    --key-schema \
        AttributeName=chat_history_id,KeyType=HASH \
    --global-secondary-indexes \
        IndexName=user_id-timestamp-index,KeySchema='[{AttributeName=user_id,KeyType=HASH},{AttributeName=timestamp,KeyType=RANGE}]',Projection='{ProjectionType=ALL}' \
    --billing-mode PAY_PER_REQUEST

# Table 3: flights
echo "Creating flights table..."
aws dynamodb create-table \
    --table-name flights \
    --attribute-definitions \
        AttributeName=flight_id,AttributeType=S \
        AttributeName=flight_number,AttributeType=S \
        AttributeName=airline,AttributeType=S \
        AttributeName=departure_airport,AttributeType=S \
        AttributeName=departure_time,AttributeType=S \
    --key-schema \
        AttributeName=flight_id,KeyType=HASH \
    --global-secondary-indexes \
        IndexName=flight_number-index,KeySchema='[{AttributeName=flight_number,KeyType=HASH}]',Projection='{ProjectionType=ALL}' \
        IndexName=airline-departure-index,KeySchema='[{AttributeName=airline,KeyType=HASH},{AttributeName=departure_time,KeyType=RANGE}]',Projection='{ProjectionType=ALL}' \
        IndexName=route-departure-index,KeySchema='[{AttributeName=departure_airport,KeyType=HASH},{AttributeName=departure_time,KeyType=RANGE}]',Projection='{ProjectionType=ALL}' \
    --billing-mode PAY_PER_REQUEST

# Table 4: flight_bookings
echo "Creating flight_bookings table..."
aws dynamodb create-table \
    --table-name flight_bookings \
    --attribute-definitions \
        AttributeName=booking_id,AttributeType=S \
        AttributeName=user_id,AttributeType=S \
        AttributeName=booking_date,AttributeType=S \
    --key-schema \
        AttributeName=booking_id,KeyType=HASH \
    --global-secondary-indexes \
        IndexName=user_id-booking_date-index,KeySchema='[{AttributeName=user_id,KeyType=HASH},{AttributeName=booking_date,KeyType=RANGE}]',Projection='{ProjectionType=ALL}' \
    --billing-mode PAY_PER_REQUEST

# Table 5: trip
echo "Creating trip table..."
aws dynamodb create-table \
    --table-name trips \
    --attribute-definitions \
        AttributeName=trip_id,AttributeType=S \
        AttributeName=user_id,AttributeType=S \
        AttributeName=start_date,AttributeType=S \
    --key-schema \
        AttributeName=trip_id,KeyType=HASH \
    --global-secondary-indexes \
        IndexName=user_id-start_date-index,KeySchema='[{AttributeName=user_id,KeyType=HASH},{AttributeName=start_date,KeyType=RANGE}]',Projection='{ProjectionType=ALL}' \
    --billing-mode PAY_PER_REQUEST

# Table 6: accommodations
echo "Creating accommodations table..."
aws dynamodb create-table \
    --table-name accommodations \
    --attribute-definitions \
        AttributeName=accommodation_id,AttributeType=S \
        AttributeName=city,AttributeType=S \
        AttributeName=country,AttributeType=S \
    --key-schema \
        AttributeName=accommodation_id,KeyType=HASH \
    --global-secondary-indexes \
        IndexName=city-index,KeySchema='[{AttributeName=city,KeyType=HASH}]',Projection='{ProjectionType=ALL}' \
        IndexName=country-city-index,KeySchema='[{AttributeName=country,KeyType=HASH},{AttributeName=city,KeyType=RANGE}]',Projection='{ProjectionType=ALL}' \
    --billing-mode PAY_PER_REQUEST

# Table 7: accommodation_bookings
echo "Creating accommodation_bookings table..."
aws dynamodb create-table \
    --table-name accommodation_bookings \
    --attribute-definitions \
        AttributeName=booking_id,AttributeType=S \
        AttributeName=user_id,AttributeType=S \
        AttributeName=booking_date,AttributeType=S \
    --key-schema \
        AttributeName=booking_id,KeyType=HASH \
    --global-secondary-indexes \
        IndexName=user_id-booking_date-index,KeySchema='[{AttributeName=user_id,KeyType=HASH},{AttributeName=booking_date,KeyType=RANGE}]',Projection='{ProjectionType=ALL}' \
    --billing-mode PAY_PER_REQUEST

echo ""
echo "All tables created successfully with On-Demand billing!"
echo ""
echo "Created tables for Aistronaut Travel Booking System:"
echo "- user (user profiles and authentication)"
echo "- user_preferences (travel preferences and settings)"
echo "- chat_history (AI chat conversations)"
echo "- flights (flight information and schedules)"
echo "- flight_bookings (flight reservations)"
echo "- trip (trip planning and management)"
echo "- accommodations (hotel and accommodation data)"
echo "- accommodation_bookings (accommodation reservations)"
echo ""
echo "Benefits of On-Demand billing:"
echo "- Pay only for actual reads/writes"
echo "- No capacity planning required"
echo "- Automatic scaling"
echo "- Perfect for development and testing"
echo ""
echo "To verify table creation, run:"
echo "aws dynamodb list-tables"
echo ""
echo "To check specific table status:"
echo "aws dynamodb describe-table --table-name [table-name]"
echo ""
echo "To test the tables with sample data, run:"
echo "python database/dynamodb.py"
echo ""
echo "For data model examples, run:"
echo "python database/data_models.py"
