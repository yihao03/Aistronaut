package models

import "time"

type Users struct {
	UserID      string `gorm:"primaryKey"`
	Username    string `gorm:"size:255;not null;unique"`
	Email       string `gorm:"size:255;not null;unique"`
	Password    string `gorm:"size:255;not null;"`
	FirstName   string `gorm:"size:100"`
	LastName    string `gorm:"size:100"`
	PhoneNumber string `gorm:"size:20"`
	DateOfBirth time.Time
	PassportNum string     `gorm:"size:50;unique"`
	Nationality string     `gorm:"size:100"`
	CreatedAt   time.Time  `gorm:"autoCreateTime;primaryKey"`
	UpdatedAt   time.Time  `gorm:"autoUpdateTime"`
	DeletedAt   *time.Time `gorm:"index"`
}
