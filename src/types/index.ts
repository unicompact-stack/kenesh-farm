export type ProductStatus = 'available' | 'soon' | 'unavailable';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  status: ProductStatus;
}

export interface CartItem extends Product {
  quantity: number;
}
