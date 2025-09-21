package models

import "time"

type Users struct {
	UserID      string      `gorm:"primaryKey"`
	CreatedAt   ISO3339Time `gorm:"autoCreateTime"`
	UpdatedAt   ISO3339Time `gorm:"autoUpdateTime"`
	DeletedAt   time.Time   `gorm:"index"` // Keep as time.Time for GORM soft delete compatibility
	Username    string      `gorm:"size:255;not null;unique"`
	Email       string      `gorm:"size:255;not null;unique"`
	Password    string      `gorm:"size:255;not null;"`
	Remarks     string
	Nationality string
}
