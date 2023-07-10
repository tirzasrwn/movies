package v1

import (
	"fmt"
	"movies-backend/internal/handlers"
	"movies-backend/internal/models"
	"movies-backend/internal/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// Get All Movies
//
//	@Tags			Public-Movies
//	@Summary		Get all movies
//	@Description	This is API to get all movies
//	@Produce		json
//	@Router			/movies [get]
func GetMovieList(c *gin.Context) {
	var err error
	movies, err := handlers.Handlers.AllMovies()
	if err != nil {
		utils.ErrorJSON(c, err)
		return
	}
	// c.JSON(http.StatusOK, map[string]interface{}{"data": movies})
	utils.WriteJSON(c, http.StatusOK, movies)
}

// Get Movies Catalouge
//
//	@Security		AdminAuth
//	@Tags			Admin-Movie
//	@Summary		Get movies catalouge
//	@Description	This is API to get movies catalouge
//	@Produce		json
//	@Router			/admin/movies [get]
func GetMovieCatalouge(c *gin.Context) {
	var err error
	movies, err := handlers.Handlers.AllMovies()
	if err != nil {
		utils.ErrorJSON(c, err)
		return
	}
	// c.JSON(http.StatusOK, map[string]interface{}{"data": movies})
	utils.WriteJSON(c, http.StatusOK, movies)
}

// Get Movies By ID
//
//	@Tags			Public-Movies
//	@Summary		Get movie by id
//	@Description	This is API to get movies by id
//	@Param			id	path	int	true	"Movie ID"
//	@Produce		json
//	@Router			/movies/{id} [get]
func GetMovieByID(c *gin.Context) {
	var err error
	id := c.Param("id")
	iId, _ := strconv.Atoi(id)
	movies, err := handlers.Handlers.OneMovie(iId)
	if err != nil {
		utils.ErrorJSON(c, err)
		return
	}
	utils.WriteJSON(c, http.StatusOK, movies)
}

// Get All Genres
//
//	@Tags			Public-Movies
//	@Summary		Get all genres
//	@Description	This is API to get all movies genres
//	@Produce		json
//	@Router			/genres [get]
func GetGenreList(c *gin.Context) {
	var err error
	genres, err := handlers.Handlers.AllGenres()
	if err != nil {
		utils.ErrorJSON(c, err)
		return
	}
	utils.WriteJSON(c, http.StatusOK, genres)
}

// Get All Movies By Genre
//
//	@Tags			Public-Movies
//	@Summary		Get all movies by genre
//	@Description	This is API to get all movies by genre
//	@Param			id	path	int	true	"Genre ID"
//	@Produce		json
//	@Router			/movies/genres/{id} [get]
func GetMovieByGenre(c *gin.Context) {
	var err error
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorJSON(c, err, http.StatusBadRequest)
		return
	}
	movies, err := handlers.Handlers.AllMovies(id)
	if err != nil {
		utils.ErrorJSON(c, err)
		return
	}
	if len(movies) <= 0 {
		c.JSON(http.StatusOK, []*models.Movie{})
		return
	}
	utils.WriteJSON(c, http.StatusOK, movies)
}

// Movie For Edit
//
//	@Security		AdminAuth
//	@Tags			Admin-Movie
//	@Summary		Movie For Edit
//	@Description	This is API to movie for edit
//	@Param			id	path	int	true	"Movie ID"
//	@Produce		json
//	@Router			/admin/movies/{id} [get]
func MovieForEdit(c *gin.Context) {
	var err error
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorJSON(c, err, http.StatusBadRequest)
		return
	}
	movie, genres, err := handlers.Handlers.OneMovieForEdit(id)
	if err != nil {
		utils.ErrorJSON(c, err, http.StatusInternalServerError)
		return
	}

	var payload = struct {
		Movie  *models.Movie   `json:"movie"`
		Genres []*models.Genre `json:"genres"`
	}{
		movie,
		genres,
	}

	utils.WriteJSON(c, http.StatusOK, payload)
}

// Insert A Movie
//
//	@Security		AdminAuth
//	@Tags			Admin-Movie
//	@Summary		Movie For Edit
//	@Description	This is API to insert a movie
//	@Param			payload	body	models.Movie	true	"Body Payload"
//	@Produce		json
//	@Router			/admin/movies/0 [put]
func InsertMovie(c *gin.Context) {
	var movie models.Movie
	err := c.ShouldBind(&movie)
	if err != nil {
		utils.ErrorJSON(c, err, http.StatusBadRequest)
		return
	}
	newID, err := handlers.Handlers.InsertMovie(movie)
	if err != nil {
		utils.ErrorJSON(c, err, http.StatusInternalServerError)
		return
	}

	resp := utils.JSONResponse{
		Error:   false,
		Message: fmt.Sprintf("movie with id %d updated", newID),
	}

	utils.WriteJSON(c, http.StatusOK, resp)
}

// Update A Movie
//
//	@Security		AdminAuth
//	@Tags			Admin-Movie
//	@Summary		Update Movie
//	@Description	This is API to update a movie
//	@Param			payload	body	models.Movie	true	"Body Payload"
//	@Param			id		path	int				true	"Movie ID"
//	@Produce		json
//	@Router			/admin/movies/{id} [patch]
func UpdateMovie(c *gin.Context) {
	var movie models.Movie
	err := c.ShouldBind(&movie)
	if err != nil {
		utils.ErrorJSON(c, err, http.StatusBadRequest)
		return
	}
	err = handlers.Handlers.UpdateMovie(movie)
	if err != nil {
		utils.ErrorJSON(c, err, http.StatusInternalServerError)
		return
	}

	resp := utils.JSONResponse{
		Error:   false,
		Message: fmt.Sprintf("movie with id %d updated", movie.ID),
	}

	utils.WriteJSON(c, http.StatusOK, resp)
}

// Delete Movie
//
//	@Security		AdminAuth
//	@Tags			Admin-Movie
//	@Summary		Delete Movie
//	@Description	This is API to delete a movie
//	@Param			id	path	int	true	"Movie ID"
//	@Produce		json
//	@Router			/admin/movies/{id} [delete]
func DeleteMovie(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorJSON(c, err, http.StatusBadRequest)
		return
	}
	err = handlers.Handlers.DeleteMovie(id)
	if err != nil {
		utils.ErrorJSON(c, err, http.StatusInternalServerError)
		return
	}
	resp := utils.JSONResponse{
		Error:   false,
		Message: "movie deleted",
	}
	utils.WriteJSON(c, http.StatusOK, resp)
}
