package router

import (
	"github.com/gin-gonic/gin"
	"github.com/yihao03/Aistronaut/m/v2/handlers/chat"
)

func SetupChatRoutes(r *gin.RouterGroup) {
	r.POST("/chat", chat.ChatHandler)
}
