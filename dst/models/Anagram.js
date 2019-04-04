"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Anagram = /** @class */ (function () {
    function Anagram(word, key) {
        // If we only have the word, then we need to find the key for it
        // Otherwise we can just use the key we already have
        if (!key) {
            // We won't call .toLowerCase() on this. That way we can
            // see if it's a proper noun in the future
            this.word = word;
            // Sort the letters of the word in alphabetical order
            // and make it our key
            var wordCharArray = word.toLowerCase().split('');
            this.key = this.getKeyFromArray(wordCharArray.sort());
        }
        else {
            this.key = key;
            this.word = word;
        }
    }
    // Remove the commas from the default array.toString()
    // Instead of just removing commas with .remove() we could just build up
    // a string. We might want to have words include commas at some point
    Anagram.prototype.getKeyFromArray = function (array) {
        var result = "";
        array.forEach(function (value) {
            result += value.toString();
        });
        return result;
    };
    return Anagram;
}());
exports.Anagram = Anagram;
//# sourceMappingURL=Anagram.js.map