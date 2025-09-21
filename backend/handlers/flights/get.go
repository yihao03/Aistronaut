package flights

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/yihao03/Aistronaut/m/v2/db"
	"github.com/yihao03/Aistronaut/m/v2/models"
	"github.com/yihao03/Aistronaut/m/v2/params/flightsparams"
)

// GetAllFlights retrieves all flights with optional filtering
func GetAllFlights(c *gin.Context) {
	db := db.GetDB()
	var flights []models.Flights

	// Bind query parameters to struct
	var params flightsparams.SearchParams
	if err := c.ShouldBindQuery(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid query parameters",
			"details": err.Error(),
		})
		return
	}

	// Validate parameters
	if err := params.Validate(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Validation failed",
			"details": err.Error(),
		})
		return
	}

	// Build query with filters
	query := db

	if params.DepartureAirport != nil {
		query = query.Where("departure_airport = ?", *params.DepartureAirport)
	}

	if params.ArrivalAirport != nil {
		query = query.Where("arrival_airport = ?", *params.ArrivalAirport)
	}

	if params.Airline != nil {
		query = query.Where("airline = ?", *params.Airline)
	}

	if params.Status != nil {
		query = query.Where("status = ?", *params.Status)
	}

	if params.StartDate != nil {
		query = query.Where("departure_time >= ?", *params.StartDate)
	}

	if params.EndDate != nil {
		query = query.Where("departure_time <= ?", *params.EndDate)
	}

	if params.MinPrice != nil {
		if price, err := params.GetMinPriceFloat(); err == nil && price > 0 {
			query = query.Where("price_economy >= ?", price)
		}
	}

	if params.MaxPrice != nil {
		if price, err := params.GetMaxPriceFloat(); err == nil && price > 0 {
			query = query.Where("price_economy <= ?", price)
		}
	}

	// Execute query
	if err := query.Find(&flights).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to retrieve flights",
			"details": err.Error(),
		})
		return
	}

	// Return flights with metadata
	c.JSON(http.StatusOK, gin.H{
		"flights": flights,
		"count":   len(flights),
		"message": "Flights retrieved successfully",
	})
}

// GetFlightByID retrieves a specific flight by ID
func GetFlightByID(c *gin.Context) {
	db := db.GetDB()
	flightID := c.Param("id")

	var flight models.Flights

	// Find flight by ID
	if err := db.Where("flight_id = ?", flightID).First(&flight).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error":     "Flight not found",
			"flight_id": flightID,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"flight":  flight,
		"message": "Flight retrieved successfully",
	})
}

// SearchFlights provides advanced search functionality
func SearchFlights(c *gin.Context) {
	db := db.GetDB()
	var flights []models.Flights

	// Bind search parameters to struct
	var params flightsparams.SearchParams
	if err := c.ShouldBindQuery(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid search parameters",
			"details": err.Error(),
		})
		return
	}

	// Validate parameters
	if err := params.Validate(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Validation failed",
			"details": err.Error(),
		})
		return
	}

	// Build search query
	query := db

	if params.DepartureAirport != nil {
		query = query.Where("departure_airport = ?", *params.DepartureAirport)
	}

	if params.ArrivalAirport != nil {
		query = query.Where("arrival_airport = ?", *params.ArrivalAirport)
	}

	if params.DepartureDate != nil {
		query = query.Where("DATE(departure_time) = ?", *params.DepartureDate)
	}

	// Filter by available seats
	if params.Passengers != nil {
		if passengerCount, err := params.GetPassengersInt(); err == nil && passengerCount > 0 {
			query = query.Where("available_seats >= ?", passengerCount)
		}
	}

	// Only show scheduled flights
	query = query.Where("status = ?", "Scheduled")

	// Order by departure time
	query = query.Order("departure_time ASC")

	if err := query.Find(&flights).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to search flights",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"flights":       flights,
		"count":         len(flights),
		"search_params": params,
		"message":       "Flight search completed successfully",
	})
}
