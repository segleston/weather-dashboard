const key = 'aa1cf3cf32bb67cd868cafdf3e2b7b1a'
// const fiveDayUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}`
// const currentDayUrl = `https://api.openweathermap.org/data/2.5/weather?q=${search}&limit=5&appid=${key}`
const search = $('#search-button')


function fetchWeather(search) {
    const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${search}&limit=5&appid=${key}`
    fetch(queryURL)
    .then(function (response) {
        return response.json()
    })
    .then(function (data){
        console.log(data)
        let latitude = data.coord.lat
        let longitude = data.coord.lon
        let forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${key}`
        displayCurrentWeather(data)

    fetch(forecastURL)
    .then(function (response){
        return response.json()
    })
    .then(function (data){
        console.log(data)
        displayForecast(data)
    })
    })
}

// fetchWeather()