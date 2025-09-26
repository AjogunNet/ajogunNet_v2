/**
 * CORS Debug Page
 * Test and diagnose CORS issues
 */

import CorsDebug from '../../components/cors-debug'

export default function CorsDebugPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <CorsDebug />
    </div>
  )
}

export const metadata = {
  title: 'CORS Debug - AjogunNet',
  description: 'Debug and test CORS connectivity issues',
}