# anagram-api

## About
This is my solution for the take-home Anagram Rest API project. It's written in Typescript and uses Node along with Express to create an http server. It can either be run using either Redis as a datastore, or by storing all the data in memory.

## Dependencies
### Development
- NodeJS
- Npm
- Typescript (Available through npm)
- tsc (Available through npm)
- tsc-watch (Available through npm)
- redis (optional)
- docker (optional)
- docker-compose (optional)
### Production
- NodeJS
- Npm
- redis (optional)
- docker (optional)
- docker-compose (optional)

## How to Run
- To run the app just **in memory**:
     - Create `appsettings.json` in the project root. There is a sample config file called appsettings-in-memory.json
     - Start the app with `npm start`

- To run the app using **redis**:
     - Create `appsettings.json` in the project root. There is a sample config file called appsettings-redis.json
     - Make sure the Redis server is running and accessable
     - Start the app with `npm start`
- To run the app using **docker-compose**:
    - Create or modify the `appsettings.json` file in the docker folder
    - Run `buildAndRunDockerCompose.sh` in the project root
