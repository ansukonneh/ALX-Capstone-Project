import { useState, useEffect } from 'react'

const DestinationDetails = ({ destination, onBack, onAddToItinerary }) => {
  const [flights, setFlights] = useState([])
  const [hotels, setHotels] = useState([])
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState({
    flights: false,
    hotels: false,
    weather: false,
  })
  const [errors, setErrors] = useState({
    flights: null,
    hotels: null,
    weather: null,
  })
  const [departureDate, setDepartureDate] = useState('')
  const [originCode, setOriginCode] = useState('')

  useEffect(() => {
    // Set default departure date to 30 days from now
    const defaultDate = new Date()
    defaultDate.setDate(defaultDate.getDate() + 30)
    setDepartureDate(defaultDate.toISOString().split('T')[0])

    // Load weather data
    loadWeather()
  }, [destination])

  const loadWeather = async () => {
    setLoading((prev) => ({ ...prev, weather: true }))
    try {
      const cityName = destination.name
      const countryCode = destination.address?.countryCode
      const weatherData = await getWeather(cityName, countryCode)
      const forecastData = await getWeatherForecast(cityName, countryCode)
      setWeather(weatherData)
      setForecast(forecastData)
    } catch (error) {
      setErrors((prev) => ({ ...prev, weather: 'Failed to load weather data' }))
    } finally {
      setLoading((prev) => ({ ...prev, weather: false }))
    }
  }

  const loadFlights = async () => {
    if (!originCode || !departureDate) {
      setErrors((prev) => ({ ...prev, flights: 'Please enter origin code and departure date' }))
      return
    }

    setLoading((prev) => ({ ...prev, flights: true }))
    setErrors((prev) => ({ ...prev, flights: null }))
    try {
      const data = await getFlightOffers(
        originCode,
        destination.iataCode,
        departureDate
      )
      setFlights(data.data || [])
    } catch (error) {
      setErrors((prev) => ({ ...prev, flights: error.message }))
      setFlights([])
    } finally {
      setLoading((prev) => ({ ...prev, flights: false }))
    }
  }

  const loadHotels = async () => {
    if (!destination.iataCode) {
      setErrors((prev) => ({ ...prev, hotels: 'City code not available' }))
      return
    }

    setLoading((prev) => ({ ...prev, hotels: true }))
    setErrors((prev) => ({ ...prev, hotels: null }))
    try {
      const data = await getHotelOffers(destination.iataCode)
      setHotels(data.data || [])
    } catch (error) {
      setErrors((prev) => ({ ...prev, hotels: error.message }))
      setHotels([])
    } finally {
      setLoading((prev) => ({ ...prev, hotels: false }))
    }
  }

  const handleAddToItinerary = (type, item) => {
    onAddToItinerary({
      type,
      destination: destination.name,
      item,
      date: departureDate,
    })
  }

  return (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={onBack}
        className="mb-4 text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-2"
      >
        ← Back to Search
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
        <div className="h-64 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
          <span className="text-8xl">🌍</span>
        </div>
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {destination.name}
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            {destination.address?.countryName || destination.countryCode || 'Unknown Country'}
          </p>
          {destination.iataCode && (
            <p className="text-sm text-gray-500">IATA Code: {destination.iataCode}</p>
          )}
        </div>
      </div>

      {/* Weather Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🌤️ Weather</h2>
        {loading.weather ? (
          <p className="text-gray-600">Loading weather data...</p>
        ) : errors.weather ? (
          <p className="text-red-600">{errors.weather}</p>
        ) : weather ? (
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl">
                {weather.weather?.[0]?.main === 'Clear' ? '☀️' :
                 weather.weather?.[0]?.main === 'Clouds' ? '☁️' :
                 weather.weather?.[0]?.main === 'Rain' ? '🌧️' : '🌤️'}
              </div>
              <div>
                <p className="text-3xl font-bold">{Math.round(weather.main.temp)}°C</p>
                <p className="text-gray-600">{weather.weather[0].description}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Feels like</p>
                <p className="font-semibold">{Math.round(weather.main.feels_like)}°C</p>
              </div>
              <div>
                <p className="text-gray-600">Humidity</p>
                <p className="font-semibold">{weather.main.humidity}%</p>
              </div>
              <div>
                <p className="text-gray-600">Wind</p>
                <p className="font-semibold">{weather.wind.speed} m/s</p>
              </div>
              <div>
                <p className="text-gray-600">Pressure</p>
                <p className="font-semibold">{weather.main.pressure} hPa</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">Weather data not available.</p>
        )}
      </div>

      {/* Flight Offers Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">✈️ Flight Offers</h2>
        <div className="mb-4 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Origin Airport Code (e.g., JFK, LHR)"
            value={originCode}
            onChange={(e) => setOriginCode(e.target.value.toUpperCase())}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            maxLength="3"
          />
          <input
            type="date"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={loadFlights}
            disabled={loading.flights}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors"
          >
            {loading.flights ? 'Loading...' : 'Search Flights'}
          </button>
        </div>
        {errors.flights && (
          <p className="text-red-600 mb-4">{errors.flights}</p>
        )}
        {loading.flights ? (
          <p className="text-gray-600">Loading flight offers...</p>
        ) : flights.length > 0 ? (
          <div className="space-y-4">
            {flights.map((flight, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-lg">
                      {flight.itineraries[0].segments[0].departure.iataCode} → {flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1].arrival.iataCode}
                    </p>
                    <p className="text-sm text-gray-600">
                      {flight.itineraries[0].segments[0].carrierCode} {flight.itineraries[0].segments[0].number}
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-indigo-600">
                    ${flight.price.total}
                  </p>
                </div>
                <div className="flex gap-4 text-sm text-gray-600 mb-2">
                  <span>
                    Departure: {new Date(flight.itineraries[0].segments[0].departure.at).toLocaleString()}
                  </span>
                  <span>
                    Arrival: {new Date(flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1].arrival.at).toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => handleAddToItinerary('flight', flight)}
                  className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  Add to Itinerary
                </button>
              </div>
            ))}
          </div>
        ) : !loading.flights && originCode && departureDate ? (
          <p className="text-gray-600">No flights found. Try different dates or origin.</p>
        ) : (
          <p className="text-gray-600">Enter origin code and departure date to search for flights.</p>
        )}
      </div>

      {/* Hotel Offers Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🏨 Hotel Accommodations</h2>
        <button
          onClick={loadHotels}
          disabled={loading.hotels}
          className="mb-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors"
        >
          {loading.hotels ? 'Loading...' : 'Search Hotels'}
        </button>
        {errors.hotels && (
          <p className="text-red-600 mb-4">{errors.hotels}</p>
        )}
        {loading.hotels ? (
          <p className="text-gray-600">Loading hotel offers...</p>
        ) : hotels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hotels.map((hotel, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-2">
                  {hotel.hotel?.name || 'Hotel Name Not Available'}
                </h3>
                {hotel.offers && hotel.offers.length > 0 && (
                  <>
                    <p className="text-2xl font-bold text-indigo-600 mb-2">
                      ${hotel.offers[0].price.total}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      {hotel.offers[0].price.currency} per night
                    </p>
                    {hotel.offers[0].room && (
                      <p className="text-sm text-gray-600 mb-2">
                        Room: {hotel.offers[0].room.typeEstimated?.category || 'Standard'}
                      </p>
                    )}
                    <button
                      onClick={() => handleAddToItinerary('hotel', hotel)}
                      className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      Add to Itinerary
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : !loading.hotels ? (
          <p className="text-gray-600">Click "Search Hotels" to find available accommodations.</p>
        ) : null}
      </div>
    </div>
  )
}

export default DestinationDetails

