const openweatherAPIkey = `39013a4639d8aedbe6d4da81a858d623`; // shh this is a secret

const searchHistButton = document.getElementById("old-search");
const forecastArticle = document.getElementById("forecast-article");

const searchHistList = document.getElementById("search-history");
const forecastList = document.getElementById("forecast-container");

const city = document.getElementById("city-name");
const date = document.getElementById("current-date");
const icon = document.getElementById("weather-icon");
const temp = document.getElementById("temp-now");
const wind = document.getElementById("wind-now");
const humidity = document.getElementById("humidity-now");
const index = document.getElementById("UV-index");

searchHistList.innerHTML = '';
forecastList.innerHTML = '';
city.innerHTML = '';
date.innerHTML = '';
icon.innerHTML = '';

const dateStringer = (date) => {
    return date.getUTCFullYear() + "/" + 
    ("0" + (date.getUTCMonth()+1)).slice(-2) + "/" + 
    ("0" + date.getUTCDate()).slice(-2);
}

function myFunction(city) {
    city = document.getElementById('search-input').value;
    fetch(// first openweather fetch for today's data.
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openweatherAPIkey}&units=imperial`
    )
    .then((response) => response.json())
    .then((todayDataObj) => {
        // use the date to pull out year, month and day
        let dataTime = todayDataObj.dt;
        let now = new Date(dataTime * 1000);
        let dateString = dateStringer(now);
        console.log(dateString);
        // get the city name
        let cityName = todayDataObj.name;
        console.log(cityName);
        // get the icon code to pass in to the icon img src
        let todayIconCode = todayDataObj.weather[0].icon;
        let iconUrl = `http://openweathermap.org/img/w/${todayIconCode}.png`
        console.log(iconUrl);
        // get the temp and append it to today's weather
        let todayTemp = todayDataObj.main.temp;
        console.log(todayTemp);
        // get the wind and append it to today's weather
        let todayWind = todayDataObj.wind.speed;
        console.log(todayWind);
        // get the humidity and append it to today's weather
        let todayHumidity = todayDataObj.main.humidity;
        console.log(todayHumidity);
        // grab the latitude and longitude from today's data,
        let lat = todayDataObj.coord.lat;
        let lon = todayDataObj.coord.lon;
        // pass to a fetch grabbing the UV index for the day
        let UVindexUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${openweatherAPIkey}`;
        // response.value

        let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${openweatherAPIkey}&units=imperial`;
        // pass to a fetch to grab the forecast
    })

    
    
}


