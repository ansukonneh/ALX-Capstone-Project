import { useState } from 'react'
import SearchBar from './components/SearchBar'
import DestinationList from './components/DestinationList'
import DestinationDetails from './components/DestinationDetails'
import ItineraryPlanner from './components/ItineraryPlanner'
import ApiConfigWarning from './components/ApiConfigWarning'

function App() {
  const [destinations, setDestinations] = useState([])
  const [selectedDestination, setSelectedDestination] = useState(null)
  const [itineraries, setItineraries] = useState([])
  const [activeTab, setActiveTab] = useState('search')
  const [pendingItem, setPendingItem] = useState(null)

  const handleAddToItinerary = (item) => {
    setPendingItem(item)
    setActiveTab('itinerary')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-indigo-600 mb-2">
            🌍Travex
          </h1>
          <p className="text-gray-600">Plan your perfect trip with ease</p>
        </div>
      </header>

      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('search')}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === 'search'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              Search Destinations
            </button>
            <button
              onClick={() => setActiveTab('itinerary')}
              className={`px-4 py-3 font-medium transition-colors ${
                activeTab === 'itinerary'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-indigo-600'
              }`}
            >
              My Itineraries
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <ApiConfigWarning />
        {activeTab === 'search' && (
          <>
            <SearchBar onSearch={setDestinations} />
            {selectedDestination ? (
              <DestinationDetails
                destination={selectedDestination}
                onBack={() => setSelectedDestination(null)}
                onAddToItinerary={handleAddToItinerary}
              />
            ) : (
              <DestinationList
                destinations={destinations}
                onSelectDestination={setSelectedDestination}
              />
            )}
          </>
        )}

        {activeTab === 'itinerary' && (
          <ItineraryPlanner
            itineraries={itineraries}
            onUpdateItineraries={setItineraries}
            pendingItem={pendingItem}
            onPendingItemAdded={() => setPendingItem(null)}
          />
        )}
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          <p>© 2025 Travex. Developed as requirement for my ALX capstone</p>
        </div>
      </footer>
    </div>
  )
}

export default App

