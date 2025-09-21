package models

type AccommodationBookings struct {
	BookingID            string `gorm:"primaryKey"`
	UserID               string `gorm:"index"`
	AccommodationID      string
	TripID               string
	RoomType             string
	NumberOfRooms        int
	AdultsPerRoom        int
	ChildrenPerRoom      int
	CheckInDate          string
	CheckOutDate         string
	TotalNights          int
	RoomRatePerNight     float64
	TotalPrice           float64
	BookingStatus        string
	PaymentStatus        string
	BookingReference     *string
	SpecialRequests      *string
	GuestDetails         string
	CancellationDeadline string
	CreatedAt            RFC3339Time `gorm:"index;primaryKey"`
	UpdatedAt            RFC3339Time `gorm:"autoUpdateTime"`
}
