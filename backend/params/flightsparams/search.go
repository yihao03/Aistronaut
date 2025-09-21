package flightsparams

import (
	"fmt"
	"strconv"
	"time"
)

// SearchParams for flight search endpoint
type SearchParams struct {
	DepartureAirport *string `json:"departure_airport,omitempty" form:"departure_airport"`
	ArrivalAirport   *string `json:"arrival_airport,omitempty" form:"arrival_airport"`
	Airline          *string `json:"airline,omitempty" form:"airline"`
	Status           *string `json:"status,omitempty" form:"status"`
	StartDate        *string `json:"start_date,omitempty" form:"start_date"`
	EndDate          *string `json:"end_date,omitempty" form:"end_date"`
	MinPrice         *string `json:"min_price,omitempty" form:"min_price"`
	MaxPrice         *string `json:"max_price,omitempty" form:"max_price"`
	DepartureDate    *string `json:"departure_date,omitempty" form:"departure_date"`
	Passengers       *string `json:"passengers,omitempty" form:"passengers"`
	Class            *string `json:"class,omitempty" form:"class"` // economy, business, first
}

// GetMinPriceFloat converts MinPrice string to float64
func (p SearchParams) GetMinPriceFloat() (float64, error) {
	if p.MinPrice == nil {
		return 0, nil
	}
	return strconv.ParseFloat(*p.MinPrice, 64)
}

// GetMaxPriceFloat converts MaxPrice string to float64
func (p SearchParams) GetMaxPriceFloat() (float64, error) {
	if p.MaxPrice == nil {
		return 0, nil
	}
	return strconv.ParseFloat(*p.MaxPrice, 64)
}

// GetPassengersInt converts Passengers string to int
func (p SearchParams) GetPassengersInt() (int, error) {
	if p.Passengers == nil {
		return 0, nil
	}
	return strconv.Atoi(*p.Passengers)
}

// GetStartDateTime parses StartDate string to time.Time
func (p SearchParams) GetStartDateTime() (time.Time, error) {
	if p.StartDate == nil {
		return time.Time{}, nil
	}
	return time.Parse("2006-01-02", *p.StartDate)
}

// GetEndDateTime parses EndDate string to time.Time
func (p SearchParams) GetEndDateTime() (time.Time, error) {
	if p.EndDate == nil {
		return time.Time{}, nil
	}
	return time.Parse("2006-01-02", *p.EndDate)
}

// Validate checks if the search parameters are valid
func (p SearchParams) Validate() error {
	// Add validation logic here
	if p.Class != nil {
		validClasses := []string{"economy", "business", "first"}
		isValid := false
		for _, class := range validClasses {
			if *p.Class == class {
				isValid = true
				break
			}
		}
		if !isValid {
			return fmt.Errorf("invalid class: %s. Valid classes are: economy, business, first", *p.Class)
		}
	}

	return nil
}
