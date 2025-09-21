package models

import "time"

type Flights struct {
	FlightID          string `gorm:"primaryKey"`
	FlightNumber      string
	Airline           string
	DepartureAirport  string
	ArrivalAirport    string
	DepartureTime     time.Time `gorm:"primaryKey"`
	ArrivalTime       time.Time
	DurationMinutes   int
	AvailableSeats    int
	SeatConfiguration string
	PriceEconomy      float64
	PriceBusiness     float64
	PriceFirst        float64
	MealService       string
	BaggageAllowance  string
	Layovers          string
	Status            string
	CreatedAt         time.Time `gorm:"autoCreateTime"`
	UpdatedAt         time.Time `gorm:"autoUpdateTime"`
}
