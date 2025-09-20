package models

type Accommodations struct {
	AccommodationID string `gorm:"primaryKey"`
	City            string
	Country         string
}
