package tripview

import "github.com/yihao03/Aistronaut/m/v2/models"

type TripResponse struct {
	FlightBookings        []models.FlightBookings        `json:"flight_bookings"`
	AccommodationBookings []models.AccommodationBookings `json:"accommodation_bookings"`
}
