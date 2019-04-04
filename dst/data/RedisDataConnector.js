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
        this.getSortedSetCardalityAsync = util_1.promisify(this.redisClient.zcard).bind(this.redisClient);
        this.getKeysAsync = util_1.promisify(this.redisClient.keys).bind(this.redisClient);
        this.deleteKeyAsync = util_1.promisify(this.redisClient.del).bind(this.redisClient);
        this.setAsync = util_1.promisify(this.redisClient.set).bind(this.redisClient);
        this.getSortedSetAsync = util_1.promisify(this.redisClient.zrange).bind(this.redisClient);
        this.addSortedSetAsync = util_1.promisify(this.redisClient.zadd).bind(this.redisClient);
        this.removeSortedSetAsync = util_1.promisify(this.redisClient.zrem).bind(this.redisClient);
        this.scanSortedSetAsync = util_1.promisify(this.redisClient.zscan).bind(this.redisClient);
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
                        return [4 /*yield*/, this.addSortedSetAsync('all', anagram.word.length, anagram.word)];
                    case 2:
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
                        return [4 /*yield*/, this.removeSortedSetAsync('all', anagram.word)];
                    case 2:
                        _a.sent();
                        this.updateStatistics = true;
                        return [2 /*return*/];
                }
            });
        });
    };
    RedisDataConnector.prototype.deleteAnagramList = function (anagram) {
        return __awaiter(this, void 0, void 0, function () {
            var wordsToDelete;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSetAsync("anagram." + anagram.key)];
                    case 1:
                        wordsToDelete = _a.sent();
                        // Remove them all
                        return [4 /*yield*/, this.removeSortedSetAsync.apply(this, ['all'].concat(wordsToDelete))];
                    case 2:
                        // Remove them all
                        _a.sent();
                        // Delete the key
                        return [4 /*yield*/, this.deleteKeyAsync("anagram." + anagram.key)];
                    case 3:
                        // Delete the key
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
                        // Delete them all
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
                        // Clear the sorted set of words
                        return [4 /*yield*/, this.deleteKeyAsync('all')];
                    case 2:
                        // Clear the sorted set of words
                        _a.sent();
                        return [4 /*yield*/, this.clearStatisticsAndSave()];
                    case 3:
                        _a.sent();
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
            var longestWord, shortestWord, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.updateStatistics = false;
                        return [4 /*yield*/, this.findLongestWord()];
                    case 1:
                        longestWord = _c.sent();
                        return [4 /*yield*/, this.findShortestWord()];
                    case 2:
                        shortestWord = _c.sent();
                        _a = this.saveStatistics;
                        _b = {};
                        return [4 /*yield*/, this.getSortedSetCardalityAsync('all')];
                    case 3:
                        _b.totalWords = _c.sent(),
                            _b.longestLength = longestWord.length,
                            _b.shortestLength = shortestWord.length;
                        return [4 /*yield*/, this.getAverageWordLength()];
                    case 4:
                        _b.averageLength = _c.sent();
                        return [4 /*yield*/, this.findMedianWordLength()];
                    case 5:
                        _a.apply(this, [(_b.medianLength = _c.sent(),
                                _b)]);
                        return [2 /*return*/];
                }
            });
        });
    };
    RedisDataConnector.prototype.findLongestWord = function () {
        return __awaiter(this, void 0, void 0, function () {
            var set;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSortedSetAsync('all', -2, -1)];
                    case 1:
                        set = _a.sent();
                        if (set.length > 0) {
                            return [2 /*return*/, set[0]];
                        }
                        else {
                            // If the set is empty, return empty string
                            return [2 /*return*/, ''];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    RedisDataConnector.prototype.findShortestWord = function () {
        return __awaiter(this, void 0, void 0, function () {
            var set;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSortedSetAsync('all', 0, 1)];
                    case 1:
                        set = _a.sent();
                        if (set.length > 0) {
                            return [2 /*return*/, set[0]];
                        }
                        else {
                            // If the set is empty, return empty string
                            return [2 /*return*/, ''];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    RedisDataConnector.prototype.getAverageWordLength = function () {
        return __awaiter(this, void 0, void 0, function () {
            var wordCount, zset, totalScore, counter, _i, zset_1, set, _a, set_1, item;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getSortedSetCardalityAsync('all')];
                    case 1:
                        wordCount = _b.sent();
                        return [4 /*yield*/, this.scanSortedSetAsync('all', 0)];
                    case 2:
                        zset = _b.sent();
                        totalScore = 0;
                        counter = 1;
                        // Now we need to go through our results and add up the scores
                        // This could probably be replace with something more efficient
                        for (_i = 0, zset_1 = zset; _i < zset_1.length; _i++) {
                            set = zset_1[_i];
                            if (typeof (set) !== 'string') {
                                for (_a = 0, set_1 = set; _a < set_1.length; _a++) {
                                    item = set_1[_a];
                                    if (counter % 2 === 0) {
                                        totalScore += Number(item);
                                    }
                                    counter++;
                                }
                            }
                        }
                        return [2 /*return*/, Math.floor(totalScore / wordCount)];
                }
            });
        });
    };
    RedisDataConnector.prototype.findMedianWordLength = function () {
        return __awaiter(this, void 0, void 0, function () {
            var wordCount, midPoint, set;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSortedSetCardalityAsync('all')];
                    case 1:
                        wordCount = _a.sent();
                        midPoint = Math.floor(wordCount / 2);
                        return [4 /*yield*/, this.getSortedSetAsync('all', midPoint, midPoint + 1)];
                    case 2:
                        set = _a.sent();
                        if (set.length > 0) {
                            // Return the middle element
                            return [2 /*return*/, set[0].length];
                        }
                        else {
                            // If the set is empty, return 0
                            return [2 /*return*/, 0];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return RedisDataConnector;
}());
exports.RedisDataConnector = RedisDataConnector;
//# sourceMappingURL=RedisDataConnector.js.map