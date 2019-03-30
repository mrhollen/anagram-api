import { SortingService } from "../../services/SortingService";

export class Anagram {
    public key: string;
    public word: string;

    constructor(word: string) {
        const sortingService: SortingService = new SortingService();
        
        this.word = word;

        // If the word is short there's no need to go through the extra overhead of quick sort
        // Realistically selection sort would probably work for most words
        // in the English language without much issue, but someone could put in some long nonsense
        // and cause some issues
        if(word.length < 10){
            this.key = sortingService.selectionSort<string>(word.split('')).toString();
        } else {
            this.key = sortingService.quickSort<string>(word.split('')).toString();
        }
    }
}