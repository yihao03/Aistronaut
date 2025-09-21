package lda

import "github.com/aws/aws-sdk-go-v2/aws"

var (
	PARSER  = aws.String("data_parser")
	FLIGHT  = aws.String("flight_decider")
	PLANNER = aws.String("trip_planner")
)
