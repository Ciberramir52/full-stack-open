import axios from "axios"

const APIKey = import.meta.env.VITE_API_KEY;
// const APIKey = 'f4983ccf6c935461f5c8a1e197463796';

const getCountryWeather = (lat, lon) => {
    const req = axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKey}`)
    return req.then(response => response.data);
}

export default getCountryWeather;