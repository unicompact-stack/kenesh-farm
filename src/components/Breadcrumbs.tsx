import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs: React.FC = () => {
  return (
    <nav className="flex items-center gap-2 text-farm-dark/60 py-4 text-sm md:text-base">
      <a href="#" className="hover:text-farm-dark transition-colors flex items-center gap-1">
        <Home size={16} />
        Главная
      </a>
      <ChevronRight size={14} />
      <a href="#" className="hover:text-farm-dark transition-colors">Каталог</a>
      <ChevronRight size={14} />
      <span className="text-farm-dark font-medium">Молочные продукты</span>
    </nav>
  );
};

export default Breadcrumbs;
