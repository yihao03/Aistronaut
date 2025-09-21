package models

type UserPreferences struct {
	PreferenceID               string `gorm:"primaryKey"`
	UserID                     string
	PreferredCurrency          string
	PreferredAirline           string
	PreferredSeatType          string
	PreferredClass             string
	DietaryRestriction         string
	AccessibilityNeeds         string
	BudgetRangeMin             int
	BudgetRangeMax             int
	PreferredAccommodationType string
	TravelStyle                string
	CreatedAt                  string
	UpdatedAt                  string
}
