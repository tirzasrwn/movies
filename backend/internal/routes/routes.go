package routes

import (
	"movies-backend/internal/controllers/middleware"
	v1 "movies-backend/internal/controllers/v1"

	"github.com/gin-gonic/gin"
)

func InitializeRouter() (router *gin.Engine) {

	router = gin.Default()
	router.Use(
		middleware.CORSMiddleware(),
	)

	v1route := router.Group("/v1")
	{
		v1route.POST("/authenticate", v1.Authenticate)
		v1route.GET("/refresh", v1.RefreshToken)
		v1route.GET("/logout", v1.Logout)

		v1route.GET("/movies", v1.GetMovieList)
		v1route.GET("/movies/:id", v1.GetMovieByID)
		v1route.GET("/genres", v1.GetGenreList)
		v1route.GET("/movies/genres/:id", v1.GetMovieByGenre)

		v1route.POST("/graph", v1.MovieGraphQL)

		admin := v1route.Group("/admin")
		admin.Use(middleware.AdminAuth.AuthRequest())
		{
			admin.GET("/user", v1.GetUserByEmail)
			admin.GET("/movies", v1.GetMovieCatalouge)
			admin.PUT("/movies/0", v1.InsertMovie)
			admin.PATCH("/movies/:id", v1.UpdateMovie)
			admin.GET("/movies/:id", v1.MovieForEdit)
			admin.DELETE("/movies/:id", v1.DeleteMovie)
		}
	}

	return router
}
