package models

type FlightBookings struct {
	BookingID string      `gorm:"primaryKey"`
	UserID    string      `gorm:"index"`
	FlightID  string      `gorm:"index"`
	TripID    string      `gorm:"index"`
	Flight    Flights     `gorm:"foreignKey:FlightID;references:FlightID"`
	CreatedAt RFC3339Time `gorm:"autoCreateTime;index;primaryKey"`
	UpdatedAt RFC3339Time `gorm:"autoUpdateTime"`
}
