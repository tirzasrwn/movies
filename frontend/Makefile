dev:
	npm run dev
build:
	npm run build
start: build
	npm run preview
docker_build:
	docker build . -t movie-frontend
docker_start:
	docker run --name movie-frontend -p 3000:3000 -d movie-frontend
docker_stop:
	docker stop movie-frontend
	docker rm movie-frontend
