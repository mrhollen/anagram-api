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
var http_1 = __importDefault(require("http"));
var express_1 = __importDefault(require("express"));
var AnagramService_1 = require("./services/AnagramService");
var InMemoryDataConnector_1 = require("./data/InMemoryDataConnector");
var bodyParser = require("body-parser");
var App = /** @class */ (function () {
    function App() {
        this.expressApp = express_1.default();
        this.expressApp.use(bodyParser.json());
        this.PORT = 3000;
        this.server = http_1.default.createServer();
        // TODO: Get this to be injected on startup
        this.anagramService = new AnagramService_1.AnagramService(new InMemoryDataConnector_1.InMemoryDataConnector());
        //this.anagramService.initialize('./data/dictionary.txt');
        this.route();
        this.startApp();
    }
    App.prototype.route = function () {
        var _this = this;
        this.expressApp.get('/anagrams/:word.json', function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
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
        }); }).post('/words.json', function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
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
    };
    App.prototype.startApp = function () {
        var _this = this;
        this.expressApp.listen(this.PORT, function () {
            console.log("Listening on http://localhost:" + _this.PORT + "/");
        });
    };
    return App;
}());
exports.default = new App().expressApp;
//# sourceMappingURL=main.js.map