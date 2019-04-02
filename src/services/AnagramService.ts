import { Anagram } from '../models/Anagram';
import { IDataConnector } from '../data/IDataConnector';
import { promisify } from 'util';
import { readFile } from 'fs';
import { IAnagramStatistics } from '../models/IAnagramStatistics';

export class AnagramService {
    constructor(private dataConnector: IDataConnector) {}

    // Preload our datastore with anagrams
    initialize(source: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const readFileAsync = promisify(readFile);

            const data = await readFileAsync(source, 'utf-8');
            data.split('\n').forEach(word => {
                this.dataConnector.addAnagram(new Anagram(word));
            });

            resolve();
        });
    }

    public async getAnagrams(word: string, limit: number, includeProperNouns: boolean = true): Promise<Anagram[]> {
        return new Promise(async (resolve, reject) => {
            const anagram = new Anagram(word);
            
            console.log(includeProperNouns);
    
            let anagrams = await this.dataConnector.getAnagrams(anagram.key, limit) || [];
            anagrams = anagrams.filter(anagram => {
                return anagram.word.charAt(0) === anagram.word.charAt(0).toUpperCase();
            });

            if(!includeProperNouns){
                anagrams = anagrams.filter(anagram => {
                   return anagram.word[0] >= 'A' && anagram.word[0] <= 'Z';
                });
            }

            // TODO: Find a better place to put this
            if(limit){
                anagrams = anagrams.slice(0, limit);
            }

            resolve(anagrams);
        });
    }

    public async addWord(word: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const anagram = new Anagram(word);
            await this.dataConnector.addAnagram(anagram);
            resolve();
        });
    }

    public async deleteWord(word: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const anagram = new Anagram(word);
            await this.dataConnector.deleteAnagram(anagram);
            resolve();
        });
    }

    public async deleteAnagramList(word: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const anagram = new Anagram(word);
            await this.dataConnector.deleteAnagramList(anagram);
            resolve();
        });
    }

    public async deleteAll(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            await this.dataConnector.deleteAll();
            resolve();
        });
    }

    public async getAnagramStatistics(): Promise<IAnagramStatistics> {
        return new Promise(async (resolve, reject) => {
            const statistics = await this.dataConnector.getAnagramStatistics();
            resolve(statistics);
        });
    }
}