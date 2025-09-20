package db

import (
	"errors"
	"log"

	"github.com/miyamo2/dynmgrm"
	"github.com/yihao03/Aistronaut/m/v2/models"
	"gorm.io/gorm"
)

var db *gorm.DB

func Setup(dsn string) error {
	setupdb, err := gorm.Open(dynmgrm.Open(dsn), &gorm.Config{})
	if setupdb == nil {
		return errors.New("failed to connect database")
	}
	setupdb.AutoMigrate(&models.User{})

	db = setupdb

	return err
}

func GetDB() *gorm.DB {
	if db == nil {
		log.Panic("Database not initialized. Call Setup first.")
	}
	return db
}
