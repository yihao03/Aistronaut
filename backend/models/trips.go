package models

type Trip struct {
	TripID          string `gorm:"primaryKey"`
	UserID          string
	Budget          *int      `json:"budget"`
	Timeline        *string   `json:"timeline"`
	Location        string    `json:"location"`
	ModeTravel      *string   `json:"mode_travel"`
	Pax             *int      `json:"pax"`
	Places          *[]string `json:"places"`
	MainPurpose     *string   `json:"main_purpose"`
	DietRestriction *string   `json:"diet_restriction"`
}
