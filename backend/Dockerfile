FROM golang:1.20.5-alpine3.18 AS builder
LABEL stage=builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
RUN go install github.com/swaggo/swag/cmd/swag@latest
COPY . .
RUN sed -i 's/development.env/production.env/g' ./configs/configs.go
RUN swag init -g ./cmd/api/main.go --output ./docs --parseDependency
USER 0:0
RUN go build -o ./backend ./cmd/api
RUN chmod -R 777 ./backend

FROM alpine:3.18 AS production
WORKDIR /app
COPY --from=builder /app ./
CMD ["./backend"]
EXPOSE 4000 
