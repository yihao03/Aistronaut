package models

import (
	"encoding/json"
)

type ChatHistory struct {
	ChatHistoryID string `gorm:"column:chat_history_id"`
	ChatID        string `gorm:"column:chat_id"`
	UserID        string
	UserOrAgent   string
	Message       string
	JSONObject    string
	Timestamp     RFC3339Time `gorm:"autoCreateTime;primaryKey"`
}

func (ChatHistory) TableName() string {
	return "chat_history"
}

type ChatHistories []ChatHistory

func (chs ChatHistories) ToString() string {
	data, _ := json.Marshal(chs)
	return string(data)
}
