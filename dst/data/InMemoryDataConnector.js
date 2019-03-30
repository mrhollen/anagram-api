"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var InMemoryDataConnector = /** @class */ (function () {
    function InMemoryDataConnector() {
        this.anagrams = new Map();
    }
    InMemoryDataConnector.prototype.getAnagrams = function (key, limit) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var foundAnagrams = _this.anagrams.get(key);
            if (foundAnagrams && limit) {
                foundAnagrams = foundAnagrams.slice(0, limit);
            }
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
        throw new Error("Method not implemented.");
    };
    return InMemoryDataConnector;
}());
exports.InMemoryDataConnector = InMemoryDataConnector;
//# sourceMappingURL=InMemoryDataConnector.js.map