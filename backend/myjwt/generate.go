package myjwt

import (
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/yihao03/Aistronaut/m/v2/models"
)

var JwtKey = []byte("CHEN_YI_IS_GAY")

// GenerateJWTToken creates a JWT token for the given user
func GenerateJWTToken(user models.Users) (string, error) {
	claims := jwt.MapClaims{
		"userID":   user.UserID,
		"username": user.Username,
		"exp":      time.Now().Add(24 * time.Hour).Unix(),
		"iat":      time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(JwtKey)
}
