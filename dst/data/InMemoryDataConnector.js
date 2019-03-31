"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var InMemoryDataConnector = /** @class */ (function () {
    function InMemoryDataConnector() {
        this.anagrams = new Map();
    }
    InMemoryDataConnector.prototype.getAnagrams = function (key) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var foundAnagrams = _this.anagrams.get(key);
            resolve(foundAnagrams);
        });
    };
    InMemoryDataConnector.prototype.addAnagram = function (anagram) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var existingValue = [];
            if (_this.anagrams.has(anagram.key)) {
                existingValue = _this.anagrams.get(anagram.key) || [];
            }
            if (existingValue.filter(function (a) { return a.word === anagram.word; }).length === 0) {
                existingValue.push(anagram);
                _this.anagrams.set(anagram.key, existingValue);
            }
            resolve();
        });
    };
    InMemoryDataConnector.prototype.deleteAnagram = function (anagram) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var anagramsForKey = _this.anagrams.get(anagram.key) || [];
            anagramsForKey = anagramsForKey.filter(function (a) { return a.word !== anagram.word; });
            _this.anagrams.set(anagram.key, anagramsForKey);
            resolve();
        });
    };
    InMemoryDataConnector.prototype.deleteAll = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.anagrams = new Map();
            resolve();
        });
    };
    return InMemoryDataConnector;
}());
exports.InMemoryDataConnector = InMemoryDataConnector;
//# sourceMappingURL=InMemoryDataConnector.js.map