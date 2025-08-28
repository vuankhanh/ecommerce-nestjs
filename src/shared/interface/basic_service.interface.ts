import { FilterQuery, FlattenMaps, HydratedDocument } from "mongoose";
import { IPaging } from "./paging.interface";
import { IMongodbDocument } from "./mongo.interface";
import { TLanguage } from "./lang.interface";

type MongoResult<T> = T & IMongodbDocument;
//T is the DTO, M is the Model
export interface IBasicService<T> {
  create(data: T): Promise<HydratedDocument<T>>;
  getAll(filterQuery: FilterQuery<T>, lang: TLanguage, page: number, size: number): Promise<{data: FlattenMaps<T>[], paging: IPaging}>;
  getDetail(filterQuery: FilterQuery<T>, lang: TLanguage): Promise<MongoResult<T>>;
  replace(filterQuery: FilterQuery<T>, data: T, lang: TLanguage): Promise<MongoResult<T>>;
  modify(filterQuery: FilterQuery<T>, data: Partial<T>, lang: TLanguage): Promise<MongoResult<T>>;
  remove(filterQuery: FilterQuery<T>, lang: TLanguage): Promise<MongoResult<T>>;
}