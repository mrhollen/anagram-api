"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __importDefault(require("http"));
var express_1 = __importDefault(require("express"));
var AnagramService_1 = require("./services/AnagramService");
var InMemoryDataConnector_1 = require("./data/InMemoryDataConnector");
var RedisDataConnector_1 = require("./data/RedisDataConnector");
var bodyParser = require("body-parser");
var anagramController_1 = require("./controllers/anagramController");
var ConnectorTypes_1 = require("./models/ConnectorTypes");
var App = /** @class */ (function () {
    function App() {
        this.expressApp = express_1.default();
        this.expressApp.use(bodyParser.json());
        this.server = http_1.default.createServer();
        this.appConfig = require("../appsettings.json");
        // TODO: Get this to be injected on startup
        // TODO: Set this up using a config file
        var dataConnector;
        if (this.appConfig.connectorType === ConnectorTypes_1.ConnectorTypes.Redis) {
            dataConnector = new RedisDataConnector_1.RedisDataConnector(this.appConfig.redisConfig.host, this.appConfig.redisConfig.port);
        }
        else if (this.appConfig.connectorType === ConnectorTypes_1.ConnectorTypes.InMemory) {
            dataConnector = new InMemoryDataConnector_1.InMemoryDataConnector();
        }
        else {
            dataConnector = new InMemoryDataConnector_1.InMemoryDataConnector();
        }
        this.anagramService = new AnagramService_1.AnagramService(dataConnector);
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
        this.expressApp.listen(this.appConfig.port, function () {
            console.log("Listening on http://localhost:" + _this.appConfig.port + "/");
        });
    };
    return App;
}());
exports.default = new App().expressApp;
//# sourceMappingURL=main.js.map