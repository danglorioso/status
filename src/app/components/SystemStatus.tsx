'use client'

import { useState } from 'react'
import StatusCard from './StatusCard'

type Status = 'online' | 'offline' | 'loading' | 'coming-soon'

interface Project {
  key: string
  name: string
  url: string
  favicon?: string // Optional
  comingSoon?: boolean // Optional, default false
}

interface SystemStatusProps {
  projects: Project[]
  setLastUpdated: (time: Date) => void
}

export default function SystemStatus({ projects, setLastUpdated }: SystemStatusProps) {
  const [projectStatuses, setProjectStatuses] = useState<Record<string, Status>>({})

  // Calculate overall system status
  const getOverallStatus = () => {
    const activeProjects = projects.filter(p => !p.comingSoon)
    const activeStatuses = activeProjects.map(p => projectStatuses[p.key]).filter(Boolean)
    
    if (activeStatuses.length === 0 || activeStatuses.length < activeProjects.length) {
      return { 
        loading: true,
        message: 'Checking Systems...',
        color: 'text-blue-400',
        dotColor: 'bg-blue-400 animate-pulse'
      }
    }
    
    const offlineCount = activeStatuses.filter(status => status === 'offline').length
    const loadingCount = activeStatuses.filter(status => status === 'loading').length
    
    if (offlineCount === 0 && loadingCount === 0) {
      // Everything is online
      return {
        loading: false,
        isOperational: true,
        message: 'All Systems Operational',
        color: 'text-green-400',
        dotColor: 'bg-green-400'
      }
    } else if (loadingCount === 0) {
      // Some systems are offline
      const unavailableCount = offlineCount
      return {
        loading: false,
        isOperational: false,
        message: `${unavailableCount} System${unavailableCount > 1 ? 's' : ''} Unavailable`,
        color: 'text-orange-400',
        dotColor: 'bg-orange-400'
      }
    } else {
      // Still loading
      return {
        loading: false,
        isOperational: false,
        message: 'Checking Systems...',
        color: 'text-blue-400',
        dotColor: 'bg-blue-400 animate-pulse'
      }
    }
  }

  const handleStatusUpdate = (projectKey: string, status: Status) => {
    setProjectStatuses(prev => ({
      ...prev,
      [projectKey]: status
    }))
  }

  const overallStatus = getOverallStatus()

  return (
    <>
      {/* Header */}
      <div className="text-center mb-6">
        <img src="/monogram.svg" alt="DG" className="mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-white mb-6">System Status</h1>
        {overallStatus.loading ? (
          <div className={`flex items-center justify-center gap-2 ${overallStatus.color}`}>
            <div className="relative w-2 h-2 mr-1 flex items-center justify-center">
              <div className={`absolute inset-0 ${overallStatus.dotColor} rounded-full animate-pulse opacity-75`}></div>
              <div className={`absolute inset-0 ${overallStatus.dotColor} rounded-full animate-ping opacity-75`}></div>
            </div>
            <span className="text-sm font-medium">{overallStatus.message}</span>
          </div>
        ) : (
          <div className={`flex items-center justify-center gap-2 ${overallStatus.color}`}>
            <div className="relative w-2 h-2 mr-1 flex items-center justify-center">
              <div className={`absolute inset-0 ${overallStatus.dotColor} rounded-full animate-pulse opacity-75`}></div>
              <div className={`absolute inset-0 ${overallStatus.dotColor} rounded-full animate-ping opacity-75`}></div>
            </div>
            <span className="text-sm font-medium">{overallStatus.message}</span>
          </div>
        )}
      </div>

      {/* Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 mt-7 gap-0 border-2 border-gray-700 rounded-lg overflow-hidden bg-gray-800/50 backdrop-blur-sm">
        {projects.map((proj, index) => (
          <StatusCard 
            key={proj.key} 
            name={proj.name} 
            url={proj.url}
            favicon={proj.favicon}
            comingSoon={proj.comingSoon}
            projectKey={proj.key}
            isLast={index === projects.length - 1 || index === projects.length - 2}
            isEven={index % 2 === 0}
            onStatusUpdate={handleStatusUpdate}
            setLastUpdated={setLastUpdated}
          />
        ))}
      </div>
    </>
  )
}