package handlers

import (
	"database/sql"
	"log"
	"movies-backend/configs"
	"movies-backend/internal/models"
	"movies-backend/internal/repository"
	"movies-backend/internal/repository/dbrepo"

	_ "github.com/jackc/pgconn"
	_ "github.com/jackc/pgx/v4"
	_ "github.com/jackc/pgx/v4/stdlib"
)

type HandlerFunc interface {
	GetUserByEmail(email string) (*models.User, error)
	GetUserByID(id int) (*models.User, error)

	AllMovies(genre ...int) (movies []*models.Movie, err error)
	OneMovieForEdit(id int) (*models.Movie, []*models.Genre, error)
	OneMovie(id int) (*models.Movie, error)
	AllGenres() ([]*models.Genre, error)
	InsertMovie(movie models.Movie) (int, error)
	UpdateMovie(movie models.Movie) error
	DeleteMovie(id int) error
}

var Handlers HandlerFunc

type module struct {
	db *dbEntity
}

type dbEntity struct {
	conn   *sql.DB
	dbrepo repository.DatabaseRepo
}

func openDB(dsn string) (*sql.DB, error) {
	db, err := sql.Open("pgx", dsn)
	if err != nil {
		return nil, err
	}

	err = db.Ping()
	if err != nil {
		return nil, err
	}

	return db, nil
}

func connectToDB(dsn string) (*sql.DB, error) {
	connection, err := openDB(dsn)
	if err != nil {
		return nil, err
	}

	log.Println("Connected to Postgres!")
	return connection, nil
}

func InitializeHandler(app *configs.Config) (appDB repository.DatabaseRepo, err error) {
	db, err := connectToDB(app.DSN)
	if err != nil {
		log.Println("[INIT] failed connecting to PostgreSQL")
		return
	}
	Handlers = &module{
		db: &dbEntity{
			conn:   db,
			dbrepo: &dbrepo.PostgresDBRepo{DB: db},
		},
	}
	return &dbrepo.PostgresDBRepo{DB: db}, nil
}
