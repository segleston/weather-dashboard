const apiKey = 'aa1cf3cf32bb67cd868cafdf3e2b7b1a'
// const fiveDayUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}`
// const currentDayUrl = `https://api.openweathermap.org/data/2.5/weather?q=${search}&limit=5&appid=${key}`
const search = $('#search-button')


let queryURL = `http://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=5&appid=${apiKey}`
    
    fetch(queryURL)
    .then(function (response) {
        return response.json()
    })
    .then(function (data) {
        console.log(`geo data: ${data}`);
        let latitude = data[0].lat
        let longitude = data[0].lon
        let forecastURl = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
        fetch(forecastURl)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            console.log(data);
           
        })
    })

// function fetchWeather(search) {
//     const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${search}&limit=5&appid=aa1cf3cf32bb67cd868cafdf3e2b7b1a`
//     fetch(queryURL)
//         .then(function (response) {
//             return response.json()
//         })
//         .then(function (data) {
//             console.log(data)
//             let latitude = data.coord.lat
//             let longitude = data.coord.lon
//             let forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=aa1cf3cf32bb67cd868cafdf3e2b7b1a`
//             displayCurrentWeather(data)

//             fetch(forecastURL)
//                 .then(function (response) {
//                     return response.json()
//                 })
//                 .then(function (data) {
//                     console.log(data)
//                     displayForecast(data)
//                 })
//         })
// }

// fetchWeather()

function displayCurrentWeather(date) {

    $('#card-title').text(data.name)
    $('#temp').text(`Temp: ${(data.main.temp - 272.15).toFixed(1)}C`)
    $('#wind').text(`Wind: ${data.wind.speed}KPH`)
    $('#humidity').text(`Humidity: ${data.main.humidity}%`)

}

function displayForecast(data) {
    forecastSection.empty()
    let forecastHeader = $('<h4>').text('5 day Forecast')
    forecastSection.append(forecastHeader)

    function checkNoon(forecast) {
        return forecast.dt.txt.includes('12:00:00')
    }

    let futureForecast = data.list.filter(checkNoon)
    console.log(futureForecast)

    for (let i = 0; i < futureForecast.length; i++) {
        let day = futureForecast[i];
        let forecastCard = $('<div>')
        forecastCard.attr('class', 'card col-md')
        let forecastCardBody = $('<div>')
        forecastCardBody.attr('class', 'card-body')
        let forecastTitle = $('<h5>')
        forecastCardBody.attr('class', 'card-title')
        forecastTitle.text(dayjs(day.dt_txt).format('DD/MM/YYYY'))
        let forecastTemp = $('<p>').text(`Temp: ${day.main.temp}C`)
        forecastCardBody.attr('class', 'card-body')
    }
}


function searchHistory() {
    let search = $('#search-input').val()
    let searchHistory = $('#history')

    searchHistory.empty()
    $('#search-input').text('')
    searches.push(search)
    console.log(searches)
    for (let i = 0; i < searches.length; i++) {
        const pastSearch = searches[i];
        let searchHistoryBtn = $('<button>').text(pastSearch)
        searchHistoryBtn.addClass('search-history-btn')
        searchHistory.append(searchHistoryBtn)  
    }
}

$(document).on('click', '.search-history-btn', function() {
    let searchCity = $('.search-history-btn').val()
    console.log(searchCity)
})

$('#search-button').on('click', function (e) {
    e.preventDefault()
    let search = $('#search-input').val()
    $('#today').attr('class', 'mt-3')

    fetchWeather(search)
    searchHistory()
})