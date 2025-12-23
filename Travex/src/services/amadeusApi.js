import axios from 'axios'

const AMADEUS_BASE_URL = 'https://test.api.amadeus.com'
let accessToken = null
let tokenExpiry = null

// Get Amadeus API credentials from environment variables
const getApiCredentials = () => {
  const apiKey = import.meta.env.VITE_AMADEUS_API_KEY
  const apiSecret = import.meta.env.VITE_AMADEUS_API_SECRET

  if (!apiKey || !apiSecret) {
    console.warn('Amadeus API credentials not found. Please add VITE_AMADEUS_API_KEY and VITE_AMADEUS_API_SECRET to your .env file')
    return null
  }

  return { apiKey, apiSecret }
}

// Get access token for Amadeus API
const getAccessToken = async () => {
  // Check if we have a valid token
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken
  }

  const credentials = getApiCredentials()
  if (!credentials) {
    throw new Error('API credentials not configured')
  }

  try {
    const response = await axios.post(
      `${AMADEUS_BASE_URL}/v1/security/oauth2/token`,
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: credentials.apiKey,
        client_secret: credentials.apiSecret,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )

    accessToken = response.data.access_token
    // Token expires in response.data.expires_in seconds, set expiry 5 minutes before
    tokenExpiry = Date.now() + (response.data.expires_in - 300) * 1000

    return accessToken
  } catch (error) {
    console.error('Error getting Amadeus access token:', error)
    throw new Error('Failed to authenticate with Amadeus API')
  }
}

// Make authenticated request to Amadeus API
const makeRequest = async (endpoint, params = {}) => {
  try {
    const token = await getAccessToken()
    const response = await axios.get(`${AMADEUS_BASE_URL}${endpoint}`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    console.error('Amadeus API error:', error)
    if (error.response?.status === 401) {
      // Token expired, clear it and retry once
      accessToken = null
      tokenExpiry = null
      const token = await getAccessToken()
      const response = await axios.get(`${AMADEUS_BASE_URL}${endpoint}`, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    }
    throw error
  }
}

// Search for destinations by keyword
export const searchDestinations = async (keyword) => {
  if (!keyword || keyword.trim() === '') {
    return { data: [] }
  }

  try {
    const data = await makeRequest('/v1/reference-data/locations', {
      keyword: keyword.trim(),
      subType: 'CITY',
    })
    return data
  } catch (error) {
    console.error('Error searching destinations:', error)
    throw new Error('Failed to search destinations. Please try again.')
  }
}

// Get city information
export const getCityInfo = async (cityCode) => {
  try {
    const data = await makeRequest('/v1/reference-data/locations/cities', {
      keyword: cityCode,
    })
    return data
  } catch (error) {
    console.error('Error getting city info:', error)
    throw new Error('Failed to get city information.')
  }
}

// Get flight offers
export const getFlightOffers = async (originCode, destinationCode, departureDate, adults = 1) => {
  try {
    const data = await makeRequest('/v2/shopping/flight-offers', {
      originLocationCode: originCode,
      destinationLocationCode: destinationCode,
      departureDate: departureDate,
      adults: adults,
      currencyCode: 'USD',
      max: 10,
    })
    return data
  } catch (error) {
    console.error('Error getting flight offers:', error)
    throw new Error('Failed to fetch flight offers. Please try again.')
  }
}

// Get hotel offers
export const getHotelOffers = async (cityCode) => {
  try {
    const data = await makeRequest('/v2/shopping/hotel-offers', {
      cityCode: cityCode,
    })
    return data
  } catch (error) {
    console.error('Error getting hotel offers:', error)
    throw new Error('Failed to fetch hotel offers. Please try again.')
  }
}

