package chat

import (
	"github.com/gin-gonic/gin"
	"github.com/yihao03/Aistronaut/m/v2/db"
	"github.com/yihao03/Aistronaut/m/v2/models"
	"github.com/yihao03/Aistronaut/m/v2/params/chatparams"
)

func ChatHandler(c *gin.Context) {
	var body chatparams.CreateParams

	if err := c.Bind(&body); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	db := db.GetDB()
	model := body.ToModel(body.UserID, "")

	if err := db.Create(model).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to create chat history: " + err.Error()})
		return
	}

	var trip models.Trip
	if err := db.Find(&trip, "trip_id = ?", body.ConversationID).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to find trip: " + err.Error()})
		return
	}

	if !CheckDetailsComplete(&trip) {
		err := getRequirements(c, &trip, body)
		if err != nil {
			c.JSON(500, gin.H{"error": "Failed to get requirements: " + err.Error()})
			return
		}
	}
}
