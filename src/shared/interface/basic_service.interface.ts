import { FilterQuery, FlattenMaps, HydratedDocument } from "mongoose";
import { IPaging } from "./paging.interface";
import { IMongodbDocument } from "./mongo.interface";

type MongoResult<T> = T & IMongodbDocument;
//T is the DTO, M is the Model
export interface IBasicService<T> {
  create(data: T): Promise<HydratedDocument<T>>;
  getAll(filterQuery: FilterQuery<T>, page: number, size: number): Promise<{data: FlattenMaps<T>[], paging: IPaging}>;
  getDetail(filterQuery: FilterQuery<T>): Promise<MongoResult<T>>;
  replace(filterQuery: FilterQuery<T>, data: T): Promise<MongoResult<T>>;
  modify(filterQuery: FilterQuery<T>, data: Partial<T>): Promise<MongoResult<T>>;
  remove(filterQuery: FilterQuery<T>): Promise<MongoResult<T>>;
}