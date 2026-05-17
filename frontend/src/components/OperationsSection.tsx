import { Calendar, AlertTriangle, TrendingUp, FileText, ArrowRight, BarChart } from 'lucide-react';

const upcomingReturns = [
  { 
    id: 1, 
    product: 'MacBook Pro 16" M3 Max', 
    customer: 'Acme Corp', 
    dueDate: 'Today, 4:00 PM', 
    status: 'due-soon',
    orderNumber: '#8821'
  },
  { 
    id: 2, 
    product: 'Canon EOS R5 Body', 
    customer: 'Smith Studios', 
    dueDate: 'Tomorrow, 10:00 AM', 
    status: 'on-time',
    orderNumber: '#8819'
  },
  { 
    id: 3, 
    product: 'DJI Mavic 3 Pro', 
    customer: 'Horizon Media', 
    dueDate: '2 days overdue', 
    status: 'late',
    orderNumber: '#8812'
  },
  { 
    id: 4, 
    product: 'Apple Pro Display XDR', 
    customer: 'Design Co', 
    dueDate: 'Feb 3, 2:00 PM', 
    status: 'on-time',
    orderNumber: '#8815'
  },
];

const mostRentedProducts = [
  { id: 1, name: 'MacBook Pro 16"', count: 89, percentage: 95 },
  { id: 2, name: 'Canon EOS R5', count: 76, percentage: 81 },
  { id: 3, name: 'Sony A7 III', count: 64, percentage: 68 },
  { id: 4, name: 'DJI Mavic 3', count: 52, percentage: 55 },
  { id: 5, name: 'iPad Pro 12.9"', count: 48, percentage: 51 },
];

export function OperationsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Upcoming Returns - Takes 2 columns */}
      <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Calendar className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Upcoming Returns</h3>
              <p className="text-sm text-gray-500">Next 7 days</p>
            </div>
          </div>
          <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
            View All
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {upcomingReturns.map((rental) => (
            <div 
              key={rental.id} 
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-gray-900">{rental.product}</p>
                  {rental.status === 'late' && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 rounded-md text-xs font-medium">
                      <AlertTriangle className="w-3 h-3" />
                      Late
                    </span>
                  )}
                  {rental.status === 'due-soon' && (
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-md text-xs font-medium">
                      Due Soon
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span>{rental.customer}</span>
                  <span>•</span>
                  <span>{rental.orderNumber}</span>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${
                  rental.status === 'late' 
                    ? 'text-red-600' 
                    : rental.status === 'due-soon' 
                    ? 'text-amber-600' 
                    : 'text-gray-600'
                }`}>
                  {rental.dueDate}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Most Rented Products */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Most Rented</h3>
              <p className="text-sm text-gray-500">This month</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {mostRentedProducts.map((product, index) => (
            <div key={product.id}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-400">#{index + 1}</span>
                  <span className="text-sm font-medium text-gray-900">{product.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{product.count}</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all" 
                  style={{ width: `${product.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Quotations */}
      <div className="lg:col-span-2 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow text-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">Pending Quotations</h3>
              <p className="text-sm text-indigo-100">Awaiting approval</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-white text-indigo-600 rounded-xl font-medium hover:bg-indigo-50 transition-colors">
            View All
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="p-4 bg-white/10 rounded-xl">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-bold">28</span>
              <span className="text-sm text-indigo-100">Draft</span>
            </div>
            <p className="text-sm text-indigo-100">Need to be sent to customers</p>
          </div>

          <div className="p-4 bg-white/10 rounded-xl">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-bold">15</span>
              <span className="text-sm text-indigo-100">Sent</span>
            </div>
            <p className="text-sm text-indigo-100">Waiting for customer response</p>
          </div>
        </div>
      </div>
    </div>
  );
}
