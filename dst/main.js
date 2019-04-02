"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __importDefault(require("http"));
var express_1 = __importDefault(require("express"));
var AnagramService_1 = require("./services/AnagramService");
var bodyParser = require("body-parser");
var anagramController_1 = require("./controllers/anagramController");
var RedisDataConnector_1 = require("./data/RedisDataConnector");
var App = /** @class */ (function () {
    function App() {
        this.expressApp = express_1.default();
        this.expressApp.use(bodyParser.json());
        this.PORT = 3000;
        this.server = http_1.default.createServer();
        // TODO: Get this to be injected on startup
        //this.anagramService = new AnagramService(new InMemoryDataConnector());
        this.anagramService = new AnagramService_1.AnagramService(new RedisDataConnector_1.RedisDataConnector('localhost', 6379));
        this.anagramService.initialize('./dst/data/dictionary.txt');
        this.anagramController = new anagramController_1.AnagramController(this.expressApp, this.anagramService);
        this.route();
        this.startApp();
    }
    App.prototype.route = function () {
        this.anagramController.route();
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