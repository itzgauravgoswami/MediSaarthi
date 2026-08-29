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

  const filtered = logs.filter(l => {
    const action = l.action || '';
    const user = l.user || l.actorName || '';
    const resource = l.resource || l.resourceId || l.resourceType || '';
    const term = search.toLowerCase();
    return action.toLowerCase().includes(term) || user.toLowerCase().includes(term) || resource.toLowerCase().includes(term);
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Security &amp; Audit Trails</h1>
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
                {filtered.map((log, idx) => {
                  const logKey = log.id || log.auditId || log._id || `log-${idx}`;
                  const logTime = log.timestamp || (log.createdAt ? new Date(log.createdAt).toLocaleString('en-IN') : 'N/A');
                  const logUser = log.user || log.actorName || 'System';
                  const logRole = log.role || log.actorRole || 'System';
                  const logAction = log.action || 'Event';
                  const logResource = log.resource || (log.resourceType ? `${log.resourceType} (${log.resourceId || ''})` : 'N/A');
                  const logStatus = log.status || 'Success';

                  return (
                    <tr key={logKey} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-4 text-slate-400 font-mono text-[11px]">{logTime}</td>
                      <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">{logUser}</td>
                      <td className="py-4 px-4 text-slate-600 dark:text-slate-300">{logRole}</td>
                      <td className="py-4 px-4 font-semibold text-slate-800 dark:text-slate-200">{logAction}</td>
                      <td className="py-4 px-4 font-mono text-slate-500 text-[11px]">{logResource}</td>
                      <td className="py-4 px-4 text-right">
                        <Badge variant={logStatus === 'Success' ? 'success' : 'warning'}>
                          {logStatus}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
