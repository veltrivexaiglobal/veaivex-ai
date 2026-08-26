import React, { useState } from 'react';
import { CustomerOrder, ProductItem, BusinessProfile } from '../../types';
import { formatCurrency } from '../../lib/biEngine';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Receipt,
  CheckCircle2,
  Search,
  Filter,
  CreditCard,
  Banknote,
  Smartphone,
  Tag,
  Printer,
  X,
  Package,
  User,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PosOrdersViewProps {
  products: ProductItem[];
  orders: CustomerOrder[];
  profile: BusinessProfile;
  onAddOrder: (newOrder: CustomerOrder) => void;
  onNavigate: (view: string) => void;
}

export const PosOrdersView: React.FC<PosOrdersViewProps> = ({
  products,
  orders,
  profile,
  onAddOrder,
  onNavigate,
}) => {
  const curr = profile.currency;
  const [activeTab, setActiveTab] = useState<'checkout' | 'history'>('checkout');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Cart State
  const [cart, setCart] = useState<{ product: ProductItem; quantity: number }[]>([]);
  const [customerName, setCustomerName] = useState<string>('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Bank Transfer' | 'POS Card' | 'Credit'>('Cash');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [activeReceiptOrder, setActiveReceiptOrder] = useState<CustomerOrder | null>(null);

  // Derive categories
  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  // Filtered products
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Cart calculations
  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.product.unitPrice * item.quantity,
    0
  );
  const cartTotalCost = cart.reduce(
    (sum, item) => sum + item.product.unitCost * item.quantity,
    0
  );
  const cartTotal = Math.max(0, cartSubtotal - discountAmount);
  const cartProfit = Math.max(0, cartTotal - cartTotalCost);

  const handleAddToCart = (product: ProductItem) => {
    if (product.currentStock <= 0) return;
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.currentStock) return prev;
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            if (newQty > item.product.currentStock) return item;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(Boolean) as { product: ProductItem; quantity: number }[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
    setDiscountAmount(0);
  };

  const handleCompleteOrder = () => {
    if (cart.length === 0) return;

    const newOrder: CustomerOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `VX-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString().split('T')[0],
      customerId: `cust-${Date.now()}`,
      customerName: customerName.trim() || 'Walk-in Customer',
      customerPhone: customerPhone.trim() || undefined,
      items: cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: item.product.unitPrice,
        unitCost: item.product.unitCost,
        subtotal: item.product.unitPrice * item.quantity,
        imageUrl: item.product.imageUrl,
      })),
      subtotal: cartSubtotal,
      discount: discountAmount,
      tax: 0,
      total: cartTotal,
      totalCost: cartTotalCost,
      netProfit: cartProfit,
      paymentMethod,
      status: 'completed',
      cashierName: profile.ownerName || 'Admin',
      notes: `Quick POS checkout (${paymentMethod})`,
    };

    onAddOrder(newOrder);
    setActiveReceiptOrder(newOrder);
    handleClearCart();

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 },
    });
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Point of Sale &amp; Customer Orders
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live Checkout &amp; Receipts
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Fast counter sales, product catalog with high-res photos, instant payment reconciliation &amp; digital receipts.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveTab('checkout')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'checkout'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <ShoppingCart className="w-3.5 h-3.5" />
              New Order &amp; POS
            </span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'history'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5" />
              Orders History ({orders.length})
            </span>
          </button>
        </div>
      </div>

      {activeTab === 'checkout' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left / Center: Product Catalog & Selector (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Search & Category Pills */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search products by name or SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-slate-900 text-white font-bold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredProducts.map((product) => {
                const inCart = cart.find((item) => item.product.id === product.id);
                const isOutOfStock = product.currentStock <= 0;

                return (
                  <div
                    key={product.id}
                    onClick={() => !isOutOfStock && handleAddToCart(product)}
                    className={`bg-white border rounded-2xl p-3 flex flex-col justify-between transition-all cursor-pointer group ${
                      inCart
                        ? 'border-blue-500 ring-2 ring-blue-100 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
                    } ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {/* Product Image */}
                    <div className="relative w-full aspect-4/3 rounded-xl overflow-hidden bg-slate-100 mb-2.5">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <Package className="w-8 h-8" />
                        </div>
                      )}
                      <span className="absolute top-1.5 right-1.5 px-2 py-0.5 bg-slate-900/80 backdrop-blur-xs text-[10px] font-bold text-white rounded-md">
                        {product.currentStock} in stock
                      </span>
                    </div>

                    {/* Product Details */}
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                        {product.category}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-tight mt-0.5">
                        {product.name}
                      </h4>
                      {product.description && (
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {product.description}
                        </p>
                      )}
                    </div>

                    {/* Price & Action */}
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-sm font-extrabold text-blue-600">
                        {formatCurrency(product.unitPrice, curr)}
                      </span>
                      <button
                        type="button"
                        disabled={isOutOfStock}
                        className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                          inCart
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-600'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Active Order / POS Cart Desk (5 cols) */}
          <div className="lg:col-span-5 space-y-4 sticky top-6">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
              {/* Cart Header */}
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-extrabold">Active Order Register</span>
                </div>
                {cart.length > 0 && (
                  <button
                    onClick={handleClearCart}
                    className="text-xs text-rose-300 hover:text-rose-200 font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Customer Info Form */}
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 space-y-2.5">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Customer Name
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Walk-in Customer / Business Name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Customer Phone / WhatsApp (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="+234 800 000 0000"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Cart Items List */}
              <div className="p-4 max-h-72 overflow-y-auto divide-y divide-slate-100">
                {cart.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 space-y-2">
                    <ShoppingCart className="w-8 h-8 mx-auto stroke-1 text-slate-300" />
                    <p className="text-xs">No items in the order yet.</p>
                    <p className="text-[11px] text-slate-400">Click any product on the left catalog to add to cart.</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.product.id} className="py-2.5 flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h5 className="text-xs font-bold text-slate-900 truncate">
                          {item.product.name}
                        </h5>
                        <span className="text-[11px] text-slate-500">
                          {formatCurrency(item.product.unitPrice, curr)} × {item.quantity} ={' '}
                          <strong className="text-slate-800">
                            {formatCurrency(item.product.unitPrice * item.quantity, curr)}
                          </strong>
                        </span>
                      </div>

                      {/* Quantity Modifier Buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleUpdateQuantity(item.product.id, -1)}
                          className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-5 text-center text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.product.id, 1)}
                          className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleRemoveFromCart(item.product.id)}
                          className="p-1 text-rose-500 hover:text-rose-700 ml-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Payment Method Selector */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-2.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'Cash', label: 'Cash', icon: Banknote },
                    { id: 'Bank Transfer', label: 'Transfer', icon: Smartphone },
                    { id: 'POS Card', label: 'POS Card', icon: CreditCard },
                    { id: 'Credit', label: 'Postpaid Credit', icon: Tag },
                  ].map((m) => {
                    const Icon = m.icon;
                    const isSelected = paymentMethod === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Financial Totals & Checkout Button */}
              <div className="p-4 border-t border-slate-200 space-y-2 bg-white">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold">{formatCurrency(cartSubtotal, curr)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Discount ({curr}):</span>
                  <input
                    type="number"
                    min="0"
                    value={discountAmount || ''}
                    onChange={(e) => setDiscountAmount(Number(e.target.value) || 0)}
                    placeholder="0"
                    className="w-24 text-right px-2 py-0.5 border border-slate-200 rounded text-xs focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-between text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg">
                  <span>Estimated Net Profit on Sale:</span>
                  <span>+{formatCurrency(cartProfit, curr)}</span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 pt-1 border-t border-slate-100">
                  <span>Total Due:</span>
                  <span className="text-blue-600">{formatCurrency(cartTotal, curr)}</span>
                </div>

                <button
                  type="button"
                  disabled={cart.length === 0}
                  onClick={handleCompleteOrder}
                  className="w-full mt-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xs transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Complete Sale &amp; Print Receipt</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Orders History Table */
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recorded Customer Orders</h3>
              <p className="text-xs text-slate-500">Every order automatically settles stock and updates daily net margins.</p>
            </div>
            <div className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg">
              Total Order Volume:{' '}
              {formatCurrency(
                orders.reduce((sum, o) => sum + o.total, 0),
                curr
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-3">Order ID</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Items</th>
                  <th className="py-3 px-3">Payment</th>
                  <th className="py-3 px-3">Total Amount</th>
                  <th className="py-3 px-3">Net Profit</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3 px-3 text-slate-600">{ord.date}</td>
                    <td className="py-3 px-3 font-medium text-slate-900">
                      <div>{ord.customerName}</div>
                      {ord.customerPhone && (
                        <div className="text-[10px] text-slate-400">{ord.customerPhone}</div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      <span className="font-semibold">{ord.items.length} items</span> (
                      {ord.items.reduce((s, i) => s + i.quantity, 0)} units)
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                        {ord.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-black text-slate-900">
                      {formatCurrency(ord.total, curr)}
                    </td>
                    <td className="py-3 px-3 font-bold text-emerald-600">
                      +{formatCurrency(ord.netProfit, curr)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setActiveReceiptOrder(ord)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Digital Receipt Modal */}
      {activeReceiptOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setActiveReceiptOrder(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Receipt Header */}
            <div className="text-center border-b border-dashed border-slate-300 pb-4">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-2 font-black text-xl">
                VX
              </div>
              <h2 className="text-lg font-black text-slate-900">{profile.name}</h2>
              <p className="text-xs text-slate-500">{profile.location}</p>
              <div className="mt-2 inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                OFFICIAL SALES RECEIPT
              </div>
            </div>

            {/* Receipt Info */}
            <div className="text-xs space-y-1 text-slate-600 border-b border-dashed border-slate-300 pb-3 font-mono">
              <div className="flex justify-between">
                <span>Receipt #:</span>
                <span className="font-bold text-slate-900">{activeReceiptOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Date &amp; Time:</span>
                <span>{activeReceiptOrder.date}</span>
              </div>
              <div className="flex justify-between">
                <span>Customer:</span>
                <span className="font-bold text-slate-900">{activeReceiptOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="font-bold">{activeReceiptOrder.paymentMethod}</span>
              </div>
            </div>

            {/* Itemized Breakdown */}
            <div className="space-y-2 border-b border-dashed border-slate-300 pb-4">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex justify-between">
                <span>Item &amp; Qty</span>
                <span>Subtotal</span>
              </div>
              {activeReceiptOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs text-slate-800">
                  <div className="truncate max-w-[200px]">
                    <span className="font-bold">{item.productName}</span>
                    <div className="text-[10px] text-slate-500">
                      {formatCurrency(item.unitPrice, curr)} × {item.quantity}
                    </div>
                  </div>
                  <span className="font-bold">{formatCurrency(item.subtotal, curr)}</span>
                </div>
              ))}
            </div>

            {/* Receipt Totals */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal:</span>
                <span>{formatCurrency(activeReceiptOrder.subtotal, curr)}</span>
              </div>
              {activeReceiptOrder.discount > 0 && (
                <div className="flex justify-between text-rose-600 font-bold">
                  <span>Discount:</span>
                  <span>-{formatCurrency(activeReceiptOrder.discount, curr)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>TOTAL PAID:</span>
                <span className="text-blue-600">{formatCurrency(activeReceiptOrder.total, curr)}</span>
              </div>
            </div>

            {/* Receipt Footer Action */}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Digital Receipt</span>
              </button>
              <button
                onClick={() => setActiveReceiptOrder(null)}
                className="w-full py-2 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-semibold text-center"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
