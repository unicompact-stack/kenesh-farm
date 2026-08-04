import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Eye, LogOut, Save, X, Package, Check } from 'lucide-react';
import { Product, ProductStatus } from '../types';
import { Order } from '../App';

interface AdminPanelProps {
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  orders: Order[];
  onUpdateOrders: (orders: Order[]) => void;
  onExit: () => void;
}

const EMPTY_PRODUCT: Omit<Product, 'id'> = {
  name: '',
  price: 0,
  image: '/images/milk.jpg',
  description: '',
  status: 'available',
};

const AdminPanel: React.FC<AdminPanelProps> = ({ products, onUpdateProducts, orders, onUpdateOrders, onExit }) => {
  const [editing, setEditing] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState<Omit<Product, 'id'>>(EMPTY_PRODUCT);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');

  // Poll for new orders every 10 seconds
  const [currentOrders, setCurrentOrders] = useState(orders);
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const stored = localStorage.getItem('kinesh-orders');
        if (stored) setCurrentOrders(JSON.parse(stored));
      } catch {}
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const newOrdersCount = currentOrders.filter(o => o.status === 'new').length;

  const handleNew = () => {
    setForm({ ...EMPTY_PRODUCT, image: '/images/milk.jpg' });
    setEditing(null);
    setIsNew(true);
  };

  const handleEdit = (product: Product) => {
    setForm({ ...product });
    setEditing(product);
    setIsNew(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Удалить товар?')) {
      onUpdateProducts(products.filter(p => p.id !== id));
    }
  };

  const handleSave = () => {
    if (!form.name || form.price <= 0) {
      alert('Заполните название и цену');
      return;
    }
    if (isNew) {
      onUpdateProducts([...products, { ...form, id: Date.now().toString() }]);
    } else if (editing) {
      onUpdateProducts(products.map(p => p.id === editing.id ? { ...form, id: editing.id } : p));
    }
    setEditing(null);
    setIsNew(false);
    setForm(EMPTY_PRODUCT);
  };

  const handleCancel = () => {
    setEditing(null);
    setIsNew(false);
    setForm(EMPTY_PRODUCT);
  };

  const handleStatusChange = (id: string, status: ProductStatus) => {
    onUpdateProducts(products.map(p => p.id === id ? { ...p, status } : p));
  };

  const handleMarkOrderDone = (orderId: string) => {
    const updated = currentOrders.map(o => o.id === orderId ? { ...o, status: 'done' as const } : o);
    setCurrentOrders(updated);
    onUpdateOrders(updated);
  };

  const isFormOpen = editing !== null || isNew;

  return (
    <div className="min-h-screen bg-farm-cream relative" style={{ zIndex: 10 }}>
      {/* Top bar */}
      <div className="bg-farm-green-dark text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold">Панель продавца</h1>
          <span className="text-white/50 text-sm hidden sm:inline">КФХ Кенеш</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-2 sm:px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <Eye size={16} />
            <span className="hidden sm:inline">{showPreview ? 'Скрыть' : 'Предпросмотр'}</span>
          </button>
          <button
            onClick={onExit}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-2 sm:px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Выйти</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto px-4 pt-4">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'products' ? 'bg-farm-green-dark text-white' : 'bg-white text-farm-dark hover:bg-gray-100'}`}
          >
            Товары ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all relative ${activeTab === 'orders' ? 'bg-farm-green-dark text-white' : 'bg-white text-farm-dark hover:bg-gray-100'}`}
          >
            <Package size={16} className="inline mr-1" />
            Заказы ({currentOrders.length})
            {newOrdersCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {newOrdersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-8">
        {/* Preview */}
        {showPreview && (
          <div className="mb-8 bg-white rounded-2xl p-6 border border-farm-cold/40 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
              <h2 className="font-bold text-farm-dark">Предпросмотр магазина</h2>
              <a href="/" className="text-farm-green-dark hover:underline text-sm">Открыть в новой вкладке →</a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {products.map(p => (
                <div key={p.id} className="bg-farm-light rounded-xl p-3 text-center">
                  <img src={p.image} alt={p.name} className="w-full aspect-square object-cover rounded-lg mb-2" />
                  <p className="text-xs font-bold text-farm-dark truncate">{p.name}</p>
                  <p className="text-xs text-farm-dark/50">{p.price} ₽</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-xl font-bold text-farm-dark mb-4">Заказы от покупателей</h2>
            {currentOrders.length === 0 ? (
              <div className="text-center py-16 text-farm-dark/40">
                <Package size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg mb-2">Заказов пока нет</p>
                <p className="text-sm">Когда покупатель оформит заказ, он появится здесь</p>
              </div>
            ) : (
              <div className="space-y-3">
                {currentOrders.map(order => (
                  <div key={order.id} className={`order-notification ${order.status === 'done' ? 'opacity-50' : ''}`}>
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {order.status === 'new' ? (
                          <span className="w-3 h-3 bg-farm-green-light rounded-full animate-pulse" />
                        ) : (
                          <Check size={14} className="text-farm-green" />
                        )}
                        <span className="order-time">{order.time}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${order.status === 'new' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {order.status === 'new' ? 'Новый' : 'Выполнен'}
                        </span>
                      </div>
                      {order.status === 'new' && (
                        <button className="btn-done" onClick={() => handleMarkOrderDone(order.id)}>
                          Выполнен
                        </button>
                      )}
                    </div>
                    <div className="order-items">
                      {order.items.map((item, i) => (
                        <div key={i}>{item.name} — {item.qty} шт. × {item.price}₽</div>
                      ))}
                    </div>
                    <div className="order-total">Итого: {order.total} ₽</div>
                    <div className="order-contact">
                      Адрес: {order.address} | Телефон: {order.phone}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <>
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-farm-dark">Товары</h2>
              <button
                onClick={handleNew}
                className="flex items-center gap-2 bg-farm-green-dark hover:bg-farm-accent text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm hover:shadow-md active:scale-95"
              >
                <Plus size={18} />
                Добавить товар
              </button>
            </div>

            {/* Form */}
            {isFormOpen && (
              <div className="bg-white rounded-2xl p-6 mb-8 border border-farm-cold/40 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-farm-dark">
                    {isNew ? 'Новый товар' : `Редактировать: ${editing?.name}`}
                  </h3>
                  <button onClick={handleCancel} className="text-farm-dark/40 hover:text-farm-dark transition-colors">
                    <X size={20} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-farm-dark mb-1">Название</label>
                      <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-farm-cold focus:border-farm-green-dark focus:ring-1 focus:ring-farm-green-dark outline-none transition-all text-sm"
                        placeholder="Молоко цельное" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-farm-dark mb-1">Цена (₽)</label>
                      <input type="number" value={form.price || ''} onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 rounded-xl border border-farm-cold focus:border-farm-green-dark focus:ring-1 focus:ring-farm-green-dark outline-none transition-all text-sm"
                        placeholder="120" min="0" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-farm-dark mb-1">Описание</label>
                      <input type="text" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-farm-cold focus:border-farm-green-dark focus:ring-1 focus:ring-farm-green-dark outline-none transition-all text-sm"
                        placeholder="1 л, свежее" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-farm-dark mb-1">Статус</label>
                      <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as ProductStatus })}
                        className="w-full px-4 py-2.5 rounded-xl border border-farm-cold focus:border-farm-green-dark outline-none transition-all text-sm bg-white">
                        <option value="available">В наличии</option>
                        <option value="soon">Скоро будет</option>
                        <option value="unavailable">Нет в наличии</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-farm-dark mb-1">Картинка товара</label>
                      <select value={form.image} onChange={e => setForm({ ...form, image: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-farm-cold focus:border-farm-green-dark outline-none transition-all text-sm bg-white">
                        <option value="/images/milk.jpg">🥛 Молоко</option>
                        <option value="/images/curd.jpg">🧀 Творог</option>
                        <option value="/images/sour-cream.jpg">🥣 Сметана</option>
                        <option value="/images/butter.jpg">🧈 Масло</option>
                      </select>
                      <p className="text-xs text-gray-400 mt-1">Выберите готовую картинку или добавьте свою в папку /images/</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center bg-farm-light rounded-xl p-6">
                    <p className="text-xs text-farm-dark/40 mb-3">Предпросмотр</p>
                    <img src={form.image} alt={form.name || 'Товар'} className="w-40 h-40 object-cover rounded-xl mb-3 shadow-sm" />
                    <p className="font-bold text-farm-dark text-center">{form.name || 'Название'}</p>
                    <p className="text-sm text-farm-dark/50">{form.description || 'Описание'}</p>
                    <p className="font-bold text-farm-accent mt-1">{form.price || 0} ₽</p>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={handleSave}
                    className="flex items-center gap-2 bg-farm-green-dark hover:bg-farm-accent text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm active:scale-95">
                    <Save size={16} /> {isNew ? 'Добавить' : 'Сохранить'}
                  </button>
                  <button onClick={handleCancel}
                    className="px-6 py-2.5 rounded-xl font-bold text-sm text-farm-dark/60 hover:text-farm-dark hover:bg-farm-cold/30 transition-all">
                    Отмена
                  </button>
                </div>
              </div>
            )}

            {/* Product list */}
            <div className="space-y-3">
              {products.map(product => (
                <div key={product.id} className="bg-white rounded-xl p-4 flex flex-wrap items-center gap-3 border border-farm-cold/30 hover:shadow-sm transition-shadow">
                  <img src={product.image} alt={product.name} className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg shrink-0" />
                  <div className="flex-grow min-w-0 flex-1 basis-32">
                    <h3 className="font-bold text-farm-dark truncate">{product.name}</h3>
                    <p className="text-sm font-bold text-farm-accent">{product.price} ₽</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-auto">
                    <select value={product.status} onChange={e => handleStatusChange(product.id, e.target.value as ProductStatus)}
                      className="text-xs px-2 py-1.5 rounded-lg border border-farm-cold bg-white text-farm-dark outline-none">
                      <option value="available">В наличии</option>
                      <option value="soon">Скоро будет</option>
                      <option value="unavailable">Нет в наличии</option>
                    </select>
                    <button onClick={() => handleEdit(product)}
                      className="p-2 text-farm-dark/40 hover:text-farm-green-dark hover:bg-farm-light rounded-lg transition-colors">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(product.id)}
                      className="p-2 text-farm-dark/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center py-16 text-farm-dark/40">
                <p className="text-lg mb-2">Товаров пока нет</p>
                <p className="text-sm">Нажмите «Добавить товар», чтобы создать первый</p>
              </div>
            )}

            {/* Reset */}
            <div className="mt-12 pt-8 border-t border-farm-cold/30 text-center">
              <button onClick={() => {
                if (confirm('Сбросить все товары к начальным?')) {
                  localStorage.removeItem('kinesh-products');
                  window.location.reload();
                }
              }} className="text-sm text-farm-dark/30 hover:text-red-500 transition-colors">
                Сбросить к начальным товарам
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
