package models

type AccommodationBookings struct {
	BookingID       string `gorm:"primaryKey"`
	UserID          string `gorm:"index"`
	AccommodationID string
	TripID          string
	CreatedAt       RFC3339Time    `gorm:"index;primaryKey"`
	UpdatedAt       RFC3339Time    `gorm:"autoUpdateTime"`
	Accomodation    Accommodations `gorm:"foreignKey:AccommodationID;references:AccommodationID"`
}
