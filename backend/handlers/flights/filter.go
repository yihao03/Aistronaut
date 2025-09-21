package flights

import (
	"fmt"
	"time"

	"github.com/yihao03/Aistronaut/m/v2/db"
	"github.com/yihao03/Aistronaut/m/v2/models"
)

// GetFlightsByDateRange retrieves flights within a specified date range
func GetFlightsByDateRange(startDate, endDate string) ([]models.Flights, error) {
	st, err := time.Parse(time.RFC3339, startDate)
	if err != nil {
		return nil, fmt.Errorf(time.RFC3339, err)
	}
	et, err := time.Parse("2006-01-02", endDate)
	if err != nil {
		return nil, fmt.Errorf("invalid date format: %v", err)
	}
	db := db.GetDB()
	var flights []models.Flights

	// Build query for flights within the date range
	query := db.Where("departure_time >= ? AND departure_time <= ?", st, et)

	// Execute query
	if err := query.Find(&flights).Error; err != nil {
		return nil, fmt.Errorf("failed to retrieve flights: %v", err)
	}

	return flights, nil
}
