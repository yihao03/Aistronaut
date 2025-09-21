package router

import (
	"github.com/gin-gonic/gin"
	"github.com/yihao03/Aistronaut/m/v2/handlers/accommodations"
	"github.com/yihao03/Aistronaut/m/v2/handlers/chat"
)

func SetupAccommodationRoutes(r *gin.RouterGroup) {
	// Public routes - no authentication required for searching/viewing accommodations
	r.GET("/", accommodations.GetAllAccommodations)
	r.GET("/search", accommodations.SearchAccommodations)
	r.GET("/:id", accommodations.GetAccommodationByID)
	r.GET("/city/:city", accommodations.GetAccommodationsByCity)
	r.POST("/select", chat.SelectAccommodationHandler)
	// Protected routes would go here if needed (e.g., admin-only routes)
	// protected := r.Group("/").Use(user.Authenticate())
	// protected.POST("/", accommodations.CreateAccommodation) // Admin only
	// protected.PUT("/:id", accommodations.UpdateAccommodation) // Admin only
	// protected.DELETE("/:id", accommodations.DeleteAccommodation) // Admin only
}
