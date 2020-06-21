'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var conditionExpressionValidation_1 = require('./conditionExpressionValidation');
var ConditionExpressionType;
(function (ConditionExpressionType) {
  ConditionExpressionType['FILTER'] = 'FILTER';
  ConditionExpressionType['KEY'] = 'KEY';
})(ConditionExpressionType || (ConditionExpressionType = {}));
// http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.OperatorsAndFunctions.html
var ConditionExpression = /** @class */ (function () {
  function ConditionExpression(type, expression, attributes, leftArgumentName) {
    if (expression === void 0) {
      expression = '';
    }
    if (attributes === void 0) {
      attributes = new ExpressionAttributeHelper();
    }
    if (leftArgumentName === void 0) {
      leftArgumentName = '';
    }
    this.type = type;
    this._expression = expression;
    this.attributes = attributes;
    this.leftArgumentName = leftArgumentName;
  }
  Object.defineProperty(ConditionExpression.prototype, 'expression', {
    get: function () {
      return this._expression;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(ConditionExpression.prototype, 'attributeNames', {
    get: function () {
      if (Object.keys(this.attributes.attributeNames).length) {
        return this.attributes.attributeNames;
      }
      return undefined;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(ConditionExpression.prototype, 'attributeValues', {
    get: function () {
      if (Object.keys(this.attributes.attributeValues).length) {
        return this.attributes.attributeValues;
      }
      return undefined;
    },
    enumerable: false,
    configurable: true
  });
  ConditionExpression.prototype.validate = function () {
    if (!this._expression) {
      return;
    }
    try {
      conditionExpressionValidation_1.validateConditionExpression(this._expression);
    } catch (error) {
      throw new Error('Invalid expression: "' + this._expression + '" at "' + error.message + '"');
    }
  };
  Object.defineProperty(ConditionExpression, 'not', {
    get: function () {
      return new ConditionExpression(ConditionExpressionType.KEY).not;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(ConditionExpression, 'openParens', {
    get: function () {
      return new ConditionExpression(ConditionExpressionType.KEY).openParens;
    },
    enumerable: false,
    configurable: true
  });
  ConditionExpression.whereKey = function (key) {
    return new ConditionExpression(ConditionExpressionType.KEY).key(key);
  };
  ConditionExpression.filterWhere = function (attribute) {
    return new ConditionExpression(ConditionExpressionType.FILTER).attribute(attribute);
  };
  ConditionExpression.prototype.key = function (key) {
    this.assertNoStringOperand('key');
    return new ConditionExpression(this.type, this._expression, this.attributes.copy(), key);
  };
  ConditionExpression.prototype.attribute = function (attribute) {
    this.assertNoStringOperand('attribute');
    return new ConditionExpression(this.type, this._expression, this.attributes.copy(), attribute);
  };
  ConditionExpression.prototype.equals = function (value) {
    return this.copyAddingComparison('=', value);
  };
  ConditionExpression.prototype.equalsAttribute = function (attribute) {
    return this.copyAddingComparison('=', attribute);
  };
  ConditionExpression.prototype.notEquals = function (value) {
    return this.copyAddingComparison('<>', value);
  };
  ConditionExpression.prototype.notEqualsAttribute = function (attribute) {
    return this.copyAddingComparison('<>', attribute);
  };
  ConditionExpression.prototype.isGreaterThan = function (value) {
    return this.copyAddingComparison('>', value);
  };
  ConditionExpression.prototype.isGreaterThanAttribute = function (attribute) {
    return this.copyAddingComparison('>', attribute);
  };
  ConditionExpression.prototype.isGreaterOrEqualTo = function (value) {
    return this.copyAddingComparison('>=', value);
  };
  ConditionExpression.prototype.isGreaterOrEqualToAttribute = function (attribute) {
    return this.copyAddingComparison('>=', attribute);
  };
  ConditionExpression.prototype.isLessThan = function (value) {
    return this.copyAddingComparison('<', value);
  };
  ConditionExpression.prototype.isLessThanAttribute = function (attribute) {
    return this.copyAddingComparison('<', attribute);
  };
  ConditionExpression.prototype.isLessOrEqualTo = function (value) {
    return this.copyAddingComparison('<=', value);
  };
  ConditionExpression.prototype.isLessOrEqualToAttribute = function (attribute) {
    return this.copyAddingComparison('<=', attribute);
  };
  ConditionExpression.prototype.isBetween = function (a, b) {
    this.assertStringOperand('BETWEEN');
    var attributes = this.attributes.copy();
    var left = attributes.addAttributeName(this.leftArgumentName);
    var aPlaceholder = attributes.addAttributeValue(this.leftArgumentName, a);
    var bPlaceholder = attributes.addAttributeValue(this.leftArgumentName, b);
    var expression = left + ' BETWEEN ' + aPlaceholder + ' AND ' + bPlaceholder;
    return this.copyAddingExpression(expression, attributes);
  };
  ConditionExpression.prototype.isIn = function (list) {
    var _this = this;
    this.assertStringOperand('IN');
    var attributes = this.attributes.copy();
    var left = attributes.addAttributeName(this.leftArgumentName);
    var listPlaceholders = list.map(function (value) {
      return attributes.addAttributeValue(_this.leftArgumentName, value);
    });
    var expression = left + ' IN (' + listPlaceholders.join(', ') + ')';
    return this.copyAddingExpression(expression, attributes);
  };
  // expression functions
  ConditionExpression.prototype.beginsWith = function (substring) {
    return this.copyAddingFunction('begins_with', substring);
  };
  ConditionExpression.prototype.contains = function (substring) {
    return this.copyAddingFunction('contains', substring);
  };
  Object.defineProperty(ConditionExpression.prototype, 'exists', {
    get: function () {
      return this.copyAddingFunction('attribute_exists');
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(ConditionExpression.prototype, 'notExists', {
    get: function () {
      return this.copyAddingFunction('attribute_not_exists');
    },
    enumerable: false,
    configurable: true
  });
  ConditionExpression.prototype.isType = function (type) {
    return this.copyAddingFunction('attribute_type', type);
  };
  Object.defineProperty(ConditionExpression.prototype, 'size', {
    get: function () {
      return this.copyAddingFunction('size');
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(ConditionExpression.prototype, 'and', {
    // condition clause operators
    get: function () {
      this.assertNoStringOperand('and');
      this.assertExpression('and');
      return this.copyAddingExpression(' AND ', this.attributes.copy());
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(ConditionExpression.prototype, 'or', {
    get: function () {
      this.assertNoStringOperand('or');
      this.assertExpression('or');
      return this.copyAddingExpression(' OR ', this.attributes.copy());
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(ConditionExpression.prototype, 'not', {
    get: function () {
      this.assertNoStringOperand('not');
      return this.copyAddingExpression('NOT ', this.attributes.copy());
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(ConditionExpression.prototype, 'openParens', {
    get: function () {
      this.assertNoStringOperand('openParens');
      return this.copyAddingExpression('( ', this.attributes.copy());
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(ConditionExpression.prototype, 'closeParens', {
    get: function () {
      this.assertNoStringOperand('closeParens');
      return this.copyAddingExpression(' )', this.attributes.copy());
    },
    enumerable: false,
    configurable: true
  });
  ConditionExpression.prototype.toString = function () {
    return this.expression;
  };
  ConditionExpression.prototype.copyAddingComparison = function (comparator, right) {
    this.assertStringOperand(comparator);
    var attributes = this.attributes.copy();
    var leftPlaceholder = attributes.addAttributeName(this.leftArgumentName);
    var rightPlaceholder = attributes.addAttributeValue(this.leftArgumentName, right);
    var expression = leftPlaceholder + ' ' + comparator + ' ' + rightPlaceholder;
    return this.copyAddingExpression(expression, attributes);
  };
  ConditionExpression.prototype.copyAddingFunction = function (functionName, arg) {
    this.assertStringOperand(functionName);
    var attributes = this.attributes.copy();
    var name = attributes.addAttributeName(this.leftArgumentName);
    var argPlaceholder;
    if (arg !== undefined) {
      argPlaceholder = attributes.addAttributeValue(this.leftArgumentName, arg);
    }
    var expression = functionName + ' (' + name + (argPlaceholder ? ', ' + argPlaceholder : '') + ')';
    return this.copyAddingExpression(expression, attributes);
  };
  ConditionExpression.prototype.copyAddingExpression = function (expression, attributes) {
    var newExpression = this._expression;
    if (newExpression.length > 0) {
      if (!newExpression.endsWith(' ') && !expression.startsWith(' ')) {
        throw new Error('Invalid expression "' + newExpression + expression + '"');
      }
      newExpression = newExpression + expression;
    } else {
      newExpression = expression;
    }
    return new ConditionExpression(this.type, newExpression, attributes.copy());
  };
  ConditionExpression.prototype.assertStringOperand = function (context) {
    if (!this.leftArgumentName) {
      throw new Error('Attribute name required before "' + context + '"');
    }
  };
  ConditionExpression.prototype.assertNoStringOperand = function (context) {
    if (this.leftArgumentName) {
      throw new Error('"' + context + '" cannot come right after argument "' + this.leftArgumentName + '"');
    }
  };
  ConditionExpression.prototype.assertExpression = function (context) {
    if (this._expression.length === 0) {
      throw new Error('Expression clause required before "' + context + '"');
    }
  };
  return ConditionExpression;
})();
exports.default = ConditionExpression;
var ExpressionAttributeHelper = /** @class */ (function () {
  function ExpressionAttributeHelper(attributeNames, attributeValues) {
    var _this = this;
    if (attributeNames === void 0) {
      attributeNames = {};
    }
    if (attributeValues === void 0) {
      attributeValues = {};
    }
    this.attributeNames = {};
    this.attributeValues = {};
    Object.keys(attributeNames).forEach(function (key) {
      return (_this.attributeNames[key] = attributeNames[key]);
    });
    Object.keys(attributeValues).forEach(function (key) {
      return (_this.attributeValues[key] = attributeValues[key]);
    });
  }
  ExpressionAttributeHelper.prototype.addAttributeName = function (name) {
    var keys = name.split('.').map(function (item) {
      return '#' + item;
    });
    var names = name.split('.');
    for (var i in keys) {
      this.attributeNames[keys[i]] = names[i];
    }
    return keys.join('.');
  };
  ExpressionAttributeHelper.prototype.addAttributeValue = function (attributeName, value, id) {
    if (id === void 0) {
      id = 0;
    }
    var key = ':' + attributeName.replace(/\./g, '_') + id;
    if (this.attributeValues[key]) {
      return this.addAttributeValue(attributeName, value, id + 1);
    }
    this.attributeValues[key] = value;
    return key;
  };
  ExpressionAttributeHelper.prototype.copy = function () {
    return new ExpressionAttributeHelper(this.attributeNames, this.attributeValues);
  };
  return ExpressionAttributeHelper;
})();
//# sourceMappingURL=ConditionExpression.js.map
