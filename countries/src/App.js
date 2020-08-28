import React, { useState, useEffect } from 'react';
import axios from "axios";


const Search = ({ search, handleSearch }) => {
  return (
    <div>find countries <input vale={search} onChange={handleSearch} /></div>
  )
}

const DisplayCountry = ({country}) => {
  const [temperature, setTemperature] = useState()
  const [windSpeed, setWindSpeed] = useState()
  const [windDirection, setWindDirection] = useState()
  const [weatherIcon, setWeatherIcon] = useState()
  
  useEffect(()=>{
    const api_key = process.env.REACT_APP_API_KEY
  
    axios
      .get(`http://api.weatherstack.com/current?access_key=${api_key}&query=${country.capital}`)
      .then((response)=>{
        const current = response.data.current;
        setTemperature(current.temperature)
        setWindSpeed(current.wind_speed)
        setWindDirection(current.wind_dir)
        setWeatherIcon(current.weather_icons[0])
        
      })
  },[country])

  return (
    <div>
      <h1>{country.name}</h1>
      <div>capital: {country.capital}</div>
      <div>population: {country.population}</div>
      <h1>Languages</h1>
      <ul>
        {country.languages.map(lang => {
          return (<li key={lang.iso639_1}>{lang.name}</li>)
        })}
      </ul>
      <img src={country.flag} alt="flag" height="100" width="100"/>
      <h1>Weather in {country.capital}</h1>
      <p><strong>temperature:</strong> {temperature} Celcius</p>
      <img alt="" src={weatherIcon} />
      <p><strong>wind:</strong> {windSpeed} mph direction {windDirection}</p>
    </div>
  )
}

const DisplayResults = ({ results, setResult }) => {
  if (results.length > 10) {
    return (<div>Too many matches, specify another filter</div>)
  }
  else if (results.length > 1) {    
    return (
      <div>
        {results.map(country =>
          <div key={country.alpha2Code}>
            {country.name}
            <button onClick={()=>setResult(country)}>show</button>
          </div>)}
      </div>
    )
  }
  else if (results.length === 1) {
    return (
      <DisplayCountry country={results[0]} />
    )
  }
  else {
    return (<div></div>)
  }
}
function App() {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])
  const [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    axios
      .get("https://restcountries.eu/rest/v2/all")
      .then(response => {
        setCountries(response.data)
      })
      .catch(err => console.log(err))
  }, [])
  console.log("Countries: ", countries.length)

  const handleSearch = (value) => {
    setSearch(value)
    const results = countries.filter(country => country.name.toLowerCase().includes(search))
    setSearchResults(results)
  }

  return (
    <div>
      <Search search={search} handleSearch={(e)=>handleSearch(e.target.value)} />
      <DisplayResults results={searchResults}
        setResult={(res) => { setSearchResults([res]) }} />
    </div>
  );
}

export default App;
