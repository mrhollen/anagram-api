"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Anagram_1 = require("./models/Anagram");
var InMemoryDataConnector = /** @class */ (function () {
    function InMemoryDataConnector() {
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
    InMemoryDataConnector.prototype.getAnagrams = function (key) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var anagrams = _this.anagrams.get(key);
            if (anagrams) {
                resolve(anagrams);
            }
            else {
                reject("Key not found");
            }
        });
    };
    InMemoryDataConnector.prototype.addAnagram = function (anagram) {
        throw new Error("Method not implemented.");
    };
    InMemoryDataConnector.prototype.deleteAnagram = function (anagram) {
        throw new Error("Method not implemented.");
    };
    return InMemoryDataConnector;
}());
exports.InMemoryDataConnector = InMemoryDataConnector;
//# sourceMappingURL=InMemoryDataConnector.js.map