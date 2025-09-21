package models

import (
	"time"
)

type Users struct {
	UserID      string     `gorm:"primaryKey"`
	CreatedAt   time.Time  `gorm:"autoCreateTime"`
	UpdatedAt   time.Time  `gorm:"autoUpdateTime"`
	DeletedAt   *time.Time `gorm:"index"`
	Username    string     `gorm:"size:255;not null;unique"`
	Email       string     `gorm:"size:255;not null;unique"`
	Password    string     `gorm:"size:255;not null;"`
	Remarks     string
	Nationality string
}
