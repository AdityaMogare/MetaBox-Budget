import React, { useState } from 'react'
import { Calendar, Clock, MapPin, Users } from 'lucide-react'

interface ScheduleItem {
  id: string
  title: string
  date: string
  time: string
  location: string
  crew: string[]
  notes: string
  status: 'planned' | 'in-progress' | 'completed'
}

const mockScheduleItems: ScheduleItem[] = [
  {
    id: '1',
    title: 'Principal Photography - Day 1',
    date: '2024-03-15',
    time: '08:00',
    location: 'Studio A',
    crew: ['Director', 'DP', 'Camera Op', 'Sound Mixer'],
    notes: 'First day of principal photography. All equipment checked.',
    status: 'planned'
  },
  {
    id: '2',
    title: 'Location Scouting',
    date: '2024-03-10',
    time: '10:00',
    location: 'Downtown Area',
    crew: ['Location Manager', 'DP', 'Producer'],
    notes: 'Scouting for exterior shots',
    status: 'completed'
  },
  {
    id: '3',
    title: 'Casting Call',
    date: '2024-03-05',
    time: '14:00',
    location: 'Casting Office',
    crew: ['Casting Director', 'Director', 'Producer'],
    notes: 'Final casting decisions',
    status: 'completed'
  }
]

export default function Schedule() {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>(mockScheduleItems)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState<Partial<ScheduleItem>>({
    title: '',
    date: '',
    time: '',
    location: '',
    crew: [],
    notes: '',
    status: 'planned'
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.date) {
      alert('Please fill in required fields')
      return
    }

    const newItem: ScheduleItem = {
      id: Date.now().toString(),
      title: formData.title!,
      date: formData.date!,
      time: formData.time || '',
      location: formData.location || '',
      crew: formData.crew || [],
      notes: formData.notes || '',
      status: formData.status || 'planned'
    }

    setScheduleItems([...scheduleItems, newItem])
    setFormData({
      title: '',
      date: '',
      time: '',
      location: '',
      crew: [],
      notes: '',
      status: 'planned'
    })
    setIsAdding(false)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Production Schedule</h1>
          <p className="text-gray-600 mt-2">Manage your production timeline</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="btn-primary flex items-center"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Add Event
        </button>
      </div>

      {/* Add Event Form */}
      {isAdding && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Schedule Event</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field"
                  placeholder="Enter event title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="input-field"
                  placeholder="Enter location"
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
                onClick={() => setIsAdding(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Add Event
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Schedule Timeline */}
      <div className="space-y-6">
        {scheduleItems
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .map((item) => (
            <div key={item.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(item.date).toLocaleDateString()}
                    </div>
                    
                    {item.time && (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {item.time}
                      </div>
                    )}
                    
                    {item.location && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {item.location}
                      </div>
                    )}
                  </div>
                  
                  {item.crew.length > 0 && (
                    <div className="mt-3">
                      <div className="flex items-center mb-1">
                        <Users className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Crew:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {item.crew.map((member, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                          >
                            {member}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {item.notes && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600">{item.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
} 