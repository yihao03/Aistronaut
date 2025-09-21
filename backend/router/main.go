package router

import (
	"fmt"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/yihao03/Aistronaut/m/v2/handlers/user"
)

func Setup(r *gin.Engine) {
	// setup
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type", "Authorization"},
		AllowCredentials: false,
	}))

	// routes
	r.GET("/", func(ctx *gin.Context) {
		fmt.Println("hi")
	})

	userGroup := r.Group("/user")
	SetupUserRoutes(userGroup)

	chatGroup := r.Group("/chat")
	SetupChatRoutes(chatGroup)

	protected := r.Group("/").Use(user.Authenticate())
	protected.GET("/hi", func(c *gin.Context) {
		fmt.Println("hello")
	})
}
