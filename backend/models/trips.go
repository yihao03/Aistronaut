package models

type Trip struct {
	TripID                string `json:"trip_id" gorm:"primaryKey"`
	UserID                string `json:"user_id" gorm:"index"`
	TripName              string `json:"trip_name"`
	DestinationCountry    string `json:"destination_country"`
	DestinationCity       string `json:"destination_city"`
	StartDate             string `json:"start_date" gorm:"primaryKey"`
	EndDate               string `json:"end_date"`
	TotalBudget           int    `json:"total_budget"`
	CurrentSpent          int    `json:"current_spent"`
	TripStatus            string `json:"trip_status"`
	NumberOfTravelers     int    `json:"number_of_travelers"`
	AdultsCount           int    `json:"adults_count"`
	ChildrenCount         int    `json:"children_count"`
	InfantsCount          int    `json:"infants_count"`
	TripType              string `json:"trip_type"`
	Purpose               string `json:"purpose"`
	Notes                 string `json:"notes"`
	EmergencyContactName  string `json:"emergency_contact_name"`
	EmergencyContactPhone string `json:"emergency_contact_phone"`
	CreatedAt             string `json:"created_at"`
	UpdatedAt             string `json:"updated_at"`
}
