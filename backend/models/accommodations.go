package models

import "time"

type Accommodations struct {
	AccommodationID    string `gorm:"primaryKey"`
	Name               string
	Type               string
	Address            string
	City               string
	Country            string
	PostalCode         string
	Latitude           float64
	Longitude          float64
	StarRating         int
	Amenities          []string
	RoomTypes          []string
	CheckInTime        string
	CheckOutTime       string
	CancellationPolicy *string
	PetPolicy          *string
	ParkingAvailable   bool
	WifiAvailable      bool
	BreakfastIncluded  bool
	GymAvailable       bool
	PoolAvailable      bool
	SpaAvailable       bool
	BusinessCenter     bool
	RoomService        bool
	ConciergeService   bool
	ContactPhone       string
	ContactEmail       string
	Images             []string
	Description        string
	CreatedAt          time.Time `gorm:"autoCreateTime;primaryKey"`
	UpdatedAt          time.Time `gorm:"autoUpdateTime"`
}
