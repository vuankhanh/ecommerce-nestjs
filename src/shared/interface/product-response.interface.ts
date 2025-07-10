import { HydratedDocument } from "mongoose";
import { Album } from "../schema/album.schema";
import { Product_Category } from "../schema/product-category.schema";
import { IProductReview } from "./product.interface";

export interface IProductResponse {
  name: string;
  slug: string; // Đường dẫn thân thiện với SEO
  code: string;
  description: string;
  shortDescription: string;
  album?: Album;
  price: number;
  productCategory?: Product_Category; // Danh mục sản phẩm
  inStock: boolean;
  reviews?: IProductReview[];
  averageRating?: number;   // Tính trung bình từ reviews
  totalReviews?: number;
}