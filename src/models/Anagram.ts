import { SortingService } from "../services/SortingService";

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
            
            // We won't call .toLowerCase() on this. That way we can
            // see if it's a proper noun in the future
            this.word = word;

            const wordCharArray  = word.toLowerCase().split('');

            // If the word is short there's no need to go through the extra overhead of quick sort
            // Realistically selection sort would probably work for most words
            // in the English language without much issue, but someone could put in some long nonsense
            // and cause some issues
            if(word.length < 10){
                this.key = this.getKeyFromArray(sortingService.selectionSort(wordCharArray));
            } else {
                this.key = this.getKeyFromArray(sortingService.quickSort(wordCharArray));
            }
        } else {
            this.key = key;
            this.word = word;
        }
    }

    // Remove the commas from the default array.toString()
    // Instead of just removing commas with .remove() we could just build up
    // a string. We might want to have words include commas at some point
    private getKeyFromArray(array: string[] | number[]): string {
        let result = "";
        array.forEach((value: string | number) => {
            result += value.toString();
        });
        return result;
    }
}