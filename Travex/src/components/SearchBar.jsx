import { useState } from 'react'

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!searchTerm.trim()) {
      setError('Please enter a search term')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { searchDestinations } = await import('../services/amadeusApi')
      const result = await searchDestinations(searchTerm)
      onSearch(result.data || [])
    } catch (err) {
      setError(err.message || 'Failed to search destinations. Please check your API configuration.')
      onSearch([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mb-8">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a destination (e.g., Paris, Tokyo, New York)..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
        {error && (
          <div className="mt-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
      </form>
    </div>
  )
}

export default SearchBar

