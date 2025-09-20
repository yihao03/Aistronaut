package models

type FlightBookings struct {
	BookingID   string `gorm:"primaryKey"`
	UserID      string
	BookingDate string
}
