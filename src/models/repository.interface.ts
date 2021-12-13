import { Document, FilterQuery, ObjectId, UpdateQuery } from "mongoose";
import { Paginated, Pagination } from "./pagination.interface";

export interface IRepositoryBase<
  TItem,
  TDocument extends Document<TItem>,
  TSorting,
  TFilterQuery = FilterQuery<TDocument>,
  TUpdateQuery = UpdateQuery<TDocument>
> {
  findOne(filter: TFilterQuery): Promise<TDocument | null>;
  findById(id: ObjectId | string): Promise<TDocument | null>;
  findAll(): Promise<TDocument[] | null>;
  findPaginated(
    pagination: Pagination<TDocument, TFilterQuery, TSorting>
  ): Promise<Paginated<TDocument> | null>;
  findAllPaginated(
    index: number,
    itemsPerPage: number
  ): Promise<Paginated<TDocument> | null>;
  updateOne(
    filter: TFilterQuery,
    update: TUpdateQuery
  ): Promise<TDocument | null>;
  updateMany(filter: TFilterQuery, update: TUpdateQuery): Promise<number>;
  insertOne(element: {
    item?: TItem;
    document?: TDocument;
  }): Promise<TDocument | null>;
  insertMany(elements: {
    items?: TItem[];
    documents?: TDocument[];
  }): Promise<TDocument[] | null>;
  removeOne(by: {
    item?: TItem;
    document?: TDocument;
    id?: string | ObjectId;
  }): Promise<void>;
  removeMany(by: {
    ids?: string[] | ObjectId[];
    items?: TItem[];
    documents?: TDocument[];
  }): Promise<void>;
}
