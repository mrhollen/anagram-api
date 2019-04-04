#!/bin/bash
docker-compose --project-directory . -f ./docker/docker-compose.yml build
docker-compose --project-directory . -f ./docker/docker-compose.yml up