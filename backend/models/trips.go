package models

type Trip struct {
	TripID              string      `json:"trip_id" gorm:"primaryKey"`
	UserID              string      `json:"user_id"`
	TripName            string      `json:"trip_name"`
	DestinationCountry  StringArray `json:"destination_country" gorm:"type:text"`
	DestinationCities   StringArray `json:"destination_cities" gorm:"type:text"`
	Landmarks           StringArray `json:"landmarks" gorm:"type:text"`
	StartDate           string      `json:"start_date"`
	EndDate             string      `json:"end_date"`
	TotalBudget         int         `json:"total_budget"`
	NumberOfTravelers   int         `json:"number_of_travelers"`
	AdultsCount         int         `json:"adults_count"`
	ChildrenCount       int         `json:"children_count"`
	InfantsCount        int         `json:"infants_count"`
	TripType            string      `json:"trip_type"`
	Purpose             string      `json:"purpose"`
	Notes               string      `json:"notes"`
	DietaryRestrictions string      `json:"dietary_restrictions"`
}
