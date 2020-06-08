// look for ideas here: https://github.com/abiglobalhealth/aor-dynamodb-client/blob/master/src/restClient.js
export interface Pagination {
  cursor: string;
  perPage: number;
}

export interface Sort {
  field: string;
  order: "ASC" | "DESC";
}
export interface Filter {
  [key: string]: any
}

export type ID = string | number;

export interface GetListOptions {
  ids?: ID[];
  sort?: Sort,
  pagination?: Pagination,
  filter?: Filter,
}

export interface DataProviderResponseRecord {
  data: any,
}

export interface DataProviderResponseRecords {
  data: any[],
  endCursor?: string,
  hasNextPage: boolean
}

export interface DataProviderResponseId {
  data: ID,
}

export interface DataProviderResponseIds {
  data: ID[],
}

// follows the patterns here except for the pagination model: https://marmelab.com/react-admin/DataProviders.html
export default interface DataProvider {
  getList(resource: string, options: GetListOptions): Promise<DataProviderResponseRecords>;
  get(resource: string, id: ID): Promise<DataProviderResponseRecord>;
  getMany(resource: string, ids: ID[]): Promise<DataProviderResponseRecords>;
  create(resource: string, item: any): Promise<DataProviderResponseRecord>;
  update(resource: string, item: any): Promise<DataProviderResponseRecord>;
  updateMany(resource: string, items: any[]): Promise<DataProviderResponseRecords>;
  delete(resource: string, id: ID): Promise<DataProviderResponseId>;
  deleteMany(resource: string, ids: ID[]): Promise<DataProviderResponseIds>;
}

export function sortItems(items: any[], sort: Sort): any[] {
  const { field, order } = sort;
  if (items[0] && typeof items[0][field] === 'string') {
    if (order === 'ASC') {
      return items.sort((a, b) => a[field].localeCompare(b[field]));
    } else {
      return items.sort((a, b) => b[field].localeCompare(a[field]));
    }
  }

  if (items[0] && typeof items[0][field] === 'number') {
    if (order === 'ASC') {
      return items.sort((a, b) => a[field] - b[field]);
    } else {
      return items.sort((a, b) => b[field] - a[field]);
    }
  }

  return items;
}

export function filterItems(items: any[], filter: Filter): any[] {
  return items.filter(item => {
    const keys = Object.keys(filter);
    let matchesAll = true;
    for (const key of keys) {
      const filterValue = filter[key];
      const itemValue = item[key];
      if (Array.isArray(filterValue)) {
        matchesAll = matchesAll && filterValue.includes(itemValue);
      } else {
        matchesAll = matchesAll && filterValue == itemValue;
      }
    }
    return matchesAll;
  });
}
