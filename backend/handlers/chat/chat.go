package chat

import (
	"encoding/json"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/yihao03/Aistronaut/m/v2/db"
	"github.com/yihao03/Aistronaut/m/v2/models"
	"github.com/yihao03/Aistronaut/m/v2/params/chatparams"
	"github.com/yihao03/Aistronaut/m/v2/view/chatview"
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

	var retRes *FinalResponse
	var err error
	if !CheckDetailsComplete(&trip) {
		retRes, err = getRequirements(c, &trip, body)
		if err != nil {
			c.JSON(500, gin.H{"error": "Failed to get requirements: " + err.Error()})
			return
		}
	}

	if retRes == nil {
		c.JSON(400, gin.H{"error": "No response generated"})
		return
	}

	resJSON, err := json.Marshal(retRes.TripDetails)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to marshal response: " + err.Error()})
		return
	}

	res := string(resJSON)
	currTime := time.Now().Format(time.RFC3339)

	resMsg := models.ChatHistory{
		ChatHistoryID: model.ChatHistoryID,
		ChatID:        uuid.New().String(),
		UserID:        body.UserID,
		UserOrAgent:   "agent",
		Message:       res,
		Timestamp:     currTime,
	}

	if err := db.Create(&resMsg).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to create chat response: " + err.Error()})
		return
	}

	resView := chatview.ChatResponse{
		ConversationID: body.ConversationID,
		Content:        retRes.Response,
		Object:         res,
		CreatedAt:      currTime,
		IsUser:         false,
	}

	c.JSON(200, resView)
}
