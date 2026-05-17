import { TrendingUp, TrendingDown, Package, DollarSign, Clock, AlertCircle } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const revenueData = [
  { value: 45000 },
  { value: 52000 },
  { value: 49000 },
  { value: 63000 },
  { value: 58000 },
  { value: 67000 },
  { value: 74500 },
];

export function MetricsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Total Rental Revenue */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-emerald-50 rounded-xl">
            <DollarSign className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium">
            <TrendingUp className="w-4 h-4" />
            +12.5%
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">Total Rental Revenue</p>
          <h3 className="text-3xl font-bold text-gray-900">$74,500</h3>
          <p className="text-xs text-gray-400 mt-1">This month</p>
        </div>

        <div className="h-16 -mb-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Active Rentals */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-indigo-50 rounded-xl">
            <Package className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium">
            <TrendingUp className="w-4 h-4" />
            +8.2%
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-1">Active Rentals</p>
          <h3 className="text-3xl font-bold text-gray-900">142</h3>
          <p className="text-xs text-gray-400 mt-1">Currently ongoing</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-sm text-gray-600">On Time</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">124</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Due Soon</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">13</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Late</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">5</span>
          </div>
        </div>
      </div>

      {/* Inventory Availability */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-violet-50 rounded-xl">
            <Package className="w-6 h-6 text-violet-600" />
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium">
            No Overbooking
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-1">Inventory Availability</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-gray-900">348</h3>
            <span className="text-sm text-gray-400">/ 520 items</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">67% available</p>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Available</span>
              <span className="text-sm font-semibold text-emerald-600">348</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '67%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Reserved</span>
              <span className="text-sm font-semibold text-indigo-600">172</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full" style={{ width: '33%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
