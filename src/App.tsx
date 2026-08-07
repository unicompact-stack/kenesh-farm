import { useState, useEffect } from 'react';
import { Truck, ShieldCheck, Heart, ShoppingCart, ArrowRight, Phone, Mail, Camera, Send } from 'lucide-react';
import AdminPanel from './components/AdminPanel';
import { Product } from './types';
import { loadOrders, saveOrder } from './api/orders';
import { loadProducts as fetchProducts, saveProducts as persistProducts } from './api/products';

const DEFAULT_PRODUCTS: Product[] = [
  { id: '1', name: 'Молоко цельное 3.5-4.5%', price: 120, image: '/images/milk.jpg', description: '1 л, свежее утренней дойки', status: 'available' },
  { id: '2', name: 'Творог домашний 9%', price: 350, image: '/images/curd.jpg', description: '500 г, зернистый', status: 'available' },
  { id: '3', name: 'Сметана фермерская 20%', price: 180, image: '/images/sour-cream.jpg', description: '250 г, густая из сливок', status: 'available' },
  { id: '4', name: 'Масло сливочное 82.5%', price: 450, image: '/images/butter.jpg', description: '200 г, традиционное', status: 'available' },
];

export interface Order {
  id: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  address: string;
  phone: string;
  time: string;
  status: 'new' | 'done';
}

function isAdminRoute(): boolean {
  return window.location.hash === '#admin' || window.location.pathname === '/admin';
}

