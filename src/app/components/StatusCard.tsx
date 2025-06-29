// This file is one project's status card component

'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

type Status = 'online' | 'offline' | 'loading' | 'coming-soon'

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
    color: 'bg-red-400',
    textColor: 'text-red-400'
  },
  'coming-soon': {
    text: 'Coming Soon...', 
    color: 'bg-yellow-600',
    textColor: 'text-yellow-600'
  },
}

interface StatusCardProps {
  name: string
  url: string
  favicon?: string
  comingSoon?: boolean
  projectKey: string
  isLast?: boolean
  isEven?: boolean
  onStatusUpdate: (projectKey: string, status: Status) => void
  setLastUpdated: (time: Date) => void
}

export default function StatusCard({ 
  name, 
  url, 
  favicon, 
  comingSoon,
  projectKey, 
  isLast, 
  isEven, 
  onStatusUpdate,
  setLastUpdated
}: StatusCardProps) {
  const [status, setStatus] = useState<Status>(comingSoon ? 'coming-soon' : 'loading')

  const checkStatus = async () => {
    // Don't check status for coming soon projects
    if (comingSoon) {
      setStatus('coming-soon')
      onStatusUpdate(projectKey, 'coming-soon')
      return
    }

    setStatus('loading')
    onStatusUpdate(projectKey, 'loading')
    
    try {
      const res = await fetch(`/api/ping?url=${encodeURIComponent(url)}`)
      setStatus(res.status === 200 ? 'online' : 'offline')
      onStatusUpdate(projectKey, res.status === 200 ? 'online' : 'offline')
      setLastUpdated(new Date())
    } catch {
      setStatus('offline')
      onStatusUpdate(projectKey, 'offline')
      setLastUpdated(new Date())
    }
  }

  useEffect(() => {
    checkStatus()
    
    // Don't set up interval for coming soon projects
    if (comingSoon) return
    
    // Auto-refresh every 15 seconds
    const interval = setInterval(checkStatus, 15000)
    return () => clearInterval(interval)
  }, [url, comingSoon])

  const { text, color, textColor } = statusMap[status]

  // Calculate border classes based on position
  const getBorderClasses = () => {
    let classes = 'border-gray-700'
    
    // Add right border for left column items (except last row if odd number of items)
    if (isEven && !isLast) {
      classes += ' md:border-r'
    }

    if (isEven && isLast) {
      classes += ' md:border-r'
    }

    if (!isLast) {
      classes += ' md:border-b'
    }
    
    return classes
  }

  // Generate favicon URL if not provided
  const getFaviconUrl = () => {
    if (favicon) return favicon
    
    try {
      const domain = new URL(url).origin
      return `${domain}/favicon.ico`
    } catch {
      return null
    }
  }

  const faviconUrl = getFaviconUrl()

  return (
    <div className={`flex items-center justify-between px-6 py-5 ${getBorderClasses()}`}>
      <div className="flex items-center gap-4">
        {faviconUrl && (
          <img 
            src={faviconUrl} 
            alt={`${name} favicon`}
            className="w-4 h-4 flex-shrink-0"
            onError={(e) => {
              // Hide favicon if it fails to load
              e.currentTarget.style.display = 'none'
            }}
          />
        )}
        <Link href={url} target="_blank" rel="noopener noreferrer" className="text-white font-medium text-base">
          {name}
        </Link>
      </div>
      
      <div className="flex items-center gap-3">
        <span className={`text-sm font-medium ${textColor}`}>
          {text}
        </span>
        <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
      </div>
    </div>
  )
}