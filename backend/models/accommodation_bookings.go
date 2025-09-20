package models

type AccommodationBookings struct {
	BookingID   string `gorm:"primaryKey"`
	UserID      string
	BookingDate string
}
