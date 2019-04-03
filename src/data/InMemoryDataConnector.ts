import { IDataConnector } from './IDataConnector';
import { Anagram } from '../models/Anagram';
import { IAnagramStatistics } from '../models/IAnagramStatistics';

export class InMemoryDataConnector implements IDataConnector {
    private anagrams: Map<string, Anagram[]>;
    private totalWords: number;
    private totalWordLength: number;
    private longestWord: string | undefined;
    private shortestWord: string | undefined;
    private statistics: IAnagramStatistics;

    constructor() {
        this.anagrams = new Map<string, Anagram[]>();
        this.totalWords = 0;
        this.totalWordLength = 0;
        this.longestWord = undefined;
        this.shortestWord = undefined;
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
            // Don't add empty words
            if(anagram.word === ''){ return; }

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

                await this.updateLongestAndShortestWords(anagram.word, true);
            }

            resolve();
        });
    }

    public deleteAnagram(anagram: Anagram): Promise<void> {
        return new Promise(async (resolve, reject) => {
            let anagramsForKey = this.anagrams.get(anagram.key) || [];
            
            anagramsForKey = anagramsForKey.filter(a => a.word !== anagram.word);
    
            this.anagrams.set(anagram.key, anagramsForKey);

            await this.updateLongestAndShortestWords(anagram.word, false);

            resolve();
        });
    }

    public deleteAnagramList(anagram: Anagram): Promise<void> {
        return new Promise(async (resolve, reject) => {
            this.anagrams.delete(anagram.key);

            await this.updateLongestAndShortestWords(anagram.word, false);
            resolve();
        });
    }

    public deleteAll(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.anagrams = new Map<string, Anagram[]>();

            this.clearStatistics();

            resolve();
        });
    }

    public getAnagramStatistics(): Promise<IAnagramStatistics> {
        return new Promise((resolve, reject) => {    
            this.calculateStatistics();    
            resolve(this.statistics);
        });
    }

    private clearStatistics() {
        this.totalWords = 0;
        this.longestWord = undefined;
        this.shortestWord = undefined;

        this.statistics = {
            totalWords: 0,
            longestLength: 0,
            shortestLength: 0,
            averageLength: 0,
            medianLength: 0,
        };
    }

    private updateLongestAndShortestWords(word: string, add: boolean): void {
        if(add){
            this.totalWords++;
            this.totalWordLength += word.length;
            if (!this.longestWord || this.longestWord.length < word.length){
                this.longestWord = word;
            }
            if(!this.shortestWord || this.shortestWord.length > word.length){
                this.shortestWord = word;
            }
        } else {
            this.totalWords--;
            this.totalWordLength -= word.length;
            this.longestWord = this.findLongestWord();
            this.shortestWord = this.findShortestWord();
        }
    }

    private calculateStatistics(): void {
        this.statistics = {
            totalWords: this.totalWords,
            longestLength: this.longestWord ? this.longestWord.length : 0,
            shortestLength: this.shortestWord ? this.shortestWord.length : 0,
            averageLength: Math.floor(this.totalWordLength / this.totalWords),
            medianLength: this.findMedianWordLength(),
        };
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
        let words: Anagram[] = []

        this.anagrams.forEach(anagramArray => {
            anagramArray.forEach(anagram => {
                words.push(anagram);
            });
        });

        return words[Math.floor(words.length/2)].word.length;
    }
}