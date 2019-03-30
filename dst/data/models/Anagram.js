"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SortingService_1 = require("../../services/SortingService");
var Anagram = /** @class */ (function () {
    function Anagram(word) {
        var sortingService = new SortingService_1.SortingService();
        this.word = word;
        // If the word is short there's no need to go through the extra overhead of quick sort
        // Realistically selection sort would probably work for most words
        // in the English language without much issue, but someone could put in some long nonsense
        // and cause some issues
        if (word.length < 10) {
            this.key = sortingService.selectionSort(word.split('')).toString();
        }
        else {
            this.key = sortingService.quickSort(word.split('')).toString();
        }
    }
    return Anagram;
}());
exports.Anagram = Anagram;
//# sourceMappingURL=Anagram.js.map