import { AnagramDataManager } from "../data/AnagramDataManager";
import { Anagram } from '../data/models/Anagram';

export class AnagramService {
    constructor(private anagramDataManager: AnagramDataManager) {}

    public async getAnagrams(word: string): Promise<Anagram[]> {
        const anagram = new Anagram(word);

        const anagrams = this.anagramDataManager.anagrams.get(anagram.key) || [];
        return anagrams.filter(anagram => {
            return anagram.word !== word;
        });
    }
}