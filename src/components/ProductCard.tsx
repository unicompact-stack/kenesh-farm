import React from 'react';
import { Minus, Plus, ShoppingCart, Clock, XCircle } from 'lucide-react';
import { Product, ProductStatus } from '../types';

interface ProductCardProps {
  product: Product;
  quantity: number;
  onUpdateQuantity: (id: string, delta: number) => void;
  onAddToCart: (product: Product) => void;
}

const STATUS_CONFIG: Record<ProductStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  available: {
    label: 'В наличии',
    color: 'text-farm-green-dark',
    bg: 'bg-farm-green/15',
    icon: <span className="w-2 h-2 bg-farm-green rounded-full" />,
  },
  soon: {
    label: 'Скоро будет',
    color: 'text-amber-700',
    bg: 'bg-amber-100',
    icon: <Clock size={12} />,
  },
  unavailable: {
    label: 'Нет в наличии',
    color: 'text-red-600',
    bg: 'bg-red-50',
    icon: <XCircle size={12} />,
  },
};

const ProductCard: React.FC<ProductCardProps> = ({ product, quantity, onUpdateQuantity, onAddToCart }) => {
  const status = STATUS_CONFIG[product.status];
  const isOrderable = product.status === 'available';

  return (
    <div className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col h-full border border-farm-cold/50 ${!isOrderable ? 'opacity-75' : ''}`}>
      <div className="aspect-square overflow-hidden relative">
        <img 
          src={product.image} 
          alt={product.name} 
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${!isOrderable ? 'grayscale-[30%]' : ''}`}
        />
        <div className={`absolute top-3 left-3 ${status.bg} backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5 ${status.color} text-xs font-semibold`}>
          {status.icon}
          {status.label}
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-lg text-farm-dark mb-1">{product.name}</h3>
        <p className="text-sm text-farm-dark/60 mb-2">{product.description}</p>
        <p className="text-xl font-bold text-farm-accent mb-4">{product.price} ₽</p>
        
        {isOrderable ? (
          <div className="mt-auto space-y-3">
            <div className="flex items-center justify-between bg-farm-light rounded-lg p-1">
              <button 
                onClick={() => onUpdateQuantity(product.id, -1)}
                className="p-2 hover:bg-white rounded-md transition-colors text-farm-dark disabled:opacity-30"
                disabled={quantity === 0}
              >
                <Minus size={18} />
              </button>
              <span className="font-bold text-lg w-8 text-center">{quantity}</span>
              <button 
                onClick={() => onUpdateQuantity(product.id, 1)}
                className="p-2 hover:bg-white rounded-md transition-colors text-farm-dark"
              >
                <Plus size={18} />
              </button>
            </div>
            
            <button 
              onClick={() => onAddToCart(product)}
              disabled={quantity === 0}
              className="w-full bg-farm-green-dark hover:bg-farm-accent text-white font-bold py-3 min-h-[44px] rounded-xl transition-all flex items-center justify-center gap-2 group-hover:shadow-md active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={20} />
              В корзину
            </button>
          </div>
        ) : (
          <div className="mt-auto">
            <p className="text-sm text-farm-dark/50 italic text-center py-3">
              {product.status === 'soon' ? 'Ожидается на следующей неделе' : 'Товар временно отсутствует'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
