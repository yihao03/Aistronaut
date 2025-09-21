package router

import (
	"github.com/gin-gonic/gin"
	"github.com/yihao03/Aistronaut/m/v2/handlers/trip"
)

func SetupTripRoutes(r *gin.RouterGroup) {
	r.GET("/:id", trip.HandleRead)
}
