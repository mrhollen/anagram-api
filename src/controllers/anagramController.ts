import express from "express";
import { AnagramService } from "../services/AnagramService";

export class AnagramController {

    constructor(private expressApp: express.Application,
                private anagramService: AnagramService) {}

    public route(): void {
        this.expressApp.get('/anagrams/:word.json', async (request, response) => {
            const word: string = request.params['word'];
            const limit: number = request.query['limit'];
            const result = await this.anagramService.getAnagrams(word.toLowerCase(), limit);

            response.json({ anagrams: result.map(a => a.word) });
        }).post('/words.json', async (request, response) => {
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
}