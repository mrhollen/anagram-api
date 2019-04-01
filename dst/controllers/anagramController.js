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
var AnagramController = /** @class */ (function () {
    function AnagramController(expressApp, anagramService) {
        this.expressApp = expressApp;
        this.anagramService = anagramService;
    }
    AnagramController.prototype.route = function () {
        var _this = this;
        // Get list of anagrams of a word with optional return limit
        this.expressApp.get('/anagrams/:word.json', function (request, response) { return __awaiter(_this, void 0, void 0, function () {
            var word, limit, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        word = request.params['word'];
                        limit = request.query['limit'];
                        return [4 /*yield*/, this.anagramService.getAnagrams(word.toLowerCase(), limit)];
                    case 1:
                        result = _a.sent();
                        response.json({ anagrams: result.map(function (a) { return a.word; }) });
                        return [2 /*return*/];
                }
            });
        }); });
        // Get statistics on datastore
        this.expressApp.get('/statistics.json', function (request, response) { return __awaiter(_this, void 0, void 0, function () {
            var results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.anagramService.getAnagramStatistics()];
                    case 1:
                        results = _a.sent();
                        response.json(results);
                        return [2 /*return*/];
                }
            });
        }); });
        // Add words to anagrams list
        this.expressApp.post('/words.json', function (request, response) { return __awaiter(_this, void 0, void 0, function () {
            var wordsToAdd;
            var _this = this;
            return __generator(this, function (_a) {
                try {
                    wordsToAdd = request.body['words'];
                    wordsToAdd.forEach(function (word) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.anagramService.addWord(word.toLowerCase())];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                }
                catch (error) {
                    response.sendStatus(500);
                    return [2 /*return*/];
                }
                response.sendStatus(201);
                return [2 /*return*/];
            });
        }); });
        // Delete a word from anagrams list
        this.expressApp.delete('/words/:word.json', function (request, response) { return __awaiter(_this, void 0, void 0, function () {
            var word;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        word = request.params['word'];
                        return [4 /*yield*/, this.anagramService.deleteWord(word.toLowerCase())];
                    case 1:
                        _a.sent();
                        response.sendStatus(204);
                        return [2 /*return*/];
                }
            });
        }); });
        // Delete entire anagram list
        this.expressApp.delete('/words.json', function (request, response) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.anagramService.deleteAll()];
                    case 1:
                        _a.sent();
                        response.sendStatus(204);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    return AnagramController;
}());
exports.AnagramController = AnagramController;
//# sourceMappingURL=anagramController.js.map