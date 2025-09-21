package chat

import (
	"encoding/json"
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/yihao03/Aistronaut/m/v2/db"
	"github.com/yihao03/Aistronaut/m/v2/models"
	"github.com/yihao03/Aistronaut/m/v2/myjwt"
	"github.com/yihao03/Aistronaut/m/v2/params/flightsparams"
	"github.com/yihao03/Aistronaut/m/v2/view/chatview"
)

func SelectFlightHandler(c *gin.Context) {
	var body flightsparams.SelectFlightParams

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

	var flight models.Flights
	if err := db.Find(&flight, "flight_id = ?", body.FlightID).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to find flight: " + err.Error()})
		return
	}

	booking := models.FlightBookings{
		UserID:    userID,
		TripID:    body.ConversationID,
		FlightID:  body.FlightID,
		BookingID: uuid.New().String(),
	}

	if err := db.Create(&booking).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to create flight booking: " + err.Error()})
		return
	}

	currTime := models.Now()
	flightJSON, err := json.Marshal(flight)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to marshal response: " + err.Error()})
		return
	}

	resMsg := models.ChatHistory{
		ChatHistoryID: body.ConversationID,
		ChatID:        uuid.New().String(),
		UserID:        userID,
		UserOrAgent:   "agent",
		Message:       fmt.Sprintf("Flight %s selected. Let's proceed with accomodations booking", flight.FlightNumber),
		FlightObject:  string(flightJSON),
		Timestamp:     currTime,
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
