import React, { useState } from 'react';
import clearCloudImg from './assets/clear.png'
import fewCloudsImg from './assets/few clouds.png'
import scatteredImg from './assets/brokencloud.png'
import brokenCloudImg from './assets/brokencloud.png'
import rainImg from './assets/rain.png'
import lightrainImg from './assets/lightrain.png'
import thunderstormImg from './assets/thunderstorm.png'
import overcastImg from './assets/overcast.png'
import WeatherForecast from './WeatherForecast';
const apiKey = process.env.REACT_APP_API_KEY;


const Weather = () => {

    const [tempUnitC, setTempUnitC] = useState(true);
    const [cityName, setCityName] = useState("");
    const [cityNameIsCorrect, setCityNameIsCorrect] = useState(true);
    const [weatherData, setweatherData] = useState("");
    const [weatherForecastData, setweatherForecastData] = useState("");
    const [forcastView, setForcastView] = useState(false);

    const weatherImages = {
        'clear sky': clearCloudImg,
        'few clouds': fewCloudsImg,
        'scattered clouds': scatteredImg,
        'broken clouds': brokenCloudImg,
        'drizzle': lightrainImg,
        'light rain': lightrainImg,
        'shower rain': rainImg,
        'moderate rain': rainImg,
        'thunderstorm': thunderstormImg,
        'overcast clouds': overcastImg,
    }

    // Function to get wind direction in words
    function getWindDirection(deg) {
        if (deg >= 337.5 || deg < 22.5) return 'North';
        if (deg >= 22.5 && deg < 67.5) return 'Northeast';
        if (deg >= 67.5 && deg < 112.5) return 'East';
        if (deg >= 112.5 && deg < 157.5) return 'Southeast';
        if (deg >= 157.5 && deg < 202.5) return 'South';
        if (deg >= 202.5 && deg < 247.5) return 'Southwest';
        if (deg >= 247.5 && deg < 292.5) return 'West';
        if (deg >= 292.5 && deg < 337.5) return 'Northwest';
        return 'Unknown';
    }

    // Function to get temp in Celsius and Fahrenheit
    const tempUnitConverter = (kelvin) => {
        if (tempUnitC) {
            // KelvinToCelsius 
            return kelvin - 273.15;
        }
        // KelvinToFahrenheit 
        return (kelvin - 273.15) * 9 / 5 + 32;
    }

    const handleViewforcast = () => {
        setForcastView(true)
    }

    const { main, weather, wind, clouds, sys, name } = weatherData;

    const handleSearch = () => {
        setForcastView(false)
        try {
            // Call 1st API to findout lat and loa values for given city 
            fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${apiKey}`)
                .then((res) => res.json())
                .then((data) => {

                    if (data.length !== 0) {
                        let lat = data[0].lat
                        let lon = data[0].lon

                        // Call 2nd API to find Weather detail for correct city
                        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)
                            .then((res) => res.json())
                            .then((data1) => {
                                setweatherData(data1)
                            })

                        // Call 3rd API to find 5 day weather forecast.
                        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`)
                            .then((res) => res.json())
                            .then((data3) => {
                                setweatherForecastData(data3)
                            })
                    } else {
                        setCityNameIsCorrect(false)
                    }
                })
        } catch (error) {
            console.log("Unexpected error", error)
        }
    };

    return (
        <section>
            <div className="weather">
                <h1>Weather Forecast Dashboard</h1>
                <input type="text" placeholder="Search by city name" value={cityName} onChange={(e) => setCityName(e.target.value)} required />
                <button onClick={handleSearch}>Search</button>
                {cityNameIsCorrect ? '' : <h3>Please enter correct city name...</h3>}

                {weatherData ?
                    <div className='weather-details'>
                        <img src={weatherImages?.[`${weather[0].description}`]} alt="" />
                        <div>

                            <h2>{name}, {sys.country}</h2>
                            <p>
                                <strong>Temperature:</strong> {tempUnitConverter(main.temp).toFixed(2)} (Feels like {tempUnitConverter(main.feels_like).toFixed(2)})
                                <span style={{
                                    color: tempUnitC ? 'blue' : 'black',
                                    fontWeight: tempUnitC ? 'bold' : 'normal',
                                    cursor: "pointer"
                                }} onClick={() => setTempUnitC(true)} >&#8451;</span>  | <span style={{
                                    color: tempUnitC ? 'black' : 'blue',
                                    fontWeight: tempUnitC ? 'normal' : 'bold',
                                    cursor: "pointer"
                                }} onClick={() => setTempUnitC(false)}>&#8457;</span>
                            </p>
                            <p><strong>Min Temp:</strong> {tempUnitConverter(main.temp_min).toFixed(2)}</p>
                            <p><strong>Max Temp:</strong> {tempUnitConverter(main.temp_max).toFixed(2)}</p>
                            <p><strong>Humidity:</strong> {main.humidity}%</p>
                            <p><strong>Wind:</strong>{wind.speed} m/s, <strong>Direction:</strong> {getWindDirection(wind.deg)}</p>
                            <p><strong>Description:</strong> {weather[0].description}</p>
                            <p><strong>Cloudiness:</strong> {clouds.all}%</p>
                            <br />
                            <button onClick={handleViewforcast} >View Next 5Days Weather Forcast</button>
                        </div>
                    </div>
                    : ''}
            </div>
            {forcastView ? <WeatherForecast daysforecast={weatherForecastData} weatherImages={weatherImages} /> : ''}
        </section>
    );
};

export default Weather;
