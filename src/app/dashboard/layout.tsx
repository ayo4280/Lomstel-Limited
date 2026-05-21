"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import { LayoutDashboard, Boxes, FileText, Settings, LogOut, User, Loader2 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/login');
          return;
        }

        // Fetch user profile to check role
        const { data: userProfile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error || !userProfile) {
          // Fallback if profile row wasn't triggered yet or fails
          setProfile({
            full_name: session.user.user_metadata?.full_name || 'Lomstel Member',
            role: session.user.user_metadata?.role || 'BUYER'
          });
        } else {
          setProfile(userProfile);
        }
      } catch (err) {
        console.error('Auth check error:', err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-main)',
        gap: '1rem'
      }}>
        <Loader2 size={36} className="animate-spin" color="var(--color-forest-500)" />
        <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Loading Command Center...</p>
      </div>
    );
  }

  const role = profile?.role || 'BUYER';
  const showInventory = role === 'ADMIN' || role === 'FARM_WORKER';

  return (
    <div className="dashboard-layout animate-fade-in">
      <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          {/* Logo Header */}
          <div style={{ marginBottom: '2.5rem', padding: '0 0.5rem' }}>
            <h2 style={{ color: 'var(--color-forest-700)', margin: 0, fontSize: '1.75rem', letterSpacing: '-0.5px', fontWeight: 800 }}>
              Lomstel
            </h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-earth-500)', fontWeight: 600 }}>
              Command Center
            </p>
          </div>
          
          {/* Navigation links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link 
              href="/dashboard" 
              className={`nav-link ${pathname === '/dashboard' ? 'active' : ''}`}
            >
              <LayoutDashboard size={20} />
              Dashboard
            </Link>
            
            {showInventory && (
              <Link 
                href="/dashboard/inventory" 
                className={`nav-link ${pathname === '/dashboard/inventory' ? 'active' : ''}`}
              >
                <Boxes size={20} />
                Inventory
              </Link>
            )}

            <Link 
              href="/dashboard/certificates" 
              className={`nav-link ${pathname === '/dashboard/certificates' ? 'active' : ''}`}
            >
              <FileText size={20} />
              Certificates
            </Link>

            <Link 
              href="/dashboard/settings" 
              className={`nav-link ${pathname === '/dashboard/settings' ? 'active' : ''}`}
            >
              <Settings size={20} />
              Settings
            </Link>
          </nav>
        </div>

        {/* User Card & Logout */}
        <div style={{
          borderTop: '1px solid var(--glass-border)',
          paddingTop: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0 0.5rem' }}>
            <div style={{
              backgroundColor: 'var(--color-forest-100)',
              color: 'var(--color-forest-700)',
              borderRadius: '50%',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <User size={18} />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{
                fontWeight: 700,
                fontSize: '0.9rem',
                color: 'var(--color-earth-900)',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden'
              }}>
                {profile?.full_name}
              </div>
              <div style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: role === 'ADMIN' ? 'var(--color-forest-600)' : role === 'FARM_WORKER' ? '#2980B9' : 'var(--color-accent)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginTop: '2px'
              }}>
                {role.replace('_', ' ')}
              </div>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: 'transparent',
              color: 'var(--color-accent)',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'left'
            }}
            className="nav-logout-btn"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>
      
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
