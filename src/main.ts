import http from "http"
import express from "express";
import { AnagramService } from "./services/AnagramService";
import { AnagramDataManager } from "./data/AnagramDataManager";

class App {
    public expressApp: express.Application;
    public server: http.Server;
    public PORT: number;

    private anagramService: AnagramService;

    constructor() {
        this.expressApp = express();
        this.PORT = 3000;
        this.server = http.createServer();

        // TODO: Get this to be injected on startup
        this.anagramService = new AnagramService(new AnagramDataManager());

        this.route();
        this.startApp();
    }

    private route() {
        this.expressApp.get('/anagrams/:word.json', async (request, response, next) => {
            const word: string = request.params['word'];
            const result = await this.anagramService.getAnagrams(word.toLowerCase());

            response.json(result);
        });
    }

    private startApp(){
        this.expressApp.listen(this.PORT, () => {
            console.log(`Listening on http://localhost:${this.PORT}/`);
        });
    }
}

export default new App().expressApp;