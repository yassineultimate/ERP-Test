import React, { useState } from 'react';
import { Plus, Eye, Download, Package, TrendingDown, ShoppingBag, Clock } from 'lucide-react';
import Card from '../components/Card';
import DataTable from '../components/DataTable';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Purchases: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const purchaseData = [
    { id: '1', orderNumber: 'PO-2024-001', supplier: 'Global Supplies Inc', date: '2024-01-15', amount: 5250.00, status: 'received', items: 15 },
    { id: '2', orderNumber: 'PO-2024-002', supplier: 'Premium Materials Co', date: '2024-01-14', amount: 3875.50, status: 'pending', items: 8 },
    { id: '3', orderNumber: 'PO-2024-003', supplier: 'Tech Components Ltd', date: '2024-01-13', amount: 7100.00, status: 'shipped', items: 22 },
    { id: '4', orderNumber: 'PO-2024-004', supplier: 'Office Depot Pro', date: '2024-01-12', status: 'cancelled', amount: 1650.25, items: 5 },
    { id: '5', orderNumber: 'PO-2024-005', supplier: 'Industrial Parts Co', date: '2024-01-11', amount: 4750.00, status: 'received', items: 12 }
  ];

  const monthlyPurchases = [
    { month: 'Jan', amount: 32000, orders: 45 },
    { month: 'Feb', amount: 28000, orders: 38 },
    { month: 'Mar', amount: 35000, orders: 52 },
    { month: 'Apr', amount: 41000, orders: 58 },
    { month: 'May', amount: 38000, orders: 49 },
    { month: 'Jun', amount: 45000, orders: 63 }
  ];

  const topSuppliers = [
    { name: 'Global Supplies Inc', orders: 28, amount: 145000 },
    { name: 'Premium Materials Co', orders: 22, amount: 98000 },
    { name: 'Tech Components Ltd', orders: 18, amount: 87500 },
    { name: 'Office Depot Pro', orders: 15, amount: 52000 },
    { name: 'Industrial Parts Co', orders: 12, amount: 38000 }
  ];

  const totalSpent = purchaseData.reduce((sum, purchase) => sum + purchase.amount, 0);
  const totalOrders = purchaseData.length;
  const avgOrderValue = totalSpent / totalOrders;
  const pendingOrders = purchaseData.filter(purchase => purchase.status === 'pending').length;

  const columns = [
    {
      key: 'orderNumber',
      label: 'PO Number',
      sortable: true,
      render: (value: string) => (
        <div className="font-medium text-blue-600">{value}</div>
      )
    },
    {
      key: 'supplier',
      label: 'Supplier',
      sortable: true
    },
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'items',
      label: 'Items',
      sortable: true
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (value: number) => `$${value.toFixed(2)}`
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'received' ? 'bg-green-100 text-green-800' :
          value === 'shipped' ? 'bg-blue-100 text-blue-800' :
          value === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          value === 'cancelled' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: any) => (
        <div className="flex items-center space-x-2">
          <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-1 text-green-600 hover:bg-green-50 rounded">
            <Download className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Purchase Management</h1>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>New Purchase Order</span>
          </button>
        </div>
      </div>

      {/* Purchase Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">${totalSpent.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">-3.2% vs last month</span>
              </div>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
              <div className="flex items-center mt-2">
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                <span className="text-sm text-red-600">-1.5% vs last month</span>
              </div>
            </div>
            <ShoppingBag className="w-8 h-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900">${avgOrderValue.toFixed(2)}</p>
              <div className="flex items-center mt-2">
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                <span className="text-sm text-red-600">-2.1% vs last month</span>
              </div>
            </div>
            <TrendingDown className="w-8 h-8 text-purple-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900">{pendingOrders}</p>
              <div className="flex items-center mt-2">
                <Clock className="w-4 h-4 text-yellow-500 mr-1" />
                <span className="text-sm text-yellow-600">Awaiting delivery</span>
              </div>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Purchase Trends */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Purchase Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyPurchases}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Top Suppliers */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Top Suppliers</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="pb-3 text-sm font-medium text-gray-500">Supplier</th>
                <th className="pb-3 text-sm font-medium text-gray-500">Orders</th>
                <th className="pb-3 text-sm font-medium text-gray-500">Total Amount</th>
                <th className="pb-3 text-sm font-medium text-gray-500">Share</th>
              </tr>
            </thead>
            <tbody className="space-y-2">
              {topSuppliers.map((supplier, index) => (
                <tr key={index} className="border-t border-gray-100">
                  <td className="py-3 font-medium text-gray-900">{supplier.name}</td>
                  <td className="py-3 text-gray-600">{supplier.orders}</td>
                  <td className="py-3 text-gray-600">${supplier.amount.toLocaleString()}</td>
                  <td className="py-3">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(supplier.amount / 150000) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{((supplier.amount / 150000) * 100).toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Recent Purchase Orders */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Recent Purchase Orders</h3>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All
          </button>
        </div>
        <DataTable
          data={purchaseData}
          columns={columns}
          searchable={false}
          onRowClick={(row) => console.log('View purchase order:', row)}
        />
      </Card>
    </div>
  );
};

export default Purchases;