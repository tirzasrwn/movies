package v1

import (
	"encoding/json"
	"io"
	"movies-backend/internal/graph"
	"movies-backend/internal/handlers"
	"movies-backend/internal/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Movie GraphQL
//
//	@Tags			GraphQL
//	@Summary		Using graphql
//	@Description	This is API to get query movie by graphql
//	@Param			stringasdasd	body	string	true	"query params"
//	@Produce		json
//	@Router			/graph [post]
func MovieGraphQL(c *gin.Context) {
	// we need to populate our Graph type with the movies
	movies, err := handlers.Handlers.AllMovies()
	if err != nil {
		utils.ErrorJSON(c, err, http.StatusInternalServerError)
		return
	}

	// get the query from the request
	q, err := io.ReadAll(c.Request.Body)
	if err != nil {
		utils.ErrorJSON(c, err, http.StatusInternalServerError)
		return
	}
	query := string(q)

	// create a new variable of type *graph.Graph
	g := graph.New(movies)

	// set the query string on the variable
	g.QueryString = query

	// perform the query
	resp, err := g.Query()
	if err != nil {
		utils.ErrorJSON(c, err, http.StatusInternalServerError)
		return
	}

	// send the response
	j, _ := json.MarshalIndent(resp, "", "\t")
	c.Writer.Header().Set("Content-Type", "application/json")
	c.Writer.WriteHeader(http.StatusOK)
	c.Writer.Write(j)
}
