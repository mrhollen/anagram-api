import express from "express";
import { AnagramService } from "../services/AnagramService";
import { Anagram } from "../models/Anagram";

export class AnagramController {

    constructor(private expressApp: express.Application,
                private anagramService: AnagramService) {}

    public route(): void {

        // Get list of anagrams of a word with optional return limit
        this.expressApp.get('/anagrams/:word.json', async (request, response) => {
            const word: string = request.params['word'];
            const limit: number = request.query['limit'];
            const result = await this.anagramService.getAnagrams(word, limit);

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
                    await this.anagramService.addWord(word);
                });
            } catch(error) {
                response.sendStatus(500);
                return;
            }

            response.sendStatus(201);
        });

        // Check if list of words are anagrams of one another
        this.expressApp.post('/check.json', async (request, response) => {
            const words: string[] = request.body['words'];
            const anagramToCompare = new Anagram(words[0]);
            for(let i = 1; i < words.length; i++) {
                // Send false if we find one that doesn't match the first
                if(anagramToCompare.key !== new Anagram(words[i]).key) {
                    response.send(false);
                    return;
                }
            }

            // If we didn't return false, then they must all match
            response.send(true);
        });
        
        // Delete a word from anagrams list
        this.expressApp.delete('/words/:word.json', async (request, response) => {
            const word: string = request.params['word'];

            await this.anagramService.deleteWord(word);

            response.sendStatus(204);
        });

        // Delete word and it's anagrams
        this.expressApp.delete('/anagrams/:word.json', async (request, response) => {
            const word: string = request.params['word'];

            await this.anagramService.deleteAnagramList(word);

            response.sendStatus(204);
        });
        
        // Delete entire anagram list
        this.expressApp.delete('/words.json', async (request, response) => {
            await this.anagramService.deleteAll();

            response.sendStatus(204);
        });
    }
}