package main

import (
	"fmt"
	"log"
	"movies-backend/configs"
	"movies-backend/internal/controllers/middleware"
	"movies-backend/internal/handlers"
	"movies-backend/internal/routes"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	_ "movies-backend/docs"

	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func init() {
	configs.InitializeAppConfig()
	if !configs.AppConfig.Debug {
		gin.SetMode(gin.ReleaseMode)
	}
}

//	@title			Movies
//	@version		1.0
//	@description	This page is API documentation for API related to movies
//	@schemes		http
//	@host			localhost:4000
//	@BasePath		/v1
//	@contact.name	tirzasrwn
//	@contact.email	tirzasrwn@gmail.com

//	@securityDefinitions.apikey	AdminAuth
//	@in							header
//	@name						Authorization

func main() {
	app := configs.AppConfig
	fmt.Println(app)
	appDB, err := handlers.InitializeHandler(&app)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer appDB.Connection().Close()

	middleware.InitializeAuthenticationMiddleware(&app)
	if err != nil {
		fmt.Println(err)
		return
	}

	// app.Auth = *auth

	routes := routes.InitializeRouter()
	routes.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	s := &http.Server{
		Addr:           fmt.Sprintf(":%d", app.Port),
		Handler:        routes,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}
	if err := s.ListenAndServe(); err != nil {
		log.Fatalln(err)
	}
}
