import { IDataConnector } from './IDataConnector';
import { Anagram } from './models/Anagram';
import { IAnagramStatistics } from './models/IAnagramStatistics';

export class InMemoryDataConnector implements IDataConnector {
    private anagrams: Map<string, Anagram[]>;
    private totalWords: number;
    private totalWordLength: number;
    private longestWordLength: number;
    private shortestWordLength: number;

    constructor() {
        this.anagrams = new Map<string, Anagram[]>();
        this.totalWords = 0;
        this.totalWordLength = 0;
        this.longestWordLength = 0;
        this.shortestWordLength = Number.MAX_SAFE_INTEGER;
    }

    public getAnagrams(key: string): Promise<Anagram[]> {
        return new Promise((resolve, reject) => {
            let foundAnagrams = this.anagrams.get(key);

            resolve(foundAnagrams);
        });
    }    
    
    public addAnagram(anagram: Anagram): Promise<void> {
        return new Promise(async (resolve, reject) => {
            // Create value for key
            let existingValue: Anagram[] = [];

            // If the key exists, pull the value into our variable
            if(this.anagrams.has(anagram.key)) {
                existingValue = this.anagrams.get(anagram.key) || [];
            }
            
            // Make sure the word doesn't exist in the collection already
            if(existingValue.filter(a => a.word === anagram.word).length === 0){
                existingValue.push(anagram);
                this.anagrams.set(anagram.key, existingValue);

                await this.calculateStatistics(anagram.word, true);
            }

            resolve();
        });
    }

    public deleteAnagram(anagram: Anagram): Promise<void> {
        return new Promise(async (resolve, reject) => {
            let anagramsForKey = this.anagrams.get(anagram.key) || [];
            
            anagramsForKey = anagramsForKey.filter(a => a.word !== anagram.word);
    
            this.anagrams.set(anagram.key, anagramsForKey);

            await this.calculateStatistics(anagram.word, false);

            resolve();
        });
    }

    public deleteAll(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.anagrams = new Map<string, Anagram[]>();

            resolve();
        });
    }

    public getAnagramStatistics(): Promise<IAnagramStatistics> {
        return new Promise((resolve, reject) => {
            reject(new Error("Method Not Implemented."));

            return;
            
            resolve({
                totalWords: this.totalWords,
                longestLength: this.longestWordLength,
                shortestLength: this.shortestWordLength,
                averageLength: Math.floor(this.totalWordLength / this.totalWords),
                medianLength: this.findMedianWordLength(),
            });
        });
    }

    private calculateStatistics(word: string, add: boolean): void{
        if(add){
            this.totalWords++;
            this.totalWordLength += word.length;
            if (!this.longestWordLength || this.longestWordLength < word.length){
                this.longestWordLength = word.length;
            }
            if(!this.shortestWordLength || this.shortestWordLength > word.length){
                this.shortestWordLength = word.length;
            }
        } else {
            this.totalWords--;
            this.totalWordLength -= word.length;
            this.longestWordLength = this.findLongestWordLength();
            this.shortestWordLength = this.findShortestWordLength();
        }
    }

    private findLongestWordLength(): number {
        let longestLengthSoFar = 0;

        this.anagrams.forEach(anagramArray => {
            anagramArray.forEach(anagram => {
                if(anagram.word.length > longestLengthSoFar) {
                    longestLengthSoFar = anagram.word.length;
                }
            });
        });

        return longestLengthSoFar;
    }

    private findShortestWordLength(): number {
        let shortestLengthSoFar = Number.MAX_SAFE_INTEGER;

        this.anagrams.forEach(anagramArray => {
            anagramArray.forEach(anagram => {
                if(anagram.word.length < shortestLengthSoFar) {
                    shortestLengthSoFar = anagram.word.length;
                }
            });
        });

        return shortestLengthSoFar;
    }

    private findMedianWordLength(): number {
        let words: Anagram[] = []

        this.anagrams.forEach(anagramArray => {
            words = words.concat(anagramArray);
        });

        return words[Math.floor(words.length/2)].word.length;
    }
}