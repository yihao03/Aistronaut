package tripparams

type ReadParams struct {
	TripID string `json:"trip_id" binding:"required"`
}
