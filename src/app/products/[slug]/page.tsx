import { getProducts, getProductBySlug } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Product } from '@/types/product';

// Generate static params at build time
export async function generateStaticParams() {
  const products = await getProducts();
  
  return products.map((product) => ({
    slug: product.slug,
  }));
}

// ISR: Revalidate every 60 seconds
export const revalidate = 60;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          {/* Product Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-gray-600 text-lg">{product.description}</p>
            </div>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {product.category}
            </span>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Product Info */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Product Details
                </h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="text-3xl font-bold text-blue-600">
                      ${product.price}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Inventory:</span>
                    <span className={`text-lg font-medium ${
                      product.inventory > 10 
                        ? 'text-green-600' 
                        : product.inventory > 0 
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}>
                      {product.inventory} units
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="text-gray-600">
                      {new Date(product.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stock Status */}
              <div className={`p-4 rounded-lg ${
                product.inventory > 10 
                  ? 'bg-green-50 border border-green-200' 
                  : product.inventory > 0 
                  ? 'bg-yellow-50 border border-yellow-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    product.inventory > 10 
                      ? 'bg-green-500' 
                      : product.inventory > 0 
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}></div>
                  <span className={`font-medium ${
                    product.inventory > 10 
                      ? 'text-green-800' 
                      : product.inventory > 0 
                      ? 'text-yellow-800'
                      : 'text-red-800'
                  }`}>
                    {product.inventory > 10 
                      ? 'In Stock - Ready to Ship' 
                      : product.inventory > 0 
                      ? 'Low Stock - Order Soon'
                      : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column - Actions */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h2>
                
                <div className="space-y-3">
                  <button 
                    disabled={product.inventory === 0}
                    className={`w-full py-3 px-4 rounded-md font-medium ${
                      product.inventory === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {product.inventory === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                  
                  <button className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50">
                    Add to Wishlist
                  </button>
                  
                  <button className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50">
                    Share Product
                  </button>
                </div>
              </div>

              {/* Admin Quick Links */}
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h2 className="text-xl font-semibold text-blue-900 mb-4">
                  Admin Tools
                </h2>
                <div className="space-y-2">
                  <a 
                    href="/admin" 
                    className="block text-blue-700 hover:text-blue-900 font-medium"
                  >
                    ↗ Edit this product
                  </a>
                  <a 
                    href="/dashboard" 
                    className="block text-blue-700 hover:text-blue-900 font-medium"
                  >
                    ↗ View inventory dashboard
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ISR Notice */}
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              💡 This page uses Incremental Static Regeneration (ISR). 
              It was pre-generated at build time and will automatically update every 60 seconds.
              Last updated: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps) {
    const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }
  
  return {
    title: `${product.name} - E-Commerce App`,
    description: product.description,
  };
}