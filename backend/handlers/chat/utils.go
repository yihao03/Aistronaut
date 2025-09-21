package chat

import (
	"reflect"

	"github.com/yihao03/Aistronaut/m/v2/models"
)

func CheckDetailsComplete(trip *models.Trip) bool {
	v := reflect.ValueOf(trip).Elem() // Use .Elem() to dereference the pointer
	done := true
	for i := 0; i < v.NumField(); i++ {
		if v.Field(i).IsZero() {
			done = false
		}
	}

	return done
}
