package chat

import (
	"reflect"

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
	if err := db.Create(body.ToModel(body.UserID, "")).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to create chat history: " + err.Error()})
		return
	}

	var trip models.Trip
	if err := db.Find(&trip, body.ConversationID).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to find trip: " + err.Error()})
		return
	}

	v := reflect.ValueOf(trip)
	done := true
	for i := 0; i < v.NumField(); i++ {
		if v.Field(i).IsNil() {
			done = false
		}
	}

	if !done {
		getRequirements(c)
		return
	}
}
