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
        // Read in the config as an object for easy access
        try {
            this.appConfig = require("../appsettings.json");
        }
        catch (_a) {
            // Create default config if no appsettings.json is found
            this.appConfig = {
                port: 3000,
                connectorType: ConnectorTypes_1.ConnectorTypes.InMemory,
                dictionaryFile: "",
                useDictionaryFile: false,
                redisConfig: undefined
            };
        }
        // Setup our data connections based on the config provided
        // TODO: Get this to be injected on startup
        var dataConnector;
        if (this.appConfig.connectorType === ConnectorTypes_1.ConnectorTypes.Redis && this.appConfig.redisConfig) {
            dataConnector = new RedisDataConnector_1.RedisDataConnector(this.appConfig.redisConfig.host, this.appConfig.redisConfig.port);
        }
        else if (this.appConfig.connectorType === ConnectorTypes_1.ConnectorTypes.InMemory) {
            dataConnector = new InMemoryDataConnector_1.InMemoryDataConnector();
        }
        else {
            dataConnector = new InMemoryDataConnector_1.InMemoryDataConnector();
        }
        // Setup Services
        this.anagramService = new AnagramService_1.AnagramService(dataConnector);
        if (this.appConfig.useDictionaryFile) {
            this.anagramService.initialize(this.appConfig.dictionaryFile);
        }
        // Setup Controllers
        this.anagramController = new anagramController_1.AnagramController(this.expressApp, this.anagramService);
        // Make express aware of the routes in our controllers
        this.route();
        // Start the app and kick butt
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