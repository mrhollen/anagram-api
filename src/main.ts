import http from "http"
import express from "express";
import { AnagramService } from "./services/AnagramService";
import { InMemoryDataConnector } from "./data/InMemoryDataConnector";
import { RedisDataConnector } from "./data/RedisDataConnector";
import bodyParser = require("body-parser");
import { AnagramController } from "./controllers/anagramController";
import { IAppConfig } from "./models/IAppConfig";
import { IDataConnector } from "./data/IDataConnector";
import { ConnectorTypes } from "./models/ConnectorTypes";

class App {
    public expressApp: express.Application;
    public server: http.Server;
    public appConfig: IAppConfig;

    private anagramController: AnagramController;
    private anagramService: AnagramService;

    constructor() {
        this.expressApp = express();
        this.expressApp.use(bodyParser.json());
        this.server = http.createServer();

        // Read in the config as an object for easy access
        this.appConfig = require("../appsettings.json");

        // Setup our data connections based on the config provided
        // TODO: Get this to be injected on startup
        let dataConnector: IDataConnector;
        if(this.appConfig.connectorType === ConnectorTypes.Redis) {
            dataConnector = new RedisDataConnector(this.appConfig.redisConfig.host, this.appConfig.redisConfig.port);
        } else if(this.appConfig.connectorType === ConnectorTypes.InMemory) {
            dataConnector = new InMemoryDataConnector();
        } else {
            dataConnector = new InMemoryDataConnector();
        }

        // Setup Services
        this.anagramService = new AnagramService(dataConnector);
        if(this.appConfig.useDictionaryFile) {
            this.anagramService.initialize(this.appConfig.dictionaryFile);
        }

        // Setup Controllers
        this.anagramController = new AnagramController(this.expressApp, this.anagramService);

        // Make express aware of the routes in our controllers
        this.route();

        // Start the app and kick butt
        this.startApp();
    }

    private route() {
        this.anagramController.route();
    }

    private startApp(){
        this.expressApp.listen(this.appConfig.port, () => {
            console.log(`Listening on http://localhost:${this.appConfig.port}/`);
        });
    }
}

export default new App().expressApp;