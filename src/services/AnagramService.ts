import { Anagram } from '../models/Anagram';
import { IDataConnector } from '../data/IDataConnector';
import { promisify } from 'util';
import { readFile } from 'fs';
import { IAnagramStatistics } from '../models/IAnagramStatistics';

export class AnagramService {
    constructor(private dataConnector: IDataConnector) {}

    // Preload our datastore with anagrams
    public async initialize(source: string): Promise<void> {
        const readFileAsync = promisify(readFile);

        const data = await readFileAsync(source, 'utf-8');
        data.split('\n').forEach(async word => {
            if(word.trim() !== '') {
                this.dataConnector.addAnagram(new Anagram(word));
            }
        });
    }

    public async getAnagrams(word: string, limit: number, noProperNouns: boolean = false): Promise<Anagram[]> {
        const anagram = new Anagram(word);

        let anagrams = await this.dataConnector.getAnagrams(anagram.key, limit) || [];
        anagrams = anagrams.filter(anagram => {
            return anagram.word !== word;
        });

        if(noProperNouns){
            anagrams = anagrams.filter(anagram => {
                return anagram.word.charAt(0) !== anagram.word.charAt(0).toUpperCase();
            });
        }

        // TODO: Find a better place to put this
        if(limit){
            anagrams = anagrams.slice(0, limit);
        }

        return anagrams;
    }

    public async getWordsWithMostAnagrams(): Promise<string[]> {
        return await this.dataConnector.getWordsWithTheMostAnagrams();
    }

    public async getWordsWithNumberOfAnagramsAboveCount(count: number): Promise<[string[]]> {
        return await this.dataConnector.getWordsWithNumberOfAnagramsAboveCount(count);
    }

    public async addWord(word: string): Promise<void> {
        // Don't add empty words
        if(word.trim() === '') { return; }
        
        await this.dataConnector.addAnagram(new Anagram(word));
    }

    public async deleteWord(word: string): Promise<void> {
        await this.dataConnector.deleteAnagram(new Anagram(word));
    }

    public async deleteAnagramList(word: string): Promise<void> {
        await this.dataConnector.deleteAnagramList(new Anagram(word));
    }

    public async deleteAll(): Promise<void> {
        await this.dataConnector.deleteAll();
    }

    public async getAnagramStatistics(): Promise<IAnagramStatistics> {
        const statistics = await this.dataConnector.getAnagramStatistics();
        return statistics;
    }
}