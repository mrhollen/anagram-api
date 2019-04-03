FROM ubuntu:latest

RUN apt update
RUN apt install -y nodejs npm

WORKDIR /app

COPY ./docker/appsettings.json ./appsettings.json
COPY ./package.json ./package.json
COPY ./dst/ ./dst 

RUN npm install

ENTRYPOINT [ "npm", "start" ]