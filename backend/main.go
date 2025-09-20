package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/yihao03/Aistronaut/m/v2/db"
	"github.com/yihao03/Aistronaut/m/v2/router"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found or could not be loaded")
	}

	dsn := os.Getenv("DATABASE_DSN")
	if dsn == "" {
		log.Fatal("DATABASE_DSN environment variable is not set")
		return
	}
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // Default port for local development
	}
	r := gin.Default()

	router.Setup(r)

	if err := db.Setup(dsn); err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	if err := r.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}
