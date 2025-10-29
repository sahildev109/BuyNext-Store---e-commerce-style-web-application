import { NextRequest, NextResponse } from 'next/server';
import { getProductBySlug, updateProduct, updateProductById } from '@/lib/data';
import { UpdateProductRequest } from '@/types/product';

interface Context {
  params: {
    slug: string;
  };
}

const isValidAuth = (authHeader: string | null) => {
  return authHeader === 'Bearer admin-key-123';
};

// GET /api/products/[slug] - Fetch single product
export async function GET (request: NextRequest,  context: { params: Promise<{ slug: string }>}) {
  try {
    const { slug } = await context.params;
    console.log('Fetching product with slug:', slug);
    const product = await getProductBySlug(slug);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id] - Update a product
export async function PUT(request: NextRequest, context: { params: Promise<{ slug: string }>}) {
  try {
    // Simple authentication check
    const authHeader = request.headers.get('authorization');
    if (!isValidAuth(authHeader)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { slug } = await context.params;
    const productData: UpdateProductRequest = await request.json();
    
    // First get the product by slug to get its ID
    const existingProduct = await getProductBySlug(slug);
    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

  const updatedProduct = await updateProductById(existingProduct.id, productData);
    
    if (!updatedProduct) {
      return NextResponse.json(
        { error: 'Failed to update product' },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}