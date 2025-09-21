package models

type Users struct {
	UserID      string `gorm:"primaryKey"`
	Username    string `gorm:"size:255;not null;unique"`
	Email       string `gorm:"size:255;not null;unique"`
	Password    string `gorm:"size:255;not null;"`
	FirstName   string `gorm:"size:100"`
	LastName    string `gorm:"size:100"`
	PhoneNumber string `gorm:"size:20"`
	DateOfBirth ISO3339Time
	PassportNum string      `gorm:"size:50;unique"`
	Nationality string      `gorm:"size:100"`
	CreatedAt   ISO3339Time `gorm:"autoCreateTime;primaryKey"`
	UpdatedAt   ISO3339Time `gorm:"autoUpdateTime"`
	DeletedAt   ISO3339Time `gorm:"index"`
}
