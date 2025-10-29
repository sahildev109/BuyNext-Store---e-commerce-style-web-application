import { getProducts } from '@/lib/data';
import { Product } from '@/types/product';

// This page uses SSR - data is fetched on every request
export default async function Dashboard() {
  // This fetch happens on every request - SSR
  const products = await getProducts();

  // Calculate statistics
  const totalProducts = products.length;
  const totalInventory = products.reduce((sum, product) => sum + product.inventory, 0);
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.inventory), 0);
  
  const lowStockProducts = products.filter(product => product.inventory > 0 && product.inventory <= 10);
  const outOfStockProducts = products.filter(product => product.inventory === 0);
  
  const categories = Array.from(new Set(products.map(product => product.category)));
  
  // Calculate inventory by category
  const inventoryByCategory = categories.map(category => {
    const categoryProducts = products.filter(product => product.category === category);
    const total = categoryProducts.reduce((sum, product) => sum + product.inventory, 0);
    const value = categoryProducts.reduce((sum, product) => sum + (product.price * product.inventory), 0);
    
    return {
      category,
      total,
      value: value.toFixed(2),
      productCount: categoryProducts.length
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Real-time inventory management and analytics
          </p>
        </div>
        <div className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-md">
          🔄 Live Data - Updates on every page refresh
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Products */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <span className="text-blue-600 text-xl">📦</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
            </div>
          </div>
        </div>

        {/* Total Inventory */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <span className="text-green-600 text-xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Inventory</p>
              <p className="text-2xl font-bold text-gray-900">{totalInventory}</p>
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <span className="text-yellow-600 text-xl">⚠️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Low Stock Items</p>
              <p className="text-2xl font-bold text-gray-900">{lowStockProducts.length}</p>
            </div>
          </div>
        </div>

        {/* Out of Stock */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-lg">
              <span className="text-red-600 text-xl">❌</span>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-gray-900">{outOfStockProducts.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Total Inventory Value */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-600 p-6 rounded-lg shadow-md text-white">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm opacity-90">Total Inventory Value</p>
            <p className="text-3xl font-bold">${totalValue.toFixed(2)}</p>
          </div>
          <div className="text-4xl">💰</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Products */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Low Stock Alert ({lowStockProducts.length})
          </h2>
          {lowStockProducts.length === 0 ? (
            <p className="text-green-600 text-center py-4">🎉 All products have sufficient stock!</p>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map(product => (
                <div key={product.id} className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-yellow-700 font-bold">{product.inventory} units</p>
                    <p className="text-sm text-gray-600">${product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Inventory by Category */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Inventory by Category
          </h2>
          <div className="space-y-3">
            {inventoryByCategory.map(({ category, total, value, productCount }) => (
              <div key={category} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{category}</p>
                  <p className="text-sm text-gray-600">{productCount} products</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-900 font-bold">{total} units</p>
                  <p className="text-sm text-gray-600">${value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All Products Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          All Products Inventory
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inventory
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600 truncate max-w-xs">
                        {product.description}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{product.category}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    ${product.price}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-bold ${
                      product.inventory > 10 
                        ? 'text-green-600' 
                        : product.inventory > 0 
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}>
                      {product.inventory}
                    </span>
                  </td>
                  <td className="px-4 py-3">
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
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(product.lastUpdated).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SSR Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="bg-blue-100 p-2 rounded-lg mr-3">
            <span className="text-blue-600">🔍</span>
          </div>
          <div>
            <p className="text-blue-800 font-medium">Server-Side Rendered Dashboard</p>
            <p className="text-blue-600 text-sm">
              This page fetches fresh data from the database on every request, ensuring you always see the latest inventory status.
              Last updated: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Force SSR by disabling any caching
export const dynamic = 'force-dynamic';