package user

import (
	"fmt"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"github.com/yihao03/Aistronaut/m/v2/db"
	model "github.com/yihao03/Aistronaut/m/v2/models"
	"github.com/yihao03/Aistronaut/m/v2/myjwt"
	"github.com/yihao03/Aistronaut/m/v2/params/userparams"
	"golang.org/x/crypto/bcrypt"
)

func Login(c *gin.Context) {
	db := db.GetDB()

	// get username and password from frontend
	var body userparams.LoginParams

	if err := c.Bind(&body); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	var user model.Users
	// find user by username
	if err := db.Where("email = ?", body.Email).First(&user).Error; err != nil {
		fmt.Println("user not found")
		c.JSON(404, gin.H{"error": "User not found"})
		return
	}

	// compare the password from the request body with the hashed password in the database
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password)); err != nil {
		c.JSON(401, gin.H{"error": "Invalid password"})
		return
	}

	tokenString, err := myjwt.GenerateJWTToken(user)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to create token"})
		return
	}

	c.JSON(200, gin.H{"token": tokenString})
}

// Authenticate for middleware
func Authenticate() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			c.JSON(403, gin.H{"error": "Unauthorized"})
			c.Abort()
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		token, err := jwt.Parse(tokenString, func(t *jwt.Token) (any, error) {
			return myjwt.JwtKey, nil
		})

		if err != nil || !token.Valid {
			c.JSON(401, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		c.Next()
	}
}
