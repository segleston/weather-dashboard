const apiKey = 'aa1cf3cf32bb67cd868cafdf3e2b7b1a'
const search = $('#search-button')

// Function to fetch the current weather
function fetchWeather(search) {
    // Weather API
    let queryURL = `http://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=5&appid=${apiKey}`

    fetch(queryURL)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            console.log(`geo data: ${data}`);
            // Variables for location lat/long values
            let latitude = data[0].lat
            let longitude = data[0].lon
            // current location with lat/long values
            let forecastURl = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
            const h3El = $('#card-title').text(`Location: ${data[0].name} (${dayjs().format('MMMM D, YYYY')})`)
            // fetching data from API
            fetch(forecastURl)
                .then(function (response) {
                    return response.json()
                })
                .then(function (data) {
                    displayForecast(data)
                    addToSearchHistory(search);
                    photoAPI(search)
                }
                )
        })
}
// function to display current weather to page, linking to index.html elements
function displayCurrentWeather(currentWeather) {
    const iconURL = `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}.png` //ICON
    const icon = $('#icon').attr('src', iconURL)
    const tempEl = $('#temp').text(`Temp : ${currentWeather.main.temp} °C`)
    const windEl = $('#wind').text(`Wind : ${currentWeather.wind.speed} KPH`)
    const humidityEl = $('#humidity').text(`Humidity : ${currentWeather.main.humidity} %`)
}
// function to display the next 5 days of weather for the location selected
function displayForecast(data) {
    const currentWeather = data.list
    displayCurrentWeather(data.list[0])
    // getting weather for a specific time of the day - 12pm
    let fiveDayForecast = currentWeather.filter(function (data) {
        return data.dt_txt.includes('12:00:00')
    })

    console.log(fiveDayForecast)
    $('#forecast').empty()
    //looping through each day forecast
    for (let i = 0; i < fiveDayForecast.length; i++) {
        let day = fiveDayForecast[i];
        //creating div/h5/p/img elements for each day forecast
        let cardCol = $('<div>').attr('class', 'col-md')
        let forecastCard = $('<div>').attr('class', 'card')
        let forecastCardBody = $('<div>').attr('class', 'card-body bg-dark-subtle')
        let forecastTitle = $('<h5>').attr('class', 'card-title').text(dayjs(day.dt_txt).format('DD/MM/YYYY'))
        let forecastIconURL = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png` //ICON
        let forecastIcon = $('<img>').attr('src', forecastIconURL)
        let forecastTemp = $('<p>').text(`Temp: ${day.main.temp}C`)
        let forecastWind = $('<p>').text(`Wind: ${day.wind.speed} KPH`)
        let forecastHumidity = $('<p>').text(`Humidity: ${day.main.humidity} %`)
        // appending to card
        $('#forecast').append(cardCol)
        cardCol.append(forecastCard)
        forecastCard.append(forecastCardBody)
        forecastCardBody.append(forecastTitle, forecastIcon, forecastTemp, forecastWind, forecastHumidity)
    }
}

// on click, getting value of search input and fetching weather with search input value
$('#search-button').on('click', function (e) {
    e.preventDefault()
    const searchInput = $('#search-input').val().trim()
    $('#today').attr('class', 'mt-3')
    fetchWeather(searchInput)
})

$(document).on('click', '.search-history-btn', function () {
    const selectedCity = $(this).text()
    fetchWeather(selectedCity)
    $('#today').removeClass('hide')
})

// adding search history to local storage
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
    //looping through the search history
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


function photoAPI(search) {
    const photoKey = '41816747-a2efef2557d1bb9221cc90625'
    const photoURL = `https://pixabay.com/api/?key=${photoKey}&q=${search}&image_type=photo`

    fetch(photoURL)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            const backgroundURL = data.hits[0].largeImageURL;

            // Set background image to the .background element
            $('.background').css('background-image', `url(${backgroundURL})`);
        })
        .catch(function (error) {
            console.error('Error fetching photo:', error);
        });
}
