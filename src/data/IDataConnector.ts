import { Anagram } from './models/Anagram';

export interface IDataConnector {
    getAnagrams(key: string): Promise<Anagram[]>;
    addAnagram(anagram: Anagram): Promise<void>;
    deleteAnagram(anagram: Anagram): Promise<void>;
}