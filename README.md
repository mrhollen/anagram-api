# anagram-api

## About
This is my solution for the take-home Anagram Rest API project. It's written in Typescript and uses Node along with Express to create an http server. It can either be run using either Redis as a datastore, or by storing all the data in memory. [Continued Below](#about-continued)

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
     - Make sure the Redis server is running and accessible
     - Start the app with `npm start`
- To run the app using **docker-compose**:
    - Create or modify the `appsettings.json` file in the docker folder
    - **Either** run `buildAndRunDockerCompose.sh` in the project root
    - **Or** run the command `docker-compose --project-directory ./ -f ./docker/docker-compose.yml build`
    - **and then** `docker-compose --project-directory ./ -f ./docker/docker-compose.yml up`

## API
#### Get Anagrams of a Word 
- `/anagrams/:word.json`
- Http GET
- Query Arguments
     - limit: number (optional)
     - noProperNouns: boolean (optional)
- Returns {'words': string[]}
#### Get Group of Words with the Most Anagrams 
- `/most.json`
- Http GET
- Returns {'words': string[]}
#### Get Groups of Words with Anagram Count at or Above Count
- `/having.json`
- Http GET
- Returns {'groups': [string[]]}
#### Get Datastore Statistics
- `/statistics.json`
- Http GET
- Returns ```{
    'totalwords': number,
    'averageLength': number,
    'medianLength': number,
    'longestLength': number,
    'shortestLength': number 
    }```

#### Add Words to the Datastore 
- `/words.json`
- Http POST
- body
     - { 'words': string[] } (required)
#### Check if List of Words are all Anagrams of One Another
- `/check.json`
- Http POST
- body
     - { 'words': string[] } (required)
- Returns boolean

#### Remove Word from the Datastore 
- `/words/:word.json`
- Http DELETE
#### Remove Word from the Datastore Along with All It's Anagrams
- `/anagrams/:word.json`
- Http DELETE
#### Remove All Words from the Datastore 
- `/words.json`
- Http DELETE

## About Continued
### Why Typescript
I chose typescript because the strong typing makes catching errors much easier. Many type missmatches are caught at compile time rather than run time. The syntax of Typescript is like that of a cross between C#/Java and Javascript which makes it easy for people familiar with either language to learn. Typescript also enables whatever IDE you're using to implements some really awesome intellisense which makes coding very nice.

#### Pros
- Strict typing and null checking makes errors and bugs less likely
- Familiar syntax makes it easy to switch to from a language like C# or Javascript
- Typings are available on npm for most packages, but can also be written yourself if needed
- Increased intellisense because of the typings
#### Cons
- It's not Javascript so Javascript developers might have a hard time switching
- Typescript has been slowly gaining more users, but is still isn't used that widely
- Projects now need to be "compiled" adding an extra step that could go wrong or slow things down

### Why NodeJS
I chose node because it's easy to install, a common and growing framework, and is portable. Node runs cross platform without much issue which is really nice not only for development, but also deployment. Node's vast library of modules available through npm also makes it a good choice if you don't feel like reinventing the wheel. Including a module like express makes it easy to get a basic webserver up and running in very little time. Node also lends itself nicely to containerization with tools like docker. Base images that already contain all the dependency modules can be cached and used to build production images quickly.

#### Pros
- NodeJS is extremely popular and has a wide library of modules available
- Node is easy to install and cross platform
- Node is easy to containerize and thus easy to scale out
- Node AWS Lambdas start up faster than Lambdas written in something like C# (for now)
#### Cons
- Node relies on a modified version of the V8 Javascript engine and Javascript as a whole
- The ease of including npm modules means vulnerabilities can be easier to "npm install" into your project

### Why Redis
Redis is a very fast, in memory, single threaded, key value store that supports an array of data-types. It's built to support running in a cluster so it's highly available. I found the Set datatype to be very helpful when storing anagrams. I didn't have to worry about accidentally putting two words in twice since by nature each member of the set must be unique. Sorted sets were also helpful for some statistics gathering. Using the length of the word as the "score" the sorted set automatically arranges words from shortest to longest. I think my implementation could be improved by incorporating Lua scripts on the redis server to process certain statistics instead of streaming data back to the node app.

#### Pros
- Redis is extremely fast because it's almost completely in memory
- It's single threaded so every action is essentially atomic and cannot generate race conditions
- It's designed to work in a cluster of redis nodes and so can be highly available if needed
- It supports Lua scripts as a way of creating what are essentially "stored procedures"
#### Cons
- Redis is almost entirely in memory so if the server shuts down, your data goes away [kinda](https://redis.io/topics/persistence)
- Running a highly available redis cluster means your data is not guaranteed consistency
- Running any sort of complex query of data is not really what redis was designed for

## Future Development
Here are some things I think could be done in the future to improve the project further.
- Add a permanent datastore like a NoSql (MongoDB, DynamoDB, etc) or relational database (MS Sql, MySql, Sqlite, etc)
- Add caching either on the controller layer to cache individual request results or on the service layer to cache data returned from the datastore. Redis could be used to enable distributed cache across app instances.
- Create lua scripts in redis to take the burden of some heavy queries away from the node app

## Some Things I've Noticed
- Node really likes to eat up memory, unless you force garbage collection. I noticed it would happily use up to 1GB+ memory on my machine, but when the garbage collector was run manually, the memory usage would fall to about 60MB.
- Looping through sets in redis is **not** performant in any way
