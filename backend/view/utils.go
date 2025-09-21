package view

import (
	"reflect"
	"strings"

	"github.com/gin-gonic/gin"
)

func structToGinH(obj interface{}) gin.H {
	result := gin.H{}
	v := reflect.ValueOf(obj)
	t := reflect.TypeOf(obj)

	for i := 0; i < v.NumField(); i++ {
		field := t.Field(i)
		value := v.Field(i)

		jsonTag := field.Tag.Get("json")
		if jsonTag == "" || jsonTag == "-" {
			continue
		}

		// Handle json tag options like "field_name,omitempty"
		jsonName := strings.Split(jsonTag, ",")[0]
		result[jsonName] = value.Interface()
	}

	return result
}
