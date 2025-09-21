package models

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
	TravelDate          RFC3339Time
	CancellationPolicy  *string
	CreatedAt           RFC3339Time `gorm:"autoCreateTime;index;primaryKey"`
	UpdatedAt           RFC3339Time `gorm:"autoUpdateTime"`
}
