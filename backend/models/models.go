package models

type Flight struct {
	FlightNumber  *string  `json:"flight_number"`
	DepartureCity *string  `json:"departure_city"`
	ArrivalCity   *string  `json:"arrival_city"`
	DepartureDate *string  `json:"departure_date"`
	DepartureTime *string  `json:"departure_time"`
	ArrivalDate   *string  `json:"arrival_date"`
	ArrivalTime   *string  `json:"arrival_time"`
	DurationHours *float64 `json:"duration_hours"`
	Stops         []string `json:"stops"`
}

type SelectedFlight struct {
	Airline        string  `json:"airline"`
	OutboundFlight Flight  `json:"outbound_flight"`
	ReturnFlight   Flight  `json:"return_flight"`
	Price          float64 `json:"price"`
	Currency       *string `json:"currency"`
	Reason         string  `json:"reason"`
}

type TripPlans struct {
	SelectedFlight  SelectedFlight `json:"selected_flight"`
	TripPreferences *string        `json:"trip_preferences"`
	Mode            string         `json:"mode"`
}
