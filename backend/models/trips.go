package models

type Trip struct {
	TripID    string `gorm:"primaryKey"`
	UserID    string
	StartDate string
}
