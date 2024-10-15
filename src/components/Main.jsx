import React, { useState } from 'react';
import axios from 'axios';
import '../scss/main.scss';

function Main() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const apiKey = process.env.REACT_APP_API_KEY;


  // Function to get weather by city
  const getWeatherByCity = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      setWeather(response.data);
      setError('');
    } catch (err) {
      setError('City not found or error fetching data');
      setWeather(null);
    }
  };

  // Function to get weather by user's location (Geolocation API)
  const getWeatherByLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
          );
          setWeather(response.data);
          setError('');
        } catch (err) {
          setError('Error fetching weather by location');
        }
      }, (error) => {
        setError('Geolocation failed. Please allow location access');
      });
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="main">
      <h1>Weather App</h1>

      <div className="input-group">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={getWeatherByCity}>Get Weather by City</button>
        <button onClick={getWeatherByLocation}>Get Weather by Location</button>
      </div>

      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="weather-info">
          <h2>{weather.name}</h2>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Weather: {weather.weather[0].description}</p>
          <img
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="weather icon"
          />
        </div>
      )}
    </div>
  );
}

export default Main;
