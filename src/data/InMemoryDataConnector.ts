import { IDataConnector } from './IDataConnector';
import { Anagram } from './models/Anagram';

export class InMemoryDataConnector implements IDataConnector {
    private anagrams: Map<string, Anagram[]>;

    constructor() {
        this.anagrams = new Map<string, Anagram[]>();
    }

    public getAnagrams(key: string): Promise<Anagram[]> {
        return new Promise((resolve, reject) => {
            let foundAnagrams = this.anagrams.get(key);

            resolve(foundAnagrams);
        });
    }    
    
    public addAnagram(anagram: Anagram): Promise<void> {
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

    public deleteAnagram(anagram: Anagram): Promise<void> {
        return new Promise((resolve, reject) => {
            let anagramsForKey = this.anagrams.get(anagram.key) || [];
            
            anagramsForKey = anagramsForKey.filter(a => a.word !== anagram.word);
    
            this.anagrams.set(anagram.key, anagramsForKey);

            resolve();
        });
    }

    public deleteAll(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.anagrams = new Map<string, Anagram[]>();
            resolve();
        });
    }
}