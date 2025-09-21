package chat

import (
	"encoding/json"
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/yihao03/Aistronaut/m/v2/db"
	"github.com/yihao03/Aistronaut/m/v2/handlers/flights"
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
	if err := db.Find(&trip, "trip_id = ?", body.ChatHistoryID).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to find trip: " + err.Error()})
		return
	}

	var chatHistories []models.ChatHistory
	if err := db.Where("chat_history_id = ?", body.ChatHistoryID).Order("created_at asc").Find(&chatHistories).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to find chat histories: " + err.Error()})
		return
	}

	var retRes *FinalResponse
	var err error

	if !CheckDetailsComplete(&trip) {
		retRes, err = getRequirements(c, &trip, body, &chatHistories)
		if err != nil {
			c.JSON(500, gin.H{"error": "Failed to get requirements: " + err.Error()})
			return
		}
	}

	if CheckDetailsComplete(&trip) && !HasFlightDetails(&trip) {
		fmt.Println("Getting flight details...")
		// Get flights based on trip dates (assuming trip has DepartureDate and ReturnDate fields)
		flights, err := flights.GetFlightsByDateRange(trip.StartDate, trip.EndDate)
		if err != nil {
			c.JSON(500, gin.H{"error": "Failed to get flights: " + err.Error()})
			return
		}

		retRes, err = getFlight(c, &trip, body, &chatHistories, &flights)
		if err != nil {
			c.JSON(500, gin.H{"error": "Failed to get flight response: " + err.Error()})
			return
		}
	}

	if retRes == nil {
		c.JSON(400, gin.H{"error": "No response generated"})
		return
	}

	reqJSON, err := json.Marshal(retRes.TripDetails)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to marshal response: " + err.Error()})
		return
	}

	flightJSON, err := json.Marshal(retRes.TripOptions)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to marshal response: " + err.Error()})
		return
	}
	fmt.Println("Flight JSON:", string(flightJSON))

	accomJSON, err := json.Marshal(retRes.AccomodationDetails)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to marshal response: " + err.Error()})
		return
	}

	currTime := models.Now()

	resMsg := models.ChatHistory{
		ChatHistoryID:       model.ChatHistoryID,
		ChatID:              uuid.New().String(),
		UserID:              body.UserID,
		UserOrAgent:         "agent",
		Message:             retRes.Response,
		ReqObject:           string(reqJSON),
		FlightObject:        string(flightJSON),
		AccommodationObject: string(accomJSON),
		Timestamp:           currTime,
	}

	if err := db.Create(&resMsg).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to create chat response: " + err.Error()})
		return
	}

	resView := chatview.ChatResponse{
		ConversationID:      body.ChatHistoryID,
		Content:             retRes.Response,
		Object:              string(reqJSON),
		FlightObject:        string(flightJSON),
		AccommodationObject: string(accomJSON),
		CreatedAt:           currTime.ToString(),
		IsUser:              false,
	}

	c.JSON(200, resView)
}
