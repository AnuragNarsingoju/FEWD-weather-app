import {Component} from 'react'
import Loader from 'react-loader-spinner'

import '../index.css'

class NewWeather extends Component {
  state = {
    search: '',
    name: '',
    ram: true,
    loader: true,
    dataList: [],
    error: false,
    suggestions: [],
    showSuggestions: false,
    fetchingSuggestions: false
  }

  // List of major Indian cities
  indianCities = [
    {name: 'Mumbai', region: 'Maharashtra'},
    {name: 'Delhi', region: 'Delhi'},
    {name: 'Bangalore', region: 'Karnataka'},
    {name: 'Hyderabad', region: 'Telangana'},
    {name: 'Chennai', region: 'Tamil Nadu'},
    {name: 'Kolkata', region: 'West Bengal'},
    {name: 'Ahmedabad', region: 'Gujarat'},
    {name: 'Pune', region: 'Maharashtra'},
    {name: 'Jaipur', region: 'Rajasthan'},
    {name: 'Lucknow', region: 'Uttar Pradesh'},
    {name: 'Kanpur', region: 'Uttar Pradesh'},
    {name: 'Nagpur', region: 'Maharashtra'},
    {name: 'Indore', region: 'Madhya Pradesh'},
    {name: 'Thane', region: 'Maharashtra'},
    {name: 'Bhopal', region: 'Madhya Pradesh'},
    {name: 'Visakhapatnam', region: 'Andhra Pradesh'},
    {name: 'Vadodara', region: 'Gujarat'},
    {name: 'Patna', region: 'Bihar'},
    {name: 'Ghaziabad', region: 'Uttar Pradesh'},
    {name: 'Ludhiana', region: 'Punjab'},
    {name: 'Agra', region: 'Uttar Pradesh'},
    {name: 'Nashik', region: 'Maharashtra'},
    {name: 'Ranchi', region: 'Jharkhand'},
    {name: 'Faridabad', region: 'Haryana'},
    {name: 'Coimbatore', region: 'Tamil Nadu'},
    {name: 'Srinagar', region: 'Jammu and Kashmir'},
    {name: 'Surat', region: 'Gujarat'},
    {name: 'Thiruvananthapuram', region: 'Kerala'},
    {name: 'Kochi', region: 'Kerala'},
    {name: 'Guwahati', region: 'Assam'},
    {name: 'Chandigarh', region: 'Chandigarh'},
    {name: 'Bhubaneswar', region: 'Odisha'},
    {name: 'Dehradun', region: 'Uttarakhand'},
    {name: 'Raipur', region: 'Chhattisgarh'},
    {name: 'Amritsar', region: 'Punjab'},
    {name: 'Varanasi', region: 'Uttar Pradesh'},
    {name: 'Allahabad', region: 'Uttar Pradesh'},
    {name: 'Shimla', region: 'Himachal Pradesh'},
    {name: 'Mysore', region: 'Karnataka'},
    {name: 'Puducherry', region: 'Puducherry'}
  ]

  // API key for OpenWeatherMap
  apiKey = 'c3e89bc97eb6bd54a4b2b7ea34b98c35'

  componentDidMount() {
    const getData = async () => {
      this.setState({loader: true})
      const url = `https://api.openweathermap.org/data/2.5/weather?q=hyderabad&appid=${this.apiKey}`

      const response = await fetch(url)

      const data = await response.json()
      console.log(data)
      this.setState({loader: false, dataList: data})
    }
    getData()
  }

