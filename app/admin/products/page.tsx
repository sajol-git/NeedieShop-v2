'use client';

import { useStore, Product } from '@/store/useStore';
import { useState } from 'react';
import { Search, Edit, Trash2, Image as ImageIcon, Star, Zap, AlertTriangle, Truck, CheckSquare, Square, MoreVertical, Package, Plus, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

export default function AdminProducts() {
  const { products, deleteProduct, updateProduct } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [bulkStockQuantity, setBulkStockQuantity] = useState<number | null>(null);

  const handleBulkStockUpdate = async () => {
    if (bulkStockQuantity === null || selectedProducts.length === 0) {
      toast.error('Please enter a stock quantity and select products.');
      return;
    }

    if (bulkStockQuantity < 0) {
      toast.error('Stock quantity cannot be negative.');
      return;
    }

    try {
      for (const id of selectedProducts) {
        await updateProduct(id, { stock: bulkStockQuantity });
      }
      toast.success(`${selectedProducts.length} products stock updated to ${bulkStockQuantity}`);
      setSelectedProducts([]);
      setBulkStockQuantity(null);
    } catch (error) {
      toast.error('Failed to update stock for some products');
    }
  };

  const filteredProducts = products.filter(product => 
    product.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  const handleSelectProduct = (id: string) => {
    if (selectedProducts.includes(id)) {
      setSelectedProducts(selectedProducts.filter(pId => pId !== id));
    } else {
      setSelectedProducts([...selectedProducts, id]);
    }
  };

  const handleBulkDelete = async () => {
    if (confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) {
      try {
        for (const id of selectedProducts) {
          await deleteProduct(id);
        }
        toast.success(`${selectedProducts.length} products deleted successfully`);
        setSelectedProducts([]);
      } catch (error) {
        toast.error('Failed to delete some products');
      }
    }
  };

  const handleBulkStatusUpdate = async (status: 'published' | 'draft') => {
    try {
      for (const id of selectedProducts) {
        const product = products.find(p => p.id === id);
        if (product) {
          await updateProduct(id, { ...product, status });
        }
      }
      toast.success(`${selectedProducts.length} products marked as ${status}`);
      setSelectedProducts([]);
    } catch (error) {
      toast.error('Failed to update product status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
          <Package className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Products</h1>
          <p className="text-sm text-gray-500 font-medium">Manage your store&apos;s inventory</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={2} />
          <input 
            type="text" 
            placeholder="Search products by title or brand..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all outline-none text-sm"
          />
        </div>
        <Link 
          href="/admin/products/new"
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm w-full sm:w-auto justify-center text-sm"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      <AnimatePresence>
        {selectedProducts.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-indigo-700 font-medium text-sm">
                <CheckSquare className="w-5 h-5" />
                <span>{selectedProducts.length} products selected</span>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleBulkStatusUpdate('published')}
                  className="text-sm font-medium px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                >
                  Publish
                </button>
                <button 
                  onClick={() => handleBulkStatusUpdate('draft')}
                  className="text-sm font-medium px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                >
                  Draft
                </button>
                <button 
                  onClick={handleBulkDelete}
                  className="text-sm font-medium px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-indigo-100 flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="block text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1.5 ml-1">Bulk Stock Update</label>
                <div className="relative">
                  <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
                  <input 
                    type="number" 
                    value={bulkStockQuantity === null ? '' : bulkStockQuantity}
                    onChange={(e) => setBulkStockQuantity(e.target.value === '' ? null : Number(e.target.value))}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all outline-none text-sm bg-white"
                    placeholder="Enter stock quantity for selected products..."
                  />
                </div>
              </div>
              <button 
                onClick={handleBulkStockUpdate}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2 w-full sm:w-auto justify-center text-sm"
              >
                <Save className="w-4 h-4" />
                Update Stock
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-left w-12">
                  <button onClick={handleSelectAll} className="text-gray-400 hover:text-indigo-600 transition-colors">
                    {selectedProducts.length === filteredProducts.length && filteredProducts.length > 0 ? (
                      <CheckSquare className="w-5 h-5 text-indigo-600" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Badges</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <motion.tr 
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`transition-colors hover:bg-gray-50 ${selectedProducts.includes(product.id) ? 'bg-indigo-50/50' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <button onClick={() => handleSelectProduct(product.id)} className="text-gray-400 hover:text-indigo-600 transition-colors">
                        {selectedProducts.includes(product.id) ? (
                          <CheckSquare className="w-5 h-5 text-indigo-600" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden relative shrink-0 flex items-center justify-center">
                          {product.image_url && product.image_url !== '#' ? (
                            <Image 
                              src={product.image_url} 
                              alt={product.title} 
                              fill 
                              className="object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-gray-300" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 line-clamp-1">{product.title}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{product.brand} • {product.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900 whitespace-nowrap">৳{product.discount_price.toLocaleString()}</div>
                      {product.original_price && (
                        <div className="text-xs text-gray-400 line-through whitespace-nowrap">৳{product.original_price.toLocaleString()}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`} />
                        <span className="font-medium text-gray-900">{product.stock}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border whitespace-nowrap ${
                        product.status === 'published' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-gray-50 text-gray-700 border-gray-200'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {product.is_featured && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200" title="Featured">
                            <Star className="w-3 h-3" /> Feat
                          </span>
                        )}
                        {product.is_flash_sale && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-200" title="Flash Sale">
                            <Zap className="w-3 h-3" /> Flash
                          </span>
                        )}
                        {product.free_delivery && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200" title="Free Delivery">
                            <Truck className="w-3 h-3" /> Free
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/products/${product.id}`}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => setProductToDelete(product.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Delete Product</h3>
                <p className="text-sm text-gray-500 mt-1">This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  try {
                    await deleteProduct(productToDelete);
                    toast.success('Product deleted successfully');
                    setProductToDelete(null);
                  } catch (error) {
                    toast.error('Failed to delete product');
                  }
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
