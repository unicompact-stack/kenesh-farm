import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="relative w-full h-[300px] md:h-[400px] lg:h-[480px] overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/header-fresh.jpg" 
          alt="Свежие фермерские продукты" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-farm-dark/60 via-farm-dark/30 to-farm-cream" />
      </div>

      <div className="relative z-10 h-full max-w-5xl mx-auto px-4 flex flex-col items-center justify-center text-center">
        <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight drop-shadow-lg mb-4">
          КФХ Кинеш
        </h1>
        <p className="text-white/90 text-lg md:text-xl lg:text-2xl font-medium drop-shadow-md max-w-2xl">
          Натуральные молочные продукты из деревни Кинеш
        </p>
        <div className="mt-6 flex items-center gap-2 text-white/80 text-sm">
          <span className="w-2 h-2 bg-farm-green rounded-full animate-pulse" />
          Доставка по району
        </div>
      </div>
    </header>
  );
};

export default Header;
