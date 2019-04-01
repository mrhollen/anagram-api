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
        this.totalWords = 0;
        this.totalWordLength = 0;
        this.longestWordLength = 0;
        this.shortestWordLength = Number.MAX_SAFE_INTEGER;
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
            var existingValue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        existingValue = [];
                        // If the key exists, pull the value into our variable
                        if (this.anagrams.has(anagram.key)) {
                            existingValue = this.anagrams.get(anagram.key) || [];
                        }
                        if (!(existingValue.filter(function (a) { return a.word === anagram.word; }).length === 0)) return [3 /*break*/, 2];
                        existingValue.push(anagram);
                        this.anagrams.set(anagram.key, existingValue);
                        return [4 /*yield*/, this.calculateStatistics(anagram.word, true)];
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
                        return [4 /*yield*/, this.calculateStatistics(anagram.word, false)];
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
            resolve();
        });
    };
    InMemoryDataConnector.prototype.getAnagramStatistics = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            reject(new Error("Method Not Implemented."));
            return;
            resolve({
                totalWords: _this.totalWords,
                longestLength: _this.longestWordLength,
                shortestLength: _this.shortestWordLength,
                averageLength: Math.floor(_this.totalWordLength / _this.totalWords),
                medianLength: _this.findMedianWordLength(),
            });
        });
    };
    InMemoryDataConnector.prototype.calculateStatistics = function (word, add) {
        if (add) {
            this.totalWords++;
            this.totalWordLength += word.length;
            if (!this.longestWordLength || this.longestWordLength < word.length) {
                this.longestWordLength = word.length;
            }
            if (!this.shortestWordLength || this.shortestWordLength > word.length) {
                this.shortestWordLength = word.length;
            }
        }
        else {
            this.totalWords--;
            this.totalWordLength -= word.length;
            this.longestWordLength = this.findLongestWordLength();
            this.shortestWordLength = this.findShortestWordLength();
        }
    };
    InMemoryDataConnector.prototype.findLongestWordLength = function () {
        var longestLengthSoFar = 0;
        this.anagrams.forEach(function (anagramArray) {
            anagramArray.forEach(function (anagram) {
                if (anagram.word.length > longestLengthSoFar) {
                    longestLengthSoFar = anagram.word.length;
                }
            });
        });
        return longestLengthSoFar;
    };
    InMemoryDataConnector.prototype.findShortestWordLength = function () {
        var shortestLengthSoFar = Number.MAX_SAFE_INTEGER;
        this.anagrams.forEach(function (anagramArray) {
            anagramArray.forEach(function (anagram) {
                if (anagram.word.length < shortestLengthSoFar) {
                    shortestLengthSoFar = anagram.word.length;
                }
            });
        });
        return shortestLengthSoFar;
    };
    InMemoryDataConnector.prototype.findMedianWordLength = function () {
        var words = [];
        this.anagrams.forEach(function (anagramArray) {
            words = words.concat(anagramArray);
        });
        return words[Math.floor(words.length / 2)].word.length;
    };
    return InMemoryDataConnector;
}());
exports.InMemoryDataConnector = InMemoryDataConnector;
//# sourceMappingURL=InMemoryDataConnector.js.map