package chat

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/yihao03/Aistronaut/m/v2/db"
	"github.com/yihao03/Aistronaut/m/v2/models"
	"github.com/yihao03/Aistronaut/m/v2/params/convoparams"
)

func CreateHandler(c *gin.Context) {
	var body convoparams.CreateParams

	if err := c.Bind(&body); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	db := db.GetDB()
	newTrip := models.Trip{
		TripID: uuid.New().String(),
		UserID: body.UserID,
	}
	if err := db.Create(&newTrip).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to create trip: " + err.Error()})
		return
	}

	c.JSON(200, gin.H{"conversation_id": newTrip.TripID})
}
