'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.validateConditionExpression = void 0;
function validateConditionExpression(expression) {
  // operand >=|<=|<>|=|<|> operand
  var comparisonRegex = /^(#\S+) (>=|<=|<>|=|<|>) ([#:]\S+)$/;
  if (expression.match(comparisonRegex) !== null) {
    return true;
  }
  // operand BETWEEN operand AND operand
  var betweenRegex = /^(#\S+) BETWEEN ([#:]\S+) AND ([#:]\S+)$/;
  if (expression.match(betweenRegex) !== null) {
    return true;
  }
  // operand IN (operand (',' operand (, ...)))
  var inRegex = /^(#\S+) IN \((([#:]\S+)|([#:]\S+), )+\)$/;
  if (expression.match(inRegex) !== null) {
    return true;
  }
  // attribute_exists (path)
  var existsRegex = /^attribute_exists \((#\S+)\)$/;
  if (expression.match(existsRegex) !== null) {
    return true;
  }
  // attribute_not_exists (path)
  var notExistsRegex = /^attribute_not_exists \((#\S+)\)$/;
  if (expression.match(notExistsRegex) !== null) {
    return true;
  }
  // attribute_type (path, type)
  var typeRegex = /^attribute_type \((#\S+), (:\S+)\)$/;
  if (expression.match(typeRegex) !== null) {
    return true;
  }
  // begins_with (path, substr)
  var beginsWithRegex = /^begins_with \((#\S+), (:\S+)\)$/;
  if (expression.match(beginsWithRegex) !== null) {
    return true;
  }
  // contains (path, operand)
  var containsRegex = /^contains \((#\S+), (:\S+)\)$/;
  if (expression.match(containsRegex) !== null) {
    return true;
  }
  // size (path)
  var sizeRegex = /^size \((#\S+)\)$/;
  if (expression.match(sizeRegex) !== null) {
    return true;
  }
  // ( condition )
  var parenthesesRegex = /^\( (.+) \)$/;
  var parenthesesFound = expression.match(parenthesesRegex);
  if (parenthesesFound && parenthesesFound[1]) {
    var insideParentheses = parenthesesFound[1];
    // don't evaluate if there are parenthetical conditions
    // joined by a conjunction like ( condition ) AND ( condition )
    // or it's otherwise malformed
    var closingWithoutMatchingOpeningParensRegex = /^[^(]+\).+/;
    if (insideParentheses.match(closingWithoutMatchingOpeningParensRegex) === null) {
      return validateConditionExpression(insideParentheses);
    }
  }
  // NOT condition
  var notRegex = /^NOT (.+)$/;
  var notFound = expression.match(notRegex);
  if (notFound && notFound[1]) {
    return validateConditionExpression(notFound[1]);
  }
  // condition OR condition
  var orRegex = /(.+) OR (.+)/;
  var orFound = expression.match(orRegex);
  if (orFound && orFound[1] && orFound[2]) {
    return validateConditionExpression(orFound[1]) && validateConditionExpression(orFound[2]);
  }
  // condition AND condition
  var andEndingWithBetweenConditionRegex = /(.+) AND (#\S+ BETWEEN [#:]\S+ AND [#:]\S+)$/;
  var andEndingWithBetweenConditionFound = expression.match(andEndingWithBetweenConditionRegex);
  if (andEndingWithBetweenConditionFound && andEndingWithBetweenConditionFound[1] && andEndingWithBetweenConditionFound[2]) {
    return (
      validateConditionExpression(andEndingWithBetweenConditionFound[1]) &&
      validateConditionExpression(andEndingWithBetweenConditionFound[2])
    );
  }
  var andRegex = /(.+) AND (.+)/;
  var andFound = expression.match(andRegex);
  if (andFound && andFound[1] && andFound[2]) {
    return validateConditionExpression(andFound[1]) && validateConditionExpression(andFound[2]);
  }
  throw new Error(expression);
}
exports.validateConditionExpression = validateConditionExpression;
//# sourceMappingURL=conditionExpressionValidation.js.map
