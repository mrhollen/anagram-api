import { Anagram } from '../data/models/Anagram';
import { IDataConnector } from '../data/IDataConnector';

export class AnagramService {
    constructor(private dataConnector: IDataConnector) {}

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
}