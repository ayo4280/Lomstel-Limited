import Image from "next/image";

export default function ExecutiveDashboard() {
  return (
    <div className="px-6 max-w-7xl mx-auto py-8">
      {/* Header Section */}
      <header className="mb-10">
        <p className="text-on-surface-variant font-label text-sm uppercase tracking-widest mb-1">
          CEO Overview — Lomstel Limited (Nigeria Ops)
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2">
          Operational Command
        </h1>
        <div className="flex flex-wrap gap-3 mt-6">
          <button className="flex items-center gap-2 bg-tertiary-container text-on-tertiary-container px-6 py-3 rounded-xl font-bold active:scale-95 transition-transform shadow-sm">
            <span className="material-symbols-outlined text-[20px]">inventory_2</span>
            View Inventory
          </button>
          <button className="flex items-center gap-2 bg-primary-container text-on-primary-container px-6 py-3 rounded-xl font-bold active:scale-95 transition-transform shadow-sm">
            <span className="material-symbols-outlined text-[20px]">description</span>
            Generate Invoice
          </button>
        </div>
      </header>

      {/* Bento Grid Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Key Metric: Total Inventory Value */}
        <section className="md:col-span-4 flex flex-col justify-between p-8 rounded-xl bg-surface-container-low relative overflow-hidden group">
          <div className="relative z-10">
            <span className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider">
              Total Portfolio Value (NGN)
            </span>
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold tracking-tighter text-on-surface">₦2.15B</span>
              <span className="text-primary font-bold text-sm flex items-center">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                +4.2%
              </span>
            </div>
            <p className="mt-2 text-on-surface-variant text-sm font-medium">942.5 Metric Tons across 4 regional hubs</p>
          </div>
          <div className="mt-8 pt-6 border-t border-outline-variant/10">
            <div className="flex justify-between items-center text-xs text-on-surface-variant mb-2">
              <span>Capacity Utilization</span>
              <span>82%</span>
            </div>
            <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
              <div className="bg-primary h-full w-[82%]"></div>
            </div>
          </div>
        </section>

        {/* Major Alert: Oyster Mushroom Surplus */}
        <section className="md:col-span-8 p-8 rounded-xl bg-primary text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 pointer-events-none">
            <img 
              alt="High-quality close-up of fresh oyster mushrooms" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuABlTVws25K-mHFT0Aq0NFvqOBiCqT3ijnX365CHrfPL-7I8HZlC7FEofSUDmX1oVfW2-ay9PQjA3A7lNgwSiRdv09uKoEhjT-R5-zaKhhIUX_4a8IrQSugi1auhBGec6AT5tFsMhS7XmRVQiavrtWCPsNMM0x1ujUlQjA3VWbio0fRJFnqIbNlAGf4QNMnrJU3okVV4OK0d9kcfGxyrJc6_bxySlipggbbLQ7IME0-z6pIu5QAAd2I2CQhaNP10eGpbGXiVCeNXlku"
            />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-fixed text-on-primary-fixed rounded-full text-xs font-bold mb-4">
                <span className="material-symbols-outlined text-[14px] fill-current">warning</span>
                INVENTORY SURPLUS DETECTED
              </div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">2.4 Metric Ton Surplus</h2>
              <p className="text-primary-fixed-dim max-w-md text-lg leading-relaxed">
                Dry Oyster Mushroom yields at Hub A (Ogun State) exceed quarterly forecasts by 18%. Immediate distribution or off-take agreement required.
              </p>
            </div>
            <div className="flex gap-4 mt-8">
              <button className="bg-white text-primary px-5 py-2 rounded-lg font-bold text-sm hover:bg-surface-bright transition-colors">AFEX Exchange List</button>
              <button className="border border-white/30 text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-white/10 transition-colors">Move to Processing</button>
            </div>
          </div>
        </section>

        {/* Sales Progress Goal */}
        <section className="md:col-span-7 p-8 rounded-xl bg-surface-container shadow-[0px_12px_32px_rgba(11,28,48,0.06)]">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-on-surface">Regional Growth Target FY24</h3>
              <p className="text-on-surface-variant text-sm mt-1">Goal: ₦500M Revenue Expansion</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-on-surface">14.2%</span>
              <p className="text-on-surface-variant text-xs">Current Progress</p>
            </div>
          </div>
          {/* Visual Chart Simulation */}
          <div className="flex items-end gap-2 h-48 w-full mt-4">
            <div className="flex-1 bg-surface-container-highest rounded-t-lg h-[20%] transition-all hover:bg-primary-fixed-dim"></div>
            <div className="flex-1 bg-surface-container-highest rounded-t-lg h-[35%] transition-all hover:bg-primary-fixed-dim"></div>
            <div className="flex-1 bg-surface-container-highest rounded-t-lg h-[30%] transition-all hover:bg-primary-fixed-dim"></div>
            <div className="flex-1 bg-surface-container-highest rounded-t-lg h-[55%] transition-all hover:bg-primary-fixed-dim"></div>
            <div className="flex-1 bg-surface-container-highest rounded-t-lg h-[70%] transition-all hover:bg-primary-fixed-dim"></div>
            <div className="flex-1 bg-primary-container rounded-t-lg h-[82%] group relative">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Current</div>
            </div>
            <div className="flex-1 bg-outline-variant/20 rounded-t-lg h-[100%] border-t-2 border-dashed border-primary/40"></div>
          </div>
          <div className="flex justify-between mt-4 text-[10px] text-on-surface-variant font-medium uppercase tracking-widest">
            <span>Q1</span>
            <span>Q2</span>
            <span>Q3</span>
            <span>Q4</span>
            <span>Target</span>
          </div>
        </section>

        {/* Recent Activity Feed */}
        <section className="md:col-span-5 p-8 rounded-xl bg-surface-container-low flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold tracking-tight text-on-surface">Intelligence Stream</h3>
            <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-on-surface">more_vert</span>
          </div>
          <div className="space-y-6 flex-1 overflow-y-auto">
            {/* Activity Item 1 */}
            <div className="flex gap-4">
              <div className="w-10 h-10 shrink-0 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                <span className="material-symbols-outlined text-[20px]">smart_toy</span>
              </div>
              <div>
                <p className="text-sm text-on-surface font-semibold">Buyer match found in Lagos</p>
                <p className="text-xs text-on-surface-variant">Bulk retailer in Ikeja looking for consistent mushroom supply.</p>
                <span className="text-[10px] text-on-surface-variant/60 font-bold uppercase mt-1 block">12 MIN AGO</span>
              </div>
            </div>
            {/* Activity Item 2 */}
            <div className="flex gap-4">
              <div className="w-10 h-10 shrink-0 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed">
                <span className="material-symbols-outlined text-[20px]">agriculture</span>
              </div>
              <div>
                <p className="text-sm text-on-surface font-semibold">Harvest Logged in Hub B (Jos)</p>
                <p className="text-xs text-on-surface-variant">500kg of Fresh Button Mushrooms moved to cold storage.</p>
                <span className="text-[10px] text-on-surface-variant/60 font-bold uppercase mt-1 block">2 HOURS AGO</span>
              </div>
            </div>
          </div>
          <button className="mt-8 text-primary font-bold text-xs uppercase tracking-widest text-center w-full py-2 hover:bg-surface-container-highest rounded-lg transition-colors">
            View Full Audit Log
          </button>
        </section>
      </div>

      {/* Secondary Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="p-6 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex items-center gap-4">
          <div className="p-3 rounded-full bg-secondary-fixed text-on-secondary-fixed">
            <span className="material-symbols-outlined">water_drop</span>
          </div>
          <div>
            <p className="text-xs text-on-surface-variant font-medium">Hub A (Ogun) Moisture</p>
            <p className="text-xl font-bold">12.4% <span className="text-[10px] text-primary">OPTIMAL</span></p>
          </div>
        </div>
        <div className="p-6 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex items-center gap-4">
          <div className="p-3 rounded-full bg-secondary-fixed text-on-secondary-fixed">
            <span className="material-symbols-outlined">thermostat</span>
          </div>
          <div>
            <p className="text-xs text-on-surface-variant font-medium">Hub B (Plateau) Temp</p>
            <p className="text-xl font-bold">21.8°C <span className="text-[10px] text-primary">STABLE</span></p>
          </div>
        </div>
        <div className="p-6 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex items-center gap-4">
          <div className="p-3 rounded-full bg-tertiary-fixed text-on-tertiary-fixed">
            <span className="material-symbols-outlined">local_shipping</span>
          </div>
          <div>
            <p className="text-xs text-on-surface-variant font-medium">In Transit (Lagos-Kano)</p>
            <p className="text-xl font-bold">18 Shipments <span className="text-[10px] text-error">4 DELAYED</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
