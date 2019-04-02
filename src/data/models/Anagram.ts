import { SortingService } from "../../services/SortingService";

export class Anagram {
    // The key of the anagram is all the letters of the word sorted alphabetically
    // This should allow us to find anagrams quickly by using a key lookup
    public key: string;
    public word: string;

    constructor(word: string, key?: string) {
        // If we only have the word, then we need to find the key for it
        // Otherwise we can just use the key we already have
        if(!key){
            const sortingService: SortingService = new SortingService();
            
            this.word = word.toLowerCase();

            // If the word is short there's no need to go through the extra overhead of quick sort
            // Realistically selection sort would probably work for most words
            // in the English language without much issue, but someone could put in some long nonsense
            // and cause some issues
            if(word.length < 100){
                this.key = sortingService.selectionSort(word.split('')).toString();
            } else {
                this.key = sortingService.quickSort(word.split('')).toString();
            }
        } else {
            this.key = key;
            this.word = word;
        }
    }
}