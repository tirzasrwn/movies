package configs

import (
	"log"

	"github.com/spf13/viper"
)

var AppConfig Config

type Config struct {
	Port        int
	Environment string
	Debug       bool

	DBHost     string
	DBPort     int
	DBDatabase string
	DBUsername string
	DBPassword string

	JWTSecret string

	DSN    string
	Domain string
	// DB           repository.DatabaseRepo
	// Auth         middleware.Auth
	JWTIssuer    string
	JWTAudience  string
	CookieDomain string
}

func InitializeAppConfig() {
	viper.SetConfigName("development.env") // allow directly reading from .env file
	viper.SetConfigType("env")
	// viper.AddConfigPath(".")
	viper.AddConfigPath("./configs")
	// viper.AddConfigPath("/")
	viper.AllowEmptyEnv(true)
	viper.AutomaticEnv()
	_ = viper.ReadInConfig()

	AppConfig.Port = viper.GetInt("PORT")
	AppConfig.Environment = viper.GetString("ENVIRONMENT")
	AppConfig.Debug = viper.GetBool("DEBUG")
	AppConfig.DBHost = viper.GetString("DB_HOST")
	AppConfig.DBPort = viper.GetInt("DB_PORT")
	AppConfig.DBDatabase = viper.GetString("DB_DATABASE")
	AppConfig.DBUsername = viper.GetString("DB_USERNAME")
	AppConfig.DBPassword = viper.GetString("DB_PASSWORD")
	AppConfig.JWTSecret = viper.GetString("JWT_SECRET")
	AppConfig.DSN = viper.GetString("DSN")
	AppConfig.Domain = viper.GetString("DOMAIN")
	AppConfig.JWTIssuer = viper.GetString("JWTISSUER")
	AppConfig.JWTAudience = viper.GetString("JWTAUDIENCE")
	AppConfig.CookieDomain = viper.GetString("COOKIEDOMAIN")

	log.Println("[INIT] configuration loaded")
}
