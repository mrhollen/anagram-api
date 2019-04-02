import { IDataConnector } from './IDataConnector';
import { Anagram } from './models/Anagram';
import { IAnagramStatistics } from './models/IAnagramStatistics';
import redis, { RedisClient } from 'redis';
import { promisify } from 'util';

export class RedisDataConnector implements IDataConnector {
    private redisClient: RedisClient;
    private lRangeAsync: any;
    private lSetAsync: any;
    private existsAsync: any;

    constructor(redisHost: string, redisPort: number) {
        this.redisClient = redis.createClient(redisPort, redisHost);
        this.lRangeAsync = promisify(this.redisClient.lrange).bind(this.redisClient);
        this.lSetAsync = promisify(this.redisClient.lset).bind(this.redisClient);
        this.existsAsync = promisify(this.redisClient.exists).bind(this.redisClient);
    }

    public async getAnagrams(key: string, limit?: number | undefined): Promise<Anagram[]> {
        return new Promise(async (resolve, reject) => {
            let foundAnagrams = await this.lRangeAsync(key, 0, -1);

            resolve(foundAnagrams);
        });
    }    

    public async addAnagram(anagram: import("./models/Anagram").Anagram): Promise<void> {
        return new Promise(async (resolve, reject) => {
            // Create value for key
            let existingValue: Anagram[] = [];

            // If the key exists, pull the value into our variable
            if(await this.existsAsync(anagram.key)) {
                existingValue = this.lRangeAsync(anagram.key, 0, -1);
            }
            
            // Make sure the word doesn't exist in the collection already
            if(existingValue.filter(a => a.word === anagram.word).length === 0){
                existingValue.push(anagram);
                this.lSetAsync(anagram.key, existingValue);
            }

            resolve();
        });
    }

    public async deleteAnagram(anagram: import("./models/Anagram").Anagram): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public async deleteAll(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
    public async getAnagramStatistics(): Promise<IAnagramStatistics> {
        throw new Error("Method not implemented.");
    }


}