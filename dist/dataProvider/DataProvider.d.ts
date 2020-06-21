export declare type ID = string | number;
export interface Record {
  id: ID;
  [field: string]: any;
}
export interface Pagination {
  cursor: string;
  perPage: number;
}
export interface Sort {
  field: string;
  order: 'ASC' | 'DESC';
}
export interface Filter {
  [key: string]: any;
}
export interface GetListOptions {
  ids?: ID[];
  sort?: Sort;
  pagination?: Pagination;
  filter?: Filter;
}
export interface DataProviderResponseRecord {
  data: Record;
}
export interface DataProviderResponseRecords {
  data: Record[];
  endCursor?: string;
  hasNextPage: boolean;
}
export interface DataProviderResponseId {
  data: ID;
}
export interface DataProviderResponseIds {
  data: ID[];
}
export interface ResourceMap {
  [resource: string]: string;
}
export default interface DataProvider {
  getList(resource: string, options: GetListOptions): Promise<DataProviderResponseRecords>;
  get(resource: string, id: ID): Promise<DataProviderResponseRecord>;
  getMany(resource: string, ids: ID[]): Promise<DataProviderResponseRecords>;
  create(resource: string, item: Record): Promise<DataProviderResponseRecord>;
  update(resource: string, item: Record): Promise<DataProviderResponseRecord>;
  updateMany(resource: string, items: Record[]): Promise<DataProviderResponseRecords>;
  delete(resource: string, id: ID): Promise<DataProviderResponseId>;
  deleteMany(resource: string, ids: ID[]): Promise<DataProviderResponseIds>;
}
export declare function sortItems(items: any[], sort: Sort): any[];
export declare function filterItems(items: any[], filter: Filter): any[];
