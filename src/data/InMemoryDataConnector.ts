import { IDataConnector } from './IDataConnector';
import { Anagram } from '../models/Anagram';
import { IAnagramStatistics } from '../models/IAnagramStatistics';
import { resolve } from 'url';

export class InMemoryDataConnector implements IDataConnector {
    private anagrams: Map<string, Anagram[]>;
    private statistics: IAnagramStatistics;

    constructor() {
        this.anagrams = new Map<string, Anagram[]>();
        this.statistics = {
            averageLength: 0,
            longestLength: 0,
            medianLength: 0,
            shortestLength: 0,
            totalWords: 0
        };
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
            let existingSet: Anagram[] = [];

            // If the key exists, pull the value into our variable
            if(this.anagrams.has(anagram.key)) {
                existingSet = this.anagrams.get(anagram.key) || [];
            }
            
            // Make sure the word doesn't exist in the collection already
            if(existingSet.filter(a => a.word === anagram.word).length === 0){
                existingSet.push(anagram);
                this.anagrams.set(anagram.key, existingSet);
            }

            resolve();
        });
    }

    public deleteAnagram(anagram: Anagram): Promise<void> {
        return new Promise(async (resolve, reject) => {
            let anagramsForKey = this.anagrams.get(anagram.key) || [];
            
            anagramsForKey = anagramsForKey.filter(a => a.word !== anagram.word);
    
            this.anagrams.set(anagram.key, anagramsForKey);

            resolve();
        });
    }

    public deleteAnagramList(anagram: Anagram): Promise<void> {
        return new Promise(async (resolve, reject) => {
            this.anagrams.delete(anagram.key);
            resolve();
        });
    }

    public deleteAll(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.anagrams = new Map<string, Anagram[]>();

            resolve();
        });
    }

    public getWordsWithTheMostAnagrams(): Promise<string[]> {
        return new Promise((resolve, reject) => {
            let keyToBeat = '';
            let lengthToBeat = 0;

            // Find the key that has the most items in it's set
            this.anagrams.forEach((value, key) => {
                if(value.length > lengthToBeat){
                    lengthToBeat = value.length;
                    keyToBeat = key;
                }
            });

            const result = this.anagrams.get(keyToBeat);

            if(result !== undefined){
                resolve(result.map(r => r.word));
            } else {
                resolve([]);
            }
        });
    }

    public getWordsWithNumberOfAnagramsAboveCount(count: number): Promise<[string[]]> {
        return new Promise((resolve, reject) => {
            const groups: [string[]] = [[]];

            // Get all the sets that are at or above our goal
            this.anagrams.forEach((value, key) => {
                if(value.length >= count){
                    groups.push(value.map(v => v.word));
                }
            });

            resolve(groups);
        });
    }

    public getAnagramStatistics(): Promise<IAnagramStatistics> {
        return new Promise((resolve, reject) => {    
            this.calculateStatistics();    
            resolve(this.statistics);
        });
    }

    private calculateStatistics(): void {
        const totalWords = this.getTotalWords();
        const totalWordLength = this.getTotalWordLength();
        const longestWord = this.findLongestWord();
        const shortestWord = this.findShortestWord();

        this.statistics = {
            totalWords: totalWords,
            longestLength: longestWord ? longestWord.length : 0,
            shortestLength: shortestWord ? shortestWord.length : 0,
            averageLength: Math.floor(totalWordLength / totalWords),
            medianLength: this.findMedianWordLength(),
        };
    }

    private getTotalWords(): number {
        let total = 0;
        this.anagrams.forEach(anagrams => {
            total += anagrams.length;
        });
        return total;
    }

    private getTotalWordLength(): number {
        let total = 0;
        this.anagrams.forEach((anagrams, key) => {
            total += key.length * anagrams.length;
        });
        return total;
    }

    private findLongestWord(): string | undefined {
        let longestSoFar: string | undefined;

        this.anagrams.forEach(anagramArray => {
            anagramArray.forEach(anagram => {
                if(!longestSoFar || anagram.word.length > longestSoFar.length) {
                    longestSoFar = anagram.word;
                }
            });
        });

        return longestSoFar;
    }

    private findShortestWord(): string | undefined {
        let shortestSoFar: string | undefined;

        this.anagrams.forEach(anagramArray => {
            anagramArray.forEach(anagram => {
                if(!shortestSoFar || anagram.word.length < shortestSoFar.length) {
                    shortestSoFar = anagram.word;
                }
            });
        });

        return shortestSoFar;
    }

    private findMedianWordLength(): number {
        if(this.anagrams.size === 0){
            return 0;
        }

        let words: Anagram[] = []

        this.anagrams.forEach(anagramArray => {
            anagramArray.forEach(anagram => {
                words.push(anagram);
            });
        });
        
        return words[Math.floor(words.length/2)].word.length;
    }
}