package v1

import (
	"errors"
	"movies-backend/configs"
	"movies-backend/internal/controllers/middleware"
	"movies-backend/internal/handlers"
	"movies-backend/internal/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
)

// Get User By Email
//
//	@Security		AdminAuth
//	@Tags			User
//	@Summary		Get user by email
//	@Description	This is API to get user by email
//	@Param			email	query	string	true	"email"
//	@Produce		json
//	@Router			/admin/user [get]
func GetUserByEmail(c *gin.Context) {
	var err error
	email := c.Query("email")
	movies, err := handlers.Handlers.GetUserByEmail(email)
	if err != nil {
		utils.ErrorJSON(c, err)
		return
	}
	// c.JSON(http.StatusOK, map[string]interface{}{"data": movies})
	utils.WriteJSON(c, http.StatusOK, movies)
}

type AuthenticatePayload struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// Authenticate
//
//	@Tags			User
//	@Summary		Authenticate
//	@Description	This is API to authenticate user
//	@Param			payload	body	AuthenticatePayload	true	"body payload"
//	@Produce		json
//	@Router			/authenticate [post]
func Authenticate(c *gin.Context) {
	// read json payload
	var requestPayload AuthenticatePayload
	err := c.ShouldBind(&requestPayload)
	if err != nil {
		utils.ErrorJSON(c, err, http.StatusBadRequest)
		return
	}
	// validate user against database
	user, err := handlers.Handlers.GetUserByEmail(requestPayload.Email)
	if err != nil {
		utils.ErrorJSON(c, errors.New("invalid credentials"), http.StatusBadRequest)
		return
	}
	// check password
	valid, err := user.PasswordMatches(requestPayload.Password)
	if err != nil || !valid {
		utils.ErrorJSON(c, errors.New("invalid credentials"), http.StatusBadRequest)
		return
	}
	// create a jwt user
	u := middleware.JwtUser{
		ID:        user.ID,
		FirstName: user.FirstName,
		LastName:  user.LastName,
	}
	// generate tokens
	tokens, err := middleware.AdminAuth.GenerateTokenPair(&u)
	if err != nil {
		utils.ErrorJSON(c, err, http.StatusBadRequest)
		return
	}

	refreshCookie := middleware.AdminAuth.GetRefreshCookie(tokens.RefreshToken)
	http.SetCookie(c.Writer, refreshCookie)

	utils.WriteJSON(c, http.StatusOK, tokens)
}

// Refresh Token
//
//	@Tags			User
//	@Summary		Refresh Token
//	@Description	This is API to refresh user token
//	@Produce		json
//	@Router			/refresh [get]
func RefreshToken(c *gin.Context) {
	for _, cookie := range c.Request.Cookies() {
		if cookie.Name == middleware.AdminAuth.CookieName {
			claims := &middleware.Claims{}
			refreshToken := cookie.Value

			// parse the token to get the claims
			_, err := jwt.ParseWithClaims(refreshToken, claims, func(token *jwt.Token) (interface{}, error) {
				return []byte(configs.AppConfig.JWTSecret), nil
			})
			if err != nil {
				utils.ErrorJSON(c, errors.New("unauthorized"), http.StatusUnauthorized)
				return
			}

			// get the user id from the token claims
			userID, err := strconv.Atoi(claims.Subject)
			if err != nil {
				utils.ErrorJSON(c, errors.New("unknown user"), http.StatusUnauthorized)
				return
			}

			user, err := handlers.Handlers.GetUserByID(userID)
			if err != nil {
				utils.ErrorJSON(c, errors.New("unknown user"), http.StatusUnauthorized)
				return
			}

			u := middleware.JwtUser{
				ID:        user.ID,
				FirstName: user.FirstName,
				LastName:  user.LastName,
			}

			tokenPairs, err := middleware.AdminAuth.GenerateTokenPair(&u)
			if err != nil {
				utils.ErrorJSON(c, errors.New("error generating tokens"), http.StatusUnauthorized)
				return
			}

			http.SetCookie(c.Writer, middleware.AdminAuth.GetRefreshCookie(tokenPairs.RefreshToken))

			utils.WriteJSON(c, http.StatusOK, tokenPairs)
			return
		}
	}
	utils.ErrorJSON(c, errors.New("unknown cookie"), http.StatusUnauthorized)
}

// Logout
//
//	@Tags			User
//	@Summary		Logout
//	@Description	This is API to logout user
//	@Produce		json
//	@Router			/logout [get]
func Logout(c *gin.Context) {
	http.SetCookie(c.Writer, middleware.AdminAuth.GetExpiredRefreshCookie())
	c.Writer.WriteHeader(http.StatusAccepted)
}
