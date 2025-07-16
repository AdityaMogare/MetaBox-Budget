import React, { useState } from 'react'
import { Save, User, Building, DollarSign, Bell } from 'lucide-react'

interface ProjectSettings {
  projectName: string
  totalBudget: number
  currency: string
  startDate: string
  endDate: string
  notifications: boolean
  autoSave: boolean
}

const defaultSettings: ProjectSettings = {
  projectName: 'Feature Film Project',
  totalBudget: 2500000,
  currency: 'USD',
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  notifications: true,
  autoSave: true
}

export default function Settings() {
  const [settings, setSettings] = useState<ProjectSettings>(defaultSettings)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    alert('Settings saved successfully!')
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      setSettings(defaultSettings)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Configure your project settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Project Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Information */}
          <div className="card">
            <div className="flex items-center mb-4">
              <Building className="h-5 w-5 text-gray-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Project Information</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  value={settings.projectName}
                  onChange={(e) => setSettings({ ...settings, projectName: e.target.value })}
                  className="input-field"
                  placeholder="Enter project name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={settings.startDate}
                    onChange={(e) => setSettings({ ...settings, startDate: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={settings.endDate}
                    onChange={(e) => setSettings({ ...settings, endDate: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Budget Settings */}
          <div className="card">
            <div className="flex items-center mb-4">
              <DollarSign className="h-5 w-5 text-gray-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Budget Settings</h3>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Budget
                  </label>
                  <input
                    type="number"
                    value={settings.totalBudget}
                    onChange={(e) => setSettings({ ...settings, totalBudget: parseFloat(e.target.value) || 0 })}
                    className="input-field"
                    placeholder="0"
                    min="0"
                    step="1000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <select
                    value={settings.currency}
                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                    className="input-field"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="CAD">CAD (C$)</option>
                    <option value="AUD">AUD (A$)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Application Settings */}
          <div className="card">
            <div className="flex items-center mb-4">
              <Bell className="h-5 w-5 text-gray-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Application Settings</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                  <p className="text-sm text-gray-500">Receive notifications about budget updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Auto Save</h4>
                  <p className="text-sm text-gray-500">Automatically save changes</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoSave}
                    onChange={(e) => setSettings({ ...settings, autoSave: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Sidebar */}
        <div className="space-y-6">
          {/* Save Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
            <div className="space-y-3">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full btn-primary flex items-center justify-center"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Settings'}
              </button>
              
              <button
                onClick={handleReset}
                className="w-full btn-secondary"
              >
                Reset to Default
              </button>
            </div>
          </div>

          {/* Project Info */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Project Name:</span>
                <span className="font-medium">{settings.projectName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Budget:</span>
                <span className="font-medium">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: settings.currency,
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(settings.totalBudget)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">
                  {Math.ceil((new Date(settings.endDate).getTime() - new Date(settings.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Notifications:</span>
                <span className={`font-medium ${settings.notifications ? 'text-green-600' : 'text-red-600'}`}>
                  {settings.notifications ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h3>
            <div className="space-y-3">
              <button className="w-full btn-secondary">
                Export Budget Report
              </button>
              <button className="w-full btn-secondary">
                Export Schedule
              </button>
              <button className="w-full btn-secondary">
                Backup Project Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 