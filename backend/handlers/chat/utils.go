package chat

import (
	"encoding/json"
	"fmt"
	"reflect"
	"strings"

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
	if err := db.Find(&booking, "trip_id = ?", trip.TripID).Error; err != nil {
		return false
	}

	return booking.BookingID != ""
}

func parseResponse(response string) (*FinalResponse, error) {
	var finalResp FinalResponse
	responseStr := strings.TrimPrefix(response, "```json\n")
	responseStr = strings.TrimSuffix(responseStr, "\n```")
	if err := json.Unmarshal([]byte(responseStr), &finalResp); err != nil {
		return nil, fmt.Errorf("failed to parse inner response: %v", err)
	}
	return &finalResp, nil
}
