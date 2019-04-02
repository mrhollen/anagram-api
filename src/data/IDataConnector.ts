import { Anagram } from "../models/Anagram";
import { IAnagramStatistics } from "../models/IAnagramStatistics";

export interface IDataConnector {
    getAnagrams(key: string, limit?: number): Promise<Anagram[]>;
    addAnagram(anagram: Anagram): Promise<void>;
    deleteAnagram(anagram: Anagram): Promise<void>;
    deleteAll(): Promise<void>;
    getAnagramStatistics(): Promise<IAnagramStatistics>;
}