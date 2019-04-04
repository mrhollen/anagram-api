"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var InMemoryDataConnector = /** @class */ (function () {
    function InMemoryDataConnector() {
        this.anagrams = new Map();
        this.longestWord = undefined;
        this.shortestWord = undefined;
        this.statistics = {
            averageLength: 0,
            longestLength: 0,
            medianLength: 0,
            shortestLength: 0,
            totalWords: 0
        };
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
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var existingSet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        existingSet = [];
                        // If the key exists, pull the value into our variable
                        if (this.anagrams.has(anagram.key)) {
                            existingSet = this.anagrams.get(anagram.key) || [];
                        }
                        if (!(existingSet.filter(function (a) { return a.word === anagram.word; }).length === 0)) return [3 /*break*/, 2];
                        existingSet.push(anagram);
                        this.anagrams.set(anagram.key, existingSet);
                        return [4 /*yield*/, this.updateLongestAndShortestWords(anagram.word, true)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        resolve();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    InMemoryDataConnector.prototype.deleteAnagram = function (anagram) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var anagramsForKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        anagramsForKey = this.anagrams.get(anagram.key) || [];
                        anagramsForKey = anagramsForKey.filter(function (a) { return a.word !== anagram.word; });
                        this.anagrams.set(anagram.key, anagramsForKey);
                        return [4 /*yield*/, this.updateLongestAndShortestWords(anagram.word, false)];
                    case 1:
                        _a.sent();
                        resolve();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    InMemoryDataConnector.prototype.deleteAnagramList = function (anagram) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.anagrams.delete(anagram.key);
                        return [4 /*yield*/, this.updateLongestAndShortestWords(anagram.word, false)];
                    case 1:
                        _a.sent();
                        resolve();
                        return [2 /*return*/];
                }
            });
        }); });
    };
    InMemoryDataConnector.prototype.deleteAll = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.anagrams = new Map();
            _this.clearStatistics();
            resolve();
        });
    };
    InMemoryDataConnector.prototype.getWordsWithTheMostAnagrams = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var keyToBeat = '';
            var lengthToBeat = 0;
            // Find the key that has the most items in it's set
            _this.anagrams.forEach(function (value, key) {
                if (value.length > lengthToBeat) {
                    lengthToBeat = value.length;
                    keyToBeat = key;
                }
            });
            var result = _this.anagrams.get(keyToBeat);
            if (result !== undefined) {
                resolve(result.map(function (r) { return r.word; }));
            }
            else {
                resolve([]);
            }
        });
    };
    InMemoryDataConnector.prototype.getWordsWithNumberOfAnagramsAboveCount = function (count) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var groups = [[]];
            // Get all the sets that are at or above our goal
            _this.anagrams.forEach(function (value, key) {
                if (value.length >= count) {
                    groups.push(value.map(function (v) { return v.word; }));
                }
            });
            resolve(groups);
        });
    };
    InMemoryDataConnector.prototype.getAnagramStatistics = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.calculateStatistics();
            resolve(_this.statistics);
        });
    };
    InMemoryDataConnector.prototype.clearStatistics = function () {
        this.longestWord = undefined;
        this.shortestWord = undefined;
        this.statistics = {
            totalWords: 0,
            longestLength: 0,
            shortestLength: 0,
            averageLength: 0,
            medianLength: 0,
        };
    };
    InMemoryDataConnector.prototype.updateLongestAndShortestWords = function (word, add) {
        if (add) {
            if (!this.longestWord || this.longestWord.length < word.length) {
                this.longestWord = word;
            }
            if (!this.shortestWord || this.shortestWord.length > word.length) {
                this.shortestWord = word;
            }
        }
        else {
            this.longestWord = this.findLongestWord();
            this.shortestWord = this.findShortestWord();
        }
    };
    InMemoryDataConnector.prototype.calculateStatistics = function () {
        var totalWords = this.getTotalWords();
        var totalWordLength = this.getTotalWordLength();
        this.statistics = {
            totalWords: totalWords,
            longestLength: this.longestWord ? this.longestWord.length : 0,
            shortestLength: this.shortestWord ? this.shortestWord.length : 0,
            averageLength: Math.floor(totalWordLength / totalWords),
            medianLength: this.findMedianWordLength(),
        };
    };
    InMemoryDataConnector.prototype.getTotalWords = function () {
        var total = 0;
        this.anagrams.forEach(function (anagrams) {
            total += anagrams.length;
        });
        return total;
    };
    InMemoryDataConnector.prototype.getTotalWordLength = function () {
        var total = 0;
        this.anagrams.forEach(function (anagrams, key) {
            total += key.length * anagrams.length;
        });
        return total;
    };
    InMemoryDataConnector.prototype.findLongestWord = function () {
        var longestSoFar;
        this.anagrams.forEach(function (anagramArray) {
            anagramArray.forEach(function (anagram) {
                if (!longestSoFar || anagram.word.length > longestSoFar.length) {
                    longestSoFar = anagram.word;
                }
            });
        });
        return longestSoFar;
    };
    InMemoryDataConnector.prototype.findShortestWord = function () {
        var shortestSoFar;
        this.anagrams.forEach(function (anagramArray) {
            anagramArray.forEach(function (anagram) {
                if (!shortestSoFar || anagram.word.length < shortestSoFar.length) {
                    shortestSoFar = anagram.word;
                }
            });
        });
        return shortestSoFar;
    };
    InMemoryDataConnector.prototype.findMedianWordLength = function () {
        if (this.anagrams.size === 0) {
            return 0;
        }
        var words = [];
        this.anagrams.forEach(function (anagramArray) {
            anagramArray.forEach(function (anagram) {
                words.push(anagram);
            });
        });
        return words[Math.floor(words.length / 2)].word.length;
    };
    return InMemoryDataConnector;
}());
exports.InMemoryDataConnector = InMemoryDataConnector;
//# sourceMappingURL=InMemoryDataConnector.js.map