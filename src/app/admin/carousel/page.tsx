'use client';
import { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Plus, Trash2, X, GripVertical, Eye, Clock, Image as ImageIcon } from 'lucide-react';
import { useCarouselStore, CarouselItem, useAuthStore } from '@/lib/store';
import Image from 'next/image';

const BADGE_OPTIONS = ['', 'New', 'Sale', 'Trending', 'Bestseller', 'Hot'];
const INTERVAL_OPTIONS = [
  { label: '2 seconds', value: 2000 },
  { label: '3 seconds', value: 3000 },
  { label: '3.5 seconds', value: 3500 },
  { label: '5 seconds', value: 5000 },
  { label: '7 seconds', value: 7000 },
];

export default function AdminCarousel() {
  const { items, interval, addItem, removeItem, updateItem, reorderItems, setInterval } = useCarouselStore();
  const requestPin = useAuthStore(s => s.requestPin);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<Partial<CarouselItem>>({ badge: '' });
  const [preview, setPreview] = useState<CarouselItem | null>(null);

  const handleAdd = () => {
    if (!form.image) return;
    requestPin(() => {
      addItem({ id: Date.now(), image: form.image!, label: form.label, badge: form.badge || undefined });
      setModal(false);
      setForm({ badge: '' });
    });
  };

  const handleRemove = (id: number) => {
    requestPin(() => removeItem(id));
  };

  const handleIntervalChange = (val: number) => {
    requestPin(() => setInterval(val));
  };

  const isLocal = (src: string) => src.startsWith('/');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Hero Carousel</h1>
          <p className="text-gray-500 text-sm">Manage the homepage hero product slides</p>
        </div>
        <button onClick={() => setModal(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors">
          <Plus size={16} /> Add Slide
        </button>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Clock size={16} className="text-purple-600" /> Auto-Play Settings</h3>
        <div className="flex flex-wrap gap-2">
          {INTERVAL_OPTIONS.map(opt => (
            <button key={opt.value}
              onClick={() => handleIntervalChange(opt.value)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors border ${interval === opt.value ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'}`}>
              {opt.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">Current interval: {interval / 1000}s · {items.length} slides total</p>
      </div>

      {/* Slides list — reorderable */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900">Slides</h3>
          <p className="text-xs text-gray-400">Drag to reorder</p>
        </div>

        <Reorder.Group axis="y" values={items} onReorder={reorderItems} className="divide-y divide-gray-50">
          {items.map((item, i) => (
            <Reorder.Item key={item.id} value={item} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors cursor-grab active:cursor-grabbing">
              <GripVertical size={16} className="text-gray-300 flex-shrink-0" />
              <span className="text-xs font-bold text-gray-400 w-4">{i + 1}</span>

              {/* Thumbnail */}
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-purple-100 to-indigo-100 flex-shrink-0">
                {isLocal(item.image) ? (
                  <Image src={item.image} alt={item.label ?? ''} fill className="object-contain p-1" />
                ) : (
                  <Image src={item.image} alt={item.label ?? ''} fill className="object-cover" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{item.label ?? 'Unnamed slide'}</p>
                <p className="text-xs text-gray-400 truncate">{item.image}</p>
                {item.badge && (
                  <span className="inline-block mt-1 text-xs bg-purple-100 text-purple-600 font-semibold px-2 py-0.5 rounded-full">{item.badge}</span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button onClick={() => setPreview(item)}
                  className="p-1.5 hover:bg-purple-50 text-gray-400 hover:text-purple-600 rounded-lg transition-colors">
                  <Eye size={14} />
                </button>
                <button onClick={() => handleRemove(item.id)}
                  className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        {items.length === 0 && (
          <div className="px-5 py-12 text-center">
            <ImageIcon size={32} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No slides yet. Add one above.</p>
          </div>
        )}
      </div>

      {/* Add Slide Modal */}
      <AnimatePresence>
        {modal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModal(false)} className="fixed inset-0 bg-black/50 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                  <h2 className="font-bold text-gray-900">Add Slide</h2>
                  <button onClick={() => setModal(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={16} /></button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Image URL or path</label>
                    <input value={form.image ?? ''} onChange={e => setForm({ ...form, image: e.target.value })}
                      placeholder="/your-image.png or https://..."
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-400" />
                    <p className="text-xs text-gray-400 mt-1">Use / for files in public/ folder, or paste an Unsplash URL</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Label (optional)</label>
                    <input value={form.label ?? ''} onChange={e => setForm({ ...form, label: e.target.value })}
                      placeholder="e.g. Summer Collection"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Badge</label>
                    <select value={form.badge ?? ''} onChange={e => setForm({ ...form, badge: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-400">
                      {BADGE_OPTIONS.map(b => <option key={b} value={b}>{b || 'None'}</option>)}
                    </select>
                  </div>

                  {/* Live preview */}
                  {form.image && (
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-4">
                      <p className="text-xs font-semibold text-gray-500 mb-2">Preview</p>
                      <div className="relative h-32 rounded-xl overflow-hidden bg-white">
                        <div className="absolute inset-0 flex items-center justify-center">
                          {isLocal(form.image) ? (
                            <Image src={form.image} alt="preview" width={120} height={120} className="object-contain" />
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={form.image} alt="preview" className="max-h-28 object-contain" onError={e => (e.currentTarget.style.display = 'none')} />
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-3 px-6 pb-6">
                  <button onClick={() => setModal(false)} className="flex-1 border border-gray-200 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                  <button onClick={handleAdd} disabled={!form.image}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white py-3 rounded-xl text-sm font-semibold transition-colors">
                    Add Slide
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {preview && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPreview(null)} className="fixed inset-0 bg-black/70 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
                <div className="bg-gradient-to-br from-purple-700 to-indigo-700 p-8 flex items-center justify-center min-h-[260px] relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-52 h-52 rounded-full bg-white/20" />
                  </div>
                  {isLocal(preview.image) ? (
                    <Image src={preview.image} alt="" width={240} height={240} className="object-contain relative z-10 drop-shadow-2xl" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={preview.image} alt="" className="max-h-52 object-contain relative z-10 drop-shadow-2xl" />
                  )}
                  {preview.badge && (
                    <span className="absolute top-4 right-4 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">{preview.badge}</span>
                  )}
                </div>
                <div className="px-6 py-5 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900">{preview.label ?? 'Slide'}</p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[200px]">{preview.image}</p>
                  </div>
                  <button onClick={() => setPreview(null)} className="p-2 hover:bg-gray-100 rounded-xl"><X size={16} /></button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
