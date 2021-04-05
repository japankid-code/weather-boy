const openweatherAPIkey = `39013a4639d8aedbe6d4da81a858d623`; // shh this is a secret

const searchHistButton = document.getElementById("old-search");
const forecastArticle = document.getElementById("forecast-article");

const searchHistList = document.getElementById("search-history");
const forecastList = document.getElementById("forecast-container");

const cityEl = document.getElementById("city-name");
const dateEl = document.getElementById("current-date");
const iconEl = document.getElementById("weather-icon");
const tempEl = document.getElementById("temp-now");
const windEl = document.getElementById("wind-now");
const humidityEl = document.getElementById("humidity-now");
const indexEl = document.getElementById("UV-index");

searchHistList.innerHTML = '';
forecastList.innerHTML = '';

const dateStringer = (date) => {
    return ("0" + date.getUTCDate()).slice(-2) + "/" + 
    ("0" + (date.getUTCMonth()+1)).slice(-2) + "/" + 
    date.getUTCFullYear();
}

function myFunction(city) {
    city = document.getElementById('search-input').value;
    fetch(// first openweather fetch for today's data.
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openweatherAPIkey}&units=imperial`
    )
    .then((response) => response.json())
    .then((todayDataObj) => {
        // get the city name
        let cityName = todayDataObj.name;
        cityEl.innerHTML = cityName;
        // use the date to pull out year, month and day
        let dataTime = todayDataObj.dt;
        let now = new Date(dataTime * 1000);
        let dateString = dateStringer(now);
        dateEl.innerHTML = dateString;
        // get the icon code to pass in to the icon img src
        let todayIconCode = todayDataObj.weather[0].icon;
        let iconUrl = `http://openweathermap.org/img/w/${todayIconCode}.png`;
        iconEl.innerHTML = `<img src='${iconUrl}' class="inline"/>`;
        // put the temp inside a new span and append it to today's weather
        let todayTemp = todayDataObj.main.temp;
        let tempValue = document.createElement("span");
        tempValue.innerHTML = `${todayTemp} &deg;F`;
        if (tempEl.childElementCount <= 1) {
            tempEl.appendChild(tempValue);
        }
        // put the wind inside a new span and append it to today's weather
        let todayWind = todayDataObj.wind.speed;
        let windValue = document.createElement("span");
        windValue.innerHTML = `${todayWind} MPH`;
        if (windEl.childElementCount <= 1) {
            windEl.appendChild(windValue);
        }
        // put the humidity inside a new span and append it to today's weather
        let todayHumidity = todayDataObj.main.humidity;
        let humidityValue = document.createElement("span");
        humidityValue.innerHTML = `${todayHumidity} %`;
        if (humidityEl.childElementCount <= 1) {
            humidityEl.appendChild(humidityValue);
        }

        // grab the latitude and longitude from today's data,
        let lat = todayDataObj.coord.lat;
        let lon = todayDataObj.coord.lon;
        // pass to a consecutive fetch grabbing the UV index for the day
        let UVindexUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${openweatherAPIkey}`;        
        // response.value

        let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${openweatherAPIkey}&units=imperial`;
        // pass to a fetch to grab the forecast
    })
}


myFunction('milwaukee');