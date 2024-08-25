import React from 'react';

const WeatherForecast = ({daysforecast, weatherImages}) => {
  const groupByDay = (data) => {
    const days = {};
    data?.list?.forEach(item => {
        const date = new Date(item.dt_txt).toLocaleDateString("en-US", {
            weekday: 'long',
            day: 'numeric',
            month: 'short'
        });

        if (!days[date]) {
            days[date] = [];
        }
        days[date].push(item);
    });
    return days;
};

const groupedData = groupByDay(daysforecast);

  return (
    <div className='weather-forecast'>
        <div className="forecast-container">
            {Object.keys(groupedData).map((day, index) => (
                <div key={index} className="forecast-day">
                    <h3>{day}</h3>
                    <div className="forecast-scroll">
                        {groupedData[day].map((item, idx) => (
                            <div key={idx} className="forecast-item">
                               <img src={weatherImages?.[`${item.weather[0].description}`]} alt="" />
                                <p>{new Date(item.dt_txt).toLocaleTimeString("en-US", {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}</p>
                                <p>Temp: {((item.main.temp - 273.15).toFixed(2))}°C</p>
                                <p>Wind: {item.wind.speed} m/s, {item.wind.deg}°</p>
                                <p>{item.weather[0].description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default WeatherForecast;
