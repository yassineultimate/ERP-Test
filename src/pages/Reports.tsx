import React, { useState } from 'react';
import { Download, Filter, Calendar, BarChart3, PieChart, TrendingUp, FileText } from 'lucide-react';
import Card from '../components/Card';
import { BarChart, Bar, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Reports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState('financial');
  const [dateRange, setDateRange] = useState('month');

  const financialData = [
    { month: 'Jan', revenue: 85000, expenses: 42500, profit: 42500 },
    { month: 'Feb', revenue: 92000, expenses: 45000, profit: 47000 },
    { month: 'Mar', revenue: 88000, expenses: 43000, profit: 45000 },
    { month: 'Apr', revenue: 95000, expenses: 48000, profit: 47000 },
    { month: 'May', revenue: 89000, expenses: 44500, profit: 44500 },
    { month: 'Jun', revenue: 98000, expenses: 49000, profit: 49000 }
  ];

  const salesData = [
    { month: 'Jan', sales: 45000, orders: 120, customers: 85 },
    { month: 'Feb', sales: 52000, orders: 135, customers: 92 },
    { month: 'Mar', sales: 48000, orders: 128, customers: 88 },
    { month: 'Apr', sales: 61000, orders: 155, customers: 105 },
    { month: 'May', sales: 55000, orders: 142, customers: 98 },
    { month: 'Jun', sales: 67000, orders: 168, customers: 112 }
  ];

  const inventoryData = [
    { category: 'Electronics', value: 125000, items: 45 },
    { category: 'Furniture', value: 85000, items: 32 },
    { category: 'Accessories', value: 35000, items: 78 },
    { category: 'Office Supplies', value: 25000, items: 156 },
    { category: 'Industrial', value: 65000, items: 28 }
  ];

  const hrData = [
    { department: 'Engineering', employees: 12, avgSalary: 85000 },
    { department: 'Sales', employees: 8, avgSalary: 65000 },
    { department: 'Marketing', employees: 5, avgSalary: 70000 },
    { department: 'HR', employees: 3, avgSalary: 60000 },
    { department: 'Finance', employees: 4, avgSalary: 75000 }
  ];

  const categoryColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const reportTypes = [
    { id: 'financial', name: 'Financial Reports', icon: BarChart3, description: 'Revenue, expenses, and profit analysis' },
    { id: 'sales', name: 'Sales Reports', icon: TrendingUp, description: 'Sales performance and customer metrics' },
    { id: 'inventory', name: 'Inventory Reports', icon: PieChart, description: 'Stock levels and inventory valuation' },
    { id: 'hr', name: 'HR Reports', icon: FileText, description: 'Employee statistics and payroll data' }
  ];

  const renderFinancialReports = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue vs Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={financialData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#10B981" name="Revenue" />
              <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Profit Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={financialData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="profit" stroke="#3B82F6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="pb-3 text-sm font-medium text-gray-500">Month</th>
                <th className="pb-3 text-sm font-medium text-gray-500">Revenue</th>
                <th className="pb-3 text-sm font-medium text-gray-500">Expenses</th>
                <th className="pb-3 text-sm font-medium text-gray-500">Profit</th>
                <th className="pb-3 text-sm font-medium text-gray-500">Margin</th>
              </tr>
            </thead>
            <tbody>
              {financialData.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 font-medium text-gray-900">{item.month}</td>
                  <td className="py-3 text-gray-600">${item.revenue.toLocaleString()}</td>
                  <td className="py-3 text-gray-600">${item.expenses.toLocaleString()}</td>
                  <td className="py-3 text-green-600 font-medium">${item.profit.toLocaleString()}</td>
                  <td className="py-3 text-gray-600">{((item.profit / item.revenue) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderSalesReports = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Sales Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#3B82F6" strokeWidth={3} name="Sales" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Orders & Customers</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#10B981" name="Orders" />
              <Bar dataKey="customers" fill="#F59E0B" name="Customers" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Sales Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">${salesData.reduce((sum, item) => sum + item.sales, 0).toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total Sales</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">{salesData.reduce((sum, item) => sum + item.orders, 0)}</p>
            <p className="text-sm text-gray-500">Total Orders</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">${(salesData.reduce((sum, item) => sum + item.sales, 0) / salesData.reduce((sum, item) => sum + item.orders, 0)).toFixed(2)}</p>
            <p className="text-sm text-gray-500">Avg Order Value</p>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderInventoryReports = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Inventory by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={inventoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {inventoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={categoryColors[index % categoryColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {inventoryData.map((item, index) => (
              <div key={item.category} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: categoryColors[index % categoryColors.length] }}
                />
                <span className="text-sm text-gray-600">{item.category}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Inventory Value</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={inventoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Inventory Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="pb-3 text-sm font-medium text-gray-500">Category</th>
                <th className="pb-3 text-sm font-medium text-gray-500">Items</th>
                <th className="pb-3 text-sm font-medium text-gray-500">Value</th>
                <th className="pb-3 text-sm font-medium text-gray-500">Avg Value/Item</th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 font-medium text-gray-900">{item.category}</td>
                  <td className="py-3 text-gray-600">{item.items}</td>
                  <td className="py-3 text-gray-600">${item.value.toLocaleString()}</td>
                  <td className="py-3 text-gray-600">${(item.value / item.items).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderHRReports = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Employees by Department</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hrData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="employees" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Average Salary by Department</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hrData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgSalary" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">HR Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{hrData.reduce((sum, item) => sum + item.employees, 0)}</p>
            <p className="text-sm text-gray-500">Total Employees</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">${(hrData.reduce((sum, item) => sum + (item.avgSalary * item.employees), 0) / hrData.reduce((sum, item) => sum + item.employees, 0)).toLocaleString()}</p>
            <p className="text-sm text-gray-500">Company Avg Salary</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">${hrData.reduce((sum, item) => sum + (item.avgSalary * item.employees), 0).toLocaleString()}</p>
            <p className="text-sm text-gray-500">Total Payroll</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="pb-3 text-sm font-medium text-gray-500">Department</th>
                <th className="pb-3 text-sm font-medium text-gray-500">Employees</th>
                <th className="pb-3 text-sm font-medium text-gray-500">Avg Salary</th>
                <th className="pb-3 text-sm font-medium text-gray-500">Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {hrData.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 font-medium text-gray-900">{item.department}</td>
                  <td className="py-3 text-gray-600">{item.employees}</td>
                  <td className="py-3 text-gray-600">${item.avgSalary.toLocaleString()}</td>
                  <td className="py-3 text-gray-600">${(item.avgSalary * item.employees).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderReportContent = () => {
    switch (selectedReport) {
      case 'financial': return renderFinancialReports();
      case 'sales': return renderSalesReports();
      case 'inventory': return renderInventoryReports();
      case 'hr': return renderHRReports();
      default: return renderFinancialReports();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <div className="flex items-center space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Report Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTypes.map((report) => (
          <Card
            key={report.id}
            className={`p-4 cursor-pointer transition-all duration-200 ${
              selectedReport === report.id 
                ? 'ring-2 ring-blue-500 bg-blue-50' 
                : 'hover:shadow-md'
            }`}
            onClick={() => setSelectedReport(report.id)}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                selectedReport === report.id ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <report.icon className={`w-5 h-5 ${
                  selectedReport === report.id ? 'text-blue-600' : 'text-gray-600'
                }`} />
              </div>
              <div>
                <h3 className={`font-medium ${
                  selectedReport === report.id ? 'text-blue-900' : 'text-gray-900'
                }`}>
                  {report.name}
                </h3>
                <p className="text-sm text-gray-500">{report.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Report Content */}
      {renderReportContent()}
    </div>
  );
};

export default Reports;