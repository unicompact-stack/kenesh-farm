import React from 'react';
import { Trash2 } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  items: CartItem[];
  total: number;
  onRemoveItem?: (id: string) => void;
}

const Cart: React.FC<CartProps> = ({ items, total, onRemoveItem }) => {
  return (
    <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-farm-cold/40">
      <h2 className="text-2xl font-bold text-farm-dark mb-6">Ваш заказ</h2>
      
      <div className="space-y-4 mb-6">
        {items.length === 0 ? (
          <p className="text-farm-dark/40 italic text-center py-8">Добавьте продукты из каталога</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex justify-between items-center pb-3 border-b border-farm-cold/30 last:border-0">
              <div className="flex-grow">
                <p className="font-semibold text-farm-dark text-sm">{item.name}</p>
                <p className="text-xs text-farm-dark/50">{item.quantity} шт. × {item.price} ₽</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-bold text-farm-dark text-sm">{item.quantity * item.price} ₽</p>
                {onRemoveItem && (
                  <button 
                    onClick={() => onRemoveItem(item.id)}
                    className="text-farm-dark/30 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {items.length > 0 && (
        <div className="border-t border-farm-cold/30 pt-4">
          <div className="flex justify-between items-center text-xl font-bold text-farm-dark mb-4">
            <span>Итого</span>
            <span>{total} ₽</span>
          </div>
          
          <a 
            href="#contacts"
            className="block w-full bg-farm-green-dark hover:bg-farm-accent text-white font-bold py-3 min-h-[44px] rounded-xl transition-all text-center shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            Написать для заказа
          </a>
          
          <p className="text-xs text-farm-dark/40 text-center mt-3">
            Напишите нам в VK или MAX, чтобы оформить доставку
          </p>
        </div>
      )}
    </div>
  );
};

export default Cart;
