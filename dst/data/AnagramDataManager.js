"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Anagram_1 = require("./models/Anagram");
var AnagramDataManager = /** @class */ (function () {
    function AnagramDataManager() {
        var _this = this;
        var testAnagrams = ["hello", "bat", "angry"];
        this.anagrams = new Map();
        testAnagrams.forEach(function (a) {
            var newAnagram = new Anagram_1.Anagram(a);
            var existingValue = [];
            if (_this.anagrams.has(newAnagram.key)) {
                existingValue = _this.anagrams.get(newAnagram.key) || [];
            }
            existingValue.push(newAnagram);
            _this.anagrams.set(newAnagram.key, existingValue);
        });
    }
    return AnagramDataManager;
}());
exports.AnagramDataManager = AnagramDataManager;
//# sourceMappingURL=AnagramDataManager.js.map