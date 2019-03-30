import { Anagram } from '../data/models/Anagram';
import { IDataConnector } from '../data/IDataConnector';

export class AnagramService {
    constructor(private dataConnector: IDataConnector) {}

    public async getAnagrams(word: string): Promise<Anagram[]> {
        const anagram = new Anagram(word);

        const anagrams = await this.dataConnector.getAnagrams(anagram.key) || [];
        return anagrams.filter(anagram => {
            return anagram.word !== word;
        });
    }
}