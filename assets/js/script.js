const apiKey = 'aa1cf3cf32bb67cd868cafdf3e2b7b1a'
const search = $('#search-button')

function fetchWeather(search) {
    let queryURL = `http://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=5&appid=${apiKey}`

    fetch(queryURL)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            console.log(`geo data: ${data}`);
            let latitude = data[0].lat
            let longitude = data[0].lon
            let forecastURl = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
            const h3El = $('#card-title').text(`Name: ${data[0].name} (${dayjs().format('MMMM D, YYYY')})`)
            fetch(forecastURl)
                .then(function (response) {
                    return response.json()
                })
                .then(function (data) {
                    displayForecast(data)
                    addToSearchHistory(search);
                }
                )
        })
}

function displayCurrentWeather(currentWeather) {
    const iconURL = `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png` //ICON
    const icon = $('#icon').attr('src', iconURL)
    const tempEl = $('#temp').text(`Temp : ${currentWeather.main.temp} °C`)
    const windEl = $('#wind').text(`Wind : ${currentWeather.wind.speed}`)
    const humidityEl = $('#humidity').text(`Humidity : ${currentWeather.main.humidity}`)
}

function displayForecast(data) {
    const currentWeather = data.list
    displayCurrentWeather(data.list[0])

    let fiveDayForecast = currentWeather.filter(function (data) {
        return data.dt_txt.includes('12:00:00')
    })

    console.log(fiveDayForecast)
    $('#forecast').empty()

    for (let i = 0; i < fiveDayForecast.length; i++) {
        let day = fiveDayForecast[i];

        let cardCol = $('<div>').attr('class', 'card col-md p-1')
        let forecastCard = $('<div>').attr('class', 'card')
        let forecastCardBody = $('<div>').attr('class', 'card-body')
        let forecastTitle = $('<h5>').attr('class', 'card-title').text(dayjs(day.dt_txt).format('DD/MM/YYYY'))
        let forecastIconURL = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png` //ICON
        let forecastIcon = $('<img>').attr('src', forecastIconURL)
        let forecastTemp = $('<p>').text(`Temp: ${day.main.temp}C`)
        let forecastWind = $('<p>').text(`Wind: ${day.wind.speed}`)
        let forecastHumidity = $('<p>').text(`Humidity: ${day.main.humidity}`)

        $('#forecast').append(cardCol)
        cardCol.append(forecastCard)
        forecastCard.append(forecastCardBody)
        forecastCardBody.append(forecastTitle, forecastIcon, forecastTemp, forecastWind, forecastHumidity)
    }
}

// $(document).on('click', '.search-history-btn', function () {
//     let searchCity = $('.search-history-btn').val()
//     console.log(searchCity)
// })

$('#search-button').on('click', function (e) {
    e.preventDefault()
    const searchInput = $('#search-input').val().trim()
    $('#today').attr('class', 'mt-3')
    fetchWeather(searchInput)
    addToSearchHistory(searchInput)
})

function addToSearchHistory(searchTerm) {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistory.push(searchTerm);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    updateSearchHistoryDisplay();
}


function updateSearchHistoryDisplay() {
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    let searchHistoryEl = $('#history');

    searchHistoryEl.empty();

    for (let i = 0; i < searchHistory.length; i++) {
        const pastSearch = searchHistory[i];
        let searchHistoryBtn = $('<button>').text(pastSearch);
        searchHistoryBtn.addClass('search-history-btn');
        searchHistoryEl.append(searchHistoryBtn);
    }
}

// Call to updateSearchHistoryDisplay on document ready
$(document).ready(function () {
    updateSearchHistoryDisplay();
});