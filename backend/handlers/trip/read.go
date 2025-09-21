package trip

import (
	"github.com/gin-gonic/gin"
	"github.com/yihao03/Aistronaut/m/v2/db"
	"github.com/yihao03/Aistronaut/m/v2/models"
	"github.com/yihao03/Aistronaut/m/v2/params/tripparams"
	"github.com/yihao03/Aistronaut/m/v2/view/tripview"
)

func HandleRead(c *gin.Context) {
	db := db.GetDB()
	var body tripparams.ReadParams

	if err := c.Bind(&body); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	var flightBooking []models.FlightBookings
	if err := db.Find(&flightBooking, "trip_id = ?", body.TripID).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to find flight booking: " + err.Error()})
		return
	}

	var accommodationBooking []models.AccommodationBookings
	if err := db.Find(&accommodationBooking, "trip_id = ?", body.TripID).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to find accommodation booking: " + err.Error()})
		return
	}

	res := tripview.TripResponse{
		FlightBookings:        flightBooking,
		AccommodationBookings: accommodationBooking,
	}

	c.JSON(200, res)
}
