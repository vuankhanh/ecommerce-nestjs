import { Album } from "../schema/album.schema";
import { Product_Category } from "../schema/product-category.schema";
import { Product } from "../schema/product.schema";
import { IProductCategoryDetailPopulated } from "./product-category-response.interface";
import { IProductReview } from "./product.interface";

export interface IProductPopulated extends Omit<Product, 'name' | 'shortDescription' | 'reviews' | 'tags' | 'totalReviews' | 'metaKeywords'> {
  name: string;
  shortDescription: string;
}

export interface IProductDetailPopulated extends Omit<Product, 'name' | 'description' | 'shortDescription' | 'productCategory'> {
  name: string;
  description: string;
  shortDescription: string;
  album?: Album;
  productCategory?: IProductCategoryDetailPopulated; // Danh mục sản phẩm
}