import { IDataConnector } from './IDataConnector';
import { Anagram } from '../models/Anagram';
import { IAnagramStatistics } from '../models/IAnagramStatistics';
import redis, { RedisClient } from 'redis';
import { promisify } from 'util';

export class RedisDataConnector implements IDataConnector {
    private redisClient: RedisClient;
    private updateStatistics: boolean;

    // All this is so we can use promises and avoid falling into the callback pit
    private getAsync: (key: string) => Promise<string>;
    private getSetAsync: (key: string) => Promise<string[]>;
    private setAddAsync: (key: string, ...args: Array<string>) => Promise<number>;
    private removeFromSetAsync: (key: string, ...args: Array<string>) => Promise<number>;
    private getKeysAsync: (pattern: string) => Promise<string[]>;
    private deleteKeyAsync: (key: string, ...args: Array<string>) => Promise<number>;
    private setAsync: (key: string, value: string) => Promise<any>;
    private getSortedSetCardalityAsync: (key: string) => Promise<number>;
    private getSortedSetAsync: (key: string, start: number, end: number) => Promise<any>;
    private addSortedSetAsync: (key: string, ...args: Array<string>) => Promise<number>;
    private removeSortedSetAsync: (key: string, ...args: Array<string>) => Promise<number>;

    constructor(redisHost: string, redisPort: number) {
        console.log(`Connecting to redis host at ${redisHost}:${redisPort}...`);
        this.redisClient = redis.createClient(redisPort, redisHost);
        console.log(`Connected!`);
        this.updateStatistics = true;

        // Setup all the promises
        this.getAsync = promisify(this.redisClient.get).bind(this.redisClient);
        this.getSetAsync = promisify(this.redisClient.smembers).bind(this.redisClient);
        this.setAddAsync = promisify(this.redisClient.sadd).bind(this.redisClient);
        this.removeFromSetAsync = promisify(this.redisClient.srem).bind(this.redisClient);
        this.getSortedSetCardalityAsync = promisify(this.redisClient.zcard).bind(this.redisClient);
        this.getKeysAsync = promisify(this.redisClient.keys).bind(this.redisClient);
        this.deleteKeyAsync = promisify(this.redisClient.del).bind(this.redisClient);
        this.setAsync= promisify(this.redisClient.set).bind(this.redisClient);
        this.getSortedSetAsync = promisify(this.redisClient.zrange).bind(this.redisClient);
        this.addSortedSetAsync = promisify(this.redisClient.zadd).bind(this.redisClient);
        this.removeSortedSetAsync = promisify(this.redisClient.zrem).bind(this.redisClient);
    }

    public async getAnagrams(key: string, limit?: number | undefined): Promise<Anagram[]> {
        const foundAnagrams = await this.getSetAsync(`anagram.${key}`);

        this.updateStatistics = true;

        // Map the word strings to an Anagram[] and resolve the promise
        return foundAnagrams.map(a => new Anagram(a, key));
    }    

    public async addAnagram(anagram: Anagram): Promise<void> {
        // Since we're using a set, each value can be added once and only once
        // We don't need to make sure there aren't duplicates
        await this.setAddAsync(`anagram.${anagram.key}`, anagram.word);
        await this.addSortedSetAsync('all', anagram.word);
        this.updateStatistics = true;
    }

    public async deleteAnagram(anagram: Anagram): Promise<void> {
        await this.removeFromSetAsync(`anagram.${anagram.key}`, anagram.word);
        await this.removeSortedSetAsync('all', anagram.word);
        this.updateStatistics = true;
    }

    public async deleteAnagramList(anagram: Anagram): Promise<void> {
        // Get the words we need to remove from our sorted set of words
        const wordsToDelete = await this.getSetAsync(`anagram.${anagram.key}`);
        // Remove them all
        await this.removeSortedSetAsync('all', ...wordsToDelete);

        // Delete the key
        await this.deleteKeyAsync(`anagram.${anagram.key}`);
        this.updateStatistics = true;
    }

    public async deleteAll(): Promise<void> {
        // I wish redis supported deleting keys based on a pattern
        const keys = await this.getKeysAsync(`anagram.*`);
        // Delete them all
        keys.forEach(async key => {
            await this.deleteKeyAsync(key);
        });

        // Clear the sorted set of words
        await this.deleteKeyAsync('all');

        await this.clearStatisticsAndSave();
        this.updateStatistics = true;
    }
    
    public async getAnagramStatistics(): Promise<IAnagramStatistics> {
        if(this.updateStatistics){
            await this.calculateStatisticsAndSave();
        }

        const statisticsString = await this.getAsync('statistics');
        return JSON.parse(statisticsString);
    }

    private async saveStatistics(statistics: IAnagramStatistics): Promise<void> {
        await this.setAsync('statistics', JSON.stringify(statistics));
    }

    private clearStatisticsAndSave() {
        this.updateStatistics = false;
        this.saveStatistics({
            totalWords: 0,
            longestLength: 0,
            shortestLength: 0,
            averageLength: 0,
            medianLength: 0,
        });
    }

    private async calculateStatisticsAndSave(): Promise<void> {
        this.updateStatistics = false;

        const words = await this.getAllWords();

        const longestWord = this.findLongestWord(words);
        const shortestWord = this.findShortestWord(words);

        this.saveStatistics({
            totalWords: words.length,
            longestLength: longestWord ? longestWord.length : 0,
            shortestLength: shortestWord ? shortestWord.length : 0,
            averageLength: this.getAverageWordLength(words),
            medianLength: this.findMedianWordLength(words),
        });
    }

    private findLongestWord(words: string[]): string | undefined {
        let longestSoFar: string | undefined;

        words.forEach(word => {
            if(!longestSoFar || word.length > longestSoFar.length) {
                longestSoFar = word;
            }
        });

        return longestSoFar;
    }

    private findShortestWord(words: string[]): string | undefined {
        let shortestSoFar: string | undefined;

        words.forEach(word => {
            if(!shortestSoFar || word.length < shortestSoFar.length) {
                shortestSoFar = word;
            }
        });

        return shortestSoFar;
    }

    private getAverageWordLength(words: string[]): number {
        if(words.length > 0){
            let totalCharacterCount = 0;

            words.forEach(word => {
                totalCharacterCount += word.length;
            });

            return Math.floor(totalCharacterCount / words.length);
        } else {
            return 0;
        }
    }

    private findMedianWordLength(words: string[]): number {
        if(words.length > 0){
            return words[Math.floor(words.length/2)].length;
        } else {
            return 0;
        }
    }

    private async getAllWords(): Promise<string[]> {
        const words: string[] = [];

        const sortedWords = await this.getKeysAsync(`all`);
        for(const word of sortedWords){
            words.push(word);
        }

        return words.sort();
    }
}