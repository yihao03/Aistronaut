package main

import (
	"log"
	"os"

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

	if err := db.Setup("host=localhost user=postgres password=postgres dbname=aistronaut port=5432 sslmode=prefer"); err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	if err := r.Run(":" + port); err != nil {
		log.Fatal(err)
	}
}
