import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getVendorInvoices } from '../../slices/invoiceSlice';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  FiFileText,
  FiSearch,
  FiEye,
  FiDownload,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiDollarSign,
  FiUser,
  FiCalendar,
  FiRefreshCw,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiTrendingUp,
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
  AreaChart,
  Area,
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
  draft: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', color: '#6b7280', icon: FiFileText },
  sent: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', color: '#3b82f6', icon: FiFileText },
  paid: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', color: '#22c55e', icon: FiCheckCircle },
  partial: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', color: '#f59e0b', icon: FiClock },
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', color: '#f59e0b', icon: FiClock },
  overdue: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', color: '#ef4444', icon: FiAlertCircle },
  cancelled: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', color: '#dc2626', icon: FiX },
};

const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || statusConfig.draft;
  const Icon = config.icon;
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
      <Icon className="w-3 h-3" />
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

            {/* Customer Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <FiUser className="w-4 h-4" />
                <span className="text-sm font-medium">Customer</span>
              </div>
              <p className="font-semibold text-gray-900">{invoice.customer?.name || 'N/A'}</p>
              <p className="text-sm text-gray-500">{invoice.customer?.email}</p>
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
                  <span className="text-gray-600">Amount Received</span>
                  <span className="text-green-600">₹{invoice.amounts?.amountPaid?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Amount Pending</span>
                  <span className={invoice.amounts?.amountDue > 0 ? 'text-red-600 font-medium' : 'text-gray-900'}>
                    ₹{invoice.amounts?.amountDue?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Due Date */}
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
const VendorInvoices = () => {
  const dispatch = useDispatch();
  const { invoices: storeInvoices, isLoading } = useSelector((state) => state.invoices);
  
  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch invoices
  useEffect(() => {
    dispatch(getVendorInvoices());
  }, [dispatch]);

  // Get invoices array
  const invoices = useMemo(() => {
    const data = storeInvoices?.data || storeInvoices || [];
    return Array.isArray(data) ? data : [];
  }, [storeInvoices]);

  // Filter invoices by search term and status
  const filteredInvoices = useMemo(() => {
    let filtered = invoices;
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(inv => 
        inv.invoiceNumber?.toLowerCase().includes(term) ||
        inv.customer?.name?.toLowerCase().includes(term) ||
        inv.customer?.email?.toLowerCase().includes(term)
      );
    }
    
    if (statusFilter) {
      filtered = filtered.filter(inv => inv.status === statusFilter);
    }
    
    return filtered;
  }, [invoices, searchTerm, statusFilter]);

  // Pagination
  const paginatedInvoices = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredInvoices.slice(start, start + itemsPerPage);
  }, [filteredInvoices, currentPage]);

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

  // Calculate stats
  const stats = useMemo(() => {
    const totalAmount = invoices.reduce((sum, inv) => sum + (inv.amounts?.total || 0), 0);
    const receivedAmount = invoices.reduce((sum, inv) => sum + (inv.amounts?.amountPaid || 0), 0);
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

    // Monthly revenue
    const monthlyData = {};
    invoices.forEach(inv => {
      const month = new Date(inv.createdAt).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      if (!monthlyData[month]) {
        monthlyData[month] = { total: 0, paid: 0 };
      }
      monthlyData[month].total += (inv.amounts?.total || 0);
      if (inv.status === 'paid') {
        monthlyData[month].paid += (inv.amounts?.total || 0);
      }
    });
    const revenueData = Object.entries(monthlyData).slice(-6).map(([month, data]) => ({
      month,
      total: data.total,
      paid: data.paid
    }));

    return { 
      total: invoices.length, 
      totalAmount, 
      receivedAmount, 
      pendingAmount,
      paid: statusCounts.paid || 0,
      pending: (statusCounts.sent || 0) + (statusCounts.pending || 0) + (statusCounts.draft || 0),
      overdue: statusCounts.overdue || 0,
      statusData,
      revenueData
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
    
    // Customer
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Bill To:', 120, 55);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(invoice.customer?.name || 'Customer', 120, 63);
    doc.text(invoice.customer?.email || '', 120, 70);
    
    // Items table
    const tableData = invoice.items?.map(item => [
      item.description || 'Item',
      item.quantity?.toString() || '1',
      `₹${(item.unitPrice || 0).toFixed(2)}`,
      `₹${(item.totalPrice || 0).toFixed(2)}`
    ]) || [];
    
    autoTable(doc, {
      startY: 85,
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
    const finalY = doc.lastAutoTable?.finalY || 125;
    
    doc.setFontSize(9);
    doc.text('Subtotal:', 130, finalY + 15);
    doc.text(`₹${(invoice.amounts?.subtotal || 0).toFixed(2)}`, 190, finalY + 15, { align: 'right' });
    
    doc.text('Tax:', 130, finalY + 22);
    doc.text(`₹${(invoice.amounts?.tax || 0).toFixed(2)}`, 190, finalY + 22, { align: 'right' });
    
    doc.setDrawColor(200, 200, 200);
    doc.line(130, finalY + 28, 190, finalY + 28);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Total:', 130, finalY + 36);
    doc.text(`₹${(invoice.amounts?.total || 0).toFixed(2)}`, 190, finalY + 36, { align: 'right' });
    
    doc.save(`${invoice.invoiceNumber || 'invoice'}.pdf`);
  };

  // Download all invoices as CSV
  const downloadCSV = () => {
    const headers = ['Invoice Number', 'Date', 'Customer', 'Email', 'Status', 'Subtotal', 'Tax', 'Total', 'Received', 'Pending'];
    const rows = filteredInvoices.map(inv => [
      inv.invoiceNumber,
      new Date(inv.createdAt).toLocaleDateString(),
      inv.customer?.name || 'N/A',
      inv.customer?.email || 'N/A',
      inv.status,
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
    link.download = `vendor_invoices_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Invoices</h1>
          <p className="text-gray-600 mt-1">Manage and track your customer invoices</p>
        </div>
        <button
          onClick={() => dispatch(getVendorInvoices())}
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
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats.totalAmount.toFixed(2)}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <FiTrendingUp className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Received</p>
              <p className="text-2xl font-bold text-green-600">₹{stats.receivedAmount.toFixed(2)}</p>
              <p className="text-xs text-gray-500">{stats.paid} paid invoices</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <FiCheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
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
              No invoices yet
            </div>
          )}
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Monthly Revenue</h3>
          {stats.revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 11 }} stroke="#9ca3af" tickFormatter={(v) => `₹${v}`} />
                <Tooltip formatter={(v) => [`₹${v.toFixed(2)}`, '']} />
                <Legend />
                <Bar dataKey="total" name="Total Invoiced" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="paid" name="Paid" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400">
              No revenue data
            </div>
          )}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by invoice number or customer..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
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
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} />)
              ) : paginatedInvoices.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-500">
                    <FiFileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="font-medium">No invoices found</p>
                    <p className="text-sm">Invoices from your sales will appear here</p>
                  </td>
                </tr>
              ) : (
                paginatedInvoices.map((invoice) => (
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
      {!isLoading && filteredInvoices.length > itemsPerPage && (
        <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredInvoices.length)}</span> of{' '}
            <span className="font-medium">{filteredInvoices.length}</span> invoices
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => p - 1)}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            <span className="px-4 py-2 text-sm font-medium text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage === totalPages}
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

export default VendorInvoices;
