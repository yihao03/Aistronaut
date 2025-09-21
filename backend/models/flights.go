package models

type Flights struct {
	FlightID          string `gorm:"primaryKey"`
	FlightNumber      string
	Airline           string
	DepartureAirport  string
	ArrivalAirport    string
	DepartureTime     RFC3339Time `gorm:"primaryKey"`
	ArrivalTime       RFC3339Time
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
	CreatedAt         RFC3339Time `gorm:"autoCreateTime"`
	UpdatedAt         RFC3339Time `gorm:"autoUpdateTime"`
}
