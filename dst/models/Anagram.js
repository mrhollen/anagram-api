"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SortingService_1 = require("../services/SortingService");
var Anagram = /** @class */ (function () {
    function Anagram(word, key) {
        // If we only have the word, then we need to find the key for it
        // Otherwise we can just use the key we already have
        if (!key) {
            var sortingService = new SortingService_1.SortingService();
            this.word = word.toLowerCase();
            // If the word is short there's no need to go through the extra overhead of quick sort
            // Realistically selection sort would probably work for most words
            // in the English language without much issue, but someone could put in some long nonsense
            // and cause some issues
            if (word.length < 100) {
                this.key = sortingService.selectionSort(word.split('')).toString();
            }
            else {
                this.key = sortingService.quickSort(word.split('')).toString();
            }
        }
        else {
            this.key = key;
            this.word = word;
        }
    }
    return Anagram;
}());
exports.Anagram = Anagram;
//# sourceMappingURL=Anagram.js.map