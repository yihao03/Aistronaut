package chatparams

import (
	"encoding/json"
	"time"

	"github.com/yihao03/Aistronaut/m/v2/models"
)

type CreateParams struct {
	ConversationID int32  `json:"conversation_id"`
	UserID         string `json:"user_id"`
	Content        string `json:"content" binding:"required"`
	ContentType    int32  `json:"content_type"`
}

func (p CreateParams) ToModel(userID string, object any) models.ChatHistory {
	objectString, err := json.Marshal(object)
	if err != nil {
		// Handle error appropriately, e.g., return an error or log it
		panic(err) // Or better, change return type to include error
	}

	return models.ChatHistory{
		ChatHistoryID: string(p.ConversationID),
		UserID:        userID,
		Content:       p.Content,
		ObjectString:  string(objectString),
		Timestamp:     time.Now().Format(time.RFC3339),
	}
}
