import { FilterQuery, FlattenMaps, HydratedDocument } from 'mongoose';
import { IPaging } from './paging.interface';
import { TLanguage } from './lang.interface';

//T is the DTO, M is the Model
export interface IBasicService<T, R, RDetail = R> {
  create(data: T): Promise<HydratedDocument<T>>;
  getAll(
    filterQuery: FilterQuery<T>,
    lang: TLanguage,
    page: number,
    size: number,
  ): Promise<{ data: FlattenMaps<R>[]; paging: IPaging }>;
  getRawData(filterQuery: FilterQuery<T>): Promise<HydratedDocument<T>>;
  getDetail(
    filterQuery: FilterQuery<T>,
    lang: TLanguage,
  ): Promise<RDetail | HydratedDocument<T>>;
  replace(
    filterQuery: FilterQuery<T>,
    data: T,
    lang: TLanguage,
  ): Promise<RDetail | HydratedDocument<T>>;
  modify(
    filterQuery: FilterQuery<T>,
    data: Partial<T>,
    lang: TLanguage,
  ): Promise<RDetail | HydratedDocument<T>>;
  remove(
    filterQuery: FilterQuery<T>,
    lang: TLanguage,
  ): Promise<RDetail | HydratedDocument<T>>;
}
