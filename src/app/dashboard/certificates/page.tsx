import React from 'react';
import { Shield, FileText } from 'lucide-react';

export default function CertificatesPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }} className="animate-fade-in">
      <header>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '0.5rem', letterSpacing: '-1px' }}>Certificate Vault</h1>
        <p style={{ fontSize: '1.1rem' }}>Securely manage your NAFDAC certifications, organic status, and lab results.</p>
      </header>

      <div className="glass" style={{ padding: '4rem 3rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', maxWidth: '700px', margin: '2rem auto' }}>
        <div style={{ backgroundColor: 'var(--color-forest-100)', padding: '1.5rem', borderRadius: '50%', color: 'var(--color-forest-500)', boxShadow: '0 4px 20px rgba(75,127,82,0.15)' }}>
          <Shield size={48} />
        </div>
        
        <div>
          <h2 style={{ color: 'var(--color-earth-900)', marginBottom: '1rem', fontSize: '1.75rem' }}>Secure Storage Coming Soon</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}>
            We are setting up the secure Supabase Storage buckets for your PDF certificates. Soon you will be able to upload and share your compliance documents directly from here.
          </p>
        </div>

        <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', opacity: 0.7, cursor: 'not-allowed' }}>
          <FileText size={18} />
          Upload Document (Locked)
        </button>
      </div>
    </div>
  );
}
