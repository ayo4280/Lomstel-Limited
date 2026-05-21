"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import MetricCard from '@/components/MetricCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, Droplets, ShoppingCart } from 'lucide-react';

export default function DashboardPage() {
  const [totalDry, setTotalDry] = useState(0);
  const [totalWet, setTotalWet] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    async function fetchData() {
      const { data: harvests } = await supabase.from('harvests').select('*');
      const { data: products } = await supabase.from('mushroom_products').select('*');

      let dry = 0;
      let wet = 0;

      if (harvests) {
        harvests.forEach((h: any) => {
          if (h.harvest_type === 'DRY') {
            dry += Number(h.weight);
          } else {
            wet += Number(h.weight);
          }
        });
      }

      if (products) {
        products.forEach((p: any) => {
          if (p.product_type === 'WET') {
            wet += Number(p.quantity_kg);
          } else {
            dry += Number(p.quantity_kg);
          }
        });
      }

      // Seed dry stock with 2000kg PRD surplus if no dry data yet
      const finalDry = dry > 0 ? dry : 2000;
      const finalWet = Math.max(0, wet);

      setTotalDry(finalDry);
      setTotalWet(finalWet);

      setChartData([
        { name: 'Jan', dry: 1200, wet: 300 },
        { name: 'Feb', dry: 1500, wet: 450 },
        { name: 'Mar', dry: 1800, wet: 200 },
        { name: 'Apr', dry: 1950, wet: 600 },
        { name: 'May', dry: finalDry, wet: finalWet },
      ]);
    }

    fetchData();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <header className="animate-fade-in">
        <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '0.5rem', letterSpacing: '-1px' }}>Overview</h1>
        <p style={{ fontSize: '1.1rem' }}>Monitor your mushroom inventory and operational metrics in real-time.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <MetricCard
          title="Total Dry Stock (kg)"
          value={totalDry.toLocaleString()}
          trend={{ value: 12, isPositive: true }}
          icon={<Package size={28} />}
        />
        <MetricCard
          title="Total Wet Stock (kg)"
          value={totalWet.toLocaleString()}
          icon={<Droplets size={28} />}
        />
        <MetricCard
          title="Pending Bulk Orders"
          value="0"
          icon={<ShoppingCart size={28} />}
        />
      </div>

      {/* Chart — only render after mount to avoid width=-1 warning */}
      {mounted && (
        <div className="glass animate-fade-in" style={{ padding: '2rem', animationDelay: '0.2s' }}>
          <h3 style={{ marginTop: 0, marginBottom: '2rem', color: 'var(--color-earth-700)', fontSize: '1.25rem' }}>
            Inventory Volume Trend
          </h3>
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-earth-200)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--color-earth-500)" axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="var(--color-earth-500)" axisLine={false} tickLine={false} dx={-10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    borderRadius: '12px',
                    border: '1px solid var(--color-earth-200)',
                    boxShadow: 'var(--glass-shadow)',
                  }}
                  itemStyle={{ fontWeight: 600 }}
                />
                <Line
                  type="monotone"
                  dataKey="dry"
                  name="Dry Stock (kg)"
                  stroke="var(--color-forest-500)"
                  strokeWidth={3}
                  dot={{ r: 5, fill: 'white', stroke: 'var(--color-forest-500)', strokeWidth: 2 }}
                  activeDot={{ r: 7 }}
                />
                <Line
                  type="monotone"
                  dataKey="wet"
                  name="Wet Stock (kg)"
                  stroke="#2980B9"
                  strokeWidth={3}
                  dot={{ r: 5, fill: 'white', stroke: '#2980B9', strokeWidth: 2 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
