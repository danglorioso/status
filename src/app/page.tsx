'use client'

import { useState } from 'react'
import SystemStatus from './components/SystemStatus'
import { projects } from './data/projects'

export default function HomePage() {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <SystemStatus 
          projects={projects} 
          setLastUpdated={setLastUpdated}/>
        
        {/* Footer */}
        <div className="text-center mt-10 text-gray-400 text-sm">
          <p>Last updated: {lastUpdated ? lastUpdated.toLocaleString() : new Date().toLocaleString()}</p>
        </div>
      </div>
    </main>
  )
}