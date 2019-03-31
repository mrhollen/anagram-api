import http from "http"
import express from "express";
import { AnagramService } from "./services/AnagramService";
import { InMemoryDataConnector } from "./data/InMemoryDataConnector";
import bodyParser = require("body-parser");

class App {
    public expressApp: express.Application;
    public server: http.Server;
    public PORT: number;

    private anagramService: AnagramService;

    constructor() {
        this.expressApp = express();
        this.expressApp.use(bodyParser.json());
        this.PORT = 3000;
        this.server = http.createServer();

        // TODO: Get this to be injected on startup
        this.anagramService = new AnagramService(new InMemoryDataConnector());
        //this.anagramService.initialize('./data/dictionary.txt');

        this.route();
        this.startApp();
    }

    private route() {
        this.expressApp.get('/anagrams/:word.json', async (request, response, next) => {
            const word: string = request.params['word'];
            const limit: number = request.query['limit'];
            const result = await this.anagramService.getAnagrams(word.toLowerCase(), limit);

            response.json({ anagrams: result.map(a => a.word) });
        }).post('/words.json', async (request, response, next) => {
            try {
                const wordsToAdd: string[] = request.body['words'];
                wordsToAdd.forEach(async word => {
                    await this.anagramService.addWord(word.toLowerCase());
                });
            } catch(error) {
                response.sendStatus(500);
                return;
            }

            response.sendStatus(201);
        }).delete('/words/:word.json', async (request, response) => {
            const word: string = request.params['word'];

            await this.anagramService.deleteWord(word.toLowerCase());

            response.sendStatus(204);
        }).delete('/words.json', async (request, response) => {
            await this.anagramService.deleteAll();

            response.sendStatus(204);
        });
    }

    private startApp(){
        this.expressApp.listen(this.PORT, () => {
            console.log(`Listening on http://localhost:${this.PORT}/`);
        });
    }
}

export default new App().expressApp;