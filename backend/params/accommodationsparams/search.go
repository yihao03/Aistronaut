package accommodationsparams

import (
	"fmt"
	"strconv"
)

// SearchParams for accommodation search endpoint
type SearchParams struct {
	City         *string `json:"city,omitempty" form:"city"`
	Country      *string `json:"country,omitempty" form:"country"`
	Type         *string `json:"type,omitempty" form:"type"`
	StarRating   *string `json:"star_rating,omitempty" form:"star_rating"`
	MinPrice     *string `json:"min_price,omitempty" form:"min_price"`
	MaxPrice     *string `json:"max_price,omitempty" form:"max_price"`
	Destination  *string `json:"destination,omitempty" form:"destination"`
	CheckinDate  *string `json:"checkin_date,omitempty" form:"checkin_date"`
	CheckoutDate *string `json:"checkout_date,omitempty" form:"checkout_date"`
	Guests       *string `json:"guests,omitempty" form:"guests"`

	// Amenity filters
	Wifi      *bool `json:"wifi,omitempty" form:"wifi"`
	Parking   *bool `json:"parking,omitempty" form:"parking"`
	Breakfast *bool `json:"breakfast,omitempty" form:"breakfast"`
	Gym       *bool `json:"gym,omitempty" form:"gym"`
	Pool      *bool `json:"pool,omitempty" form:"pool"`
	Spa       *bool `json:"spa,omitempty" form:"spa"`
}

// GetStarRatingInt converts StarRating string to int
func (p SearchParams) GetStarRatingInt() (int, error) {
	if p.StarRating == nil {
		return 0, nil
	}
	return strconv.Atoi(*p.StarRating)
}

// GetMinPriceFloat converts MinPrice string to float64
func (p SearchParams) GetMinPriceFloat() (float64, error) {
	if p.MinPrice == nil {
		return 0, nil
	}
	return strconv.ParseFloat(*p.MinPrice, 64)
}

// GetMaxPriceFloat converts MaxPrice string to float64
func (p SearchParams) GetMaxPriceFloat() (float64, error) {
	if p.MaxPrice == nil {
		return 0, nil
	}
	return strconv.ParseFloat(*p.MaxPrice, 64)
}

// GetGuestsInt converts Guests string to int
func (p SearchParams) GetGuestsInt() (int, error) {
	if p.Guests == nil {
		return 0, nil
	}
	return strconv.Atoi(*p.Guests)
}

// Validate checks if the search parameters are valid
func (p SearchParams) Validate() error {
	// Validate star rating range
	if p.StarRating != nil {
		rating, err := p.GetStarRatingInt()
		if err != nil {
			return fmt.Errorf("invalid star rating: %s", *p.StarRating)
		}
		if rating < 1 || rating > 5 {
			return fmt.Errorf("star rating must be between 1 and 5, got: %d", rating)
		}
	}

	// Validate accommodation type
	if p.Type != nil {
		validTypes := []string{"hotel", "hostel", "apartment", "resort", "villa", "guesthouse", "bnb"}
		isValid := false
		for _, validType := range validTypes {
			if *p.Type == validType {
				isValid = true
				break
			}
		}
		if !isValid {
			return fmt.Errorf("invalid accommodation type: %s", *p.Type)
		}
	}

	// Validate guest count
	if p.Guests != nil {
		guests, err := p.GetGuestsInt()
		if err != nil {
			return fmt.Errorf("invalid guest count: %s", *p.Guests)
		}
		if guests < 1 {
			return fmt.Errorf("guest count must be at least 1, got: %d", guests)
		}
	}

	return nil
}
