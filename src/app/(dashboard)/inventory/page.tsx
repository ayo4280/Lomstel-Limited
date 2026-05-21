"use client"

import { useState, useEffect } from "react";
import { subscribeToHarvests, HarvestLog } from "@/lib/services/inventory";

export default function InventoryPage() {
  const [batches, setBatches] = useState<HarvestLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToHarvests((harvests) => {
      setBatches(harvests);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const totalWeight = batches.reduce((sum, b) => sum + b.weight, 0);

  return (
    <div className="px-6 max-w-7xl mx-auto py-8">
      {/* Dashboard Header & Stats */}
      <section className="mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2">Inventory Command</h2>
            <p className="text-on-surface-variant font-medium">Real-time oversight of global agricultural stock.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-surface-container-low px-6 py-4 rounded-xl shadow-sm border border-outline-variant/20">
              <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Total Weight</p>
              <p className="text-2xl font-black text-primary">{totalWeight.toLocaleString()} <span className="text-sm font-medium text-on-surface-variant">KG</span></p>
            </div>
            <div className="bg-surface-container-low px-6 py-4 rounded-xl shadow-sm border border-outline-variant/20">
              <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Active Batches</p>
              <p className="text-2xl font-black text-primary">{batches.length}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="mb-8 bg-surface-container-low p-2 rounded-xl flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 bg-surface-container-lowest px-4 py-2 rounded-lg border border-outline-variant/10">
          <span className="material-symbols-outlined text-sm">hub</span>
          <select className="bg-transparent border-none text-sm font-semibold focus:ring-0 cursor-pointer outline-none">
            <option>All Hubs</option>
            <option>Central Processing Hub</option>
            <option>Northern Silo Site</option>
            <option>Eastern Collection Point</option>
          </select>
        </div>
        <div className="flex items-center gap-2 bg-surface-container-lowest px-4 py-2 rounded-lg border border-outline-variant/10">
          <span className="material-symbols-outlined text-sm">grade</span>
          <select className="bg-transparent border-none text-sm font-semibold focus:ring-0 cursor-pointer outline-none">
            <option>All Grades</option>
            <option>Grade A1 - Premium</option>
            <option>Grade B2 - Standard</option>
            <option>Grade C1 - Feed</option>
          </select>
        </div>
        <div className="ml-auto">
          <button className="bg-primary text-on-primary px-6 py-2 rounded-lg font-bold text-sm hover:opacity-90 active:scale-95 transition-all">
            Apply View
          </button>
        </div>
      </section>

      {/* Batch List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-on-surface-variant font-bold">Synchronizing ledger...</div>
        ) : batches.length === 0 ? (
          <div className="text-center py-12 text-on-surface-variant font-bold">No batches recorded in the ledger.</div>
        ) : batches.map((batch) => (
          <div key={batch.id} className="group bg-surface-container-lowest hover:bg-white transition-all rounded-xl p-5 flex flex-col md:flex-row items-center gap-6 shadow-[0px_12px_32px_rgba(11,28,48,0.04)] border border-outline-variant/10">
            <div className="w-full md:w-48">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-2 py-1 bg-primary-fixed text-on-primary-fixed text-[10px] font-black uppercase rounded tracking-tighter`}>
                  Fresh
                </span>
                <div className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${batch.status === "SYNCED" ? "bg-primary" : "bg-error"}`}></span>
                  <span className="text-[10px] font-bold text-on-surface-variant">{batch.status}</span>
                </div>
              </div>
              <h3 className="font-black text-on-surface text-lg tracking-tight leading-none uppercase">{batch.id?.slice(0, 8)}</h3>
              <p className="text-xs text-on-surface-variant mt-1">
                {batch.timestamp?.toDate().toLocaleString() || "Syncing..."}
              </p>
            </div>
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
              <div>
                <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Weight</span>
                <span className="text-base font-bold text-on-surface">{batch.weight} <span className="text-xs text-outline">KG</span></span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Grade</span>
                <span className="text-base font-bold text-on-surface">{batch.grade}</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Moisture</span>
                <span className={`px-2 py-0.5 bg-secondary-container text-on-secondary-container text-xs font-bold rounded`}>{batch.moisture}%</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Location</span>
                <span className="text-base font-bold text-on-surface">{batch.location}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button className="flex items-center justify-center gap-2 bg-surface-container-high hover:bg-surface-container-highest transition-colors text-on-surface-variant px-4 py-3 rounded-lg flex-1 md:flex-none">
                <span className="material-symbols-outlined text-lg">description</span>
                <span className="text-xs font-bold">CoA Vault</span>
              </button>
              <button className="bg-tertiary-container text-on-tertiary-container hover:opacity-90 active:scale-95 transition-all p-3 rounded-lg flex-1 md:flex-none flex items-center justify-center">
                <span className="material-symbols-outlined">open_in_full</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Analytical Insights Footer Section */}
      <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2 bg-surface-container-low rounded-xl p-8 border border-outline-variant/10">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xl font-bold tracking-tight">Analytical Insights</h4>
            <span className="material-symbols-outlined text-outline">trending_up</span>
          </div>
          <div className="h-48 w-full bg-surface-container-lowest rounded-lg border border-outline-variant/5 flex items-end justify-between p-6 gap-2">
            <div className="bg-primary/20 w-full h-[40%] rounded-t-sm"></div>
            <div className="bg-primary/40 w-full h-[60%] rounded-t-sm"></div>
            <div className="bg-primary/30 w-full h-[50%] rounded-t-sm"></div>
            <div className="bg-primary/70 w-full h-[85%] rounded-t-sm"></div>
            <div className="bg-primary/50 w-full h-[70%] rounded-t-sm"></div>
            <div className="bg-primary w-full h-[95%] rounded-t-sm"></div>
          </div>
          <div className="mt-6 flex justify-between items-center">
            <p className="text-sm font-medium text-on-surface-variant">
              Average moisture content across <span className="text-primary font-bold">{batches.length}</span> active batches.
            </p>
            <button className="text-sm font-bold text-primary underline underline-offset-4">Full Report</button>
          </div>
        </div>
        <div className="bg-primary text-on-primary rounded-xl p-8 flex flex-col justify-between shadow-lg">
          <div>
            <h4 className="text-xl font-bold mb-2">Sync Protocol</h4>
            <p className="text-primary-fixed/80 text-sm leading-relaxed">
              System is performing hourly validation against ledger nodes. Last successful global sync: 4m ago.
            </p>
          </div>
          <button className="mt-8 w-full bg-primary-fixed text-on-primary-fixed py-4 rounded-lg font-black tracking-tighter hover:bg-white transition-colors active:scale-95 duration-150">
            FORCE GLOBAL SYNC
          </button>
        </div>
      </section>
    </div>
  );
}
