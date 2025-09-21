package models

import "time"

type FlightBookings struct {
	BookingID           string `gorm:"primaryKey"`
	UserID              string `gorm:"index"`
	FlightID            string `gorm:"index"`
	TripID              string `gorm:"index"`
	PassengerDetails    string `gorm:"type:json"`
	SeatNumber          string
	ClassType           string
	BookingStatus       string
	TotalPrice          float64
	PaymentStatus       string
	BookingReference    string
	SpecialRequests     string
	MealPreference      string
	CheckedBaggageCount int
	TravelDate          time.Time
	CancellationPolicy  *string
	CreatedAt           time.Time `gorm:"autoCreateTime;index;primaryKey"`
	UpdatedAt           time.Time `gorm:"autoUpdateTime"`
}
