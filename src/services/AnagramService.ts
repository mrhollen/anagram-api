import { Anagram } from '../data/models/Anagram';
import { IDataConnector } from '../data/IDataConnector';
import { promisify } from 'util';
import { readFile } from 'fs';

export class AnagramService {
    constructor(private dataConnector: IDataConnector) {}

    initialize(source: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const readFileAsync = promisify(readFile);

            const data = await readFileAsync(source, 'utf-8');
            data.split('\n').forEach(word => {
                this.dataConnector.addAnagram(new Anagram(word.toLowerCase()));
            });

            resolve();
        });
    }

    public async getAnagrams(word: string, limit: number): Promise<Anagram[]> {
        return new Promise(async (resolve, reject) => {
            const anagram = new Anagram(word);
    
            let anagrams = await this.dataConnector.getAnagrams(anagram.key, limit) || [];
            anagrams = anagrams.filter(anagram => {
                return anagram.word !== word;
            });

            resolve(anagrams);
        });
    }

    public async addWord(word: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const anagram = new Anagram(word);
            await this.dataConnector.addAnagram(anagram);
        });
    }
}