'use client'

import { useState, useEffect } from 'react'

type Status = 'online' | 'offline' | 'loading' | 'coming-soon'

interface Project {
  key: string
  name: string
  url: string
  favicon?: string // Optional
  comingSoon?: boolean // Optional, default false
  description?: string // Optional
  links?: { label: string; url: string }[] // Optional
}

interface SystemStatusProps {
  projects: Project[]
  setLastUpdated: (time: Date) => void
}

export default function SystemStatus({ projects, setLastUpdated }: SystemStatusProps) {
  const [projectStatuses, setProjectStatuses] = useState<Record<string, Status>>({})
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set())

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

  const toggleExpanded = (projectKey: string) => {
    setExpandedProjects(prev => {
      const newSet = new Set(prev)
      if (newSet.has(projectKey)) {
        newSet.delete(projectKey)
      } else {
        newSet.add(projectKey)
      }
      return newSet
    })
  }

  const statusMap = {
    online: { 
      text: 'Available', 
      color: 'bg-green-400 animate-pulse',
      textColor: 'text-green-400'
    },
    loading: {
      text: 'Loading...', 
      color: 'bg-blue-400 animate-pulse',
      textColor: 'text-blue-400'
    },
    offline: {
      text: 'Unavailable', 
      color: 'bg-red-400 animate-pulse',
      textColor: 'text-red-400'
    },
    'coming-soon': {
      text: 'Coming Soon...', 
      color: 'bg-yellow-600 animate-grow-pulse',
      textColor: 'text-yellow-600'
    },
  }

  const getStatusDisplay = (projectKey: string) => {
    const status = projectStatuses[projectKey] || 'loading'
    return statusMap[status]
  }

  const checkProjectStatus = async (project: Project) => {
    // Don't check status for coming soon projects
    if (project.comingSoon) {
      setProjectStatuses(prev => ({
        ...prev,
        [project.key]: 'coming-soon'
      }))
      return
    }

    // Set loading state
    setProjectStatuses(prev => ({
      ...prev,
      [project.key]: 'loading'
    }))
    
    try {
      const res = await fetch(`/api/ping?url=${encodeURIComponent(project.url)}`)
      const newStatus = res.status === 200 ? 'online' : 'offline'
      setProjectStatuses(prev => ({
        ...prev,
        [project.key]: newStatus
      }))
      setLastUpdated(new Date())
    } catch {
      setProjectStatuses(prev => ({
        ...prev,
        [project.key]: 'offline'
      }))
      setLastUpdated(new Date())
    }
  }

  useEffect(() => {
    // Check status for all projects on mount
    projects.forEach(project => {
      checkProjectStatus(project)
    })

    // Set up interval to check status every 15 seconds for non-coming-soon projects
    const interval = setInterval(() => {
      projects.forEach(project => {
        if (!project.comingSoon) {
          checkProjectStatus(project)
        }
      })
    }, 15000)

    return () => clearInterval(interval)
  }, [projects])

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
            <span className="text-md font-medium">{overallStatus.message}</span>
          </div>
        ) : (
          <div className={`flex items-center justify-center gap-2 ${overallStatus.color}`}>
            <div className="relative w-2 h-2 mr-1 flex items-center justify-center">
              <div className={`absolute inset-0 ${overallStatus.dotColor} rounded-full animate-pulse opacity-75`}></div>
              <div className={`absolute inset-0 ${overallStatus.dotColor} rounded-full animate-ping opacity-75`}></div>
            </div>
            <span className="text-md font-medium">{overallStatus.message}</span>
          </div>
        )}
      </div>

      {/* Status Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 mt-7 gap-0 border-2 border-gray-700 rounded-lg overflow-hidden bg-gray-800/50 backdrop-blur-sm">
        {projects.map((proj, index) => {
          const isEven = index % 2 === 0
          const isLastRow = index >= projects.length - 2
          const isLast = index === projects.length - 1
          const isExpanded = expandedProjects.has(proj.key)
          
          return (
            <div key={proj.key} className="flex flex-col">
              {/* Main project row */}
              <div 
                className={`cursor-pointer hover:bg-gray-700/30 transition-colors px-6 py-5 border-gray-700 ${
                  // Only add bottom border if not expanded and not last row
                  !isExpanded && !isLastRow ? 'border-b' : ''
                } ${
                  // Add bottom border if this is last row but not expanded
                  !isExpanded && isLastRow && !isLast ? 'border-b' : ''
                } ${
                  // Right border logic
                  isEven && !isLast ? 'md:border-r' : ''
                } ${
                  isEven && isLast && projects.length % 2 !== 0 ? 'md:border-r' : ''
                }`}
                onClick={() => toggleExpanded(proj.key)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Favicon */}
                    {proj.favicon && (
                      <img 
                        src={proj.favicon} 
                        alt={`${proj.name} favicon`}
                        className="w-4 h-4 flex-shrink-0"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    )}
                    {/* Project name */}
                    <span className="text-white font-medium text-base">{proj.name}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {/* Status text */}
                    <span className={`text-sm font-medium ${getStatusDisplay(proj.key).textColor}`}>
                      {/* {getStatusDisplay(proj.key).text} */}
                    </span>
                    {/* Status dot */}
                    <div className={`w-3 h-3 rounded-full ${getStatusDisplay(proj.key).color}`} />
                    {/* Expand/collapse icon */}
                    <svg 
                      className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Expanded content */}
              {isExpanded && (
                <div className={`px-6 border-gray-700 ${
                  // Add bottom border only if not last row
                  !isLastRow ? 'border-b' : ''
                } ${
                  // Add bottom border if this is the last item of an odd-numbered list
                  isLastRow && !isLast ? 'border-b' : ''
                } ${
                  // Right border logic for expanded content
                  isEven && !isLast ? 'md:border-r' : ''
                } ${
                  isEven && isLast && projects.length % 2 !== 0 ? 'md:border-r' : ''
                }`}>
                  <div className="pb-5 pt-3">
                    {/* Description */}
                    {proj.description && (
                      <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                        {proj.description}
                      </p>
                    )}
                    
                    {/* Links */}
                    {proj.links && proj.links.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {proj.links.map((link, linkIndex) => (
                          <a
                            key={linkIndex}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-400 bg-blue-400/10 hover:bg-blue-400/20 rounded-md transition-colors border border-blue-400/20 hover:border-blue-400/40"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {link.label}
                            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}