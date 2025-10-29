'use client';

import { useState, useEffect } from 'react';
import { Product, CreateProductRequest, UpdateProductRequest } from '@/types/product';
import ProductForm from '../components/ProductForm';
import ProductList from '../components/ProductList';

export default function AdminPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (productData: CreateProductRequest) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin-key-123' // Simple mock authentication
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      const newProduct = await response.json();
      setProducts(prev => [...prev, newProduct]);
      setShowForm(false);
      setError(null);
      
      alert('Product created successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
    }
  };

  const handleUpdateProduct = async (productId: string, productData: UpdateProductRequest) => {
    try {
      // First get the product to find its slug
      const product = products.find(p => p.id === productId);
      if (!product) {
        throw new Error('Product not found');
      }

      const response = await fetch(`/api/products/${product.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer admin-key-123'
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      const updatedProduct = await response.json();
      setProducts(prev => prev.map(p => p.id === productId ? updatedProduct : p));
      setEditingProduct(null);
      setError(null);
      
      alert('Product updated successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      // Note: We don't have a DELETE endpoint yet, so we'll simulate it
      // In a real app, you would call DELETE /api/products/[id]
      setProducts(prev => prev.filter(p => p.id !== productId));
      setError(null);
      
      alert('Product deleted successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600 mt-2">
            Manage your product inventory and catalog
          </p>
        </div>
        <div className="text-sm text-gray-500 bg-yellow-100 px-3 py-2 rounded-md">
          ⚡ Client-Side Data Fetching
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="bg-red-100 p-2 rounded-lg mr-3">
              <span className="text-red-600">❌</span>
            </div>
            <div>
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <p className="text-2xl font-bold text-blue-600">{products.length}</p>
          <p className="text-gray-600">Total Products</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <p className="text-2xl font-bold text-green-600">
            {products.filter(p => p.inventory > 10).length}
          </p>
          <p className="text-gray-600">In Stock</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md text-center">
          <p className="text-2xl font-bold text-red-600">
            {products.filter(p => p.inventory === 0).length}
          </p>
          <p className="text-gray-600">Out of Stock</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          + Add New Product
        </button>
        <button
          onClick={fetchProducts}
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
        >
          🔄 Refresh Data
        </button>
      </div>

      {/* Product Form */}
      {showForm && (
        <ProductForm
  product={editingProduct}
  onSubmit={
    editingProduct
      ? (data) => handleUpdateProduct(editingProduct.id, data as UpdateProductRequest)
      : (data) => handleCreateProduct(data as CreateProductRequest)
  }
  onCancel={handleCancel}
/>
      )}

      {/* Products List */}
      <ProductList
        products={products}
        onEdit={handleEdit}
        onDelete={handleDeleteProduct}
      />

      {/* Client-Side Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="bg-green-100 p-2 rounded-lg mr-3">
            <span className="text-green-600">⚡</span>
          </div>
          <div>
            <p className="text-green-800 font-medium">Client-Side Rendered Admin Panel</p>
            <p className="text-green-600 text-sm">
              This page uses client-side data fetching for maximum interactivity. 
              All operations (create, update, delete) happen without page reloads.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}