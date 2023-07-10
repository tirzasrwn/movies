docker_build:
	docker build . -t movie-postgres
docker_start:
	docker run --name movie-postgres -p 5432:5432 -v ./data/postgres/:/var/lib/postgresql/data -d movie-postgres
docker_stop:
	docker stop movie-postgres
	docker rm movie-postgres
