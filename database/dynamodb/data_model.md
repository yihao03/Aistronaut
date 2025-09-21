# Data Models
PK: Parition Key
SK: Sort Key
FK: Foreign Key

## Table 1: users
user_id (PK)
username
email
password
first_name
last_name
phone_number
date_of_birth
passport_number
nationality
created_at (SK)
updated_at
deleted_at

## Table 2: user_preferences
preference_id (PK)
user_id (FK)
preferred_currency
preferred_airline
preferred_seat_type
preferred_class
dietary_restriction
accessibility_needs
budget_range_min
budget_range_max
preferred_accommodation_type
travel_style
created_at (SK)
updated_at

## Table 3: chat_history
chat_history_id (PK)
user_id (FK)
chat_id
user_or_agent
message
json_object
timestamp (SK)

## Table 4: flights
flight_id (PK)
flight_number
airline
aircraft_type
departure_airport
arrival_airport
departure_time (SK)
arrival_time
duration_minutes
available_seats
seat_configuration
price_economy
price_business
price_first
meal_service
baggage_allowance
layovers
status
created_at
updated_at

## Table 5: flight_bookings
booking_id (PK)
user_id (FK)
flight_id (FK)
trip_id (FK)
passenger_details (JSON)
seat_number
class_type
booking_status
total_price
payment_status
booking_reference
special_requests
meal_preference
checked_baggage_count
travel_date
cancellation_policy
created_at (SK)
updated_at

## Table 6: trips
trip_id (PK)
user_id (FK)
trip_name
destination_country
destination_cities
landmarks
start_date (SK)
end_date
total_budget
trip_status
number_of_travelers
adults_count
children_count
infants_count
trip_type
purpose
notes
dietary_restriction
created_at
updated_at

## Table 7: accommodations
accommodation_id (PK)
name
type
address
city
country
postal_code
latitude
longitude
star_rating
amenities (JSON)
room_types (JSON)
check_in_time
check_out_time
cancellation_policy
pet_policy
parking_available
wifi_available
breakfast_included
gym_available
pool_available
spa_available
business_center
room_service
concierge_service
contact_phone
contact_email
images (JSON)
description
created_at (SK)
updated_at

## Table 8: accommodation_bookings
booking_id (PK)
user_id (FK)
accommodation_id (FK)
trip_id (FK)
room_type
number_of_rooms
adults_per_room
children_per_room
check_in_date
check_out_date
total_nights
room_rate_per_night
total_price
booking_status
payment_status
booking_reference
special_requests
guest_details (JSON)
cancellation_deadline
created_at (SK)
updated_at