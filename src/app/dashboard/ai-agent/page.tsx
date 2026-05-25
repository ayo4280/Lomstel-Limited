"use client";

import React, { useEffect, useState } from 'react';
import { Bot, Terminal, Building2, MapPin, Phone, ExternalLink, Activity } from 'lucide-react';
import { supabase } from '@/utils/supabase/client';

type Lead = {
  id: string;
  business_name: string;
  business_type: string;
  contact_info: string;
  location: string;
  source_url: string;
  status: string;
  created_at: string;
};

type AITask = {
  id: string;
  task_name: string;
  status: string;
  leads_found: number;
  logs: string;
  started_at: string;
  completed_at: string;
};

export default function AIAgentDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [tasks, setTasks] = useState<AITask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();

    // Subscribe to realtime updates for leads and tasks
    const leadsSubscription = supabase
      .channel('leads_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
        fetchData();
      })
      .subscribe();

    const tasksSubscription = supabase
      .channel('tasks_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ai_tasks' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(leadsSubscription);
      supabase.removeChannel(tasksSubscription);
    };
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [leadsResponse, tasksResponse] = await Promise.all([
        supabase.from('leads').select('*').order('created_at', { ascending: false }),
        supabase.from('ai_tasks').select('*').order('started_at', { ascending: false }).limit(5)
      ]);

      if (leadsResponse.data) setLeads(leadsResponse.data);
      if (tasksResponse.data) setTasks(tasksResponse.data);
    } catch (error) {
      console.error('Error fetching AI data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }} className="animate-fade-in">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '0.5rem', letterSpacing: '-1px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Bot style={{ color: 'var(--color-forest-500)' }} size={40} />
            AI Lead Generator
          </h1>
          <p style={{ fontSize: '1.1rem' }}>Monitor your automated AI browser agent's activity and view newly scraped leads.</p>
        </div>
        
        <div className="glass" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Terminal size={24} style={{ color: 'var(--color-earth-600)' }} />
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>To run the agent, open your terminal and type:</p>
            <code style={{ backgroundColor: 'rgba(0,0,0,0.05)', padding: '0.25rem 0.5rem', borderRadius: '4px', color: 'var(--color-forest-600)', fontWeight: 600 }}>npm run scrape</code>
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        
        {/* Main Leads Table */}
        <div className="glass" style={{ flex: '1 1 600px', padding: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--color-earth-900)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building2 size={24} style={{ color: 'var(--color-forest-500)' }} />
            Generated Leads
          </h2>

          {isLoading ? (
            <p>Loading leads...</p>
          ) : leads.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <p>No leads found yet. Run the scraper to get started!</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(0,0,0,0.05)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '1rem 0.5rem' }}>Business Name</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Contact</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Location</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map(lead => (
                    <tr key={lead.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <div style={{ fontWeight: 500, color: 'var(--color-earth-900)' }}>{lead.business_name}</div>
                        <a href={lead.source_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem', color: 'var(--color-forest-500)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          Source <ExternalLink size={12} />
                        </a>
                      </td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                          <Phone size={16} style={{ color: 'var(--text-muted)' }} />
                          {lead.contact_info}
                        </div>
                      </td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', maxWidth: '200px' }}>
                          <MapPin size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{lead.location}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <span style={{ padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600, backgroundColor: 'var(--color-earth-100)', color: 'var(--color-earth-700)' }}>
                          {lead.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* AI Task Activity Feed */}
        <div className="glass" style={{ flex: '1 1 300px', padding: '2rem', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--color-earth-900)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={20} style={{ color: 'var(--color-forest-500)' }} />
            Agent Activity Log
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {tasks.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No recent agent activity.</p>
            ) : (
              tasks.map(task => (
                <div key={task.id} style={{ borderLeft: `3px solid ${task.status === 'Running' ? '#f59e0b' : task.status === 'Completed' ? 'var(--color-forest-500)' : '#ef4444'}`, paddingLeft: '1rem' }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>{task.task_name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.25rem 0' }}>
                    Status: <strong style={{ color: task.status === 'Running' ? '#f59e0b' : task.status === 'Completed' ? 'var(--color-forest-500)' : '#ef4444' }}>{task.status}</strong>
                  </div>
                  {task.status === 'Completed' && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-earth-700)' }}>
                      Found {task.leads_found} new leads.
                    </div>
                  )}
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    {new Date(task.started_at).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
