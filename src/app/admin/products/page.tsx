'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, X, Package, MessageSquare, Star } from 'lucide-react';
import { useAdminStore, useAuthStore } from '@/lib/store';
import Image from 'next/image';
import { Product } from '@/lib/products';

interface ReviewEntry { author: string; rating: number; text: string; date: string; }

const emptyForm: Omit<Product, 'id'> = {
  name: '', price: 0, originalPrice: undefined, category: 'Electronics',
  image: '', badge: undefined, rating: 4.5, reviews: 0,
  description: '', stock: 0, sku: '', tags: [],
};

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useAdminStore();
  const requestPin = useAuthStore(s => s.requestPin);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<Product, 'id'>>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [reviewsMap, setReviewsMap] = useState<Record<number, ReviewEntry[]>>({});
  const [newReview, setNewReview] = useState<ReviewEntry>({ author: '', rating: 5, text: '', date: new Date().toLocaleDateString() });
  const [reviewProductId, setReviewProductId] = useState<number | null>(null);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setForm(emptyForm); setEditingId(null); setModalOpen(true); };
  const openEdit = (p: Product) => {
    const { id, ...rest } = p;
    setForm(rest);
    setEditingId(id);
    setModalOpen(true);
  };

  const handleSave = () => {
    requestPin(() => {
      if (editingId !== null) {
        updateProduct(editingId, form);
      } else {
        addProduct({ ...form, id: Date.now() });
      }
      setModalOpen(false);
    });
  };

  const handleDelete = (id: number) => {
    requestPin(() => {
      deleteProduct(id);
      setDeleteConfirm(null);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm">{products.length} total products</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-purple-400"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Product', 'Category', 'Price', 'Stock', 'Rating', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((product) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        {product.image ? (
                          <Image src={product.image} alt={product.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={16} className="text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-xs">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="bg-purple-50 text-purple-700 text-xs font-medium px-2 py-1 rounded-lg">{product.category}</span>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-bold text-gray-900">${product.price.toFixed(2)}</p>
                    {product.originalPrice && <p className="text-xs text-gray-400 line-through">${product.originalPrice}</p>}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${product.stock > 20 ? 'bg-green-100 text-green-700' : product.stock > 5 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-xs font-medium text-gray-700">{product.rating}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => { setReviewProductId(product.id); setModalOpen(true); setEditingId(product.id); setActiveTab('reviews'); const { id, ...rest } = product; setForm(rest); }}
                        className="p-1.5 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg transition-colors"
                        title="Manage reviews"
                      >
                        <MessageSquare size={14} />
                      </button>
                      <button
                        onClick={() => { openEdit(product); setActiveTab('details'); }}
                        className="p-1.5 hover:bg-purple-50 text-gray-400 hover:text-purple-600 rounded-lg transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(product.id)}
                        className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(false)} className="fixed inset-0 bg-black/50 z-50" />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.97 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                  <h2 className="font-bold text-gray-900">{editingId ? 'Edit Product' : 'Add Product'}</h2>
                  <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                    <X size={16} className="text-gray-500" />
                  </button>
                </div>
                {/* Tabs */}
                <div className="flex border-b border-gray-100">
                  {(['details', 'reviews'] as const).map((t) => (
                    <button key={t} onClick={() => setActiveTab(t)}
                      className={`flex-1 py-3 text-xs font-semibold capitalize transition-colors ${activeTab === t ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}>
                      {t === 'reviews' ? `Customer Reviews (${(reviewsMap[editingId ?? 0] ?? []).length})` : 'Product Details'}
                    </button>
                  ))}
                </div>

                {activeTab === 'details' && (
                  <div className="p-6 space-y-4">
                    {([
                      ['name', 'Product Name', 'text'],
                      ['sku', 'SKU', 'text'],
                      ['image', 'Image URL', 'text'],
                      ['price', 'Price ($)', 'number'],
                      ['originalPrice', 'Original Price (optional)', 'number'],
                      ['stock', 'Stock', 'number'],
                      ['rating', 'Rating (0-5)', 'number'],
                      ['reviews', 'Review Count', 'number'],
                    ] as const).map(([field, label, type]) => (
                      <div key={field}>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
                        <input
                          type={type}
                          value={(form[field as keyof typeof form] as string | number) ?? ''}
                          onChange={(e) => setForm({ ...form, [field]: type === 'number' ? Number(e.target.value) : e.target.value })}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-400"
                        />
                      </div>
                    ))}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                      <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-400">
                        {['Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Sports'].map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Badge</label>
                      <select value={form.badge ?? ''} onChange={(e) => setForm({ ...form, badge: e.target.value || undefined })}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-400">
                        <option value="">None</option>
                        {['New', 'Sale', 'Trending', 'Bestseller'].map((b) => <option key={b}>{b}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                      <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-400 resize-none" />
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && editingId && (
                  <div className="p-6 space-y-4">
                    <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                      <p className="text-xs font-bold text-gray-700">Add Review</p>
                      <input value={newReview.author} onChange={e => setNewReview({ ...newReview, author: e.target.value })}
                        placeholder="Customer name" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-400" />
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(s => (
                          <button key={s} onClick={() => setNewReview({ ...newReview, rating: s })}>
                            <Star size={18} className={s <= newReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                          </button>
                        ))}
                      </div>
                      <textarea value={newReview.text} onChange={e => setNewReview({ ...newReview, text: e.target.value })}
                        placeholder="Write review text..." rows={2}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-purple-400 resize-none" />
                      <button onClick={() => {
                        if (!newReview.author || !newReview.text) return;
                        setReviewsMap(prev => ({ ...prev, [editingId]: [...(prev[editingId] ?? []), { ...newReview, date: new Date().toLocaleDateString() }] }));
                        setNewReview({ author: '', rating: 5, text: '', date: '' });
                      }} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl text-xs font-semibold transition-colors">
                        Add Review
                      </button>
                    </div>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {(reviewsMap[editingId] ?? []).length === 0 && <p className="text-xs text-gray-400 text-center py-4">No reviews yet</p>}
                      {(reviewsMap[editingId] ?? []).map((r, i) => (
                        <div key={i} className="bg-white border border-gray-100 rounded-xl p-3">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs font-bold text-gray-900">{r.author}</p>
                            <div className="flex gap-0.5">{[1,2,3,4,5].map(s => <Star key={s} size={10} className={s <= r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} />)}</div>
                          </div>
                          <p className="text-xs text-gray-600">{r.text}</p>
                          <p className="text-xs text-gray-400 mt-1">{r.date}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 px-6 pb-6">
                  <button onClick={() => setModalOpen(false)} className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                  <button onClick={handleSave} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl text-sm font-semibold transition-colors">
                    {editingId ? 'Save Changes' : 'Add Product'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirm !== null && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteConfirm(null)} className="fixed inset-0 bg-black/50 z-50" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 size={20} className="text-red-500" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Delete Product?</h3>
                <p className="text-gray-500 text-sm mb-5">This action cannot be undone.</p>
                <div className="flex gap-3">
                  <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-gray-200 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                  <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors">Delete</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
