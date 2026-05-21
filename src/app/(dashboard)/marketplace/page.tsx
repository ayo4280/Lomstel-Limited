"use client"

import { useState, useEffect } from "react";
import { subscribeToProducts, Product } from "@/lib/services/marketplace";

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Snowy Pearl Oyster",
    farm: "Vertical Greens Hub",
    price: "$12.50",
    available: "4.5kg",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAX2nF5pwvxO_FCkBKSowWlJpZd459kJw3cpvNOguSvvqhd6WObVW6xdv8Aok-9f7xHsJsetd8b62hv4a4nyCuf1hBU2tzktq3RWH2HTmmlvrROKKq-Kv_9fzkYOSsQt3e-u23tJKjqmpQtvSCqq33pEsRujtKLT_BB3IQ7aRxlRTlViXc5v_C4uiDxk7YTvl_z3opNEIhn51CA25-rSZ2ip8As3ETo2bz3ZP1mvUhrr1fy5e1OYJE7QMaijcpupGwEM5NJnd1WSpMN",
    tag: "Available"
  },
  {
    id: "2",
    name: "Sapphire Oyster",
    farm: "Riverside Growers",
    price: "$14.00",
    available: "8.0kg",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAjDyOY9aN7FFB3cSLR2JOF6rU9dz3roerDI07DhwD42O9u_T8uuFvK02eDWgwoPGD2u9TlIS_qvcHUrj_0IrLBLYo_4AhsuOfqOqu3b1LnCPJQBx6dceOP7eQeYXDu1hNhTQFKGuxJwdoJiBier1Cp8xB3jYi4Ypv9ydq5wZDWlQuKopBLpD7Ty26Ayj-IGK44LhUxGX9aAYEZG3DtY-WyMQ1UJaTyx4A7T4XsFgCmjVaJVKXGMa4pelDu5Rwi-RT_XCoGWQClYZMq",
    tag: "Available"
  },
  {
    id: "3",
    name: "Golden Sun Oyster",
    farm: "Solaris Shrooms",
    price: "$18.25",
    available: "1.2kg",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAFEd1jOU2Tv7kv15uMqGl_l-0wo8DjCpTlEfiRntV_UChc8o4Derq1-iFgNVK9-1F1s7y-BTx4Bbm7rMiytKBNVCMsPC-ecxkXeWK60Pevq9WdBbq--BNZNhRpnE6RTBP5D37ukG1Mi4SNG-vsCXRyDiLYdT8hDZKzCx1CK_YEPekVqOojBi4oj0-8EX2NSqqyCp_oPI4p4IIXLlC51jBkuvRu8-OJFkFuykf46yJmgI_OfTgyBA7dskjt0o2P4KCipmKRUYZs73Y6",
    tag: "Low Stock",
    tagColor: "bg-error-container text-on-error-container"
  }
];

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToProducts((fetchedProducts) => {
      if (fetchedProducts.length > 0) {
        setProducts(fetchedProducts);
      } else {
        setProducts(FALLBACK_PRODUCTS);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="px-6 max-w-7xl mx-auto py-8 space-y-8">
      {/* Fresh Harvest Banner */}
      <section className="relative overflow-hidden rounded-xl bg-primary-container h-64 md:h-80 flex items-center">
        <img 
          className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaiy5VAN6dFX7AwDvsma5c0ZguxiDvWoKSpmt9U01IAhke90nR__1bIx7c2fvPs-N3R327HC7vEQBo6hu2eSsp8AYsVxaaQ1OUNWHF9DPjCE-XKw-t-BASwhqtZmMqOsEz8tIll9NLaeiYSmAWQN7icny_NuptxMpeMhgj3yJwZn7CJX-I8m26NjlSCbIkIQ0exgThxV6ARyLcGY-282V6605goiGjhqzX7RkafsbFqZOyjr2Mufr-q03OIgvknuDXHyXe8YS-nUxF"
          alt="Freshly picked mushrooms"
        />
        <div className="relative z-10 p-8 md:p-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-fixed text-on-primary-fixed rounded-full text-xs font-bold tracking-wider">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            LIVE HARVEST UPDATES
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight max-w-lg">
            Premium Blue Oyster <br /> Freshly Picked.
          </h2>
          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
              <p className="text-white/70 text-xs uppercase font-bold tracking-widest">Next Harvest</p>
              <p className="text-white font-bold">Today, 4:00 PM</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
              <p className="text-white/70 text-xs uppercase font-bold tracking-widest">Temperature</p>
              <p className="text-white font-bold">18.5°C Optimal</p>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Status Tracker */}
      <section className="bg-surface-container-low rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 border border-outline-variant/10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined">local_shipping</span>
          </div>
          <div>
            <h3 className="font-bold text-on-surface">Order #PL-8821 in Transit</h3>
            <p className="text-on-surface-variant text-sm">Estimated delivery: 25 mins • Picking up from Farm A</p>
          </div>
        </div>
        <div className="w-full md:w-64 h-2 bg-surface-container-highest rounded-full overflow-hidden">
          <div className="h-full bg-primary w-2/3"></div>
        </div>
        <button className="text-primary font-bold text-sm px-4 py-2 hover:bg-primary-fixed/20 rounded-lg transition-colors">
          Track Live Map
        </button>
      </section>

      {/* Marketplace Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Filter Sidebar */}
        <aside className="md:col-span-3 space-y-8 hidden md:block">
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-4">Categories</h4>
            <ul className="space-y-2">
              <li className="bg-primary-fixed text-on-primary-fixed px-4 py-2 rounded-lg font-bold flex justify-between items-center">
                Blue Oyster <span className="text-xs opacity-70">12kg</span>
              </li>
              <li className="hover:bg-surface-container text-on-surface-variant px-4 py-2 rounded-lg transition-colors flex justify-between items-center cursor-pointer">
                King Oyster <span className="text-xs opacity-70">0kg</span>
              </li>
              <li className="hover:bg-surface-container text-on-surface-variant px-4 py-2 rounded-lg transition-colors flex justify-between items-center cursor-pointer">
                Golden Oyster <span className="text-xs opacity-70">4kg</span>
              </li>
            </ul>
          </div>
          <div className="bg-tertiary-fixed rounded-xl p-6">
            <h4 className="text-on-tertiary-fixed font-bold mb-2">Grower&apos;s Note</h4>
            <p className="text-on-tertiary-fixed-variant text-sm leading-relaxed">
              Humidity is currently peaking at 85%. Today&apos;s harvest is exceptionally firm and high in umami.
            </p>
          </div>
        </aside>

        {/* Products Bento Grid */}
        <section className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12 text-on-surface-variant font-bold">Accessing marketplace node...</div>
          ) : products.map((product) => (
            <div key={product.id} className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0px_12px_32px_rgba(11,28,48,0.04)] transition-all hover:shadow-[0px_12px_32px_rgba(11,28,48,0.08)]">
              <div className="relative h-48 overflow-hidden">
                <img 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                  src={product.image}
                  alt={product.name}
                />
                <div className={`absolute top-3 left-3 ${product.tagColor || "bg-secondary-container text-on-secondary-container"} px-3 py-1 rounded-full text-xs font-bold`}>
                  Available: {product.available}
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-on-surface">{product.name}</h3>
                    <p className="text-on-surface-variant text-xs">Farm: {product.farm}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-primary font-black text-xl">{product.price}</p>
                    <p className="text-on-surface-variant text-[10px] uppercase font-bold">per kg</p>
                  </div>
                </div>
                <button className="w-full py-3 bg-tertiary-container text-on-tertiary-container font-bold rounded-lg flex items-center justify-center gap-2 active:scale-95 transition-transform">
                  <span className="material-symbols-outlined text-sm">bolt</span>
                  Quick Order
                </button>
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* Local Farm Stats */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-12">
        <div className="md:col-span-2 bg-surface-container rounded-xl p-6 flex items-center gap-6">
          <div className="w-20 h-20 bg-primary-container rounded-full flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary-fixed text-4xl">eco</span>
          </div>
          <div>
            <h4 className="font-black text-2xl text-primary leading-none">100% Organic</h4>
            <p className="text-on-surface-variant mt-2 text-sm">Every mushroom is grown without synthetic pesticides, using sustainable substrate practices.</p>
          </div>
        </div>
        <div className="bg-surface-container-high rounded-xl p-6 text-center">
          <p className="text-3xl font-black text-primary">1.2h</p>
          <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Avg. Harvest to Door</p>
        </div>
        <div className="bg-surface-container-high rounded-xl p-6 text-center">
          <p className="text-3xl font-black text-primary">48</p>
          <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Active Buyers Now</p>
        </div>
      </section>
    </div>
  );
}
