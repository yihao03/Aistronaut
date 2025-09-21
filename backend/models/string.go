package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"strings"
)

type StringArray []string

func (sa *StringArray) Scan(value interface{}) error {
	if value == nil {
		*sa = nil
		return nil
	}
	str, ok := value.(string)
	if !ok {
		return errors.New("cannot scan non-string into StringArray")
	}
	*sa = strings.Split(str, ",")
	return nil
}

func (sa StringArray) Value() (driver.Value, error) {
	if sa == nil {
		return nil, nil
	}
	return strings.Join(sa, ","), nil
}

func (sa StringArray) MarshalJSON() ([]byte, error) {
	return json.Marshal(strings.Join(sa, ","))
}

func (sa *StringArray) UnmarshalJSON(data []byte) error {
	// Try to unmarshal as []string
	var arr []string
	if err := json.Unmarshal(data, &arr); err == nil {
		*sa = arr
		return nil
	}
	// If not, try as string
	var s string
	if err := json.Unmarshal(data, &s); err != nil {
		return err
	}
	*sa = strings.Split(s, ",")
	return nil
}
