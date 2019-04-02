"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SortingService = /** @class */ (function () {
    function SortingService() {
    }
    SortingService.prototype.selectionSort = function (array) {
        for (var i = 0; i < array.length; i++) {
            var lowestIndex = i;
            for (var j = i; j < array.length; j++) {
                if (array[j] < array[lowestIndex]) {
                    lowestIndex = j;
                }
            }
            array = this.swap(array, i, lowestIndex);
        }
        return array;
    };
    SortingService.prototype.quickSort = function (array) {
        // Cheat for now
        return array.sort();
    };
    SortingService.prototype.swap = function (array, a, b) {
        var tempItem = array[a];
        array[a] = array[b];
        array[b] = tempItem;
        return array;
    };
    return SortingService;
}());
exports.SortingService = SortingService;
//# sourceMappingURL=SortingService.js.map