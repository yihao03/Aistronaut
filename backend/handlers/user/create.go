package user

import (
	"net/http"
	"net/mail"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/yihao03/Aistronaut/m/v2/db"
	model "github.com/yihao03/Aistronaut/m/v2/models"
	"github.com/yihao03/Aistronaut/m/v2/myjwt"
	"github.com/yihao03/Aistronaut/m/v2/params/userparams"
	"github.com/yihao03/Aistronaut/m/v2/view/userview"
	"golang.org/x/crypto/bcrypt"
)

func Create(c *gin.Context) {
	var body userparams.CreateParams

	if err := c.Bind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if _, err := mail.ParseAddress(body.Email); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid email format"})
		return
	}

	db := db.GetDB()

	if len(body.Password) < 8 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Password must be at least 8 characters long"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(body.Password), 10)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to hash password"})
		return
	}

	id := uuid.New().String()

	user := model.Users{
		UserID:      id,
		Username:    body.Username,
		Email:       body.Email,
		Password:    string(hashedPassword),
		Nationality: body.Nationality,
	}

	result := db.Create(&user)
	if err := result.Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to create user: " + err.Error()})
		return
	}

	jwtToken, err := myjwt.GenerateJWTToken(user)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to create token"})
		return
	}

	view := userview.CreateUserResponse{
		Token:  jwtToken,
		UserID: id,
	}

	if result.Error != nil {
		c.JSON(500, gin.H{"error": result.Error})
	} else {
		c.JSON(200, view)
	}
}
