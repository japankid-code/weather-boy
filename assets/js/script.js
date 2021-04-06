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
    return ("0" + (date.getUTCMonth()+1)).slice(-2) + "/" + 
    ("0" + date.getUTCDate()).slice(-2) + "/" +
    ("" + date.getUTCFullYear()).slice(-2);
}

function myFunction(city) {
    city = document.getElementById('search-input').value;
    fetch(// first openweather fetch for today's data.
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openweatherAPIkey}&units=imperial`
    )
    .then((response) => response.json())
    .then((todayDataObj) => {
        // values get overwritten for city, date and icon
        // get the city name
        let cityName = todayDataObj.name;
        cityEl.innerHTML = `${cityName} | `;
        // use the date to pull out year, month and day
        let dataTime = todayDataObj.dt;
        let now = new Date(dataTime * 1000);
        let dateString = dateStringer(now);
        dateEl.innerHTML = `${dateString} | `;
        // get the icon code to pass in to the icon img src
        let todayIconCode = todayDataObj.weather[0].icon;
        let iconUrl = `http://openweathermap.org/img/w/${todayIconCode}.png`;
        iconEl.innerHTML = `<img src='${iconUrl}' class="inline"/>`;


        // values get appended to the divs for wind, temp and hums.
        // put the temp inside a new span and append it to today's weather
        let todayTemp = todayDataObj.main.temp;
        let tempValue = document.createElement("span");
        tempValue.innerHTML = `${todayTemp} &deg;F`;
        if (tempEl.children.length <= 1) {
            tempEl.appendChild(tempValue);
        } else if (tempEl.children.length >= 2) {
            // checks if there is a value displayed and removes it if there is
            tempEl.removeChild(tempEl.children[1]);
            tempEl.appendChild(tempValue);
        }
        // put the wind inside a new span and append it to today's weather
        let todayWind = todayDataObj.wind.speed;
        let windValue = document.createElement("span");
        windValue.innerHTML = `${todayWind} MPH`;
        if (windEl.children.length <= 1) {
            windEl.appendChild(windValue);
        } else if (windEl.children.length >= 2) {
            windEl.removeChild(windEl.children[1]);
            windEl.appendChild(windValue);
        }
        // put the humidity inside a new span and append it to today's weather
        let todayHumidity = todayDataObj.main.humidity;
        let humidityValue = document.createElement("span");
        humidityValue.innerHTML = `${todayHumidity} %`;
        if (humidityEl.children.length <= 1) {
            humidityEl.appendChild(humidityValue);
        } else if (humidityEl.children.length >= 2) {
            humidityEl.removeChild(humidityEl.children[1]);
            humidityEl.appendChild(humidityValue);
        }

        // take care of UV index with another API call
        // grab the latitude and longitude from today's data,
        let lat = todayDataObj.coord.lat;
        let lon = todayDataObj.coord.lon;
        // pass to a consecutive fetch grabbing the UV index for the day
        let UVindexUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${openweatherAPIkey}`;        
        fetch(UVindexUrl)
            .then((response) => response.json())
            .then((UVDataObj) => {
                let UVI = UVDataObj.value;
                let indexValue = document.createElement("span");
                indexValue.setAttribute('id', 'index-value');
                indexValue.classList = 'bg-gray-400 rounded p-1';
                if (UVI <= 5) { // 0 to 5 is yellow
                    indexValue.classList.add('bg-yellow-400');
                } else if (UVI <= 7) { // 6-7 is orange
                    indexValue.classList.add('bg-orange-400');
                } else if (UVI <= 10.5) { // 8-10 red
                    indexValue.classList.add('bg-red-400');
                } else if (UVI > 10.5){ // 11+ is extreme purple
                    indexValue.classList.add('bg-purple-400');
                }
                
                indexValue.innerHTML = `${UVI}`;
                if (indexEl.childElementCount <= 1) {
                    indexEl.appendChild(indexValue);
                } else if (indexEl.children.length >= 2) {
                    indexEl.removeChild(indexEl.children[1]);
                    indexEl.appendChild(indexValue);
                }
            })
    
        // gather the forecast asynchronously to the other weather data
        let forecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${openweatherAPIkey}&units=imperial&exclude={current,minutely,hourly,alerts}`;
        fetch(forecastUrl)
            .then(response => response.json())
            .then(forecastData => {
                for (let i = 2; i <7; i++) {
                    // create the article element holding 1 day's forecast
                    let forecastArticle = document.createElement("article");
                    forecastArticle.classList = 'col-span-1 lg:col-span-5 text-center bg-gray-800 rounded m-1 p-1';
                    forecastArticle.setAttribute('src', `forecast-article-${i}`);
                    // grab value for the date and run it thru the stringer
                    let fDataTime = forecastData.daily[`${i}`].dt;
                    let now = new Date(fDataTime * 1000);
                    let fString = dateStringer(now);
                    let dateChild = document.createElement(`span`);
                    dateChild.innerHTML = `${fString}`;
                    forecastArticle.appendChild(dateChild);
                    // grab the icon code and append it using the APIs icon URL
                    let fIcon = forecastData.daily[`${i}`].weather[0].icon
                    let iconUrl = `http://openweathermap.org/img/w/${fIcon}.png`;
                    let iconChild = document.createElement("img");
                    iconChild.classList = '';
                    iconChild.src = iconUrl;
                    forecastArticle.appendChild(iconChild);
                    // add the temp, wind, humidity in using innerHTML to add  elements
                    let fTemp = forecastData.daily[`${i}`].temp.day;
                    let fWind = forecastData.daily[`${i}`].wind_speed;
                    let fHums = forecastData.daily[`${i}`].humidity;
                    iconChild.insertAdjacentHTML('afterend', 
                        `<div class='flex justify-between text-xs'><p>hums:</p><p>${fHums}%</p></div>`
                    );
                    iconChild.insertAdjacentHTML('afterend', 
                        `<div class='flex justify-between text-xs'><p>wind:</p><p>${fWind}MPH</p></div>`
                    );
                    iconChild.insertAdjacentHTML('afterend', 
                        `<div class='flex justify-between text-xs'><p>temp:</p><p>${fTemp}&deg;F</p></div>`
                    );
                    // add it all to the forecast-container
                    if (forecastList.children.length <= 5) {
                        forecastList.appendChild(forecastArticle);
                    } else if (forecastList.children.length >= 6) {
                        forecastList.innerHTML = '';
                        forecastList.appendChild(forecastArticle);
                    }
                }
            })
            
        
        })
        
}

myFunction();