type ModalType = 'about' | 'delivery' | 'contacts' | null;

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [modal, setModal] = useState<ModalType>(null);
  const [isAdmin, setIsAdmin] = useState(isAdminRoute);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const onHashChange = () => setIsAdmin(isAdminRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Загрузка товаров из Supabase
  useEffect(() => {
    fetchProducts().then(data => {
      if (data.length > 0) {
        setProducts(data);
      } else {
        setProducts(DEFAULT_PRODUCTS);
      }
      setProductsLoaded(true);
    });
    // Обновлять каждые 30 секунд
    const interval = setInterval(() => {
      fetchProducts().then(data => {
        if (data.length > 0) setProducts(data);
      });
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Сохранение товаров в Supabase
  const handleUpdateProducts = async (newProducts: Product[]) => {
    setProducts(newProducts);
    await persistProducts(newProducts);
  };

  // Загрузка заказов из Supabase
  useEffect(() => {
    loadOrders().then(setOrders);
    const interval = setInterval(() => {
      loadOrders().then(setOrders);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleQty = (id: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta),
    }));
  };

  const total = products.reduce((sum, p) => sum + (p.price * (quantities[p.id] || 0)), 0);
  const totalQty = Object.values(quantities).reduce((s, q) => s + q, 0);

  const handleSubmit = async () => {
    if (totalQty === 0) { alert('Добавьте хотя бы один продукт'); return; }
    if (!address.trim()) { alert('Укажите адрес доставки'); return; }
    if (!phone.trim()) { alert('Укажите телефон'); return; }

    const items = products
      .filter(p => (quantities[p.id] || 0) > 0)
      .map(p => ({ name: p.name, qty: quantities[p.id], price: p.price }));

    const newOrder = {
      items,
      total,
      address: address.trim(),
      phone: phone.trim(),
      time: new Date().toLocaleString('ru-RU'),
      status: 'new' as const,
    };

    const saved = await saveOrder(newOrder);
    if (saved) {
      alert('Заказ оформлен! Мы свяжемся с вами в ближайшее время.');
    } else {
      alert('Заказ отправлен. Мы свяжемся с вами.');
    }

    // Обновить список заказов
    const updatedOrders = await loadOrders();
    setOrders(updatedOrders);

    setQuantities({});
    setAddress('');
    setPhone('');
  };

  if (isAdmin) {
    return (
      <AdminPanel
        products={products}
        onUpdateProducts={handleUpdateProducts}
        orders={orders}
        onUpdateOrders={setOrders}
        onExit={() => {
          window.location.hash = '';
          window.history.replaceState(null, '', window.location.pathname);
        }}
      />
    );
  }

  return (
    <>
      {/* === MOBILE VERSION === */}
      <div className="md:hidden">
        <div className="pasture-bg" />
        <div className="app-card">
          {/* Mobile Header */}
          <div style={{
            background: 'linear-gradient(180deg, #1e3a2e 0%, #2a5035 60%, #35613d 100%)',
            padding: '28px 20px 20px',
            textAlign: 'center',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/images/farm-hero.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.35 }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <svg width="36" height="28" viewBox="0 0 40 30" fill="white" style={{ marginBottom: 8 }}>
                <path d="M10 20c0-3 2-5 4-6l1-2c1-2 1-4 0-5s-3-2-5-2c-1 0-2 0-3 1-2 2-3 4-3 6 0 1 0 2 1 3l-2 4c-1 2-1 4 0 6s3 3 5 3h22c3 0 5-2 5-5s-2-5-5-5c-1 0-2 0-3 1l-2-2c-1-2-1-4 0-5s3-2 5-2c1 0 2 0 3 1 2 2 3 4 3 6 0 1 0 2-1 3l2 4c1 2 1 4 0 6" opacity="0.9"/>
              </svg>
              <h1 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 4px', letterSpacing: 1 }}>КФХ Кенеш</h1>
              <p style={{ fontSize: 13, opacity: 0.85, margin: 0 }}>Настоящие молочные продукты</p>
            </div>
          </div>

          {/* Mobile Products */}
          <div className="product-grid">
            {products.map(product => {
              const qty = quantities[product.id] || 0;
              const isAvailable = product.status === 'available';
              return (
                <div key={product.id} className="product-card" style={{ opacity: isAvailable ? 1 : 0.85 }}>
                  {product.status === 'available' && <span className="product-badge product-badge--available">В наличии</span>}
                  {product.status === 'soon' && <span className="product-badge product-badge--soon">Скоро будет</span>}
                  {product.status === 'unavailable' && <span className="product-badge product-badge--unavailable">Нет в наличии</span>}
                  <img src={product.image} alt={product.name} loading="lazy" decoding="async" />
                  <div className="product-card-info">
                    <h3>{product.name}</h3>
                    <p className="product-desc">{product.description}</p>
                    <div className="product-card-controls">
                      <span className="price">{product.price} ₽</span>
                      {isAvailable ? (
                        <>
                          <button className="qty-btn" onClick={() => handleQty(product.id, -1)} disabled={qty === 0}>−</button>
                          <span className="qty-num">{qty}</span>
                          <button className="qty-btn" onClick={() => handleQty(product.id, 1)}>+</button>
                          {qty > 0 ? <span className="dot-active" /> : <span className="dot-inactive" />}
                          <button className="btn-cart" onClick={() => handleQty(product.id, 1)}>В корзину</button>
                        </>
                      ) : (
                        <span className="product-status-text">
                          {product.status === 'soon' ? 'Скоро будет' : 'Нет в наличии'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Order */}
          <div className="order-section">
            <div className="order-row">
              <span className="order-sum">Сумма: {total} ₽</span>
              <div className="order-inputs">
                <input className="order-input" placeholder="Адрес доставки" value={address} onChange={e => setAddress(e.target.value)} />
                <input className="order-input" type="tel" placeholder="Контакт телефон" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
            </div>
            <button className="btn-submit" onClick={handleSubmit}>Отправить заказ</button>
          </div>

          {/* Mobile Info Tabs */}
          <div className="info-tabs">
            <button className="info-tab" onClick={() => setModal('about')}>О нас</button>
            <button className="info-tab" onClick={() => setModal('delivery')}>Доставка</button>
            <button className="info-tab" onClick={() => setModal('contacts')}>Контакты</button>
          </div>
        </div>
      </div>

      {/* === DESKTOP VERSION === */}
      <div className="desktop-layout">
        {/* Desktop Header */}
        <header className="desktop-header">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-farm-green">КФХ Кенеш</span>
              <span className="hidden lg:inline text-sm text-gray-400">Фермерские продукты</span>
            </div>
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500">
              <a href="#products" className="hover:text-farm-green transition-colors">Каталог</a>
              <button onClick={() => setModal('about')} className="hover:text-farm-green transition-colors">О ферме</button>
              <button onClick={() => setModal('delivery')} className="hover:text-farm-green transition-colors">Доставка</button>
              <button onClick={() => setModal('contacts')} className="hover:text-farm-green transition-colors">Контакты</button>
            </nav>
          </div>
        </header>

        {/* Desktop Hero */}
        <section className="relative h-[300px] lg:h-[360px] overflow-hidden">
          <img src="/images/farm-hero.jpg" alt="Наша ферма" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/35 flex items-center">
            <div className="max-w-6xl mx-auto px-6 w-full">
              <div className="max-w-xl text-white space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                  Настоящие молочные продукты{' '}
                  <span style={{ background: 'linear-gradient(90deg, #66bb6a, #43a047, #2e7d32)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    с доставкой
                  </span>
                </h1>
                <p className="text-lg opacity-90">
                  Свежесть с фермы прямо к вашему столу. Каждое утро мы собираем лучшее для вас.
                </p>
                <a href="#products" className="inline-flex items-center gap-2 bg-farm-green-light hover:bg-farm-green text-white px-8 py-3 rounded-xl font-bold transition-all">
                  Смотреть каталог <ArrowRight size={18} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Desktop Info Blocks */}
        <section className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="bg-green-50 p-3 rounded-xl text-farm-green"><Truck size={24} /></div>
            <div>
              <h3 className="font-bold text-lg">Доставка по Йошкар-Оле</h3>
              <p className="text-gray-500 text-sm">Пн, Вт, Чт, Пт</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="bg-green-50 p-3 rounded-xl text-farm-green"><ShieldCheck size={24} /></div>
            <div>
              <h3 className="font-bold text-lg">100% Натурально</h3>
              <p className="text-gray-500 text-sm">Без промышленной обработки</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="bg-green-50 p-3 rounded-xl text-farm-green"><Heart size={24} /></div>
            <div>
              <h3 className="font-bold text-lg">Своё хозяйство</h3>
              <p className="text-gray-500 text-sm">КРС, свиньи, овощи, зерновые</p>
            </div>
          </div>
        </section>

        {/* Desktop Products */}
        <section id="products" className="max-w-6xl mx-auto px-6 pb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Каталог продуктов</h2>
          <div className="product-grid">
            {products.map(product => {
              const qty = quantities[product.id] || 0;
              const isAvailable = product.status === 'available';
              return (
                <div key={product.id} className="product-card" style={{ opacity: isAvailable ? 1 : 0.85 }}>
                  {product.status === 'available' && <span className="product-badge product-badge--available">В наличии</span>}
                  {product.status === 'soon' && <span className="product-badge product-badge--soon">Скоро будет</span>}
                  {product.status === 'unavailable' && <span className="product-badge product-badge--unavailable">Нет в наличии</span>}
                  <img src={product.image} alt={product.name} loading="lazy" decoding="async" />
                  <div className="product-card-info">
                    <h3>{product.name}</h3>
                    <p style={{ fontSize: 12, color: '#888', margin: 0 }}>{product.description}</p>
                    <div className="product-card-controls">
                      <span className="price">{product.price} ₽</span>
                      {isAvailable ? (
                        <>
                          <button className="qty-btn" onClick={() => handleQty(product.id, -1)} disabled={qty === 0}>−</button>
                          <span className="qty-num">{qty}</span>
                          <button className="qty-btn" onClick={() => handleQty(product.id, 1)}>+</button>
                          <button className="btn-cart" onClick={() => handleQty(product.id, qty || 1)}>
                            <ShoppingCart size={14} style={{ marginRight: 4 }} /> В корзину
                          </button>
                        </>
                      ) : (
                        <span className="product-status-text">
                          {product.status === 'soon' ? 'Скоро будет' : 'Нет в наличии'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Desktop Order Form */}
        {totalQty > 0 && (
          <section className="max-w-6xl mx-auto px-6 pb-16">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-xl">
              <h3 className="text-xl font-bold mb-4">Оформить заказ</h3>
              <div className="space-y-3 mb-4">
                <input className="order-input" placeholder="Адрес доставки" value={address} onChange={e => setAddress(e.target.value)} />
                <input className="order-input" type="tel" placeholder="Контакт телефон" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">Итого: {total} ₽</span>
                <button className="btn-submit" style={{ width: 'auto', padding: '12px 32px' }} onClick={handleSubmit}>
                  Отправить заказ
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Desktop Footer */}
        <footer className="bg-farm-dark/95 text-white/60 py-8 px-6 text-center text-sm">
          <p className="font-bold text-white text-lg mb-2">КФХ Кенеш</p>
          <p>Натуральные молочные продукты с доставкой</p>
          <p className="mt-4 text-xs">© 2026 КФХ Кенеш. Все права защищены.</p>
        </footer>
      </div>

      {/* === MODALS === */}
      {modal === 'about' && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>О нашем хозяйстве</h2>
            <p>КФХ «Кенеш» — многопрофильное фермерское хозяйство в Республике Марий Эл. Мы выращиваем крупный рогатый скот (для молока и мяса), свиней, овощи и зерновые.</p>
            <p style={{ marginTop: 12 }}>Фермерские продукты не проходят обычной промышленной обработки — они полностью сохраняют свои полезные качества и вкус, выращиваются и производятся в экологически чистых местах.</p>
            <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 12, background: 'rgba(46,125,50,0.06)', borderRadius: 12 }}>
                <p style={{ fontWeight: 700, color: '#2e7d32', margin: '0 0 4px', fontSize: 13 }}>Своё хозяйство</p>
                <p style={{ fontSize: 12, color: '#666', margin: 0 }}>КРС, свиньи, овощи, зерновые</p>
              </div>
              <div style={{ padding: 12, background: 'rgba(46,125,50,0.06)', borderRadius: 12 }}>
                <p style={{ fontWeight: 700, color: '#2e7d32', margin: '0 0 4px', fontSize: 13 }}>Без обработки</p>
                <p style={{ fontSize: 12, color: '#666', margin: 0 }}>Продукты без промышленной переработки</p>
              </div>
              <div style={{ padding: 12, background: 'rgba(46,125,50,0.06)', borderRadius: 12 }}>
                <p style={{ fontWeight: 700, color: '#2e7d32', margin: '0 0 4px', fontSize: 13 }}>Экологично</p>
                <p style={{ fontSize: 12, color: '#666', margin: 0 }}>Выращиваем в экологически чистых местах</p>
              </div>
              <div style={{ padding: 12, background: 'rgba(46,125,50,0.06)', borderRadius: 12 }}>
                <p style={{ fontWeight: 700, color: '#2e7d32', margin: '0 0 4px', fontSize: 13 }}>Натуральный вкус</p>
                <p style={{ fontSize: 12, color: '#666', margin: 0 }}>Сохраняем всё полезное и вкусное</p>
              </div>
            </div>
            <p style={{ marginTop: 16, fontSize: 12, color: '#999' }}>Республика Марий Эл, Медведевский район, село Ежово</p>
            <button className="modal-close" onClick={() => setModal(null)}>Понятно</button>
          </div>
        </div>
      )}

      {modal === 'delivery' && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Доставка</h2>
            <p style={{ fontWeight: 600, marginBottom: 8 }}>Город доставки:</p>
            <ul style={{ paddingLeft: 18, margin: '0 0 16px' }}>
              <li>Йошкар-Ола</li>
            </ul>
            <p style={{ fontWeight: 600, marginBottom: 8 }}>Дни доставки:</p>
            <ul style={{ paddingLeft: 18, margin: '0 0 16px' }}>
              <li>Понедельник</li>
              <li>Вторник</li>
              <li>Четверг</li>
              <li>Пятница</li>
            </ul>
            <p style={{ fontWeight: 600, marginBottom: 8 }}>Условия:</p>
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              <li>Минимальный заказ: 300 ₽</li>
              <li>Доставка по городу: бесплатно от 1 500 ₽</li>
              <li>Стоимость доставки до 1 500 ₽: 200 ₽</li>
              <li>Оплата: наличными или банковской картой</li>
              <li>При наличии продукции — готовы привезти в день заказа</li>
            </ul>
            <button className="modal-close" onClick={() => setModal(null)}>Понятно</button>
          </div>
        </div>
      )}

      {modal === 'contacts' && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Контакты</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <a href="tel:+79060236464" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: '#f5f5f5', borderRadius: 12, textDecoration: 'none', color: 'inherit' }}>
                <Phone size={20} color="#2e7d32" />
                <div>
                  <p style={{ fontSize: 10, color: '#999', margin: 0, textTransform: 'uppercase', fontWeight: 700 }}>Телефон</p>
                  <p style={{ margin: 0, fontWeight: 500 }}>+7 (906) 023-64-64</p>
                </div>
              </a>
              <a href="mailto:kfh-kenesh@yandex.ru" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: '#f5f5f5', borderRadius: 12, textDecoration: 'none', color: 'inherit' }}>
                <Mail size={20} color="#2e7d32" />
                <div>
                  <p style={{ fontSize: 10, color: '#999', margin: 0, textTransform: 'uppercase', fontWeight: 700 }}>Email</p>
                  <p style={{ margin: 0, fontWeight: 500 }}>kfh-kenesh@yandex.ru</p>
                </div>
              </a>
              <a href="https://wa.me/79060236464" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: '#e6f7e6', borderRadius: 12, textDecoration: 'none', color: 'inherit' }}>
                <Send size={20} color="#2e7d32" />
                <div>
                  <p style={{ fontSize: 10, color: '#999', margin: 0, textTransform: 'uppercase', fontWeight: 700 }}>WhatsApp</p>
                  <p style={{ margin: 0, fontWeight: 500 }}>Написать в WhatsApp</p>
                </div>
              </a>
            </div>
            <p style={{ marginTop: 16, fontSize: 12, color: '#999' }}>Пн–Пт с 08:00 до 17:00</p>
            <p style={{ fontSize: 12, color: '#999', marginTop: 4 }}>Респ. Марий Эл, с. Ежово</p>
            <button className="modal-close" onClick={() => setModal(null)}>Понятно</button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
