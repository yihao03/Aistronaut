package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"time"
)

type ISO3339Time time.Time

func (t *ISO3339Time) Scan(value interface{}) error {
	if value == nil {
		*t = ISO3339Time(time.Time{})
		return nil
	}

	switch v := value.(type) {
	case string:
		parsed, err := time.Parse(time.RFC3339, v)
		if err != nil {
			return err
		}
		*t = ISO3339Time(parsed)
	case []byte:
		parsed, err := time.Parse(time.RFC3339, string(v))
		if err != nil {
			return err
		}
		*t = ISO3339Time(parsed)
	case time.Time:
		*t = ISO3339Time(v)
	default:
		return errors.New("cannot scan non-string, []byte, or time.Time into ISO3339Time")
	}
	return nil
}

func (t ISO3339Time) Value() (driver.Value, error) {
	return time.Time(t).Format(time.RFC3339), nil
}

func (t ISO3339Time) MarshalJSON() ([]byte, error) {
	return json.Marshal(time.Time(t).Format(time.RFC3339))
}

func (t *ISO3339Time) UnmarshalJSON(data []byte) error {
	var s string
	if err := json.Unmarshal(data, &s); err != nil {
		return err
	}
	parsed, err := time.Parse(time.RFC3339, s)
	if err != nil {
		return err
	}
	*t = ISO3339Time(parsed)
	return nil
}

// Implement other interfaces if needed, e.g., for GORM hooks
func (t ISO3339Time) IsZero() bool {
	return time.Time(t).IsZero()
}
