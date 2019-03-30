import { IDataConnector } from './IDataConnector';
import { Anagram } from './models/Anagram';

export class InMemoryDataConnector implements IDataConnector {
    private anagrams: Map<string, Anagram[]>;

    constructor() {
        this.anagrams = new Map<string, Anagram[]>();
    }

    getAnagrams(key: string, limit?: number): Promise<Anagram[]> {
        return new Promise((resolve, reject) => {
            let foundAnagrams = this.anagrams.get(key);
            
            if(foundAnagrams && limit){
                foundAnagrams = foundAnagrams.slice(0, limit);
            }

            resolve(foundAnagrams);
        });
    }    
    
    addAnagram(anagram: Anagram): Promise<void> {
        return new Promise((resolve, reject) => {
            let existingValue: Anagram[] = [];
            if(this.anagrams.has(anagram.key)) {
                existingValue = this.anagrams.get(anagram.key) || [];
            }
            
            if(existingValue.filter(a => a.word === anagram.word).length === 0){
                existingValue.push(anagram);
                this.anagrams.set(anagram.key, existingValue);
            }
    
            resolve();
        });
    }

    deleteAnagram(anagram: Anagram): Promise<void> {
        throw new Error("Method not implemented.");
    }
}