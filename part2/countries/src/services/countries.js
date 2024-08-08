import axios from "axios";

const getAll = () => {
    const request = axios.get('https://studies.cs.helsinki.fi/restcountries/api/all');
    return request.then(response => response.data);
}

const getCountriesByName = name => {
    const request = axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`);
    return request.then(response => response.data);
}

const objectIntoArrayValues = ob => {
    return Object.values(ob).reduce((acc, value) => {
        if (typeof value === 'string') return acc.concat(value);
        return acc.concat(objectIntoArrayValues(value))
    }, []);
}

export default {
    getAll,
    getCountriesByName,
    objectIntoArrayValues
}