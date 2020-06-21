"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterItems = exports.sortItems = void 0;
function sortItems(items, sort) {
    var field = sort.field, order = sort.order;
    if (items[0] && typeof items[0][field] === 'string') {
        if (order === 'ASC') {
            return items.sort(function (a, b) { return a[field].localeCompare(b[field]); });
        }
        else {
            return items.sort(function (a, b) { return b[field].localeCompare(a[field]); });
        }
    }
    if (items[0] && typeof items[0][field] === 'number') {
        if (order === 'ASC') {
            return items.sort(function (a, b) { return a[field] - b[field]; });
        }
        else {
            return items.sort(function (a, b) { return b[field] - a[field]; });
        }
    }
    return items;
}
exports.sortItems = sortItems;
function filterItems(items, filter) {
    return items.filter(function (item) {
        var keys = Object.keys(filter);
        var matchesAll = true;
        for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
            var key = keys_1[_i];
            var filterValue = filter[key];
            var itemValue = item[key];
            if (Array.isArray(filterValue)) {
                matchesAll = matchesAll && filterValue.includes(itemValue);
            }
            else {
                matchesAll = matchesAll && filterValue == itemValue;
            }
        }
        return matchesAll;
    });
}
exports.filterItems = filterItems;
//# sourceMappingURL=DataProvider.js.map