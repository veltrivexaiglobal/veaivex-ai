import React, { useState } from 'react';
import { ProductItem, BusinessProfile, BusinessMetrics } from '../../types';
import { formatCurrency } from '../../lib/biEngine';
import {
  Package,
  AlertTriangle,
  Sparkles,
  TrendingDown,
  Clock,
  ShoppingCart,
  CheckCircle2,
  AlertOctagon,
  Search,
  Zap,
  Plus,
  Image as ImageIcon,
  Edit2,
  Trash2,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface InventoryIntelligenceViewProps {
  products: ProductItem[];
  profile: BusinessProfile;
  metrics: BusinessMetrics;
  onNavigate: (view: string) => void;
  onAddProduct?: (newProduct: ProductItem) => void;
}

export const InventoryIntelligenceView: React.FC<InventoryIntelligenceViewProps> = ({
  products,
  profile,
  metrics,
  onNavigate,
  onAddProduct,
}) => {
  const curr = profile.currency;
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [reorderedIds, setReorderedIds] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Product Form State
  const [newProductName, setNewProductName] = useState('');
  const [newSku, setNewSku] = useState('');
  const [newCategory, setNewCategory] = useState('Groceries & Grains');
  const [newUnitPrice, setNewUnitPrice] = useState(5000);
  const [newUnitCost, setNewUnitCost] = useState(3800);
  const [newStock, setNewStock] = useState(30);
  const [newMinThreshold, setNewMinThreshold] = useState(15);
  const [newDescription, setNewDescription] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  const criticalProducts = products.filter((p) => p.stockStatus === 'critical');
  const lowProducts = products.filter((p) => p.stockStatus === 'low');
  const excessProducts = products.filter((p) => p.stockStatus === 'excess');

  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ? true : p.stockStatus === statusFilter;
    const matchesCat =
      categoryFilter === 'all' ? true : p.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCat;
  });

  const handleSimulateReorder = (productId: string) => {
    if (!reorderedIds.includes(productId)) {
      setReorderedIds([...reorderedIds, productId]);
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    const marginPct =
      newUnitPrice > 0
        ? Math.round(((newUnitPrice - newUnitCost) / newUnitPrice) * 1000) / 10
        : 0;

    const newProd: ProductItem = {
      id: `prod-${Date.now()}`,
      name: newProductName.trim(),
      sku: newSku.trim() || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      category: newCategory,
      description: newDescription.trim() || undefined,
      imageUrl:
        newImageUrl.trim() ||
        'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&auto=format&fit=crop&q=80',
      unitPrice: Number(newUnitPrice) || 0,
      unitCost: Number(newUnitCost) || 0,
      marginPct,
      currentStock: Number(newStock) || 0,
      minThreshold: Number(newMinThreshold) || 10,
      reorderQuantity: (Number(newMinThreshold) || 10) * 2,
      avgWeeklySales: 15,
      daysOfStockRemaining:
        newStock > 0 ? Math.round((newStock / (15 / 7)) * 10) / 10 : 0,
      stockStatus:
        newStock <= (Number(newMinThreshold) || 10) / 2
          ? 'critical'
          : newStock <= (Number(newMinThreshold) || 10)
          ? 'low'
          : 'optimal',
      supplierLeadDays: 3,
      supplierName: 'Direct Hub Supplier',
      lastRestockDate: new Date().toISOString().split('T')[0],
    };

    if (onAddProduct) {
      onAddProduct(newProd);
    }
    setIsAddModalOpen(false);
    // Reset form
    setNewProductName('');
    setNewSku('');
    setNewDescription('');
    setNewImageUrl('');

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Product &amp; Inventory Catalog
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
              {criticalProducts.length} Items Critical
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Product catalog with high-resolution imagery, SKU management, stockout burn forecasting &amp; instant restock purchase orders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
          <button
            onClick={() => onNavigate('pos-orders')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xs"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Open POS Desk</span>
          </button>
        </div>
      </div>

      {/* Stock Health KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Inventory Health Score */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Health Score
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {metrics.inventoryHealthScore}/100
            </span>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
              Needs Attention
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            3 items require emergency reordering
          </p>
        </div>

        {/* Critical Stock */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Stockout Imminent (&lt;5 Days)
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-rose-600">
              {criticalProducts.length} Items
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Risking ₦2.4M in potential lost sales
          </p>
        </div>

        {/* Low Stock */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Low Stock (5–14 Days)
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-600">
              {lowProducts.length} Items
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Schedule standard supplier orders
          </p>
        </div>

        {/* Excess / Dead Stock */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Excess Stock (&gt;60 Days)
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-purple-600">
              {excessProducts.length} Items
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Sluggish capital tied up in inventory
          </p>
        </div>
      </div>

      {/* Critical Stockout Urgency Card */}
      {criticalProducts.length > 0 && (
        <div className="bg-rose-950 text-white rounded-2xl p-5 border border-rose-900 shadow-md">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-rose-800">
            <AlertOctagon className="w-5 h-5 text-rose-400 animate-pulse" />
            <h3 className="text-sm font-bold tracking-tight text-white uppercase">
              Priority Purchase Orders Required Within 24–48 Hours
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            {criticalProducts.map((p) => {
              const isDone = reorderedIds.includes(p.id);
              return (
                <div
                  key={p.id}
                  className="bg-black/30 border border-rose-500/30 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    {p.imageUrl && (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-lg object-cover bg-slate-800"
                      />
                    )}
                    <div>
                      <span className="font-bold text-rose-200 block text-sm">{p.name}</span>
                      <span className="text-slate-300 block mt-0.5">
                        Current Stock: <strong className="text-white">{p.currentStock} units</strong> (Runout in:{' '}
                        <strong className="text-rose-300">{p.daysOfStockRemaining.toFixed(1)} days</strong>)
                      </span>
                      <span className="text-[11px] text-emerald-300 font-medium block mt-0.5">
                        Suggested Reorder: {p.reorderQuantity} units (Cost:{' '}
                        {formatCurrency(p.reorderQuantity * p.unitCost, curr)})
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSimulateReorder(p.id)}
                    disabled={isDone}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                      isDone
                        ? 'bg-emerald-500 text-white'
                        : 'bg-rose-600 hover:bg-rose-500 text-white shadow-xs'
                    }`}
                  >
                    {isDone ? 'PO Issued!' : 'Create PO'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Product Catalog & Master List */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Product Stock Master List
            </h3>
            <p className="text-xs text-slate-500">
              Showing {filteredProducts.length} inventory catalog items
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search SKU or item name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'all' ? 'All Categories' : c}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="critical">Critical (&lt;5d)</option>
              <option value="low">Low (5-14d)</option>
              <option value="optimal">Optimal</option>
              <option value="excess">Excess / Sluggish</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-2.5 px-3">Product / Image</th>
                <th className="py-2.5 px-3">Category &amp; SKU</th>
                <th className="py-2.5 px-3">Current Stock</th>
                <th className="py-2.5 px-3">Days Left</th>
                <th className="py-2.5 px-3">Unit Price &amp; Margin</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Reorder Qty</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredProducts.map((p) => (
                <tr
                  key={p.id}
                  className={`hover:bg-slate-50 transition-colors ${
                    p.stockStatus === 'critical' ? 'bg-rose-50/40' : ''
                  }`}
                >
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-3">
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                          <Package className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <span className="font-bold text-slate-900 block">{p.name}</span>
                        {p.description && (
                          <span className="text-[10px] text-slate-400 line-clamp-1">
                            {p.description}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-semibold text-slate-700 block">{p.category}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{p.sku}</span>
                  </td>
                  <td className="py-2.5 px-3 font-bold text-slate-800">
                    {p.currentStock} units
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`font-black ${
                        p.daysOfStockRemaining < 5
                          ? 'text-rose-600'
                          : p.daysOfStockRemaining < 14
                          ? 'text-amber-600'
                          : 'text-slate-800'
                      }`}
                    >
                      {p.daysOfStockRemaining.toFixed(1)} days
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-slate-900 block">
                      {formatCurrency(p.unitPrice, curr)}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold">
                      {p.marginPct.toFixed(1)}% margin (Cost: {formatCurrency(p.unitCost, curr)})
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    {p.stockStatus === 'critical' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                        Critical
                      </span>
                    ) : p.stockStatus === 'low' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        Low
                      </span>
                    ) : p.stockStatus === 'excess' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                        Excess
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        Optimal
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => handleSimulateReorder(p.id)}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors inline-flex items-center gap-1"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      <span>+{p.reorderQuantity}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-extrabold text-slate-900">Add New Product to Catalog</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Premium Golden Sunflower Oil 5L"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">SKU / Barcode Code</label>
                  <input
                    type="text"
                    placeholder="e.g., SUN-5L-01"
                    value={newSku}
                    onChange={(e) => setNewSku(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Groceries & Grains">Groceries & Grains</option>
                    <option value="Cooking Oils">Cooking Oils</option>
                    <option value="Beverages & Breakfast">Beverages & Breakfast</option>
                    <option value="Household & Laundry">Household & Laundry</option>
                    <option value="Pasta & Noodles">Pasta & Noodles</option>
                    <option value="Electronics & Gadgets">Electronics & Gadgets</option>
                    <option value="General Merchandise">General Merchandise</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Selling Price ({curr}) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newUnitPrice}
                    onChange={(e) => setNewUnitPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unit Cost Price ({curr}) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={newUnitCost}
                    onChange={(e) => setNewUnitCost(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Initial Stock (Units)</label>
                  <input
                    type="number"
                    min="0"
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Min Threshold Alert</label>
                  <input
                    type="number"
                    min="1"
                    value={newMinThreshold}
                    onChange={(e) => setNewMinThreshold(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Description</label>
                <input
                  type="text"
                  placeholder="Brief item description or size/pack details..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-xs"
                >
                  Save Product to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
