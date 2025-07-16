import React, { useState } from 'react'
import { useBudget, BudgetItem } from '../contexts/BudgetContext'
import { Plus, Edit, Trash2, Save, X } from 'lucide-react'

export default function Budget() {
  const { state, dispatch } = useBudget()
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<BudgetItem>>({
    category: '',
    subcategory: '',
    description: '',
    amount: 0,
    actual: 0,
    notes: '',
    date: new Date().toISOString().split('T')[0]
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.category || !formData.subcategory || !formData.description) {
      alert('Please fill in all required fields')
      return
    }

    const newItem: BudgetItem = {
      id: editingId || Date.now().toString(),
      category: formData.category!,
      subcategory: formData.subcategory!,
      description: formData.description!,
      amount: formData.amount || 0,
      actual: formData.actual || 0,
      variance: (formData.actual || 0) - (formData.amount || 0),
      notes: formData.notes || '',
      date: formData.date || new Date().toISOString().split('T')[0]
    }

    if (editingId) {
      dispatch({ type: 'UPDATE_ITEM', payload: newItem })
      setEditingId(null)
    } else {
      dispatch({ type: 'ADD_ITEM', payload: newItem })
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      category: '',
      subcategory: '',
      description: '',
      amount: 0,
      actual: 0,
      notes: '',
      date: new Date().toISOString().split('T')[0]
    })
    setIsAdding(false)
  }

  const handleEdit = (item: BudgetItem) => {
    setEditingId(item.id)
    setFormData(item)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      dispatch({ type: 'DELETE_ITEM', payload: id })
    }
  }

  const handleCancel = () => {
    resetForm()
    setEditingId(null)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Budget Management</h1>
          <p className="text-gray-600 mt-2">Manage your movie budget items</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </button>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="card mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingId ? 'Edit Budget Item' : 'Add Budget Item'}
            </h3>
            <button
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Select Category</option>
                  {state.categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subcategory *
                </label>
                <select
                  value={formData.subcategory}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Select Subcategory</option>
                  {formData.category && state.subcategories[formData.category]?.map(subcategory => (
                    <option key={subcategory} value={subcategory}>{subcategory}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field"
                placeholder="Enter description"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget Amount
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  className="input-field"
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Actual Amount
                </label>
                <input
                  type="number"
                  value={formData.actual}
                  onChange={(e) => setFormData({ ...formData, actual: parseFloat(e.target.value) || 0 })}
                  className="input-field"
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="input-field"
                rows={3}
                placeholder="Additional notes..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                {editingId ? 'Update' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Budget Table */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Items</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Category</th>
                <th className="table-header">Subcategory</th>
                <th className="table-header">Description</th>
                <th className="table-header">Budget</th>
                <th className="table-header">Actual</th>
                <th className="table-header">Variance</th>
                <th className="table-header">Date</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {state.items.map((item) => (
                <tr key={item.id}>
                  <td className="table-cell">{item.category}</td>
                  <td className="table-cell">{item.subcategory}</td>
                  <td className="table-cell">{item.description}</td>
                  <td className="table-cell">{formatCurrency(item.amount)}</td>
                  <td className="table-cell">{formatCurrency(item.actual)}</td>
                  <td className={`table-cell ${item.variance >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {formatCurrency(Math.abs(item.variance))}
                  </td>
                  <td className="table-cell">{item.date}</td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 