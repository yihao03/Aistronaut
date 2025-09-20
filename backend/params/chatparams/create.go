package chatparams

type CreateParams struct {
	ConversationID int32  `json:"conversation_id"`
	Content        string `json:"content" binding:"required"`
	ContentType    int32  `json:"content_type"`
}
