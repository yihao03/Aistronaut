package chat

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/yihao03/Aistronaut/m/v2/db"
	"github.com/yihao03/Aistronaut/m/v2/models"
	"github.com/yihao03/Aistronaut/m/v2/myjwt"
)

func CreateHandler(c *gin.Context) {
	claims, err := myjwt.ParseJWTFromContext(c)
	if err != nil {
		c.JSON(403, gin.H{"error": "Unauthorized: " + err.Error()})
		return
	}

	db := db.GetDB()
	userID, ok := claims["user_id"].(string)
	if !ok {
		c.JSON(400, gin.H{"error": "Invalid user ID in token"})
		return
	}
	newTrip := models.Trip{
		TripID:    uuid.New().String(),
		UserID:    userID,
		StartDate: time.Now().Format(time.RFC3339),
	}

	if err := db.Create(&newTrip).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to create trip: " + err.Error()})
		return
	}

	c.JSON(200, gin.H{"conversation_id": newTrip.TripID})
}
