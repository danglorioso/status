'use client'

import { useState, useEffect } from 'react'
import StatusCard from './StatusCard'

type Status = 'online' | 'offline' | 'loading' | 'coming-soon'

interface Project {
  key: string
  name: string
  url: string
  favicon?: string // Add this to your data file
  comingSoon?: boolean // Add this to your data file
}

interface SystemStatusProps {
  projects: Project[]
}

export default function SystemStatus({ projects }: SystemStatusProps) {
  const [projectStatuses, setProjectStatuses] = useState<Record<string, Status>>({})

  // Calculate overall system status
  const getOverallStatus = () => {
    const activeProjects = projects.filter(p => !p.comingSoon)
    const activeStatuses = activeProjects.map(p => projectStatuses[p.key]).filter(Boolean)
    
    if (activeStatuses.length === 0 || activeStatuses.length < activeProjects.length) {
      return { 
        loading: true,
        message: 'Checking Systems...',
        color: 'text-orange-400',
        dotColor: 'bg-orange-400 animate-pulse'
      }
    }
    
    const offlineCount = activeStatuses.filter(status => status === 'offline').length
    const loadingCount = activeStatuses.filter(status => status === 'loading').length
    
    if (offlineCount === 0 && loadingCount === 0) {
      return {
        loading: false,
        isOperational: true,
        message: 'All Systems Operational',
        color: 'text-green-400',
        dotColor: 'bg-green-400'
      }
    } else {
      const unavailableCount = offlineCount + loadingCount
      return {
        loading: false,
        isOperational: false,
        message: `${unavailableCount} System${unavailableCount > 1 ? 's' : ''} Unavailable`,
        color: 'text-orange-400',
        dotColor: 'bg-orange-400'
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
      <div className="text-center mb-16">
        <h1 className="text-4xl font-light text-white mb-4">System Status</h1>
        {overallStatus.loading ? (
          <div className={`flex items-center justify-center gap-2 ${overallStatus.color}`}>
            <div className={`w-2 h-2 ${overallStatus.dotColor} rounded-full`}></div>
            <span className="text-sm font-medium">{overallStatus.message}</span>
          </div>
        ) : (
          <div className={`flex items-center justify-center gap-2 ${overallStatus.color}`}>
            <div className={`w-2 h-2 ${overallStatus.dotColor} rounded-full`}></div>
            <span className="text-sm font-medium">{overallStatus.message}</span>
          </div>
        )}
      </div>

      {/* Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-2 border-gray-700 rounded-lg overflow-hidden bg-gray-800/50 backdrop-blur-sm">
        {projects.map((proj, index) => (
          <StatusCard 
            key={proj.key} 
            name={proj.name} 
            url={proj.url}
            favicon={proj.favicon}
            comingSoon={proj.comingSoon}
            projectKey={proj.key}
            isLast={index === projects.length - 1}
            isEven={index % 2 === 0}
            onStatusUpdate={handleStatusUpdate}
          />
        ))}
      </div>
    </>
  )
}