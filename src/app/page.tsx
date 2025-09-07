'use client'

import { useState, useEffect } from 'react'
import SystemStatus from './components/SystemStatus'
import { projects } from './data/projects'
import Footer from './components/Footer'

export default function HomePage() {
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  
  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto py-10">
        <SystemStatus 
          projects={projects} 
          setLastUpdated={setLastUpdated}
        />
        
        <Footer 
          lastUpdated={lastUpdated ?? undefined}
        />

      </div>
    </main>
  )
}