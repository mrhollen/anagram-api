import http from "http"
import express from "express";
import { AnagramService } from "./services/AnagramService";
import { InMemoryDataConnector } from "./data/InMemoryDataConnector";
import bodyParser = require("body-parser");
import { AnagramController } from "./controllers/anagramController";

class App {
    public expressApp: express.Application;
    public server: http.Server;
    public PORT: number;

    private anagramController: AnagramController;
    private anagramService: AnagramService;

    constructor() {
        this.expressApp = express();
        this.expressApp.use(bodyParser.json());
        this.PORT = 3000;
        this.server = http.createServer();

        // TODO: Get this to be injected on startup
        this.anagramService = new AnagramService(new InMemoryDataConnector());
        this.anagramService.initialize('./dst/data/dictionary.txt');

        this.anagramController = new AnagramController(this.expressApp, this.anagramService);

        this.route();
        this.startApp();
    }

    private route() {
        this.anagramController.route();
    }

    private startApp(){
        this.expressApp.listen(this.PORT, () => {
            console.log(`Listening on http://localhost:${this.PORT}/`);
        });
    }
}

export default new App().expressApp;