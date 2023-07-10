start: swagger
	go run ./cmd/api/
swagger:
	swag fmt
	swag init -g ./cmd/api/main.go  --output ./docs --parseDependency
docker_build:
	docker build . -t movie-backend
docker_start:
	docker run --name movie-backend -p 4000:4000 -d movie-backend
docker_stop:
	docker stop movie-backend
	docker rm movie-backend
