package convoparams

type CreateParams struct {
	UserID string `json:"user_id" binding:"required"`
}
