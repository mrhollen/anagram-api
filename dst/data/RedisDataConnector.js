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
        // Setup all the promises
        this.getAsync = util_1.promisify(this.redisClient.smembers).bind(this.redisClient);
        this.getElementCountAsync = util_1.promisify(this.redisClient.scard).bind(this.redisClient);
        this.addAsync = util_1.promisify(this.redisClient.sadd).bind(this.redisClient);
        this.removeAsync = util_1.promisify(this.redisClient.srem).bind(this.redisClient);
        this.getKeysAsync = util_1.promisify(this.redisClient.keys).bind(this.redisClient);
        this.deleteKeyAsync = util_1.promisify(this.redisClient.del).bind(this.redisClient);
    }
    RedisDataConnector.prototype.getAnagrams = function (key, limit) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var foundAnagrams;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.getAsync("anagram." + key)];
                                case 1:
                                    foundAnagrams = _a.sent();
                                    // Map the word strings to an Anagram[] and resolve the promise
                                    resolve(foundAnagrams.map(function (a) { return new Anagram_1.Anagram(a, key); }));
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    RedisDataConnector.prototype.addAnagram = function (anagram) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            // Since we're using a set, each value can be added once and only once
                            // We don't need to make sure there aren't duplicates
                            this.addAsync("anagram." + anagram.key, anagram.word);
                            resolve();
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    RedisDataConnector.prototype.deleteAnagram = function (anagram) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            this.removeAsync("anagram." + anagram.key, anagram.word);
                            resolve();
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    RedisDataConnector.prototype.deleteAnagramList = function (anagram) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.deleteKeyAsync("anagram." + anagram.key)];
                                case 1:
                                    _a.sent();
                                    resolve();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    RedisDataConnector.prototype.deleteAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
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
                                    resolve();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    RedisDataConnector.prototype.getAnagramStatistics = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error("Method not implemented.");
            });
        });
    };
    return RedisDataConnector;
}());
exports.RedisDataConnector = RedisDataConnector;
//# sourceMappingURL=RedisDataConnector.js.map