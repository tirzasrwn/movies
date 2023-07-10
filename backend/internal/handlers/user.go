package handlers

import "movies-backend/internal/models"

func (m *module) GetUserByEmail(email string) (user *models.User, err error) {
	user, err = m.db.dbrepo.GetUserByEmail(email)
	if err != nil {
		return nil, err
	}
	return
}

func (m *module) GetUserByID(id int) (user *models.User, err error) {
	user, err = m.db.dbrepo.GetUserByID(id)
	if err != nil {
		return nil, err
	}
	return
}
