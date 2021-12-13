import { FilterQuery, Document, ObjectId, UpdateQuery } from "mongoose";
import { BaseClass } from "./base.class";
import { Paginated, Pagination } from "./models/pagination.interface";
import { IRepositoryBase } from "./models/repository.interface";

export abstract class AbstractRepository<
    TItem,
    TDocument extends Document<TItem>,
    TSorting,
    TFilterQuery = FilterQuery<TDocument>,
    TUpdateQuery = UpdateQuery<TDocument>
  >
  extends BaseClass
  implements
    IRepositoryBase<TItem, TDocument, TSorting, TFilterQuery, TUpdateQuery>
{
  constructor() {
    super();
  }

  abstract findOne(filter: TFilterQuery): Promise<TDocument | null>;
  abstract findById(id: string | ObjectId): Promise<TDocument | null>;
  abstract findAll(): Promise<TDocument[] | null>;
  abstract findPaginated(
    pagination: Pagination<TDocument, TFilterQuery, TSorting>
  ): Promise<Paginated<TDocument> | null>;
  abstract findAllPaginated(
    index: number,
    itemsPerPage: number
  ): Promise<Paginated<TDocument> | null>;
  abstract insertOne(element: {
    item?: TItem | undefined;
    document?: TDocument | undefined;
  }): Promise<TDocument | null>;
  abstract insertMany(elements: {
    items?: TItem[] | undefined;
    documents?: TDocument[] | undefined;
  }): Promise<TDocument[] | null>;
  abstract removeOne(by: {
    item?: TItem | undefined;
    document?: TDocument | undefined;
    id?: string | ObjectId | undefined;
  }): Promise<void>;
  abstract removeMany(by: {
    ids?: ObjectId[] | string[] | undefined;
    items?: TItem[] | undefined;
    documents?: TDocument[] | undefined;
  }): Promise<void>;
  abstract updateOne(
    filter: TFilterQuery,
    update: TUpdateQuery
  ): Promise<TDocument | null>;
  abstract updateMany(
    filter: TFilterQuery,
    update: TUpdateQuery
  ): Promise<number>;
}
