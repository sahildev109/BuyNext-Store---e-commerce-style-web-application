import { getProducts } from '@/lib/data';
import { Product } from '@/types/product';
import RecommendedProducts from '../components/RecommendedProducts';

// This is a React Server Component - runs on the server
export default async function RecommendationsPage() {
  // Fetch recommended products on the server
  const allProducts = await getProducts();
  
  // Simple recommendation logic: products with low inventory get recommended for restock
  // In a real app, this would be more sophisticated (based on sales, categories, etc.)
  const recommendedProducts = allProducts
    .filter(product => product.inventory <= 5 && product.inventory > 0)
    .slice(0, 6);

  const trendingProducts = allProducts
    .sort((a, b) => b.inventory - a.inventory) // Products with high inventory
    .slice(0, 6);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Product Recommendations
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Smart recommendations powered by server-side logic with client-side interactions
        </p>
      </div>

      {/* Server Component Notice */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="bg-purple-100 p-2 rounded-lg mr-3">
            <span className="text-purple-600">⚡</span>
          </div>
          <div>
            <p className="text-purple-800 font-medium">React Server Component</p>
            <p className="text-purple-600 text-sm">
              This page uses React Server Components to fetch and process data on the server, 
              then passes it to client components for interactivity.
            </p>
          </div>
        </div>
      </div>

      {/* Low Stock Recommendations */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Restock Recommendations</h2>
            <p className="text-gray-600">
              Products running low on inventory - consider restocking soon
            </p>
          </div>
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
            {recommendedProducts.length} items need attention
          </span>
        </div>

        <RecommendedProducts 
          products={recommendedProducts} 
          recommendationType="restock"
          emptyMessage="Great news! All products have sufficient stock levels."
        />
      </section>

      {/* Trending Products */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Well-Stocked Items</h2>
            <p className="text-gray-600">
              Products with healthy inventory levels - great for promotions
            </p>
          </div>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            {trendingProducts.length} items trending
          </span>
        </div>

        <RecommendedProducts 
          products={trendingProducts} 
          recommendationType="trending"
          emptyMessage="No trending products found at the moment."
        />
      </section>

      {/* Architecture Explanation */}
      <div className="bg-gray-50 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🏗️ Architecture Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Server-Side (RSC)</h4>
            <ul className="text-gray-600 space-y-1">
              <li>• Data fetching from database</li>
              <li>• Recommendation algorithm</li>
              <li>• Product filtering and sorting</li>
              <li>• Initial HTML rendering</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Client-Side</h4>
            <ul className="text-gray-600 space-y-1">
              <li>• Add to Wishlist interactions</li>
              <li>• Button hover effects</li>
              <li>• Real-time wishlist updates</li>
              <li>• User interactions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata() {
  return {
    title: 'Product Recommendations - E-Commerce App',
    description: 'Smart product recommendations with server-side processing and client-side interactions',
  };
}