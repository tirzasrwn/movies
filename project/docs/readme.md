# Movie

# Requirement

- docker
- docker compose
- make

# Running

```sh
cd project
# start the services
make up
# stop the services
make down
# visit localhost:3000 to open the website
```

# Services

You can run this services as individual service.

```sh
# go to the service directory like frontend, backend, or db.
cd frontend
# to build the docker image
make docker_build
# to start docker image
make docker_start
# to stop and remove the docker image that running
make docker_stop
```

# Ports

- frontend: 3000
- backend: 4000
- db: 5432
