import Link from 'next/link';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-blue-600">
            ${product.price}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            product.inventory > 10 
              ? 'bg-green-100 text-green-800' 
              : product.inventory > 0 
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {product.inventory > 10 
              ? 'In Stock' 
              : product.inventory > 0 
              ? 'Low Stock'
              : 'Out of Stock'}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>Category: {product.category}</span>
          <span>Stock: {product.inventory}</span>
        </div>

        <Link
          href={`/products/${product.slug}`}
          className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}