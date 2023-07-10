package handlers

import (
	"movies-backend/internal/models"
	"time"
)

func (m *module) AllMovies(genre ...int) (movies []*models.Movie, err error) {
	movies, err = m.db.dbrepo.AllMovies(genre...)
	if err != nil {
		return nil, err
	}
	return movies, err
}

func (m *module) OneMovieForEdit(id int) (movie *models.Movie, genres []*models.Genre, err error) {
	movie, genres, err = m.db.dbrepo.OneMovieForEdit(id)
	if err != nil {
		return nil, nil, err
	}
	return movie, genres, nil
}

func (m *module) OneMovie(id int) (movie *models.Movie, err error) {
	movie, err = m.db.dbrepo.OneMovie(id)
	if err != nil {
		return nil, err
	}
	return movie, nil
}

func (m *module) AllGenres() (genres []*models.Genre, err error) {
	genres, err = m.db.dbrepo.AllGenres()
	if err != nil {
		return nil, err
	}
	return genres, nil
}

func (m *module) InsertMovie(movie models.Movie) (newID int, err error) {

	movie.CreatedAt = time.Now()
	movie.UpdatedAt = time.Now()

	newID, err = m.db.dbrepo.InsertMovie(movie)
	if err != nil {
		return 0, err
	}

	// now handle genres
	err = m.db.dbrepo.UpdateMovieGenres(newID, movie.GenresArray)
	if err != nil {
		return 0, err
	}

	return newID, nil
}

func (m *module) UpdateMovie(movie models.Movie) (err error) {
	newMovie, err := m.db.dbrepo.OneMovie(movie.ID)
	if err != nil {
		return err
	}

	newMovie.Title = movie.Title
	newMovie.ReleaseDate = movie.ReleaseDate
	newMovie.Description = movie.Description
	newMovie.MPAARating = movie.MPAARating
	newMovie.RunTime = movie.RunTime
	newMovie.Image = movie.Image
	movie.UpdatedAt = time.Now()

	err = m.db.dbrepo.UpdateMovie(*newMovie)
	if err != nil {
		return err
	}

	err = m.db.dbrepo.UpdateMovieGenres(newMovie.ID, movie.GenresArray)
	if err != nil {
		return err
	}

	return nil
}

func (m *module) DeleteMovie(id int) (err error) {
	err = m.db.dbrepo.DeleteMovie(id)
	if err != nil {
		return err
	}

	return nil
}
