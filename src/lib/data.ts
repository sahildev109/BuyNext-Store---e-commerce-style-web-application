import { Product, CreateProductRequest, UpdateProductRequest } from '@/types/product';
import productsData from '@/data/products.json';

let products: Product[] = [...productsData];

export const getProducts = async (): Promise<Product[]> => {
  return products;
};

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  return products.find(product => product.slug === slug) || null;
};

export const getProductById = async (id: string): Promise<Product | null> => {
  return products.find(product => product.id === id) || null;
};

export const createProduct = async (productData: CreateProductRequest): Promise<Product> => {
  const newProduct: Product = {
    id: Date.now().toString(),
    slug: productData.name.toLowerCase().replace(/ /g, '-'),
    lastUpdated: new Date().toISOString(),
    ...productData
  };
  
  products.push(newProduct);
  return newProduct;
};

export const updateProduct = async (id: string, productData: UpdateProductRequest): Promise<Product | null> => {
  const index = products.findIndex(product => product.id === id);
  
  if (index === -1) return null;
  
  products[index] = {
    ...products[index],
    ...productData,
    lastUpdated: new Date().toISOString()
  };
  
  return products[index];
};

export const updateProductById = async (id: string, productData: UpdateProductRequest): Promise<Product | null> => {
  const index = products.findIndex(product => product.id === id);
  
  if (index === -1) return null;
  
  products[index] = {
    ...products[index],
    ...productData,
    lastUpdated: new Date().toISOString()
  };
  
  return products[index];
};