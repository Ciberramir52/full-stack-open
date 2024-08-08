import { useEffect, useState } from "react";
import getCountryWeather from "../services/weather";

function Country({ country }) {

    const [weather, setWeather] = useState(null);

    useEffect(() => {
        getCountryWeather(country.capitalInfo.latlng[0], country.capitalInfo.latlng[1]).then(weather => {
            setWeather(weather);
            console.log(weather);
        });
    }, [])


    return (
        <div>
            <h1>{country.name.common}</h1>
            <p>Capital: {country.capital[0]}</p>
            <p>Area: {country.area}</p>
            <h3>Languages:</h3>
            <ul>
                {
                    Object.values(country.languages).map(language => <li key={language}>{language}</li>)
                }
            </ul>
            <img src={country.flags.svg} alt={country.flags.alt} />
            {
                weather && (
                    <div>
                        <h2>Weather in {country.capital}</h2>
                        <p>Temperature {(Math.round((weather.main.temp - 273.15) * 100) / 100).toFixed(2)} Celsius</p>
                        <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="" />
                        <p>Wind {weather.wind.speed} m/s</p>
                    </div>
                )
            }
        </div>
    );
}

export default Country;