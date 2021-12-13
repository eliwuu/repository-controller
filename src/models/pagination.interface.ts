import { FilterQuery } from "mongoose";
import { Sort } from "./sorting";

export interface Pagination<
  TDocument,
  TFilterQuery = FilterQuery<TDocument>,
  TSorting = void
> {
  filter?: TFilterQuery;
  itemsPerPage: number;
  current: number;
  sort?: Sort<TDocument, TSorting>;
}

export interface Paginated<TDocument> {
  items: TDocument[];
  current: number;
  count: number;
}
