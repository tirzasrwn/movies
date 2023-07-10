FROM postgres:15.3-alpine3.18 AS production
ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD postgres
ENV POSTGRES_DB movies
COPY ./data/create_tables.sql docker-entrypoint-initdb.d/create_tables.sql

