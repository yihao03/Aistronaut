package accommodations

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/yihao03/Aistronaut/m/v2/db"
	"github.com/yihao03/Aistronaut/m/v2/models"
	"github.com/yihao03/Aistronaut/m/v2/params/accommodationsparams"
)

// GetAllAccommodations retrieves all accommodations with optional filtering
func GetAllAccommodations(c *gin.Context) {
	db := db.GetDB()
	var accommodations []models.Accommodations

	// Bind query parameters to struct
	var params accommodationsparams.SearchParams
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

	if params.City != nil {
		query = query.Where("city = ?", *params.City)
	}

	if params.Country != nil {
		query = query.Where("country = ?", *params.Country)
	}

	if params.Type != nil {
		query = query.Where("type = ?", *params.Type)
	}

	if params.StarRating != nil {
		if rating, err := params.GetStarRatingInt(); err == nil && rating > 0 {
			query = query.Where("star_rating >= ?", rating)
		}
	}

	// Filter by amenities
	if params.Wifi != nil && *params.Wifi {
		query = query.Where("wifi_available = ?", true)
	}

	if params.Parking != nil && *params.Parking {
		query = query.Where("parking_available = ?", true)
	}

	if params.Breakfast != nil && *params.Breakfast {
		query = query.Where("breakfast_included = ?", true)
	}

	if params.Gym != nil && *params.Gym {
		query = query.Where("gym_available = ?", true)
	}

	if params.Pool != nil && *params.Pool {
		query = query.Where("pool_available = ?", true)
	}

	if params.Spa != nil && *params.Spa {
		query = query.Where("spa_available = ?", true)
	}

	// Execute query
	if err := query.Find(&accommodations).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to retrieve accommodations",
			"details": err.Error(),
		})
		return
	}

	// Return accommodations with metadata
	c.JSON(http.StatusOK, gin.H{
		"accommodations": accommodations,
		"count":          len(accommodations),
		"message":        "Accommodations retrieved successfully",
	})
}

// GetAccommodationByID retrieves a specific accommodation by ID
func GetAccommodationByID(c *gin.Context) {
	db := db.GetDB()
	accommodationID := c.Param("id")

	var accommodation models.Accommodations

	// Find accommodation by ID
	if err := db.Where("accommodation_id = ?", accommodationID).First(&accommodation).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error":            "Accommodation not found",
			"accommodation_id": accommodationID,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"accommodation": accommodation,
		"message":       "Accommodation retrieved successfully",
	})
}

// SearchAccommodations provides advanced search functionality
func SearchAccommodations(c *gin.Context) {
	db := db.GetDB()
	var accommodations []models.Accommodations

	// Bind search parameters to struct
	var params accommodationsparams.SearchParams
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

	if params.Destination != nil {
		// DynamoDB-compatible approach: use exact match first
		destination := *params.Destination
		query = query.Where("city = ? OR country = ?", destination, destination)
	}

	if params.Type != nil {
		query = query.Where("type = ?", *params.Type)
	}

	// Filter by availability (basic check - in real app you'd check bookings table)
	if params.Guests != nil {
		if guestCount, err := params.GetGuestsInt(); err == nil && guestCount > 0 {
			// Assuming accommodations have a max_guests field or similar logic
			query = query.Where("max_guests >= ? OR max_guests IS NULL", guestCount)
		}
	}

	// Order by star rating (highest first)
	query = query.Order("star_rating DESC")

	if err := query.Find(&accommodations).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to search accommodations",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"accommodations": accommodations,
		"count":          len(accommodations),
		"search_params":  params,
		"message":        "Accommodation search completed successfully",
	})
}

// GetAccommodationsByCity retrieves accommodations in a specific city
func GetAccommodationsByCity(c *gin.Context) {
	db := db.GetDB()
	city := c.Param("city")

	var accommodations []models.Accommodations

	if err := db.Where("city = ?", city).Find(&accommodations).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to retrieve accommodations for city",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"accommodations": accommodations,
		"city":           city,
		"count":          len(accommodations),
		"message":        "Accommodations retrieved successfully for " + city,
	})
}
