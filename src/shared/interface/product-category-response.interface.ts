import { Album } from '../schema/album.schema';
import { Product_Category } from '../schema/product-category.schema';

export interface IProductCategoryPopulated
  extends Omit<Product_Category, 'name' | 'description' | 'album.media'> {
  name: string;
  album?: Album;
}

export interface IProductCategoryDetailPopulated
  extends Omit<Product_Category, 'name' | 'description'> {
  name: string;
  description: string;
  productCount: number;
  parent?: IProductCategoryDetailPopulated;
  album?: Album;
}
