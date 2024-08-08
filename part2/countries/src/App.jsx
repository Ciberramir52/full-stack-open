import { useEffect, useState } from "react"
import countryService from "./services/countries"
import Country from "./components/Country";
import CountryList from "./components/CountryList";

function App() {
  const [inputValue, setInputValue] = useState('');
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(null);
  const onInputChange = (e) => {
    setInputValue(e.target.value);
  }

  console.log(countries);

  const onShowCountry = c => () => {
    setCountry(c);
  }


  const searchCountries = countries => {
    const result = countries.filter(country => countryService.objectIntoArrayValues({ name: country.name, spelling: country.altSpellings }).find(value => value.toLowerCase().includes(inputValue.toLowerCase())))
    setCountries(result);
    setCountry(null);
  }


  useEffect(() => {
    countryService.getAll().then(countries => searchCountries(countries));
  }, [inputValue])

  return (
    <>
      <p>Find countries <input value={inputValue} onChange={onInputChange} type="text" /></p>
      {
        countries.length > 10
          ? <p>Too many countries, specify another filter</p>
          : countries.length !== 1
          ? countries.map(country => (<CountryList country={country} handleClick={onShowCountry} key={country.name.common}/>))
          : <Country country={countries[0]}/>
      }
      {
        country && <Country country={country}/>
      }
    </>
  )
}

export default App
