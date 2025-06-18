import { Types } from "mongoose";

export interface IProductCategory {
  name: string;
  description?: string;
  parentId?: Types.ObjectId | string; // ID của danh mục cha
  metaTitle?: string;       // SEO
  metaDescription?: string; // SEO
  metaKeywords?: string[];  // SEO
}
export interface IProductReview {
  userId: string;
  rating: number; // 1-5
  comment: string;
}

export interface IProduct {
  name: string;
  description: string;
  shortDescription: string;
  albumId: Types.ObjectId | string; // ID của album chứa ảnh sản phẩm
  price: number;
  category: string;
  stock: number;
  tags?: string[];
  metaTitle?: string;       // SEO
  metaDescription?: string; // SEO
  metaKeywords?: string[];  // SEO
  reviews?: IProductReview[];
  averageRating?: number;   // Tính trung bình từ reviews
  totalReviews?: number;
}