package chat

import (
	"encoding/json"
	"fmt"

	"github.com/aws/aws-sdk-go-v2/service/lambda"
	"github.com/gin-gonic/gin"
	"github.com/yihao03/Aistronaut/m/v2/db"
	"github.com/yihao03/Aistronaut/m/v2/lda"
	"github.com/yihao03/Aistronaut/m/v2/models"
	"github.com/yihao03/Aistronaut/m/v2/params/chatparams"
)

type Flight struct {
	FlightNumber  *string  `json:"flight_number"`
	DepartureCity *string  `json:"departure_city"`
	ArrivalCity   *string  `json:"arrival_city"`
	DepartureDate *string  `json:"departure_date"`
	DepartureTime *string  `json:"departure_time"`
	ArrivalDate   *string  `json:"arrival_date"`
	ArrivalTime   *string  `json:"arrival_time"`
	DurationHours *float64 `json:"duration_hours"`
	Stops         []string `json:"stops"`
}

type FlightDetails struct {
	Airline        string  `json:"airline"`
	OutboundFlight Flight  `json:"outbound_flight"`
	ReturnFlight   Flight  `json:"return_flight"`
	Price          int     `json:"price"`
	Currency       *string `json:"currency"`
	Reason         string  `json:"reason"`
}

type SelectedFlightWrapper struct {
	SelectedFlight models.SelectedFlight `json:"selected_flight"`
}

type ResponseBody struct {
	SelectedFlight  string  `json:"selected_flight"`
	TripPreferences *string `json:"trip_preferences"`
	Mode            string  `json:"mode"`
}

func getFlight(c *gin.Context,
	trip *models.Trip,
	chat chatparams.CreateParams,
	chatHistories *[]models.ChatHistory,
	flights *[]models.Flights,
) (*FinalResponse, error) {
	lambdaClient := lda.GetLambda()
	db := db.GetDB()

	var user models.Users
	db.Find(&user, "user_id = ?", trip.UserID)

	tripString, err := json.Marshal(trip)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal trip: %v", err)
	}
	flightString, err := json.Marshal(flights)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal flights: %v", err)
	}

	modes := []string{"chill", "moderate", "intense"}
	var results []models.TripPlans

	for _, mode := range modes {
		payload := LambdaPayload{
			FlightDetails:   string(flightString),
			TripPreferences: string(tripString),
			Mode:            mode,
		}

		request := LambdaRequest{
			Body: payload,
		}

		marshaledPayload, err := json.Marshal(request)
		if err != nil {
			return nil, fmt.Errorf("failed to marshal payload: %v", err)
		}

		output, err := lambdaClient.Invoke(c.Request.Context(), &lambda.InvokeInput{
			FunctionName: lda.FLIGHT,
			Payload:      marshaledPayload,
		})
		if err != nil {
			return nil, fmt.Errorf("failed to invoke Lambda function: %v", err)
		}

		// Parse the Lambda response
		var lambdaResp LambdaResponse
		if err := json.Unmarshal(output.Payload, &lambdaResp); err != nil {
			return nil, fmt.Errorf("failed to parse Lambda response: %v", err)
		}

		var respBody ResponseBody
		if err := json.Unmarshal([]byte(lambdaResp.Body), &respBody); err != nil {
			return nil, fmt.Errorf("failed to unmarshal response body: %v", err)
		}

		var selectedFlightWrapper SelectedFlightWrapper
		if err := json.Unmarshal([]byte(respBody.SelectedFlight), &selectedFlightWrapper); err != nil {
			return nil, fmt.Errorf("failed to unmarshal selected flight: %v", err)
		}

		marshaledFlight, err := json.Marshal(selectedFlightWrapper.SelectedFlight)
		if err != nil {
			return nil, fmt.Errorf("failed to marshal selected flight: %v", err)
		}
		payload.SelectedFlight = string(marshaledFlight)

		// Update marshaledPayload with selected flight
		request.Body = payload
		marshaledPayload, err = json.Marshal(request)
		if err != nil {
			return nil, fmt.Errorf("failed to marshal updated payload: %v", err)
		}

		planOutput, err := lambdaClient.Invoke(c.Request.Context(), &lambda.InvokeInput{
			FunctionName: lda.PLANNER,
			Payload:      marshaledPayload,
		})
		if err != nil {
			return nil, fmt.Errorf("failed to invoke Lambda function: %v", err)
		}

		// Parse the Lambda response
		var planRes LambdaResponse
		if err := json.Unmarshal(planOutput.Payload, &planRes); err != nil {
			return nil, fmt.Errorf("failed to parse Lambda response: %v", err)
		}

		tripPlan := models.TripPlans{
			SelectedFlight:  selectedFlightWrapper.SelectedFlight,
			TripPreferences: respBody.TripPreferences,
			Mode:            respBody.Mode,
		}
		results = append(results, tripPlan)
	}

	fmt.Printf("Final Results: %+v\n", results)
	return &FinalResponse{TripOptions: results}, nil
}
