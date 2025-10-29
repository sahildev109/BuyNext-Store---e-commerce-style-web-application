import { NextRequest, NextResponse } from 'next/server';
import { getProducts, createProduct } from '@/lib/data';
import { CreateProductRequest } from '@/types/product';

const isValidAuth = (authHeader: string | null) => {
  return authHeader === 'Bearer admin-key-123';
};

// GET /api/products - Fetch all products
export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products - Create a new product
export async function POST(request: NextRequest) {
  try {
    // Simple authentication check (we'll improve this later)
    const authHeader = request.headers.get('authorization');
    if (!isValidAuth(authHeader)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const productData: CreateProductRequest = await request.json();
    
    // Basic validation
    if (!productData.name || !productData.price || !productData.category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newProduct = await createProduct(productData);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}