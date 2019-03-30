import { Anagram } from "./models/Anagram";

export class AnagramDataManager {
    public anagrams: Map<string, Anagram[]>;

    constructor() {
        const testAnagrams = ["hello", "bat", "angry"];
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
}