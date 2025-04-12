import { useState } from 'react';

export default function WeatherApp() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    if (!city.trim()) return;

    setLoading(true);
    setError(null);

    const url = `https://open-weather13.p.rapidapi.com/city/${encodeURIComponent(city)}/IN`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '1f2ef36e97mshef65cb56de63ca3p1e6189jsn60235ffa17e3',
        'x-rapidapi-host': 'open-weather13.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error('City not found or API error');
      }
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      setError(error.message || 'Error fetching weather data');
      console.error('Error fetching weather data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      fetchWeather();
    }
  };

  const kelvinToCelsius = (kelvin) => Math.round((kelvin - 32)*5/9); // fixed conversion

  const formatDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-blue-200 to-blue-300 px-4 py-10">
      <div className="w-full max-w-lg bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 space-y-6 border border-gray-200">
        <h1 className="text-3xl font-extrabold text-center text-blue-800">🌤 India Weather App</h1>

        <div className="flex items-center">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter city name (India)"
            className="flex-1 px-4 py-3 text-lg rounded-l-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={fetchWeather}
            disabled={loading}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-r-xl transition duration-200"
          >
            {loading ? 'Loading...' : 'Search'}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 font-medium p-3 rounded-lg">
            ⚠️ {error}
          </div>
        )}

        {weather && !error && (
          <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
            <div className="text-sm text-gray-500">{formatDate()}</div>
            <h2 className="text-2xl font-semibold text-blue-700">{weather.name}</h2>

            <div className="flex items-center justify-center space-x-4">
              {weather.weather && weather.weather[0] && (
                <img
                  src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt="Weather Icon"
                  className="w-20 h-20"
                />
              )}
              {weather.main && (
                <div className="text-5xl font-bold text-blue-800">
                  {kelvinToCelsius(weather.main.temp)}°C
                </div>
              )}
            </div>

            <p className="capitalize text-lg text-gray-700">
              {weather.weather[0]?.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-100 p-4 rounded-xl text-center shadow-sm">
                <div className="text-sm text-gray-500">Feels Like</div>
                <div className="text-xl font-semibold text-blue-700">
                  {kelvinToCelsius(weather.main.feels_like)}°C
                </div>
              </div>

              <div className="bg-gray-100 p-4 rounded-xl text-center shadow-sm">
                <div className="text-sm text-gray-500">Humidity</div>
                <div className="text-xl font-semibold text-blue-700">
                  {weather.main.humidity}%
                </div>
              </div>

              <div className="bg-gray-100 p-4 rounded-xl text-center shadow-sm">
                <div className="text-sm text-gray-500">Wind Speed</div>
                <div className="text-xl font-semibold text-blue-700">
                  {weather.wind ? `${weather.wind.speed} m/s` : 'N/A'}
                </div>
              </div>

              <div className="bg-gray-100 p-4 rounded-xl text-center shadow-sm">
                <div className="text-sm text-gray-500">Pressure</div>
                <div className="text-xl font-semibold text-blue-700">
                  {weather.main.pressure} hPa
                </div>
              </div>
            </div>
          </div>
        )}

        {!weather && !error && !loading && (
          <div className="text-center text-gray-600 mt-6">
            🔍 Start by searching for a city to see weather updates.
          </div>
        )}

        <div className="text-xs text-center text-gray-400 mt-6">
          Powered by OpenWeather API
        </div>
      </div>
    </div>
  );
}
