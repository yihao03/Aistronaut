package chatview

type ChatResponse struct {
	ConversationID string `json:"conversation_id"`
	Content        string `json:"content"`
	Object         string `json:"object"`
	CreatedAt      string `json:"created_at"`
}
