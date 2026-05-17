import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllInvoices } from '../../slices/invoiceSlice';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  FiFileText,
  FiSearch,
  FiFilter,
  FiEye,
  FiDownload,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiDollarSign,
  FiUser,
  FiCalendar,
  FiPackage,
  FiRefreshCw,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiPrinter,
} from 'react-icons/fi';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

// ============================================
// SKELETON LOADERS
// ============================================
const SkeletonBox = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

const TableRowSkeleton = () => (
  <tr className="border-b border-gray-100">
    <td className="py-4 px-4"><SkeletonBox className="h-4 w-24" /></td>
    <td className="py-4 px-4"><SkeletonBox className="h-4 w-32" /></td>
    <td className="py-4 px-4"><SkeletonBox className="h-4 w-28" /></td>
    <td className="py-4 px-4"><SkeletonBox className="h-4 w-20" /></td>
    <td className="py-4 px-4"><SkeletonBox className="h-6 w-16 rounded-full" /></td>
    <td className="py-4 px-4"><SkeletonBox className="h-4 w-16" /></td>
    <td className="py-4 px-4"><SkeletonBox className="h-8 w-24" /></td>
  </tr>
);

// ============================================
// STATUS CONFIGURATION
// ============================================
const statusConfig = {
  draft: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', color: '#6b7280' },
  sent: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', color: '#3b82f6' },
  paid: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', color: '#22c55e' },
  partial: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', color: '#f59e0b' },
  overdue: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', color: '#ef4444' },
  cancelled: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', color: '#dc2626' },
};

const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || statusConfig.draft;
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
      {label}
    </span>
  );
};

