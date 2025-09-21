package models

type Users struct {
	UserID      string `gorm:"primaryKey"`
	CreatedAt   string `gorm:"autoCreateTime"`
	UpdatedAt   string `gorm:"autoUpdateTime"`
	DeletedAt   string `gorm:"index"`
	Username    string `gorm:"size:255;not null;unique"`
	Email       string `gorm:"size:255;not null;unique"`
	Password    string `gorm:"size:255;not null;"`
	Remarks     string
	Nationality string
}
