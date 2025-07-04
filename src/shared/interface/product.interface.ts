import { Types } from "mongoose";

export interface IProductCategory {
  name: string;
  albumId?: Types.ObjectId | string; // ID của album chứa ảnh danh mục
  description?: string;
  parentId?: Types.ObjectId | string; // ID của danh mục cha
  isActive: boolean; // Trạng thái hoạt động của danh mục
}
export interface IProductReview {
  userId: string;
  rating: number; // 1-5
  comment: string;
}

export interface IProduct {
  name: string;
  slug?: string; // Tự động sinh ra từ tên sản phẩm
  description: string;
  shortDescription: string;
  albumId?: Types.ObjectId | string; // ID của album chứa ảnh sản phẩm
  price: number;
  productCategoryId?: Types.ObjectId | string;
  inStock: boolean;
  reviews?: IProductReview[];
  averageRating?: number;   // Tính trung bình từ reviews
  totalReviews?: number;
}