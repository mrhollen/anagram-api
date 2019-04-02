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

        this.appConfig = require("../appsettings.json");

        // TODO: Get this to be injected on startup
        // TODO: Set this up using a config file
        let dataConnector: IDataConnector;
        if(this.appConfig.connectorType === ConnectorTypes.Redis) {
            dataConnector = new RedisDataConnector(this.appConfig.redisConfig.host, this.appConfig.redisConfig.port);
        } else if(this.appConfig.connectorType === ConnectorTypes.InMemory) {
            dataConnector = new InMemoryDataConnector();
        } else {
            dataConnector = new InMemoryDataConnector();
        }

        this.anagramService = new AnagramService(dataConnector);
        this.anagramService.initialize('./dst/data/dictionary.txt');

        this.anagramController = new AnagramController(this.expressApp, this.anagramService);

        this.route();
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