// ============================================
// INVOICE DETAIL MODAL
// ============================================
const InvoiceDetailModal = ({ invoice, onClose, onDownload }) => {
  if (!invoice) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="relative inline-block w-full max-w-2xl p-6 my-8 text-left align-middle bg-white rounded-xl shadow-xl transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Invoice Details</h3>
              <p className="text-sm text-gray-500">{invoice.invoiceNumber}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onDownload(invoice)}
                className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
                title="Download PDF"
              >
                <FiDownload className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Status & Dates */}
            <div className="flex items-center justify-between">
              <StatusBadge status={invoice.status} />
              <div className="text-right">
                <p className="text-xs text-gray-500">Created</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(invoice.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Customer & Vendor */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <FiUser className="w-4 h-4" />
                  <span className="text-sm font-medium">Customer</span>
                </div>
                <p className="font-semibold text-gray-900">{invoice.customer?.name || 'N/A'}</p>
                <p className="text-sm text-gray-500">{invoice.customer?.email}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <FiPackage className="w-4 h-4" />
                  <span className="text-sm font-medium">Vendor</span>
                </div>
                <p className="font-semibold text-gray-900">
                  {invoice.vendor?.vendorInfo?.businessName || invoice.vendor?.name || 'N/A'}
                </p>
              </div>
            </div>

            {/* Invoice Items */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Invoice Items</h4>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-2 px-3 text-xs font-semibold text-gray-600">Description</th>
                      <th className="text-center py-2 px-3 text-xs font-semibold text-gray-600">Qty</th>
                      <th className="text-right py-2 px-3 text-xs font-semibold text-gray-600">Unit Price</th>
                      <th className="text-right py-2 px-3 text-xs font-semibold text-gray-600">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {invoice.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-3 text-sm text-gray-900">{item.description}</td>
                        <td className="py-2 px-3 text-sm text-gray-900 text-center">{item.quantity}</td>
                        <td className="py-2 px-3 text-sm text-gray-900 text-right">₹{item.unitPrice?.toFixed(2)}</td>
                        <td className="py-2 px-3 text-sm font-medium text-gray-900 text-right">₹{item.totalPrice?.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Amount Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Payment Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">₹{invoice.amounts?.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">₹{invoice.amounts?.tax?.toFixed(2)}</span>
                </div>
                {invoice.amounts?.securityDeposit > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Security Deposit</span>
                    <span className="text-gray-900">₹{invoice.amounts?.securityDeposit?.toFixed(2)}</span>
                  </div>
                )}
                {invoice.amounts?.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600">-₹{invoice.amounts?.discount?.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-semibold pt-2 border-t border-gray-200">
                  <span className="text-gray-900">Total</span>
                  <span className="text-indigo-600">₹{invoice.amounts?.total?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm pt-2">
                  <span className="text-gray-600">Amount Paid</span>
                  <span className="text-green-600">₹{invoice.amounts?.amountPaid?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Amount Due</span>
                  <span className={invoice.amounts?.amountDue > 0 ? 'text-red-600 font-medium' : 'text-gray-900'}>
                    ₹{invoice.amounts?.amountDue?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Due Date & Payment Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <FiCalendar className="w-4 h-4" />
                  <span className="text-sm font-medium">Due Date</span>
                </div>
                <p className="font-medium text-gray-900">
                  {new Date(invoice.dueDate).toLocaleDateString()}
                </p>
              </div>
              {invoice.paidDate && (
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <FiCheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Paid Date</span>
                  </div>
                  <p className="font-medium text-green-600">
                    {new Date(invoice.paidDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const InvoicesManagement = () => {
  const dispatch = useDispatch();
  const { invoices, pagination, isLoading } = useSelector((state) => state.invoices);
  
  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch invoices
  const fetchInvoices = (page = 1) => {
    const params = { page, limit: 20 };
    if (statusFilter) params.status = statusFilter;
    dispatch(getAllInvoices(params));
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchInvoices(1);
  }, [statusFilter]);

  // Filter invoices by search term and type
  const filteredInvoices = useMemo(() => {
    let filtered = invoices;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(inv => 
        inv.invoiceNumber?.toLowerCase().includes(term) ||
        inv.customer?.name?.toLowerCase().includes(term) ||
        inv.customer?.email?.toLowerCase().includes(term) ||
        inv.vendor?.name?.toLowerCase().includes(term) ||
        inv.vendor?.vendorInfo?.businessName?.toLowerCase().includes(term)
      );
    }
    
    if (typeFilter) {
      filtered = filtered.filter(inv => inv.invoiceType === typeFilter);
    }
    
    return filtered;
  }, [invoices, searchTerm, typeFilter]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalAmount = invoices.reduce((sum, inv) => sum + (inv.amounts?.total || 0), 0);
    const paidAmount = invoices.reduce((sum, inv) => sum + (inv.amounts?.amountPaid || 0), 0);
    const pendingAmount = invoices.reduce((sum, inv) => sum + (inv.amounts?.amountDue || 0), 0);
    
    const statusCounts = {};
    invoices.forEach(inv => {
      statusCounts[inv.status] = (statusCounts[inv.status] || 0) + 1;
    });
    
    const statusData = Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      color: statusConfig[status]?.color || '#6b7280',
    }));

    // Group by vendor for chart
    const vendorRevenue = {};
    invoices.forEach(inv => {
      const vendorName = inv.vendor?.vendorInfo?.businessName || inv.vendor?.name || 'Unknown';
      vendorRevenue[vendorName] = (vendorRevenue[vendorName] || 0) + (inv.amounts?.total || 0);
    });
    const vendorData = Object.entries(vendorRevenue)
      .map(([name, revenue]) => ({ name: name.substring(0, 15), revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return { 
      total: invoices.length, 
      totalAmount, 
      paidAmount, 
      pendingAmount,
      paid: statusCounts.paid || 0,
      pending: (statusCounts.sent || 0) + (statusCounts.draft || 0),
      overdue: statusCounts.overdue || 0,
      statusData,
      vendorData
    };
  }, [invoices]);

  // Generate PDF for invoice
  const generatePDF = (invoice) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(31, 41, 55);
    doc.rect(0, 0, 210, 45, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', 20, 25);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(invoice.invoiceNumber || 'N/A', 20, 35);
    
    // Status badge
    const statusText = invoice.status?.toUpperCase() || 'DRAFT';
    doc.setFillColor(invoice.status === 'paid' ? 34 : 245, invoice.status === 'paid' ? 197 : 158, invoice.status === 'paid' ? 94 : 11);
    doc.roundedRect(150, 15, 40, 12, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text(statusText, 170, 23, { align: 'center' });
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Dates
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    doc.text('Issue Date:', 20, 55);
    doc.text('Due Date:', 20, 62);
    doc.setTextColor(0, 0, 0);
    doc.text(new Date(invoice.createdAt).toLocaleDateString(), 50, 55);
    doc.text(new Date(invoice.dueDate).toLocaleDateString(), 50, 62);
    
    // Customer & Vendor
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Bill To:', 20, 80);
    doc.text('From:', 120, 80);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(invoice.customer?.name || 'Customer', 20, 88);
    doc.text(invoice.customer?.email || '', 20, 95);
    
    doc.text(invoice.vendor?.vendorInfo?.businessName || invoice.vendor?.name || 'Vendor', 120, 88);
    
    // Items table
    const tableData = invoice.items?.map(item => [
      item.description || 'Item',
      item.quantity?.toString() || '1',
      `₹${(item.unitPrice || 0).toFixed(2)}`,
      `₹${(item.totalPrice || 0).toFixed(2)}`
    ]) || [];
    
    autoTable(doc, {
      startY: 110,
      head: [['Description', 'Qty', 'Unit Price', 'Total']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [79, 70, 229], textColor: 255 },
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 25, halign: 'center' },
        2: { cellWidth: 35, halign: 'right' },
        3: { cellWidth: 35, halign: 'right' }
      }
    });
    
    // Summary
    const finalY = doc.lastAutoTable?.finalY || 150;
    
    doc.setFontSize(9);
    doc.text('Subtotal:', 130, finalY + 15);
    doc.text(`₹${(invoice.amounts?.subtotal || 0).toFixed(2)}`, 190, finalY + 15, { align: 'right' });
    
    doc.text('Tax:', 130, finalY + 22);
    doc.text(`₹${(invoice.amounts?.tax || 0).toFixed(2)}`, 190, finalY + 22, { align: 'right' });
    
    if (invoice.amounts?.securityDeposit > 0) {
      doc.text('Security Deposit:', 130, finalY + 29);
      doc.text(`₹${invoice.amounts.securityDeposit.toFixed(2)}`, 190, finalY + 29, { align: 'right' });
    }
    
    doc.setDrawColor(200, 200, 200);
    doc.line(130, finalY + 35, 190, finalY + 35);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Total:', 130, finalY + 43);
    doc.text(`₹${(invoice.amounts?.total || 0).toFixed(2)}`, 190, finalY + 43, { align: 'right' });
    
    doc.save(`${invoice.invoiceNumber || 'invoice'}.pdf`);
  };

  // Download all invoices as CSV
  const downloadCSV = () => {
    const headers = ['Invoice Number', 'Date', 'Customer', 'Vendor', 'Status', 'Type', 'Subtotal', 'Tax', 'Total', 'Paid', 'Due'];
    const rows = filteredInvoices.map(inv => [
      inv.invoiceNumber,
      new Date(inv.createdAt).toLocaleDateString(),
      inv.customer?.name || 'N/A',
      inv.vendor?.vendorInfo?.businessName || inv.vendor?.name || 'N/A',
      inv.status,
      inv.invoiceType || 'vendor',
      inv.amounts?.subtotal?.toFixed(2) || '0.00',
      inv.amounts?.tax?.toFixed(2) || '0.00',
      inv.amounts?.total?.toFixed(2) || '0.00',
      inv.amounts?.amountPaid?.toFixed(2) || '0.00',
      inv.amounts?.amountDue?.toFixed(2) || '0.00'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `invoices_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices Management</h1>
          <p className="text-gray-600 mt-1">View and manage all vendor invoices</p>
        </div>
        <button
          onClick={() => fetchInvoices(currentPage)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <FiRefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <FiFileText className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats.totalAmount.toFixed(2)}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <FiDollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Paid</p>
              <p className="text-2xl font-bold text-green-600">₹{stats.paidAmount.toFixed(2)}</p>
              <p className="text-xs text-gray-500">{stats.paid} invoices</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <FiCheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending/Due</p>
              <p className="text-2xl font-bold text-amber-600">₹{stats.pendingAmount.toFixed(2)}</p>
              <p className="text-xs text-gray-500">{stats.overdue} overdue</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <FiClock className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Invoice Status Distribution</h3>
          {stats.statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={stats.statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {stats.statusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400">
              No data available
            </div>
          )}
        </div>

        {/* Revenue by Vendor */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Top Vendors by Invoice Amount</h3>
          {stats.vendorData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.vendorData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="#9ca3af" tickFormatter={(v) => `₹${v}`} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} stroke="#9ca3af" width={100} />
                <Tooltip formatter={(v) => [`₹${v.toFixed(2)}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* Filters & Search & Download */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by invoice number, customer, or vendor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="partial">Partial</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Types</option>
            <option value="vendor">Vendor Invoices</option>
            <option value="customer">Customer Invoices</option>
          </select>

          {/* Download Button */}
          <button
            onClick={downloadCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <FiDownload className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Invoice</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Vendor</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} />)
              ) : filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-gray-500">
                    <FiFileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="font-medium">No invoices found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice) => (
                  <tr key={invoice._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900 text-sm">{invoice.invoiceNumber}</p>
                      <p className="text-xs text-gray-500">{invoice.items?.length || 0} item(s)</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900 text-sm">{invoice.customer?.name || 'N/A'}</p>
                      <p className="text-xs text-gray-500">{invoice.customer?.email}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-900 text-sm">
                        {invoice.vendor?.vendorInfo?.businessName || invoice.vendor?.name || 'N/A'}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-900">
                        {new Date(invoice.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        Due: {new Date(invoice.dueDate).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge status={invoice.status} />
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        invoice.invoiceType === 'customer' 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'bg-purple-50 text-purple-700'
                      }`}>
                        {invoice.invoiceType === 'customer' ? 'Customer' : 'Vendor'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <p className="font-semibold text-gray-900">₹{invoice.amounts?.total?.toFixed(2) || '0.00'}</p>
                      {invoice.amounts?.amountDue > 0 && (
                        <p className="text-xs text-red-500">Due: ₹{invoice.amounts.amountDue.toFixed(2)}</p>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedInvoice(invoice)}
                          className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => generatePDF(invoice)}
                          className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Download PDF"
                        >
                          <FiDownload className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!isLoading && filteredInvoices.length > 0 && pagination?.pages > 1 && (
        <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">{(currentPage - 1) * 20 + 1}</span> to{' '}
            <span className="font-medium">{Math.min(currentPage * 20, pagination.total)}</span> of{' '}
            <span className="font-medium">{pagination.total}</span> invoices
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchInvoices(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-4 py-2 text-sm font-medium text-gray-700">
              Page {currentPage} of {pagination.pages}
            </span>
            <button
              onClick={() => fetchInvoices(currentPage + 1)}
              disabled={currentPage === pagination.pages}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <InvoiceDetailModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          onDownload={generatePDF}
        />
      )}
    </div>
  );
};

export default InvoicesManagement;
