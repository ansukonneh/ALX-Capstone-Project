const DestinationList = ({ destinations, onSelectDestination }) => {
  if (destinations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">
          Search for a destination to get started! Try searching for cities like "Paris", "Tokyo", or "New York".
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {destinations.map((destination) => (
        <div
          key={destination.iataCode || destination.id}
          onClick={() => onSelectDestination(destination)}
          className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer overflow-hidden"
        >
          <div className="h-48 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
            <span className="text-6xl">🌍</span>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {destination.name}
            </h3>
            <p className="text-gray-600 mb-4">
              {destination.address?.countryName || destination.countryCode || 'Unknown Country'}
            </p>
            {destination.iataCode && (
              <p className="text-sm text-indigo-600 font-medium">
                Code: {destination.iataCode}
              </p>
            )}
            <button className="mt-4 w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DestinationList

