package models

type ChatHistory struct {
	ChatHistoryID string `gorm:"primaryKey"`
	UserID        string
	Content       string
	ObjectString  string
	Timestamp     string
}

func (ChatHistory) TableName() string {
	return "chat_history"
}
