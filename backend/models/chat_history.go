package models

type ChatHistory struct {
	ChatHistoryID string `gorm:"primaryKey"`
	UserID        string
	Timestamp     string
}
