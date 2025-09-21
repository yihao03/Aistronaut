package userview

type CreateUserResponse struct {
	Token  string `json:"token"`
	UserID string `json:"user_id"`
}
