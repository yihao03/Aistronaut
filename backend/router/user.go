package router

import (
	"github.com/gin-gonic/gin"
	"github.com/yihao03/Aistronaut/m/v2/handlers/user"
)

func SetupUserRoutes(r *gin.RouterGroup) {
	r.POST("/create", user.Create)
	r.POST("/login", user.Login)
}
