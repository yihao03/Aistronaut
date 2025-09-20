package models

type UserPreferences struct {
	PreferenceID string `gorm:"primaryKey"`
	UserID       string
}
