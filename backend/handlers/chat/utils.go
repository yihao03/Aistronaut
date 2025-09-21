package chat

import (
	"reflect"

	"github.com/yihao03/Aistronaut/m/v2/db"
	"github.com/yihao03/Aistronaut/m/v2/models"
)

func CheckDetailsComplete(trip *models.Trip) bool {
	v := reflect.ValueOf(trip).Elem() // Use .Elem() to dereference the pointer
	done := true
	for i := 0; i < v.NumField(); i++ {
		fieldName := v.Type().Field(i).Name
		if fieldName == "TripID" || fieldName == "UserID" || fieldName == "ChildrenCount" || fieldName == "InfantsCount" {
			continue
		}
		if v.Field(i).IsZero() {
			done = false
		}
	}

	return done
}

func HasFlightDetails(trip *models.Trip) bool {
	db := db.GetDB()

	booking := models.FlightBookings{}
	if err := db.Find(booking, "trip_id = ?", trip.TripID).Error; err != nil {
		return false
	}

	return booking.BookingID != ""
}
