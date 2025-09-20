package main

import (
	"context"
	"log"
	"os"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/yihao03/Aistronaut/m/v2/db"
	"github.com/yihao03/Aistronaut/m/v2/lda"
	"github.com/yihao03/Aistronaut/m/v2/router"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found or could not be loaded")
	}
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default port for local development
	}

	ctx := context.Background()
	cfg, err := config.LoadDefaultConfig(ctx)
	if err != nil {
		log.Fatal("Unable to load AWS SDK config:", err)
		return
	}

	lda.Init(ctx, cfg)

	r := gin.Default()

	router.Setup(r)

	if err := db.Setup(); err != nil {
		log.Fatal("Failed to connect to database:", err)
		return
	}

	if err := r.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}
