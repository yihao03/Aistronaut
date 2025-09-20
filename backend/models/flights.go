package models

type Flights struct {
	FlightID         string `gorm:"primaryKey"`
	FlightNumber     string
	Airline          string
	DepartureAirport string
	DepartureTime    string
}
