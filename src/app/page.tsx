'use client'

import SystemStatus from './components/SystemStatus'
import { projects } from './data/projects'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <SystemStatus projects={projects} />
        
        {/* Footer */}
        <div className="text-center mt-10 text-gray-400 text-sm">
          <p>Last updated: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </main>
  )
}