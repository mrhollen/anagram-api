import { IDataConnector } from './IDataConnector';
import { Anagram } from './models/Anagram';

export class InMemoryDataConnector implements IDataConnector {
    private anagrams: Map<string, Anagram[]>;

    constructor() {
        const testAnagrams = ["hello", "heoll", "loleh", "bat", "angry"];
        this.anagrams = new Map<string, Anagram[]>();

        testAnagrams.forEach( a => {
            const newAnagram = new Anagram(a);

            let existingValue: Anagram[] = [];
            if(this.anagrams.has(newAnagram.key)) {
                existingValue = this.anagrams.get(newAnagram.key) || [];
            }

            existingValue.push(newAnagram);
            this.anagrams.set(newAnagram.key, existingValue);
        });
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
        throw new Error("Method not implemented.");
    }

    deleteAnagram(anagram: Anagram): Promise<void> {
        throw new Error("Method not implemented.");
    }
}