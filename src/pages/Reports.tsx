import React from 'react'
import { useBudget } from '../contexts/BudgetContext'
import { Download, FileText, BarChart3, PieChart } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

export default function Reports() {
  const { state } = useBudget()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const categoryBreakdown = state.categories.map(category => {
    const items = state.items.filter(item => item.category === category)
    const budget = items.reduce((sum, item) => sum + item.amount, 0)
    const actual = items.reduce((sum, item) => sum + item.actual, 0)
    const variance = actual - budget
    return {
      category,
      budget,
      actual,
      variance,
      percentage: state.totalBudget > 0 ? (budget / state.totalBudget) * 100 : 0
    }
  }).filter(item => item.budget > 0)

  const topVariances = state.items
    .filter(item => Math.abs(item.variance) > 0)
    .sort((a, b) => Math.abs(b.variance) - Math.abs(a.variance))
    .slice(0, 10)
    .map(item => ({
      name: item.description,
      variance: Math.abs(item.variance),
      isOver: item.variance > 0
    }))

  const monthlyData = state.items.reduce((acc, item) => {
    const month = new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    if (!acc[month]) {
      acc[month] = { budget: 0, actual: 0 }
    }
    acc[month].budget += item.amount
    acc[month].actual += item.actual
    return acc
  }, {} as Record<string, { budget: number; actual: number }>)

  const monthlyChartData = Object.entries(monthlyData).map(([month, data]) => ({
    month,
    budget: data.budget,
    actual: data.actual
  }))

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-2">Comprehensive budget analysis and reporting</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </button>
          <button className="btn-secondary flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Export Excel
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(state.totalBudget)}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(state.totalActual)}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <PieChart className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Variance</p>
              <p className={`text-2xl font-bold ${state.totalVariance >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                {formatCurrency(Math.abs(state.totalVariance))}
              </p>
            </div>
            <div className={`p-2 rounded-lg ${state.totalVariance >= 0 ? 'bg-red-100' : 'bg-green-100'}`}>
              <BarChart3 className={`h-6 w-6 ${state.totalVariance >= 0 ? 'text-red-600' : 'text-green-600'}`} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Utilization</p>
              <p className="text-2xl font-bold text-gray-900">
                {state.totalBudget > 0 ? Math.round((state.totalActual / state.totalBudget) * 100) : 0}%
              </p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <PieChart className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Spending */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Spending</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
                <Bar dataKey="budget" fill="#3b82f6" name="Budget" />
                <Bar dataKey="actual" fill="#10b981" name="Actual" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget by Category</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percentage }) => `${category} ${percentage.toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="budget"
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown Table */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-header">Category</th>
                  <th className="table-header">Budget</th>
                  <th className="table-header">Actual</th>
                  <th className="table-header">Variance</th>
                  <th className="table-header">%</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categoryBreakdown.map((item) => (
                  <tr key={item.category}>
                    <td className="table-cell">{item.category}</td>
                    <td className="table-cell">{formatCurrency(item.budget)}</td>
                    <td className="table-cell">{formatCurrency(item.actual)}</td>
                    <td className={`table-cell ${item.variance >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {formatCurrency(Math.abs(item.variance))}
                    </td>
                    <td className="table-cell">{item.percentage.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Variances */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Variances</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="table-header">Item</th>
                  <th className="table-header">Variance</th>
                  <th className="table-header">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topVariances.map((item, index) => (
                  <tr key={index}>
                    <td className="table-cell">{item.name}</td>
                    <td className="table-cell">{formatCurrency(item.variance)}</td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        item.isOver ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {item.isOver ? 'Over Budget' : 'Under Budget'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-8">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Recommendations</h3>
          <div className="space-y-4">
            {state.totalVariance > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-medium text-red-800 mb-2">⚠️ Budget Overrun Alert</h4>
                <p className="text-red-700">
                  Your project is currently over budget by {formatCurrency(state.totalVariance)}. 
                  Consider reviewing high-variance items and adjusting spending in remaining categories.
                </p>
              </div>
            )}
            
            {state.totalVariance < 0 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">✅ Budget Status: Good</h4>
                <p className="text-green-700">
                  Your project is under budget by {formatCurrency(Math.abs(state.totalVariance))}. 
                  You may have room for additional expenses or can allocate funds to other areas.
                </p>
              </div>
            )}

            {categoryBreakdown.filter(item => item.variance > 0).length > 0 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">📊 Category Analysis</h4>
                <p className="text-yellow-700">
                  The following categories are over budget: {
                    categoryBreakdown
                      .filter(item => item.variance > 0)
                      .map(item => item.category)
                      .join(', ')
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 