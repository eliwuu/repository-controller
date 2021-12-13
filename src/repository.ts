import { Document, FilterQuery, Model, ObjectId, UpdateQuery } from "mongoose";
import { AbstractRepository } from "./abstract.repository";
import { Paginated, Pagination } from "./models/pagination.interface";
import { Sorting } from "./models/sorting";

export class RepositoryBase<
  TItem,
  TDocument extends Document<TItem>,
  TSorting,
  TFilterQuery = FilterQuery<TDocument>,
  TUpdateQuery = UpdateQuery<TDocument>
> extends AbstractRepository<
  TItem,
  TDocument,
  TSorting,
  TFilterQuery,
  TUpdateQuery
> {
  constructor(protected model: Model<TDocument>) {
    super();
  }
  async findById(id: string | ObjectId): Promise<TDocument | null> {
    return await this.model.findById(id);
  }
  async findAll(): Promise<TDocument[] | null> {
    return await this.model.find();
  }
  async findAllPaginated(
    index: number,
    itemsPerPage: number,
    sort?: Sorting<TSorting>
  ): Promise<Paginated<TDocument> | null> {
    const documentsCount = await this.model.countDocuments();

    const count = Math.ceil(documentsCount / itemsPerPage);

    const skip = index * itemsPerPage;

    let data: TDocument[];

    if (sort)
      data = await this.model
        .find()
        .sort({ sort })
        .limit(itemsPerPage)
        .skip(skip);
    else
      data = await this.model
        .find()
        .sort({ id: -1 })
        .limit(itemsPerPage)
        .skip(skip);

    const paginated: Paginated<TDocument> = {
      current: index,
      items: data,
      count: count,
    };

    return paginated;
  }
  async findPaginated(
    pagination: Pagination<TDocument, TFilterQuery, TSorting>
  ): Promise<Paginated<TDocument> | null> {
    if (pagination.filter === undefined)
      return await this.findAllPaginated(
        pagination.current,
        pagination.itemsPerPage
      );

    const documentsCount = await this.model.countDocuments();

    const count = Math.ceil(documentsCount / pagination.itemsPerPage);

    const skip = pagination.current * pagination.itemsPerPage;

    let data: TDocument[];

    if (pagination.sort) {
      const field = pagination.sort.field;
      data = await this.model
        .find(pagination.filter)
        .sort({ field: pagination.sort.by })
        .limit(pagination.itemsPerPage)
        .skip(skip);
    } else
      data = await this.model
        .find(pagination.filter)
        .sort({ id: -1 })
        .limit(pagination.itemsPerPage)
        .skip(skip);

    const paginated: Paginated<TDocument> = {
      items: data,
      current: pagination.current,
      count: count,
    };
    return paginated;
  }
  async insertMany(elements: {
    items?: TItem[] | undefined;
    documents?: TDocument[] | undefined;
  }): Promise<TDocument[] | null> {
    if (elements === undefined)
      throw new Error("paramter elements is undefined");

    if (elements.items === undefined && elements.documents === undefined)
      throw new Error("items & documents in element are undefined");

    if (elements.items) {
      const data = await this.model.insertMany(
        elements.items as unknown as TDocument[]
      );

      return data;
    }

    if (elements.documents) {
      const data = await this.model.insertMany(elements.documents);

      return data;
    }

    throw new Error("no data error");
  }
  removeOne(by: {
    item?: TItem | undefined;
    document?: TDocument | undefined;
    id?: string | ObjectId | undefined;
  }): Promise<void> {
    throw new Error("Method not implemented.");
  }
  removeMany(by: {
    ids?: string[] | ObjectId[] | undefined;
    items?: TItem[] | undefined;
    documents?: TDocument[] | undefined;
  }): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async findOne(filter: FilterQuery<TDocument>): Promise<TDocument | null> {
    return await this.model.findOne(filter);
  }
  async insertOne(item: TItem): Promise<TDocument | null> {
    const data = await this.model.create(item);
    await data.save();

    return data;
  }

  async updateOne(
    filter: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>
  ): Promise<TDocument | null> {
    return await this.model.findOneAndUpdate(filter, update);
  }
  async updateMany(
    filter: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>
  ): Promise<number> {
    return (await this.model.updateMany(filter, update)).modifiedCount;
  }
}
