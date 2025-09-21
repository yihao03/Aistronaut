package chatparams

import (
	"encoding/json"

	"github.com/google/uuid"
	"github.com/yihao03/Aistronaut/m/v2/models"
)

type CreateParams struct {
	ChatHistoryID string `json:"conversation_id"`
	UserID        string `json:"user_id"`
	Content       string `json:"content" binding:"required"`
	ContentType   int32  `json:"content_type"`
}

func (p CreateParams) ToModel(userID string, object any) *models.ChatHistory {
	objectString, err := json.Marshal(object)
	if err != nil {
		// Handle error appropriately, e.g., return an error or log it
		panic(err) // Or better, change return type to include error
	}

	return &models.ChatHistory{
		ChatHistoryID: string(p.ChatHistoryID),
		UserID:        userID,
		ChatID:        uuid.New().String(),
		Message:       p.Content,
		ReqObject:     string(objectString),
		Timestamp:     models.Now(),
	}
}
