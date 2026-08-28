"use client";

import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, Badge } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  PackageCheck, 
  Plus, 
  Search, 
  AlertTriangle, 
  Calendar, 
  TrendingUp, 
  Pill, 
  RefreshCw, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  X, 
  Filter,
  Boxes,
  ShieldAlert
} from 'lucide-react';

export default function MedicationInventoryPage() {
  const [inventory, setInventory] = useState([
    {
      id: "MED-001",
      name: "Metformin 500mg",
      brand: "Glycomet",
      category: "Antidiabetic",
      batch: "MT-2026A",
      expiry: "Dec 2027",
      quantity: 450,
      unit: "Strips",
      price: 45.00,
      reorderPoint: 100,
      status: "In Stock"
    },
    {
      id: "MED-002",
      name: "Paracetamol 650mg",
      brand: "Dolo 650",
      category: "Analgesics & Antipyretics",
      batch: "PCM-9912",
      expiry: "Aug 2027",
      quantity: 820,
      unit: "Strips",
      price: 32.00,
      reorderPoint: 150,
      status: "In Stock"
    },
    {
      id: "MED-003",
      name: "Azithromycin 500mg",
      brand: "Azee 500",
      category: "Antibiotics",
      batch: "AZ-4410",
      expiry: "Oct 2026",
      quantity: 15,
      unit: "Boxes",
      price: 115.00,
      reorderPoint: 30,
      status: "Low Stock"
    },
    {
      id: "MED-004",
      name: "Amlodipine 5mg",
      brand: "Stamlo 5",
      category: "Cardiovascular",
      batch: "AM-8812B",
      expiry: "Mar 2028",
      quantity: 310,
      unit: "Strips",
      price: 28.00,
      reorderPoint: 80,
      status: "In Stock"
    },
    {
      id: "MED-005",
      name: "Pantoprazole 40mg",
      brand: "Pan 40",
      category: "Gastrointestinal",
      batch: "PAN-9011",
      expiry: "Nov 2026",
      quantity: 18,
      unit: "Strips",
      price: 78.00,
      reorderPoint: 40,
      status: "Low Stock"
    },
    {
      id: "MED-006",
      name: "Insulin Glargine 100IU/ml",
      brand: "Lantus SoloStar",
      category: "Endocrinology",
      batch: "INS-1102",
      expiry: "Sep 2026",
      quantity: 4,
      unit: "Vials",
      price: 450.00,
      reorderPoint: 10,
      status: "Critical"
    },
    {
      id: "MED-007",
      name: "Aceclofenac + Paracetamol",
      brand: "Zerodol-P",
      category: "Analgesics & Antipyretics",
      batch: "ACE-3312",
      expiry: "Jan 2028",
      quantity: 600,
      unit: "Strips",
      price: 55.00,
      reorderPoint: 100,
      status: "In Stock"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Form State for new medication batch
  const [newMed, setNewMed] = useState({
    name: '',
    brand: '',
    category: 'Antibiotics',
    batch: '',
    expiry: '',
    quantity: '',
    unit: 'Strips',
    price: '',
    reorderPoint: '50'
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRestock = (id, amount = 100) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + amount;
        let newStatus = 'In Stock';
        if (newQty <= item.reorderPoint / 2) newStatus = 'Critical';
        else if (newQty <= item.reorderPoint) newStatus = 'Low Stock';
        return { ...item, quantity: newQty, status: newStatus };
      }
      return item;
    }));
    showToast(`Stock replenished successfully (+${amount} units)!`);
  };

  const handleAddMedication = (e) => {
    e.preventDefault();
    if (!newMed.name || !newMed.batch || !newMed.quantity) return;

    const qty = parseInt(newMed.quantity, 10);
    const reorder = parseInt(newMed.reorderPoint, 10);
    let status = 'In Stock';
    if (qty <= reorder / 2) status = 'Critical';
    else if (qty <= reorder) status = 'Low Stock';

    const createdItem = {
      id: `MED-00${inventory.length + 1}`,
      name: newMed.name,
      brand: newMed.brand || newMed.name,
      category: newMed.category,
      batch: newMed.batch.toUpperCase(),
      expiry: newMed.expiry || 'Dec 2027',
      quantity: qty,
      unit: newMed.unit,
      price: parseFloat(newMed.price) || 50.00,
      reorderPoint: reorder,
      status: status
    };

    setInventory([createdItem, ...inventory]);
    setIsAddModalOpen(false);
    showToast(`New stock batch ${createdItem.batch} added to inventory!`);
    setNewMed({
      name: '',
      brand: '',
      category: 'Antibiotics',
      batch: '',
      expiry: '',
      quantity: '',
      unit: 'Strips',
      price: '',
      reorderPoint: '50'
    });
  };

  // Categories list
  const categories = ['All', 'Antidiabetic', 'Analgesics & Antipyretics', 'Antibiotics', 'Cardiovascular', 'Gastrointestinal', 'Endocrinology'];

  // Filtered List
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.brand.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.batch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const lowStockCount = inventory.filter(i => i.status === 'Low Stock' || i.status === 'Critical').length;
  const criticalCount = inventory.filter(i => i.status === 'Critical').length;
  const totalStockUnits = inventory.reduce((acc, curr) => acc + curr.quantity, 0);
  const totalValuation = inventory.reduce((acc, curr) => acc + (curr.quantity * curr.price), 0);

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Toast */}
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-xs font-bold">{toastMessage}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-black border border-slate-200 dark:border-[#27272a] p-4 sm:p-5 rounded-2xl shadow-md relative overflow-hidden">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#18A999]">CENTRAL PHARMACY INVENTORY</span>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white font-newsreader flex items-center gap-2">
              Medication & Drug Stock Registry
            </h1>
            <p className="text-xs text-slate-500 dark:text-[#a1a1aa]">
              Real-time batch tracking, expiration monitoring, and automated restock alerts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="primary" icon={Plus} onClick={() => setIsAddModalOpen(true)}>
              Add New Stock Batch
            </Button>
          </div>
        </div>

        {/* KPI Summaries */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          <Card className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Items in Stock</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white font-newsreader">{totalStockUnits.toLocaleString()}</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#0F4C5C]/20 text-[#18A999] border border-[#18A999]/30">
              <Boxes className="w-6 h-6" />
            </div>
          </Card>

          <Card className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Low / Critical Alerts</span>
              <span className="text-2xl font-black text-amber-500 font-newsreader">{lowStockCount}</span>
            </div>
            <div className="p-3 rounded-2xl bg-amber-950/40 text-amber-400 border border-amber-900/50">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </Card>

          <Card className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Critical Stockout Risk</span>
              <span className="text-2xl font-black text-rose-500 font-newsreader">{criticalCount}</span>
            </div>
            <div className="p-3 rounded-2xl bg-rose-950/40 text-rose-400 border border-rose-900/50">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </Card>

          <Card className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Est. Stock Valuation</span>
              <span className="text-2xl font-black text-emerald-400 font-newsreader">₹{totalValuation.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-950/40 text-emerald-400 border border-emerald-900/50">
              <TrendingUp className="w-6 h-6" />
            </div>
          </Card>
        </div>

        {/* Filters and Inventory List */}
        <Card className="p-4 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Category Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter className="w-4 h-4 text-[#18A999]" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-100 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] rounded-xl text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-[#18A999]"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-1.5 text-xs bg-slate-100 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] rounded-xl text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-[#18A999]"
              >
                <option value="All">All Stock Levels</option>
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search drug name, brand, or batch #..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-black border border-slate-200 dark:border-[#27272a] rounded-full text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#18A999]"
              />
            </div>
          </div>

          {/* Inventory Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-[#27272a] text-[10px] font-bold text-[#18A999] uppercase tracking-wider">
                  <th className="py-3 px-3">Medication Name & Brand</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Batch & Expiry</th>
                  <th className="py-3 px-3">Quantity & Unit</th>
                  <th className="py-3 px-3">Unit Cost</th>
                  <th className="py-3 px-3">Stock Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1f1f23] text-xs font-medium">
                {filteredInventory.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-[#111111] transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 dark:text-white text-sm font-newsreader">{item.name}</div>
                      <div className="text-[10px] text-slate-400">Brand: {item.brand} • <span className="font-mono">{item.id}</span></div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-[#1a1a1a] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#27272a]">
                        {item.category}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-mono text-xs font-bold text-slate-900 dark:text-white">{item.batch}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" /> Exp: {item.expiry}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-black text-slate-900 dark:text-white">{item.quantity}</span>
                        <span className="text-[10px] text-slate-400">{item.unit}</span>
                      </div>
                      <div className="w-24 h-1.5 bg-slate-200 dark:bg-[#27272a] rounded-full overflow-hidden mt-1">
                        <div 
                          className={`h-full rounded-full ${
                            item.status === 'Critical' ? 'bg-rose-500' : item.status === 'Low Stock' ? 'bg-amber-500' : 'bg-emerald-500'
                          }`} 
                          style={{ width: `${Math.min(100, (item.quantity / (item.reorderPoint * 3)) * 100)}%` }}
                        />
                      </div>
                    </td>

                    <td className="py-3 px-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                      ₹{item.price.toFixed(2)}
                    </td>

                    <td className="py-3 px-3">
                      <Badge 
                        variant={
                          item.status === 'Critical' ? 'danger' : item.status === 'Low Stock' ? 'warning' : 'success'
                        }
                      >
                        {item.status}
                      </Badge>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          icon={RefreshCw}
                          onClick={() => handleRestock(item.id, 100)}
                          title="Quick Restock (+100)"
                        >
                          +100 Restock
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Add New Stock Batch Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-black border border-slate-200 dark:border-[#27272a] max-w-xl w-full rounded-3xl p-6 space-y-5 shadow-2xl relative">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-100 dark:hover:bg-[#27272a]"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#0F4C5C]/20 text-[#18A999] border border-[#18A999]/30">
                  <Plus className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white font-newsreader">
                    Register New Stock Batch
                  </h2>
                  <p className="text-xs text-slate-400">
                    Add new medicine delivery to inventory registry.
                  </p>
                </div>
              </div>

              <form onSubmit={handleAddMedication} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Medication Name *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Amoxicillin 500mg" 
                      value={newMed.name}
                      onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] rounded-xl text-xs text-white focus:outline-none focus:border-[#18A999]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Brand Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Mox 500" 
                      value={newMed.brand}
                      onChange={(e) => setNewMed({ ...newMed, brand: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] rounded-xl text-xs text-white focus:outline-none focus:border-[#18A999]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
                    <select
                      value={newMed.category}
                      onChange={(e) => setNewMed({ ...newMed, category: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] rounded-xl text-xs text-white focus:outline-none focus:border-[#18A999]"
                    >
                      {categories.filter(c => c !== 'All').map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Batch Number *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. AMX-9982" 
                      value={newMed.batch}
                      onChange={(e) => setNewMed({ ...newMed, batch: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] rounded-xl text-xs text-white uppercase font-mono focus:outline-none focus:border-[#18A999]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Quantity *</label>
                    <input 
                      type="number" 
                      required
                      placeholder="500" 
                      value={newMed.quantity}
                      onChange={(e) => setNewMed({ ...newMed, quantity: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] rounded-xl text-xs text-white focus:outline-none focus:border-[#18A999]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Unit</label>
                    <select
                      value={newMed.unit}
                      onChange={(e) => setNewMed({ ...newMed, unit: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] rounded-xl text-xs text-white focus:outline-none focus:border-[#18A999]"
                    >
                      <option value="Strips">Strips</option>
                      <option value="Boxes">Boxes</option>
                      <option value="Vials">Vials</option>
                      <option value="Bottles">Bottles</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Unit Price (₹)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      placeholder="45.00" 
                      value={newMed.price}
                      onChange={(e) => setNewMed({ ...newMed, price: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#27272a] rounded-xl text-xs text-white focus:outline-none focus:border-[#18A999]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <Button type="button" variant="secondary" onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" icon={CheckCircle2}>
                    Save Stock Batch
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
