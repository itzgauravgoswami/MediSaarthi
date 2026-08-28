"use client";

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, Badge } from '@/components/ui/Card';
import { adminApi } from '@/services/api';
import { ShieldCheck, Search, Filter } from 'lucide-react';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      const data = await adminApi.getAuditLogs();
      setLogs(data);
    }
    load();
  }, []);

  const filtered = logs.filter(l => l.action.toLowerCase().includes(search.toLowerCase()) || l.user.toLowerCase().includes(search.toLowerCase()) || l.resource.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Security & Audit Trails</h1>
            <p className="text-xs text-slate-500">Immutable clinical audit log tracking data access, consent declarations, and verification sign-offs.</p>
          </div>

          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search audit logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-[#18A999]"
            />
          </div>
        </div>

        <Card className="p-6 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Action Event</th>
                  <th className="py-3 px-4">Resource</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-medium">
                {filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-4 text-slate-400 font-mono text-[11px]">{log.timestamp}</td>
                    <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">{log.user}</td>
                    <td className="py-4 px-4 text-slate-600 dark:text-slate-300">{log.role}</td>
                    <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-200">{log.action}</td>
                    <td className="py-4 px-4 font-mono text-slate-500 text-[11px]">{log.resource}</td>
                    <td className="py-4 px-4 text-right">
                      <Badge variant={log.status === 'Success' ? 'success' : 'warning'}>
                        {log.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
