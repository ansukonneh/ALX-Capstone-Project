import axios from 'axios'

const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5'

// Get weather data for a city
export const getWeather = async (cityName, countryCode = '') => {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY

  if (!apiKey) {
    console.warn('OpenWeatherMap API key not found. Please add VITE_OPENWEATHER_API_KEY to your .env file')
    return null
  }

  try {
    const query = countryCode ? `${cityName},${countryCode}` : cityName
    const response = await axios.get(`${OPENWEATHER_BASE_URL}/weather`, {
      params: {
        q: query,
        appid: apiKey,
        units: 'metric',
      },
    })
    return response.data
  } catch (error) {
    console.error('Error getting weather:', error)
    // Return null instead of throwing to allow app to work without weather
    return null
  }
}

// Get weather forecast for a city
export const getWeatherForecast = async (cityName, countryCode = '') => {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY

  if (!apiKey) {
    return null
  }

  try {
    const query = countryCode ? `${cityName},${countryCode}` : cityName
    const response = await axios.get(`${OPENWEATHER_BASE_URL}/forecast`, {
      params: {
        q: query,
        appid: apiKey,
        units: 'metric',
      },
    })
    return response.data
  } catch (error) {
    console.error('Error getting weather forecast:', error)
    return null
  }
}

