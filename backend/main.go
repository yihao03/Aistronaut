package main

import (
	"context"
	"log"
	"os"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/gin-gonic/gin"
	"github.com/yihao03/Aistronaut/m/v2/db"
	"github.com/yihao03/Aistronaut/m/v2/router"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default port for local development
	}
	r := gin.Default()

	router.Setup(r)

	cfg, err := config.LoadDefaultConfig(context.Background())
	if err != nil {
		log.Fatal("Failed to load AWS config:", err)
		return
	}

	if err := db.Setup(&cfg); err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	if err := r.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}
