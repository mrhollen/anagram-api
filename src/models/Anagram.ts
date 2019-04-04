export class Anagram {
    // The key of the anagram is all the letters of the word sorted alphabetically
    // This should allow us to find anagrams quickly by using a key lookup
    public key: string;
    public word: string;

    constructor(word: string, key?: string) {
        // If we only have the word, then we need to find the key for it
        // Otherwise we can just use the key we already have
        if(!key){
            // We won't call .toLowerCase() on this. That way we can
            // see if it's a proper noun in the future
            this.word = word;

            // Sort the letters of the word in alphabetical order
            // and make it our key
            const wordCharArray  = word.toLowerCase().split('');
            this.key = this.getKeyFromArray(wordCharArray.sort());
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