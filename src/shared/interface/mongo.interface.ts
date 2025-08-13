import { Types } from "mongoose";

export interface IMongodbDocument {
  _id: Types.ObjectId | string;
  createdAt: string;
  updatedAt: string;
}