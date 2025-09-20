package db

import (
	"errors"
	"log"
	"os"

	"github.com/miyamo2/dynmgrm"
	"gorm.io/gorm"
)

var db *gorm.DB

func Setup() error {
	dsn := os.Getenv("DATABASE_DSN")
	if dsn == "" {
		return errors.New("DATABASE_DSN environment variable is not set")
	}
	setupdb, err := gorm.Open(dynmgrm.Open(dsn), &gorm.Config{})
	if setupdb == nil {
		return errors.New("failed to connect database")
	}

	db = setupdb

	return err
}

func GetDB() *gorm.DB {
	if db == nil {
		log.Panic("Database not initialized. Call Setup first.")
	}
	return db
}
