package chatview

type ChatResponse struct {
	ConversationID      string `json:"conversation_id"`
	Content             string `json:"content"`
	Object              string `json:"object"`
	FlightObject        string `json:"flight_object,omitempty"`
	AccommodationObject string `json:"accommodation_object,omitempty"`
	CreatedAt           string `json:"created_at"`
	IsUser              bool   `json:"is_user"`
}
