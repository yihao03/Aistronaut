package models

import (
	"encoding/json"
	"strings"
)

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
	Amenities          string `gorm:"type:text"` // Changed from []string to string
	RoomTypes          string `gorm:"type:text"` // Changed from []string to string
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
	Images             string `gorm:"type:text"` // Changed from []string to string
	Description        string
	CreatedAt          RFC3339Time `gorm:"autoCreateTime;primaryKey"`
	UpdatedAt          RFC3339Time `gorm:"autoUpdateTime"`
}

// Helper methods to work with Amenities as array
func (a *Accommodations) GetAmenitiesArray() []string {
	if a.Amenities == "" {
		return []string{}
	}
	var amenities []string
	json.Unmarshal([]byte(a.Amenities), &amenities)
	return amenities
}

func (a *Accommodations) SetAmenitiesArray(amenities []string) {
	data, _ := json.Marshal(amenities)
	a.Amenities = string(data)
}

// Helper methods to work with RoomTypes as array
func (a *Accommodations) GetRoomTypesArray() []string {
	if a.RoomTypes == "" {
		return []string{}
	}
	var roomTypes []string
	json.Unmarshal([]byte(a.RoomTypes), &roomTypes)
	return roomTypes
}

func (a *Accommodations) SetRoomTypesArray(roomTypes []string) {
	data, _ := json.Marshal(roomTypes)
	a.RoomTypes = string(data)
}

// Helper methods to work with Images as array
func (a *Accommodations) GetImagesArray() []string {
	if a.Images == "" {
		return []string{}
	}
	var images []string
	json.Unmarshal([]byte(a.Images), &images)
	return images
}

func (a *Accommodations) SetImagesArray(images []string) {
	data, _ := json.Marshal(images)
	a.Images = string(data)
}

// Helper method to check if accommodation has specific amenity
func (a *Accommodations) HasAmenity(amenity string) bool {
	amenities := a.GetAmenitiesArray()
	for _, a := range amenities {
		if strings.EqualFold(a, amenity) {
			return true
		}
	}
	return false
}
