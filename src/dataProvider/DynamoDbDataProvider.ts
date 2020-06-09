import DataProvider, { GetListOptions, DataProviderResponseRecords, ID, DataProviderResponseRecord, DataProviderResponseIds, DataProviderResponseId, Filter, sortItems, ResourceMap, Record } from './DataProvider';
import DynamoDbWrapper, { Key } from '../dynamoDb/DynamoDbWrapper';
import ConditionExpression from '../dynamoDb/ConditionExpression';

export default class DynamoDbDataProvider implements DataProvider {
  private readonly db: DynamoDbWrapper;
  private readonly resourceMap: ResourceMap;

  constructor(region: string, resourceMap: ResourceMap) {
    this.db = new DynamoDbWrapper(region);
    this.resourceMap = resourceMap;
  }

  // TODO: pagination
  async getList(resource: string, options: GetListOptions): Promise<DataProviderResponseRecords> {
    let items = await this.queryOrScan(resource, options.filter);
    if (options.sort) {
      items = sortItems(items, options.sort);
    }
    return {
      data: items,
      hasNextPage: false,
    }
  }

  async get(resource: string, id: ID): Promise<DataProviderResponseRecord> {
    const item = await this.db.get(this.tableForResource(resource), this.keyForResource(resource, id));
    return { data: item }
  }
  
  async getMany(resource: string, ids: ID[]): Promise<DataProviderResponseRecords> {
    const items = await this.db.batchGet(this.tableForResource(resource), ids.map(id => this.keyForResource(resource, id)));
    return { 
      data: items,
      hasNextPage: false,
    };
  }

  async create(resource: string, item: Record): Promise<DataProviderResponseRecord> {
    item.createdAt = Date.now();
    item.updatedAt = Date.now();
    await this.db.put(this.tableForResource(resource), item, `attribute_not_exists(id)`);
    return { data: item };
  }

  async update(resource: string, item: Record): Promise<DataProviderResponseRecord> {
    const key = this.keyForResource(resource, item.id);
    const tableName = this.tableForResource(resource);
    const original = await this.db.get(tableName, key);
    if (!original || !original.createdAt) {
      item.createdAt = Date.now();
    }
    item.updatedAt = Date.now();
  
    const mergedItem = { ...original, ...item, ...key };
    await this.db.put(tableName, mergedItem);
    return {
      data: mergedItem
    }
  }

  async updateMany(resource: string, items: Record[]): Promise<DataProviderResponseRecords> {
    const tableName = this.tableForResource(resource);
    const originals = await this.db.batchGet(tableName, items.map(item => this.keyForResource(resource, item.id)));
    const originalMap = originals.reduce((map: any, item: Record) => {
      map[item.id] = item;
      return map;
    }, {});

    const mergedItems = items.map(item => {
      const original = originalMap[item.id]
      if (!original || !original.createdAt) {
        item.createdAt = Date.now();
      }
      item.updatedAt = Date.now();
      return {...original, ...item}
    });

    await this.db.batchPut(tableName, mergedItems);
    return {
      data: mergedItems,
      hasNextPage: false,
    }
  }

  async delete(resource: string, id: ID): Promise<DataProviderResponseId> {
    await this.db.delete(this.tableForResource(resource), this.keyForResource(resource, id));
    return {
      data: id
    }
  }

  async deleteMany(resource: string, ids: ID[]): Promise<DataProviderResponseIds> {
    const keys = ids.map(id => this.keyForResource(resource, id));
    await this.db.batchDelete(this.tableForResource(resource), keys);
    return { data: ids }
  }

  private tableForResource(resource: string): string {
    return this.resourceMap[resource];
  }

  private keyForResource(resource: string, id: ID): Key {
    return { id };
  }

  private createFilterExpression(filter?: Filter): ConditionExpression | undefined {
    if (!filter) {
      return undefined;
    }
    const attributes = Object.keys(filter);
    if (!attributes.length) {
      return undefined;
    }
  
    const addEqualsOrIsInList = (expression, value) => {
      expression = ConditionExpression.filterWhere(attribute);
      if (Array.isArray(value)) {
        return expression.isIn(value);
      }
      return expression.equals(value);
    };
  
    let attribute = attributes[0];
    let value = filter[attribute];
    let expression = ConditionExpression.filterWhere(attribute);
    expression = addEqualsOrIsInList(expression, value);
    for (let i = 1; i < attributes.length; i++) {
      attribute = attributes[i];
      value = filter[attribute];
      expression = expression.and.attribute(attribute);
      expression = addEqualsOrIsInList(expression, value);
    }
    return expression;
  }
  
  private async queryOrScan(resource: string, filter?: Filter): Promise<Record[]> {
    const table = this.tableForResource(resource);
    const { id, ...restFilter } = filter || {};
    const filterExpression = this.createFilterExpression(restFilter);
    if (id) {
      const keyExpression = ConditionExpression.whereKey('id').equals(id);
      return this.db.query(table, keyExpression, filterExpression)
    }
    return this.db.scan(table, filterExpression);
  }
}
