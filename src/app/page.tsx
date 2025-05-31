'use client'

import { useState, useEffect } from 'react'
import SystemStatus from './components/SystemStatus'
import { projects } from './data/projects'

export default function HomePage() {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [initialClientTime, setInitialClientTime] = useState<string | null>(null)

  useEffect(() => {
    // Set fallback time only on the client
    setInitialClientTime(new Date().toLocaleString())
  }, [])
  
  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-6 pt-10">
        <SystemStatus 
          projects={projects} 
          setLastUpdated={setLastUpdated}/>
        
        {/* Footer */}
        <div className="text-center mt-10 text-gray-400 text-sm">
          <p>Last updated: {lastUpdated ? lastUpdated.toLocaleString() : initialClientTime}</p>
        </div>
      </div>
    </main>
  )
}