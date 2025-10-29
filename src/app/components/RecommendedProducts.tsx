'use client';

import { useState } from 'react';
import { Product } from '@/types/product';
import { format } from "date-fns";

interface RecommendedProductsProps {
  products: Product[];
  recommendationType: 'restock' | 'trending';
  emptyMessage: string;
}

export default function RecommendedProducts({ 
  products, 
  recommendationType, 
  emptyMessage 
}: RecommendedProductsProps) {
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
      } else {
        newWishlist.add(productId);
      }
      return newWishlist;
    });
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  const getRecommendationBadge = (type: 'restock' | 'trending') => {
    if (type === 'restock') {
      return {
        text: 'Low Stock',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      };
    }
    return {
      text: 'Well-Stocked',
      color: 'bg-green-100 text-green-800 border-green-200',
    };
  };

  const badge = getRecommendationBadge(recommendationType);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => (
        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
          {/* Product Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900 text-lg line-clamp-2 flex-1 mr-2">
                {product.name}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${badge.color}`}>
                {badge.text}
              </span>
            </div>
            <p className="text-gray-600 text-sm line-clamp-2">
              {product.description}
            </p>
          </div>

          {/* Product Details */}
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
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
                {product.inventory} in stock
              </span>
            </div>

            <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
              <span>Category: {product.category}</span>
              <span>Updated: {format(new Date(product.lastUpdated), "yyyy-MM-dd")}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors duration-200 ${
                  wishlist.has(product.id)
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {wishlist.has(product.id) ? '❤️ Remove from Wishlist' : '🤍 Add to Wishlist'}
              </button>
              
              <button 
                onClick={() => window.open(`/products/${product.slug}`, '_blank')}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                View
              </button>
            </div>

            {/* Wishlist Feedback */}
            {wishlist.has(product.id) && (
              <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-700 text-sm text-center">
                  ✅ Added to wishlist! You'll be notified of updates.
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}