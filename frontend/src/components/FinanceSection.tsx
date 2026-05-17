import { Receipt, CreditCard, CheckCircle, Clock, Package, ShoppingBag, RotateCcw } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const invoiceData = [
  { name: 'Paid', value: 68, color: '#10b981' },
  { name: 'Pending', value: 24, color: '#f59e0b' },
  { name: 'Overdue', value: 8, color: '#ef4444' },
];

const workflowData = [
  { 
    status: 'Picked Up', 
    count: 89, 
    icon: ShoppingBag, 
    color: 'indigo',
    description: 'Equipment collected'
  },
  { 
    status: 'With Customer', 
    count: 142, 
    icon: Package, 
    color: 'violet',
    description: 'Currently in use'
  },
  { 
    status: 'Returned', 
    count: 67, 
    icon: RotateCcw, 
    color: 'emerald',
    description: 'Today'
  },
];

export function FinanceSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Invoices & Payments - Takes 2 columns */}
      <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Receipt className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Invoices & Payments</h3>
              <p className="text-sm text-gray-500">This month overview</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Chart */}
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={invoiceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {invoiceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">100</span>
                <span className="text-sm text-gray-500">Total</span>
              </div>
            </div>
          </div>

          {/* Legend and Stats */}
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-3">
              {invoiceData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Amount</span>
                <span className="text-lg font-bold text-gray-900">$74,500</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Security Deposits</span>
                <span className="text-sm font-semibold text-indigo-600">$12,400</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Partial Payments</span>
                <span className="text-sm font-semibold text-amber-600">8 pending</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pickup & Return Status */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Package className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Workflow Status</h3>
            <p className="text-sm text-gray-500">Real-time tracking</p>
          </div>
        </div>

        <div className="space-y-4">
          {workflowData.map((item) => {
            const Icon = item.icon;
            const colorClasses = {
              indigo: 'bg-indigo-50 text-indigo-600',
              violet: 'bg-violet-50 text-violet-600',
              emerald: 'bg-emerald-50 text-emerald-600',
            }[item.color];

            return (
              <div 
                key={item.status} 
                className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${colorClasses}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.status}</p>
                      <p className="text-xs text-gray-500">{item.description}</p>
                    </div>
                  </div>
                  <span className="text-xl font-bold text-gray-900">{item.count}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Conversion Rate</span>
            <span className="font-semibold text-emerald-600">94.2%</span>
          </div>
          <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={{ width: '94.2%' }}></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Quote → Rental completion rate</p>
        </div>
      </div>
    </div>
  );
}
