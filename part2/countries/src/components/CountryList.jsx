function CountryList({ country, handleClick }) {
    return ( 
        <p>{ country.name.common } <button onClick={handleClick(country)}>show</button></p>
     );
}

export default CountryList;