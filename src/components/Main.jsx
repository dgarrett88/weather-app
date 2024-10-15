import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../scss/main.scss'; // Assuming your SCSS file is named styles.scss

const Main = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState(null);
    const [location, setLocation] = useState(null);
    const [temperatureUnit, setTemperatureUnit] = useState('metric'); // 'metric' for Celsius, 'imperial' for Fahrenheit
    const [city, setCity] = useState('');
    const [error, setError] = useState(null);
  
    const apiKey = process.env.REACT_APP_API_KEY;
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}`;
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}`;
  
    useEffect(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ lat: latitude, lon: longitude });
          },
          (error) => setError('Unable to retrieve your location.')
        );
      } else {
        setError('Geolocation is not supported by this browser.');
      }
    }, []);
  
    useEffect(() => {
      if (location) {
        const fetchWeather = async () => {
          try {
            const weatherResponse = await axios.get(
              `${weatherApiUrl}&lat=${location.lat}&lon=${location.lon}&units=${temperatureUnit}`
            );
            setWeatherData(weatherResponse.data);
  
            const forecastResponse = await axios.get(
              `${forecastApiUrl}&lat=${location.lat}&lon=${location.lon}&units=${temperatureUnit}`
            );
            setForecastData(forecastResponse.data.list.filter((item, index) => index % 8 === 0)); // Get one forecast per day
          } catch (err) {
            setError('Failed to fetch weather data.');
          }
        };
        fetchWeather();
      }
    }, [location, temperatureUnit]);
  
    const formatTemperature = (temp) => {
      const unitSymbol = temperatureUnit === 'metric' ? '°C' : '°F';
      return `${Math.round(temp)} ${unitSymbol}`;
    };
  
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const monthIndex = date.getMonth();
      const year = date.getFullYear();
      const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      const dayName = days[date.getDay()];
      const monthAbbreviation = months[monthIndex];
  
      return {
        day: day,
        month: monthAbbreviation,
        year: year,
        dayName: dayName,
      };
    };
  
    const handleCitySearch = async () => {
      try {
        const weatherResponse = await axios.get(
          `${weatherApiUrl}&q=${city}&units=${temperatureUnit}`
        );
        setWeatherData(weatherResponse.data);
  
        const forecastResponse = await axios.get(
          `${forecastApiUrl}&q=${city}&units=${temperatureUnit}`
        );
        setForecastData(forecastResponse.data.list.filter((item, index) => index % 8 === 0)); // Get one forecast per day
      } catch (err) {
        setError('City not found or failed to fetch weather data.');
      }
    };
  
    return (
      <div className="main-container">
        <h1>Weather App</h1>
  
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button onClick={handleCitySearch}>Search</button>
        </div>
  
        {error && <p className="error">{error}</p>}
  
        {weatherData && (
          <div className="current-weather">
            <h2>{weatherData.name}</h2>
            <p>{weatherData.weather[0].description}</p>
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
              alt={weatherData.weather[0].description}
            />
            <p>{formatTemperature(weatherData.main.temp)}</p>
          </div>
        )}
  
        {forecastData && (
          <div className="forecast-container">
            <h3>5-Day Forecast</h3>
            <div className="forecast-list">
              {forecastData.map((forecast, index) => {
                const formattedDate = formatDate(forecast.dt_txt);
                return (
                  <div key={index} className="forecast-item">
                    <div className="day-name">{formattedDate.dayName}</div>
                    <div className="day">{formattedDate.day}</div>
                    <div className="month">{formattedDate.month}</div>
                    <div className="forecast-icon">
                      <img
                        src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`}
                        alt={forecast.weather[0].description}
                      />
                    </div>
                    <div className="temperature">
                      {formatTemperature(forecast.main.temp)}
                    </div>
                    <div className="description">
                      {forecast.weather[0].description}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
  
        <div className="temperature-toggle">
          <button onClick={() => setTemperatureUnit(temperatureUnit === 'metric' ? 'imperial' : 'metric')}>
            Toggle to {temperatureUnit === 'metric' ? '°F' : '°C'}
          </button>
        </div>
      </div>
    );
  };
  
  export default Main;