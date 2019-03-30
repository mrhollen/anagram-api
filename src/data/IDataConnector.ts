import { Anagram } from './models/Anagram';

export interface IDataConnector {
    getAnagrams(key: string, limit?: number): Promise<Anagram[]>;
    addAnagram(anagram: Anagram): Promise<void>;
    deleteAnagram(anagram: Anagram): Promise<void>;
}