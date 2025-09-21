package flightsparams

type SelectFlightParams struct {
	FlightID       string `json:"flight_id" binding:"required"`
	ConversationID string `json:"conversation_id" binding:"required"`
}
