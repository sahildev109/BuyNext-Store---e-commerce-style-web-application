export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  inventory: number;
  lastUpdated: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  inventory: number;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  inventory?: number;
}