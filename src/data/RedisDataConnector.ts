import { IDataConnector } from './IDataConnector';
import { Anagram } from './models/Anagram';
import { IAnagramStatistics } from './models/IAnagramStatistics';
import redis, { RedisClient } from 'redis';
import { promisify } from 'util';

export class RedisDataConnector implements IDataConnector {
    private redisClient: RedisClient;

    // All this is so we can use promises and avoid falling into the callback pit
    private getAsync: (key: string) => Promise<string[]>;
    private addAsync: (key: string, ...args: Array<string>) => Promise<number>;
    private removeAsync: (key: string, ...args: Array<string>) => Promise<number>;
    private getKeysAsync: (pattern: string) => Promise<string[]>;
    private deleteKeyAsync: (key: string, ...args: Array<string>) => Promise<number>;

    constructor(redisHost: string, redisPort: number) {
        this.redisClient = redis.createClient(redisPort, redisHost);

        // Setup all the promises
        this.getAsync = promisify(this.redisClient.smembers).bind(this.redisClient);
        this.addAsync = promisify(this.redisClient.sadd).bind(this.redisClient);
        this.removeAsync = promisify(this.redisClient.srem).bind(this.redisClient);
        this.getKeysAsync = promisify(this.redisClient.keys).bind(this.redisClient);
        this.deleteKeyAsync = promisify(this.redisClient.del).bind(this.redisClient);
    }

    public async getAnagrams(key: string, limit?: number | undefined): Promise<Anagram[]> {
        return new Promise(async (resolve, reject) => {
            const foundAnagrams = await this.getAsync(`anagram.${key}`);

            // Map the word strings to an Anagram[] and resolve the promise
            resolve(foundAnagrams.map(a => new Anagram(a, key)));
        });
    }    

    public async addAnagram(anagram: import("./models/Anagram").Anagram): Promise<void> {
        return new Promise(async (resolve, reject) => {
            // Since we're using a set, each value can be added once and only once
            // We don't need to make sure there aren't duplicates
            this.addAsync(`anagram.${anagram.key}`, anagram.word);

            resolve();
        });
    }

    public async deleteAnagram(anagram: import("./models/Anagram").Anagram): Promise<void> {
        return new Promise(async (resolve, reject) => {
            this.removeAsync(`anagram.${anagram.key}`, anagram.word);

            resolve();
        });
    }

    public async deleteAll(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            // I wish redis supported deleting keys based on a patter
            const keys = await this.getKeysAsync(`anagram.*`);

            keys.forEach(async key => {
                await this.deleteKeyAsync(key);
            });

            resolve();
        });
    }
    
    public async getAnagramStatistics(): Promise<IAnagramStatistics> {
        throw new Error("Method not implemented.");
    }


}