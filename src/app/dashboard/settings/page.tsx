"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { User, Shield, Mail, Save, Calendar, Info } from 'lucide-react';

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setEmail(session.user.email || '');
          setCreatedAt(new Date(session.user.created_at).toLocaleDateString());
          
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (userProfile) {
            setProfile(userProfile);
            setFullName(userProfile.full_name || '');
          }
        }
      } catch (err) {
        console.error('Error loading settings info:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session.');

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          updated_at: new Date().toISOString()
        })
        .eq('id', session.user.id);

      if (error) throw error;

      // Also update auth metadata for consistency
      await supabase.auth.updateUser({
        data: { full_name: fullName }
      });

      setSuccessMsg('✓ Profile information updated successfully!');
      
      // Update local profile state
      setProfile((prev: any) => ({ ...prev, full_name: fullName }));
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ color: 'var(--text-muted)' }}>Loading settings...</div>;
  }

  const role = profile?.role || 'BUYER';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }} className="animate-fade-in">
      <header>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '0.5rem', letterSpacing: '-1px' }}>Settings</h1>
        <p style={{ fontSize: '1.1rem' }}>Manage your account settings, profile information, and system role permissions.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        
        {/* Left Side: Profile Info Form */}
        <div className="glass" style={{ padding: '2rem' }}>
          <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: 'var(--color-earth-700)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={20} color="var(--color-forest-500)" />
            Profile Details
          </h3>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {successMsg && (
              <div style={{ padding: '0.85rem 1rem', borderRadius: '10px', backgroundColor: 'var(--color-forest-100)', color: 'var(--color-forest-700)', fontWeight: 600, fontSize: '0.9rem' }}>
                {successMsg}
              </div>
            )}
            {errorMsg && (
              <div style={{ padding: '0.85rem 1rem', borderRadius: '10px', backgroundColor: '#FDECEA', color: 'var(--color-accent)', fontWeight: 600, fontSize: '0.9rem' }}>
                {errorMsg}
              </div>
            )}

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--color-earth-700)' }}>Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                style={{ width: '100%', padding: '0.85rem', borderRadius: '10px', border: '2px solid var(--color-earth-200)', outline: 'none', fontFamily: 'inherit', fontSize: '1rem', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--color-earth-700)' }}>Email Address</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem', borderRadius: '10px', backgroundColor: 'var(--color-earth-100)', border: '2px solid var(--color-earth-200)', color: 'var(--text-muted)' }}>
                <Mail size={16} />
                <span>{email}</span>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={saving} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        </div>

        {/* Right Side: Permissions & System Role Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="glass" style={{ padding: '2rem' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: 'var(--color-earth-700)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={20} color="var(--color-forest-500)" />
              Security Role & Permissions
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-earth-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Current System Role
                </p>
                <div style={{
                  display: 'inline-block',
                  backgroundColor: role === 'ADMIN' ? 'var(--color-forest-100)' : role === 'FARM_WORKER' ? '#E8F4FD' : '#FDECEA',
                  color: role === 'ADMIN' ? 'var(--color-forest-700)' : role === 'FARM_WORKER' ? '#2980B9' : 'var(--color-accent)',
                  padding: '4px 14px',
                  borderRadius: '20px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  marginTop: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {role.replace('_', ' ')}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-earth-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  System Permissions
                </p>
                
                <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <li>{role === 'ADMIN' ? '✓ Full database access' : '✗ Full database access'}</li>
                  <li>{role !== 'BUYER' ? '✓ Record harvests and stock additions' : '✗ Record harvests and stock additions'}</li>
                  <li>{role !== 'BUYER' ? '✓ Subract sales and stock deductions' : '✗ Subract sales and stock deductions'}</li>
                  <li>{role === 'ADMIN' ? '✓ Manage bulk buyer accounts & price sheets' : '✗ Manage bulk buyer accounts & price sheets'}</li>
                  <li>✓ Secure Certificate Vault access (Read-Only)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem', borderLeft: '4px solid var(--color-forest-500)' }}>
            <Calendar size={20} color="var(--color-forest-500)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-earth-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Account Created
              </p>
              <p style={{ margin: '4px 0 0', fontWeight: 600, color: 'var(--color-earth-900)' }}>
                {createdAt}
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
