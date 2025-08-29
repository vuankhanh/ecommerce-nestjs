import { Types } from "mongoose";
import { Album } from "../schema/album.schema";
import { Product_Category } from "../schema/product-category.schema";
import { TLanguage } from "./lang.interface";

export interface IProductCategory {
  name: { [key in TLanguage]: string };
  albumId?: Types.ObjectId | string; // ID của album chứa ảnh danh mục
  description?: { [key in TLanguage]: string };
  parentId?: Types.ObjectId | string; // ID của danh mục cha
  isActive: boolean; // Trạng thái hoạt động của danh mục
}
export interface IProductReview {
  userId: string;
  rating: number; // 1-5
  comment: string;
}

export interface IProduct {
  name: { [key in TLanguage]: string };
  slug?: string; // Tự động sinh ra từ tên sản phẩm
  description: { [key in TLanguage]: string };
  shortDescription: { [key in TLanguage]: string };
  albumId?: Types.ObjectId | string; // ID của album chứa ảnh sản phẩm
  album?: Album;
  price: number;
  productCategoryId?: Types.ObjectId | string;
  productCategory?: Product_Category;
  inStock: boolean;
  reviews?: IProductReview[];
  averageRating?: number;   // Tính trung bình từ reviews
  totalReviews?: number;
}