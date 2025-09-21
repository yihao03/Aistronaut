package accommodationparams

type SelectAccommodationParams struct {
	AccommodationID string `json:"accommodation_id" binding:"required"`
	ConversationID  string `json:"conversation_id" binding:"required"`
}
