package router

import (
	"github.com/gin-gonic/gin"
	"github.com/yihao03/Aistronaut/m/v2/handlers/flights"
)

func SetupFlightRoutes(r *gin.RouterGroup) {
	// Public routes - no authentication required for searching/viewing flights
	r.GET("/", flights.GetAllFlights)
	r.GET("/search", flights.SearchFlights)
	r.GET("/:id", flights.GetFlightByID)

	// Protected routes would go here if needed (e.g., admin-only routes)
	// protected := r.Group("/").Use(user.Authenticate())
	// protected.POST("/", flights.CreateFlight) // Admin only
	// protected.PUT("/:id", flights.UpdateFlight) // Admin only
	// protected.DELETE("/:id", flights.DeleteFlight) // Admin only
}
