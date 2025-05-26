// components/StatusCard.tsx
'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

type Status = 'online' | 'offline' | 'booting'

const statusMap = {
  online: { 
    text: 'Operational', 
    color: 'bg-green-400',
    textColor: 'text-green-400'
  },
  booting: { 
    text: 'Starting Up', 
    color: 'bg-orange-400 animate-pulse',
    textColor: 'text-orange-400'
  },
  offline: { 
    text: 'Down', 
    color: 'bg-red-400',
    textColor: 'text-red-400'
  },
}

interface StatusCardProps {
  name: string
  url: string
  favicon?: string
  projectKey: string
  isLast?: boolean
  isEven?: boolean
  onStatusUpdate: (projectKey: string, status: Status) => void
}

export default function StatusCard({ 
  name, 
  url, 
  favicon, 
  projectKey, 
  isLast, 
  isEven, 
  onStatusUpdate 
}: StatusCardProps) {
  const [status, setStatus] = useState<Status>('booting')

  const checkStatus = async () => {
    try {
      const res = await axios.get(url, { timeout: 3000 })
      if (res.status === 200) {
        setStatus('online')
        onStatusUpdate(projectKey, 'online')
      } else {
        setStatus('offline')
        onStatusUpdate(projectKey, 'offline')
      }
    } catch {
      setStatus('offline')
      onStatusUpdate(projectKey, 'offline')
    }
  }

  useEffect(() => {
    checkStatus()
    // Auto-refresh every 30 seconds
    const interval = setInterval(checkStatus, 30000)
    return () => clearInterval(interval)
  }, [url])

  const { text, color, textColor } = statusMap[status]

  // Calculate border classes based on position
  const getBorderClasses = () => {
    let classes = 'border-gray-700'
    
    // Add right border for left column items (except last row if odd number of items)
    if (isEven && !isLast) {
      classes += ' md:border-r'
    }
    
    // Add bottom border for all items except the last two (bottom row)
    if (!isLast && !(isLast && !isEven)) {
      classes += ' border-b'
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
        <span className="text-white font-medium text-base">{name}</span>
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