import { ExpressionAttributeNameMap, ExpressionAttributeValueMap } from 'aws-sdk/clients/dynamodb';
declare enum ConditionExpressionType {
  FILTER = 'FILTER',
  KEY = 'KEY'
}
export declare type AttributeValue = any;
export declare type Comparator = '=' | '<>' | '<' | '<=' | '>' | '>=';
export declare type ExpressionAttributeType = 'name' | 'value';
export declare type ConjunctionOperator = 'AND' | 'OR';
export declare type NotOperator = 'NOT';
export declare type ParensOperator = '(' | ')';
export declare type ClauseOperator = ConjunctionOperator | NotOperator | ParensOperator;
export default class ConditionExpression {
  type: ConditionExpressionType;
  private _expression;
  private attributes;
  private leftArgumentName;
  get expression(): string;
  get attributeNames(): ExpressionAttributeNameMap | undefined;
  get attributeValues(): ExpressionAttributeValueMap | undefined;
  constructor(
    type: ConditionExpressionType,
    expression?: string,
    attributes?: ExpressionAttributeHelper,
    leftArgumentName?: string
  );
  validate(): void;
  static get not(): ConditionExpression;
  static get openParens(): ConditionExpression;
  static whereKey(key: string): ConditionExpression;
  static filterWhere(attribute: string): ConditionExpression;
  key(key: string): ConditionExpression;
  attribute(attribute: string): ConditionExpression;
  equals(value: AttributeValue): ConditionExpression;
  equalsAttribute(attribute: string): ConditionExpression;
  notEquals(value: AttributeValue): ConditionExpression;
  notEqualsAttribute(attribute: string): ConditionExpression;
  isGreaterThan(value: AttributeValue): ConditionExpression;
  isGreaterThanAttribute(attribute: string): ConditionExpression;
  isGreaterOrEqualTo(value: AttributeValue): ConditionExpression;
  isGreaterOrEqualToAttribute(attribute: string): ConditionExpression;
  isLessThan(value: AttributeValue): ConditionExpression;
  isLessThanAttribute(attribute: string): ConditionExpression;
  isLessOrEqualTo(value: AttributeValue): ConditionExpression;
  isLessOrEqualToAttribute(attribute: string): ConditionExpression;
  isBetween(a: AttributeValue, b: AttributeValue): ConditionExpression;
  isIn(list: AttributeValue[]): ConditionExpression;
  beginsWith(substring: string): ConditionExpression;
  contains(substring: string): ConditionExpression;
  get exists(): ConditionExpression;
  get notExists(): ConditionExpression;
  isType(type: any): ConditionExpression;
  get size(): ConditionExpression;
  get and(): ConditionExpression;
  get or(): ConditionExpression;
  get not(): ConditionExpression;
  get openParens(): ConditionExpression;
  get closeParens(): ConditionExpression;
  toString(): string;
  private copyAddingComparison;
  private copyAddingFunction;
  private copyAddingExpression;
  private assertStringOperand;
  private assertNoStringOperand;
  private assertExpression;
}
declare class ExpressionAttributeHelper {
  attributeNames: ExpressionAttributeNameMap;
  attributeValues: ExpressionAttributeValueMap;
  constructor(attributeNames?: {}, attributeValues?: {});
  addAttributeName(name: string): String;
  addAttributeValue(attributeName: string, value: AttributeValue, id?: number): string;
  copy(): ExpressionAttributeHelper;
}
export {};
