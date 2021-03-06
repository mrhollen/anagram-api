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
var Anagram_1 = require("../models/Anagram");
var util_1 = require("util");
var fs_1 = require("fs");
var AnagramService = /** @class */ (function () {
    function AnagramService(dataConnector) {
        this.dataConnector = dataConnector;
    }
    // Preload our datastore with anagrams
    AnagramService.prototype.initialize = function (source) {
        return __awaiter(this, void 0, void 0, function () {
            var readFileAsync, data;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        readFileAsync = util_1.promisify(fs_1.readFile);
                        return [4 /*yield*/, readFileAsync(source, 'utf-8')];
                    case 1:
                        data = _a.sent();
                        data.split('\n').forEach(function (word) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                if (word.trim() !== '') {
                                    this.dataConnector.addAnagram(new Anagram_1.Anagram(word));
                                }
                                return [2 /*return*/];
                            });
                        }); });
                        return [2 /*return*/];
                }
            });
        });
    };
    AnagramService.prototype.getAnagrams = function (word, limit, noProperNouns) {
        if (noProperNouns === void 0) { noProperNouns = false; }
        return __awaiter(this, void 0, void 0, function () {
            var anagram, anagrams;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        anagram = new Anagram_1.Anagram(word);
                        return [4 /*yield*/, this.dataConnector.getAnagrams(anagram.key, limit)];
                    case 1:
                        anagrams = (_a.sent()) || [];
                        anagrams = anagrams.filter(function (anagram) {
                            return anagram.word !== word;
                        });
                        if (noProperNouns) {
                            anagrams = anagrams.filter(function (anagram) {
                                return anagram.word.charAt(0) !== anagram.word.charAt(0).toUpperCase();
                            });
                        }
                        // TODO: Find a better place to put this
                        if (limit) {
                            anagrams = anagrams.slice(0, limit);
                        }
                        return [2 /*return*/, anagrams];
                }
            });
        });
    };
    AnagramService.prototype.getWordsWithMostAnagrams = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dataConnector.getWordsWithTheMostAnagrams()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AnagramService.prototype.getWordsWithNumberOfAnagramsAboveCount = function (count) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dataConnector.getWordsWithNumberOfAnagramsAboveCount(count)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AnagramService.prototype.addWord = function (word) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Don't add empty words
                        if (word.trim() === '') {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.dataConnector.addAnagram(new Anagram_1.Anagram(word))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AnagramService.prototype.deleteWord = function (word) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dataConnector.deleteAnagram(new Anagram_1.Anagram(word))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AnagramService.prototype.deleteAnagramList = function (word) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dataConnector.deleteAnagramList(new Anagram_1.Anagram(word))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AnagramService.prototype.deleteAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dataConnector.deleteAll()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AnagramService.prototype.getAnagramStatistics = function () {
        return __awaiter(this, void 0, void 0, function () {
            var statistics;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dataConnector.getAnagramStatistics()];
                    case 1:
                        statistics = _a.sent();
                        return [2 /*return*/, statistics];
                }
            });
        });
    };
    return AnagramService;
}());
exports.AnagramService = AnagramService;
//# sourceMappingURL=AnagramService.js.map