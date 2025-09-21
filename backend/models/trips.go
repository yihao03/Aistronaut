package models

import "time"

type Trips struct {
	TripID             string     `json:"trip_id" gorm:"primaryKey"`
	UserID             string     `json:"user_id"`
	TripName           *string    `json:"trip_name"`
	DestinationCountry *string    `json:"destination_country"`
	DestinationCities  *[]string  `json:"destination_cities" gorm:"type:text[]"`
	Landmarks          *[]string  `json:"landmarks" gorm:"type:text[]"`
	StartDate          *time.Time `json:"start_date"`
	EndDate            *time.Time `json:"end_date"`
	TotalBudget        *int       `json:"total_budget"`
	TripStatus         *string    `json:"trip_status"`
	NumberOfTravelers  *int       `json:"number_of_travelers"`
	AdultsCount        *int       `json:"adults_count"`
	ChildrenCount      *int       `json:"children_count"`
	InfantsCount       *int       `json:"infants_count"`
	TripType           *string    `json:"trip_type"`
	Purpose            *string    `json:"purpose"`
	Notes              *string    `json:"notes"`
	DietaryRestriction *string    `json:"dietary_restrictions"`
	CreatedAt          *time.Time `json:"created_at"`
	UpdatedAt          *time.Time `json:"updated_at"`
}
