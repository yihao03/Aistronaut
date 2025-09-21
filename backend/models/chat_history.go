package models

import "time"

type ChatHistory struct {
	ChatHistoryID string `gorm:"column:chat_history_id"`
	ChatID        string `gorm:"column:chat_id"`
	UserID        string
	UserOrAgent   string
	Message       string
	JSONObject    string
	Timestamp     time.Time `gorm:"autoCreateTime;primaryKey"`
}

func (ChatHistory) TableName() string {
	return "chat_history"
}
