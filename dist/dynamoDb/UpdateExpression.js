"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.UpdateExpressions.html
var UpdateExpression = /** @class */ (function () {
    function UpdateExpression(attributeNames, attributeValues, setClause, removeClause, addClause, deleteClause) {
        if (attributeNames === void 0) { attributeNames = {}; }
        if (attributeValues === void 0) { attributeValues = {}; }
        this.attributeNames = attributeNames;
        this.attributeValues = attributeValues;
        this.setClause = setClause;
        this.addClause = addClause;
        this.removeClause = removeClause;
        this.deleteClause = deleteClause;
    }
    Object.defineProperty(UpdateExpression.prototype, "expression", {
        get: function () {
            var clauses = Array();
            if (this.setClause) {
                clauses.push(this.setClause);
            }
            if (this.removeClause) {
                clauses.push(this.removeClause);
            }
            if (this.addClause) {
                clauses.push(this.addClause);
            }
            if (this.deleteClause) {
                clauses.push(this.deleteClause);
            }
            return clauses.join(' ');
        },
        enumerable: false,
        configurable: true
    });
    UpdateExpression.prototype.set = function (attribute, to) {
        return this.copyAddingSetClause(this.addAttributeName(attribute) + " = " + this.addAttributeValue(attribute, to));
    };
    UpdateExpression.set = function (attribute, to) {
        return new UpdateExpression().set(attribute, to);
    };
    UpdateExpression.prototype.setIfNotExists = function (attribute, to, attributeToCheck) {
        var placeholder = this.addAttributeName(attribute);
        var checkPlaceholder = placeholder;
        if (attributeToCheck) {
            checkPlaceholder = this.addAttributeName(attributeToCheck);
        }
        return this.copyAddingSetClause(placeholder + " = if_not_exists(" + checkPlaceholder + ", " + this.addAttributeValue(attribute, to) + ")");
    };
    UpdateExpression.setIfNotExists = function (attribute, to, attributeToCheck) {
        return new UpdateExpression().setIfNotExists(attribute, to, attributeToCheck);
    };
    UpdateExpression.prototype.increment = function (attribute, by) {
        var placeholder = this.addAttributeName(attribute);
        return this.copyAddingSetClause(placeholder + " = " + placeholder + " + " + this.addAttributeValue(attribute, by));
    };
    UpdateExpression.prototype.decrement = function (attribute, by) {
        var placeholder = this.addAttributeName(attribute);
        return this.copyAddingSetClause(placeholder + " = " + placeholder + " - " + this.addAttributeValue(attribute, by));
    };
    UpdateExpression.prototype.appendToList = function (listName, items) {
        var placeholder = this.addAttributeName(listName);
        return this.copyAddingSetClause(placeholder + " = list_append(" + placeholder + ", " + this.addAttributeValue(listName, items) + ")");
    };
    UpdateExpression.prototype.appendToBeginingOfList = function (listName, items) {
        var placeholder = this.addAttributeName(listName);
        return this.copyAddingSetClause(placeholder + " = list_append(" + this.addAttributeValue(listName, items) + ", " + placeholder + ")");
    };
    UpdateExpression.prototype.addToSet = function (setName, items) {
        return this.copyAddingAddClause(this.addAttributeName(setName) + " " + this.addAttributeValue(setName, items));
    };
    UpdateExpression.prototype.deleteFromSet = function (setName, items) {
        return this.copyAddingDeleteClause(this.addAttributeName(setName) + " " + this.addAttributeValue(setName, items));
    };
    UpdateExpression.prototype.remove = function (attribute) {
        return this.copyAddingRemoveClause("" + this.addAttributeName(attribute));
    };
    UpdateExpression.prototype.removeFromList = function (listName, index) {
        return this.copyAddingRemoveClause(this.addAttributeName(listName) + "[" + index + "]");
    };
    UpdateExpression.prototype.addAttributeName = function (name) {
        var key = "#" + name;
        this.attributeNames[key] = name;
        return key;
    };
    UpdateExpression.prototype.addAttributeValue = function (attributeName, value, id) {
        if (id === void 0) { id = 0; }
        var key = ":" + attributeName + id;
        if (this.attributeValues[key]) {
            return this.addAttributeValue(attributeName, value, id + 1);
        }
        this.attributeValues[key] = value;
        return key;
    };
    UpdateExpression.prototype.copyAddingSetClause = function (clause) {
        return new UpdateExpression(this.attributeNames, this.attributeValues, this.buildClause('SET', clause, this.setClause), this.removeClause, this.addClause, this.deleteClause);
    };
    UpdateExpression.prototype.copyAddingRemoveClause = function (clause) {
        return new UpdateExpression(this.attributeNames, this.attributeValues, this.setClause, this.buildClause('REMOVE', clause, this.removeClause), this.addClause, this.deleteClause);
    };
    UpdateExpression.prototype.copyAddingAddClause = function (clause) {
        return new UpdateExpression(this.attributeNames, this.attributeValues, this.setClause, this.removeClause, this.buildClause('ADD', clause, this.addClause), this.deleteClause);
    };
    UpdateExpression.prototype.copyAddingDeleteClause = function (clause) {
        return new UpdateExpression(this.attributeNames, this.attributeValues, this.setClause, this.removeClause, this.addClause, this.buildClause('DELETE', clause, this.deleteClause));
    };
    UpdateExpression.prototype.buildClause = function (type, newPart, existingPart) {
        return existingPart ? existingPart + ", " + newPart : type + " " + newPart;
    };
    return UpdateExpression;
}());
exports.default = UpdateExpression;
//# sourceMappingURL=UpdateExpression.js.map