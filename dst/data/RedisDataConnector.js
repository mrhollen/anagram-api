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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Anagram_1 = require("../models/Anagram");
var redis_1 = __importDefault(require("redis"));
var util_1 = require("util");
var RedisDataConnector = /** @class */ (function () {
    function RedisDataConnector(redisHost, redisPort) {
        this.redisClient = redis_1.default.createClient(redisPort, redisHost);
        this.updateStatistics = true;
        // Setup all the promises
        this.getAsync = util_1.promisify(this.redisClient.get).bind(this.redisClient);
        this.getSetAsync = util_1.promisify(this.redisClient.smembers).bind(this.redisClient);
        this.setAddAsync = util_1.promisify(this.redisClient.sadd).bind(this.redisClient);
        this.removeFromSetAsync = util_1.promisify(this.redisClient.srem).bind(this.redisClient);
        this.getSetCardalityAsync = util_1.promisify(this.redisClient.scard).bind(this.redisClient);
        this.getKeysAsync = util_1.promisify(this.redisClient.keys).bind(this.redisClient);
        this.deleteKeyAsync = util_1.promisify(this.redisClient.del).bind(this.redisClient);
        this.setAsync = util_1.promisify(this.redisClient.set).bind(this.redisClient);
    }
    RedisDataConnector.prototype.getAnagrams = function (key, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var foundAnagrams;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSetAsync("anagram." + key)];
                    case 1:
                        foundAnagrams = _a.sent();
                        this.updateStatistics = true;
                        // Map the word strings to an Anagram[] and resolve the promise
                        return [2 /*return*/, foundAnagrams.map(function (a) { return new Anagram_1.Anagram(a, key); })];
                }
            });
        });
    };
    RedisDataConnector.prototype.addAnagram = function (anagram) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Since we're using a set, each value can be added once and only once
                    // We don't need to make sure there aren't duplicates
                    return [4 /*yield*/, this.setAddAsync("anagram." + anagram.key, anagram.word)];
                    case 1:
                        // Since we're using a set, each value can be added once and only once
                        // We don't need to make sure there aren't duplicates
                        _a.sent();
                        this.updateStatistics = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    RedisDataConnector.prototype.deleteAnagram = function (anagram) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.removeFromSetAsync("anagram." + anagram.key, anagram.word)];
                    case 1:
                        _a.sent();
                        this.updateStatistics = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    RedisDataConnector.prototype.deleteAnagramList = function (anagram) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.deleteKeyAsync("anagram." + anagram.key)];
                    case 1:
                        _a.sent();
                        this.updateStatistics = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    RedisDataConnector.prototype.deleteAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var keys;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getKeysAsync("anagram.*")];
                    case 1:
                        keys = _a.sent();
                        keys.forEach(function (key) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.deleteKeyAsync(key)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        this.clearStatisticsAndSave();
                        this.updateStatistics = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    RedisDataConnector.prototype.getAnagramStatistics = function () {
        return __awaiter(this, void 0, void 0, function () {
            var statisticsString;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.updateStatistics) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.calculateStatisticsAndSave()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.getAsync('statistics')];
                    case 3:
                        statisticsString = _a.sent();
                        return [2 /*return*/, JSON.parse(statisticsString)];
                }
            });
        });
    };
    RedisDataConnector.prototype.saveStatistics = function (statistics) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.setAsync('statistics', JSON.stringify(statistics))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    RedisDataConnector.prototype.clearStatisticsAndSave = function () {
        this.updateStatistics = false;
        this.saveStatistics({
            totalWords: 0,
            longestLength: 0,
            shortestLength: 0,
            averageLength: 0,
            medianLength: 0,
        });
    };
    RedisDataConnector.prototype.calculateStatisticsAndSave = function () {
        return __awaiter(this, void 0, void 0, function () {
            var words, longestWord, shortestWord;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.updateStatistics = false;
                        return [4 /*yield*/, this.getAllWords()];
                    case 1:
                        words = _a.sent();
                        longestWord = this.findLongestWord(words);
                        shortestWord = this.findShortestWord(words);
                        this.saveStatistics({
                            totalWords: words.length,
                            longestLength: longestWord ? longestWord.length : 0,
                            shortestLength: shortestWord ? shortestWord.length : 0,
                            averageLength: this.getAverageWordLength(words),
                            medianLength: this.findMedianWordLength(words),
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    RedisDataConnector.prototype.findLongestWord = function (words) {
        var longestSoFar;
        words.forEach(function (word) {
            if (!longestSoFar || word.length > longestSoFar.length) {
                longestSoFar = word;
            }
        });
        return longestSoFar;
    };
    RedisDataConnector.prototype.findShortestWord = function (words) {
        var shortestSoFar;
        words.forEach(function (word) {
            if (!shortestSoFar || word.length < shortestSoFar.length) {
                shortestSoFar = word;
            }
        });
        return shortestSoFar;
    };
    RedisDataConnector.prototype.getAverageWordLength = function (words) {
        if (words.length > 0) {
            var totalCharacterCount_1 = 0;
            words.forEach(function (word) {
                totalCharacterCount_1 += word.length;
            });
            return Math.floor(totalCharacterCount_1 / words.length);
        }
        else {
            return 0;
        }
    };
    RedisDataConnector.prototype.findMedianWordLength = function (words) {
        if (words.length > 0) {
            return words[Math.floor(words.length / 2)].length;
        }
        else {
            return 0;
        }
    };
    RedisDataConnector.prototype.getAllWords = function () {
        return __awaiter(this, void 0, void 0, function () {
            var words, keys, _i, keys_1, key, set, _a, set_1, item;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        words = [];
                        return [4 /*yield*/, this.getKeysAsync("anagram.*")];
                    case 1:
                        keys = _b.sent();
                        _i = 0, keys_1 = keys;
                        _b.label = 2;
                    case 2:
                        if (!(_i < keys_1.length)) return [3 /*break*/, 5];
                        key = keys_1[_i];
                        return [4 /*yield*/, this.getSetAsync(key)];
                    case 3:
                        set = _b.sent();
                        for (_a = 0, set_1 = set; _a < set_1.length; _a++) {
                            item = set_1[_a];
                            words.push(item);
                        }
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, words.sort()];
                }
            });
        });
    };
    return RedisDataConnector;
}());
exports.RedisDataConnector = RedisDataConnector;
//# sourceMappingURL=RedisDataConnector.js.map