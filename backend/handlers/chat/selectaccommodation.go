package chat

import (
	"encoding/json"
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/yihao03/Aistronaut/m/v2/db"
	"github.com/yihao03/Aistronaut/m/v2/models"
	"github.com/yihao03/Aistronaut/m/v2/myjwt"
	"github.com/yihao03/Aistronaut/m/v2/params/accommodationparams"
	"github.com/yihao03/Aistronaut/m/v2/view/chatview"
)

func SelectAccommodationHandler(c *gin.Context) {
	var body accommodationparams.SelectAccommodationParams

	if err := c.Bind(&body); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	db := db.GetDB()
	claims, err := myjwt.ParseJWTFromContext(c)
	if err != nil {
		c.JSON(403, gin.H{"error": "Unauthorized: " + err.Error()})
		return
	}
	userID, ok := claims["user_id"].(string)
	if !ok {
		c.JSON(400, gin.H{"error": "Invalid user ID in token"})
		return
	}

	var accommodation models.Accommodations
	if err := db.Find(&accommodation, "accommodation_id = ?", body.AccommodationID).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to find accommodation: " + err.Error()})
		return
	}

	booking := models.AccommodationBookings{
		UserID:          userID,
		TripID:          body.ConversationID,
		AccommodationID: body.AccommodationID,
		BookingID:       uuid.New().String(),
	}

	if err := db.Create(&booking).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to create accommodation booking: " + err.Error()})
		return
	}

	currTime := models.Now()
	accommodationJSON, err := json.Marshal(accommodation)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to marshal response: " + err.Error()})
		return
	}

	resMsg := models.ChatHistory{
		ChatHistoryID:       body.ConversationID,
		ChatID:              uuid.New().String(),
		UserID:              userID,
		UserOrAgent:         "agent",
		Message:             fmt.Sprintf("Accommodation %s selected. Booking confirmed.", accommodation.Name),
		AccommodationObject: string(accommodationJSON),
		Timestamp:           currTime,
	}

	if err := db.Create(&resMsg).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to create chat response: " + err.Error()})
		return
	}

	resView := chatview.ChatResponse{
		ConversationID: body.ConversationID,
		Content:        resMsg.Message,
		CreatedAt:      currTime.ToString(),
		IsUser:         false,
	}

	c.JSON(200, resView)
}
