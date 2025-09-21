package models

import "time"

type UserPreferences struct {
	PreferenceID               string  `gorm:"primaryKey"`
	UserID                     string  `gorm:"size:255;not null;unique"`
	PreferredCurrency          *string `gorm:"size:10"`
	PreferredAirline           *string `gorm:"size:100"`
	PreferredSeatType          *string `gorm:"size:50"`
	PreferredClass             *string `gorm:"size:50"`
	DietaryRestriction         *string `gorm:"size:255"`
	AccessibilityNeeds         *string `gorm:"size:255"`
	BudgetRangeMin             *int
	BudgetRangeMax             *int
	PreferredAccommodationType *string   `gorm:"size:100"`
	TravelStyle                *string   `gorm:"size:100"`
	CreatedAt                  time.Time `gorm:"autoCreateTime;primaryKey"`
	UpdatedAt                  time.Time `gorm:"autoUpdateTime"`
}
