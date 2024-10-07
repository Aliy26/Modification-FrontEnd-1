import {
  ProductCollection,
  ProductStatus,
  ProductUnit,
} from "../enums/product.enum";

export interface Product {
  _id: string;
  productStatus: ProductStatus;
  productCollection: ProductCollection;
  productName: string;
  productPrice: number;
  productLeftCount: number;
  productSoldCount: number;
  productUnit: ProductUnit;
  productPerSaleCount: number;
  productDesc?: string;
  productImages: string[];
  productViews: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductInquiry {
  page: number;
  limit: number;
  order: string;
  productCollection?: ProductCollection;
  sort?: string;
  search?: string;
}