  // Debounce function to limit API calls
  debounce = (func, delay) => {
    let debounceTimer
    return function() {
      const context = this
      const args = arguments
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => func.apply(context, args), delay)
    }
  }

  // Function to filter Indian cities based on search input
  filterIndianCities = this.debounce((query) => {
    if (!query.trim()) {
      this.setState({showSuggestions: false, suggestions: [], fetchingSuggestions: false})
      return
    }
    
    // Setting the loading state
    this.setState({fetchingSuggestions: true})
    
    // Filter cities based on the query (case insensitive)
    const filteredCities = this.indianCities.filter(city => 
      city.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5) // Limit to 5 suggestions
    
    // Update state with filtered cities
    this.setState({
      suggestions: filteredCities,
      showSuggestions: filteredCities.length > 0,
      fetchingSuggestions: false
    })
  }, 300)

  searchCity = event => {
    const searchTerm = event.target.value
    this.setState({search: searchTerm})
    
    if (searchTerm.trim() === '') {
      this.setState({showSuggestions: false, suggestions: []})
      return
    }
    
    // Use the Indian cities filter function
    this.filterIndianCities(searchTerm)
  }

  selectSuggestion = (city) => {
    this.setState({
      search: city.name,
      showSuggestions: false
    }, () => {
      this.SubmitCity()
    })
  }

  handleBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      this.setState({showSuggestions: false})
    }, 200)
  }

  getData12 = async () => {
    this.setState({loader: true})
    const url = `https://api.openweathermap.org/data/2.5/weather?q=Hyderabad&appid=${this.apiKey}`

    const response = await fetch(url)
    console.log(response)
    const data = await response.json()
    console.log(data)
    this.setState({loader: false, dataList: data, error: false})
  }

  SubmitCity = async () => {
    console.log('data')
    this.setState({loader: true})
    const {search} = this.state
    
    if (!search.trim()) {
      this.setState({loader: false})
      return
    }
    
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=${this.apiKey}`

    const response = await fetch(url)

    const data = await response.json()
    console.log(data)
    if (response.ok) {
      this.setState({loader: false, dataList: data, search: ''})
    } else {
      this.setState({loader: false, error: true, search: ''})
    }
  }

  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.SubmitCity()
    }
  }

  render() {
    const {loader, dataList, error, search, suggestions, showSuggestions, fetchingSuggestions} = this.state
    console.log(dataList)
    return (
      <div className="backgroundNew">
        <div className="app-header">
          <div className="app-container">
            <div className="backgroundHome1">
              <h1 className="app-title">India Weather Dashboard</h1>
              <div className="search-container">
                <input
                  type="text"
                  className="input"
                  placeholder="Search for an Indian city..."
                  onChange={this.searchCity}
                  onKeyPress={this.handleKeyPress}
                  onBlur={this.handleBlur}
                  value={search}
                />
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="suggestions-list">
                    {suggestions.map((city, index) => (
                      <li 
                        key={index} 
                        onClick={() => this.selectSuggestion(city)}
                        className="suggestion-item"
                      >
                        {city.name}, {city.region}
                      </li>
                    ))}
                  </ul>
                )}
                {fetchingSuggestions && (
                  <div className="suggestion-loading">
                    <div className="suggestion-spinner"></div>
                  </div>
                )}
                <div className="button-container">
                  {!error && (
                    <button
                      type="button"
                      className="search-btn full-width"
                      onClick={this.SubmitCity}
                    >
                      Search
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="app-container">
          <div className="content-container">
            {!loader ? (
              <>
                {!error ? (
                  <div className="weather-main">
                    <div className="weather-card">
                      <div className="weather-card-content">
                        <h2 className="city-name">{dataList.name}</h2>
                        <div className="temperature">
                          {(dataList.main.temp - 273.15).toFixed(1)}°C
                        </div>
                        <img
                          src={`https://openweathermap.org/img/wn/${dataList.weather[0].icon}@4x.png`}
                          alt={dataList.name}
                          className="weatherImage"
                        />
                        <h3 className="weather-condition">{dataList.weather[0].main}</h3>
                        <p className="weather-description">{dataList.weather[0].description}</p>
                      </div>
                    </div>
                    
                    <div className="weather-details">
                      <div className="info-card">
                        <img
                          src="https://img.icons8.com/color/512/snowflake.png"
                          alt="cool"
                        />
                        <h5>Minimum Temperature</h5>
                        <div className="info-value">
                          {(dataList.main.temp_min - 273.15).toFixed(1)}°C
                        </div>
                      </div>
                      
                      <div className="info-card">
                        <img
                          src="https://img.icons8.com/parakeet/512/summer.png"
                          alt="warm"
                        />
                        <h5>Maximum Temperature</h5>
                        <div className="info-value">
                          {(dataList.main.temp_max - 273.15).toFixed(1)}°C
                        </div>
                      </div>
                      
                      <div className="info-card">
                        <img
                          src="https://img.icons8.com/external-justicon-flat-justicon/512/external-humidity-weather-justicon-flat-justicon.png"
                          alt="humidity"
                        />
                        <h5>Humidity</h5>
                        <div className="info-value">
                          {dataList.main.humidity}%
                        </div>
                      </div>
                      
                      <div className="info-card">
                        <img
                          src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/512/external-pressure-weather-flaticons-lineal-color-flat-icons.png"
                          alt="pressure"
                        />
                        <h5>Pressure</h5>
                        <div className="info-value">
                          {dataList.main.pressure} hPa
                        </div>
                      </div>
                      
                      <div className="wind-card">
                        <img
                          src="https://img.icons8.com/color/512/windsock.png"
                          alt="wind"
                        />
                        <h5>Wind Speed: {dataList.wind.speed} m/s</h5>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="background1">
                    <h4>City Not Found!</h4>
                    <p>Please check the spelling and try again</p>
                    <button
                      type="button"
                      className="search-btn"
                      onClick={this.getData12}
                    >
                      Try Default City
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="loading-container">
                <Loader type="TailSpin" color="#6e45e2" height={80} width={80} />
                <p className="loading-text">Fetching weather data...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default NewWeather 