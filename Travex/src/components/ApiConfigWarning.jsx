import { useState, useEffect } from 'react'

const ApiConfigWarning = () => {
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    const apiKey = import.meta.env.VITE_AMADEUS_API_KEY
    const apiSecret = import.meta.env.VITE_AMADEUS_API_SECRET
    
    if (!apiKey || !apiSecret) {
      setShowWarning(true)
    }
  }, [])

  if (!showWarning) return null

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <span className="text-2xl">⚠️</span>
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            <strong>API Configuration Required:</strong> To use this application, please configure your API keys in a <code className="bg-yellow-100 px-1 rounded">.env</code> file. 
          </p>
        </div>
        <div className="ml-auto pl-3">
          <button
            onClick={() => setShowWarning(false)}
            className="text-yellow-700 hover:text-yellow-900"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}

export default ApiConfigWarning

