import DataProvider, {
  GetListOptions,
  DataProviderResponseRecords,
  ID,
  DataProviderResponseRecord,
  DataProviderResponseIds,
  DataProviderResponseId,
  ResourceMap,
  Record
} from './DataProvider';
export default class DynamoDbDataProvider implements DataProvider {
  private readonly db;
  private readonly resourceMap;
  constructor(region: string, resourceMap: ResourceMap);
  getList(resource: string, options: GetListOptions): Promise<DataProviderResponseRecords>;
  get(resource: string, id: ID): Promise<DataProviderResponseRecord>;
  getMany(resource: string, ids: ID[]): Promise<DataProviderResponseRecords>;
  create(resource: string, item: Record): Promise<DataProviderResponseRecord>;
  update(resource: string, item: Record): Promise<DataProviderResponseRecord>;
  updateMany(resource: string, items: Record[]): Promise<DataProviderResponseRecords>;
  delete(resource: string, id: ID): Promise<DataProviderResponseId>;
  deleteMany(resource: string, ids: ID[]): Promise<DataProviderResponseIds>;
  private tableForResource;
  private keyForResource;
  private createFilterExpression;
  private queryOrScan;
}
