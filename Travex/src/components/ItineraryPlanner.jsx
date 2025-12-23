import { useState, useEffect } from 'react'

const ItineraryPlanner = ({ itineraries, onUpdateItineraries, pendingItem, onPendingItemAdded }) => {
  const [newItineraryName, setNewItineraryName] = useState('')
  const [selectedItinerary, setSelectedItinerary] = useState(null)
  const [itineraryItems, setItineraryItems] = useState({})
  const [showPendingModal, setShowPendingModal] = useState(false)

  useEffect(() => {
    if (pendingItem) {
      if (itineraries.length === 0) {
        setShowPendingModal(true)
      } else {
        setShowPendingModal(true)
      }
    }
  }, [pendingItem, itineraries.length])

  const createItinerary = () => {
    if (!newItineraryName.trim()) {
      alert('Please enter an itinerary name')
      return
    }

    const newItinerary = {
      id: Date.now(),
      name: newItineraryName,
      items: pendingItem ? [{ ...pendingItem, id: Date.now() }] : [],
      createdAt: new Date().toISOString(),
    }

    onUpdateItineraries([...itineraries, newItinerary])
    setItineraryItems({ ...itineraryItems, [newItinerary.id]: [] })
    setNewItineraryName('')
    
    if (pendingItem) {
      setShowPendingModal(false)
      onPendingItemAdded()
      setSelectedItinerary(newItinerary.id)
    }
  }

  const deleteItinerary = (id) => {
    if (confirm('Are you sure you want to delete this itinerary?')) {
      onUpdateItineraries(itineraries.filter((it) => it.id !== id))
      const newItems = { ...itineraryItems }
      delete newItems[id]
      setItineraryItems(newItems)
      if (selectedItinerary === id) {
        setSelectedItinerary(null)
      }
    }
  }

  const addItemToItinerary = (itineraryId, item, isPending = false) => {
    const itinerary = itineraries.find((it) => it.id === itineraryId)
    if (!itinerary) return

    const updatedItinerary = {
      ...itinerary,
      items: [...itinerary.items, { ...item, id: Date.now() }],
    }

    onUpdateItineraries(
      itineraries.map((it) => (it.id === itineraryId ? updatedItinerary : it))
    )
    
    if (isPending) {
      setShowPendingModal(false)
      onPendingItemAdded()
      setSelectedItinerary(itineraryId)
    }
  }

  const handlePendingItemAdd = (itineraryId) => {
    if (pendingItem) {
      addItemToItinerary(itineraryId, pendingItem, true)
    }
  }

  const removeItemFromItinerary = (itineraryId, itemId) => {
    const itinerary = itineraries.find((it) => it.id === itineraryId)
    if (!itinerary) return

    const updatedItinerary = {
      ...itinerary,
      items: itinerary.items.filter((item) => item.id !== itemId),
    }

    onUpdateItineraries(
      itineraries.map((it) => (it.id === itineraryId ? updatedItinerary : it))
    )
  }

  const currentItinerary = itineraries.find((it) => it.id === selectedItinerary)

  return (
    <div className="max-w-6xl mx-auto">
      {/* Pending Item Modal */}
      {showPendingModal && pendingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Add to Itinerary</h3>
            <p className="text-gray-600 mb-4">
              Select an itinerary to add this item to, or create a new one.
            </p>
            {itineraries.length > 0 ? (
              <div className="space-y-2 mb-4">
                {itineraries.map((itinerary) => (
                  <button
                    key={itinerary.id}
                    onClick={() => handlePendingItemAdd(itinerary.id)}
                    className="w-full text-left px-4 py-2 border border-gray-300 rounded-lg hover:bg-indigo-50 hover:border-indigo-500 transition-colors"
                  >
                    {itinerary.name}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 mb-4 text-sm">
                Create a new itinerary below to add this item.
              </p>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowPendingModal(false)
                  onPendingItemAdded()
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Create New Itinerary</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={newItineraryName}
            onChange={(e) => setNewItineraryName(e.target.value)}
            placeholder="Enter itinerary name (e.g., Summer Europe Trip)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onKeyPress={(e) => e.key === 'Enter' && createItinerary()}
          />
          <button
            onClick={createItinerary}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Create
          </button>
        </div>
      </div>

      {itineraries.length === 0 ? (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <p className="text-gray-600 text-lg mb-4">
            You don't have any itineraries yet.
          </p>
          <p className="text-gray-500">
            Create your first itinerary to start planning your trip!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Itinerary List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">My Itineraries</h3>
              <div className="space-y-2">
                {itineraries.map((itinerary) => (
                  <div
                    key={itinerary.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      selectedItinerary === itinerary.id
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                    onClick={() => setSelectedItinerary(itinerary.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-gray-800">{itinerary.name}</h4>
                        <p className="text-sm text-gray-600">
                          {itinerary.items.length} item{itinerary.items.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteItinerary(itinerary.id)
                        }}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Itinerary Details */}
          <div className="lg:col-span-2">
            {selectedItinerary ? (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">
                    {currentItinerary.name}
                  </h3>
                  <button
                    onClick={() => setSelectedItinerary(null)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Close
                  </button>
                </div>

                {currentItinerary.items.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600 mb-4">
                      This itinerary is empty.
                    </p>
                    <p className="text-gray-500 text-sm">
                      Add flights, hotels, or destinations from the search page to build your itinerary.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentItinerary.items.map((item) => (
                      <div
                        key={item.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-2xl">
                                {item.type === 'flight' ? '✈️' :
                                 item.type === 'hotel' ? '🏨' : '🌍'}
                              </span>
                              <span className="font-semibold text-gray-800">
                                {item.type === 'flight' ? 'Flight' :
                                 item.type === 'hotel' ? 'Hotel' : 'Destination'}
                              </span>
                            </div>
                            {item.type === 'flight' && item.item.itineraries && (
                              <div className="ml-10">
                                <p className="text-gray-700">
                                  {item.item.itineraries[0].segments[0].departure.iataCode} →{' '}
                                  {item.item.itineraries[0].segments[item.item.itineraries[0].segments.length - 1].arrival.iataCode}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {new Date(item.item.itineraries[0].segments[0].departure.at).toLocaleString()}
                                </p>
                                <p className="text-indigo-600 font-semibold mt-1">
                                  ${item.item.price.total}
                                </p>
                              </div>
                            )}
                            {item.type === 'hotel' && item.item.hotel && (
                              <div className="ml-10">
                                <p className="text-gray-700">{item.item.hotel.name}</p>
                                {item.item.offers && item.item.offers[0] && (
                                  <p className="text-indigo-600 font-semibold mt-1">
                                    ${item.item.offers[0].price.total} per night
                                  </p>
                                )}
                              </div>
                            )}
                            {item.type === 'destination' && (
                              <div className="ml-10">
                                <p className="text-gray-700">{item.destination}</p>
                              </div>
                            )}
                            {item.date && (
                              <p className="text-sm text-gray-500 mt-2 ml-10">
                                Date: {new Date(item.date).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeItemFromItinerary(selectedItinerary, item.id)}
                            className="text-red-600 hover:text-red-800 ml-4"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <p className="text-gray-600">
                  Select an itinerary from the list to view details.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ItineraryPlanner

