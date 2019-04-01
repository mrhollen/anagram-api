import express from "express";
import { AnagramService } from "../services/AnagramService";

export class AnagramController {

    constructor(private expressApp: express.Application,
                private anagramService: AnagramService) {}

    public route(): void {

        // Get list of anagrams of a word with optional return limit
        this.expressApp.get('/anagrams/:word.json', async (request, response) => {
            const word: string = request.params['word'];
            const limit: number = request.query['limit'];
            const result = await this.anagramService.getAnagrams(word.toLowerCase(), limit);

            response.json({ anagrams: result.map(a => a.word) });
        });

        // Get statistics on datastore
        this.expressApp.get('/statistics.json', async (request, response) => {
            const results = await this.anagramService.getAnagramStatistics();
            response.json(results);
        });

        // Add words to anagrams list
        this.expressApp.post('/words.json', async (request, response) => {
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
        });
        
        // Delete a word from anagrams list
        this.expressApp.delete('/words/:word.json', async (request, response) => {
            const word: string = request.params['word'];

            await this.anagramService.deleteWord(word.toLowerCase());

            response.sendStatus(204);
        });
        
        // Delete entire anagram list
        this.expressApp.delete('/words.json', async (request, response) => {
            await this.anagramService.deleteAll();

            response.sendStatus(204);
        });
    }
}