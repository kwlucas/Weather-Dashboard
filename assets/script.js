let presets = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'London', 'Paris', 'Tokyo', 'Delhi']
//Use geo coding to get lat and lon of city then pass the coords into the weather one call to get curent weather and daily forcasts.

function unixTimeConversion(timestamp, isShort) {
    let ms = new Date(timestamp * 1000);
    let daysOfWeek = ['Sunday, ', 'Monday, ', 'Tuesday, ', 'Wednesday, ', 'Thursday, ', 'Friday, ', 'Saturday, '];
    if (isShort) {
        daysOfWeek = ['Sun.\n', 'Mon.\n', 'Tue.\n', 'Wed.\n', 'Thur.\n', 'Fri.\n', 'Sat.\n'];
    }
    //console.log(daysOfWeek);
    return `${daysOfWeek[ms.getDay()]}${ms.getMonth() + 1}-${ms.getDate()}-${ms.getFullYear()}`; //day, mm-dd-yyyy
}

//On load get latests searches and fill in buttons. Fill page with last search.
//If there are no or not enough latestes searches fill in with major cities.
function onPresetClick(event) {
    const city = event.target.value;
    searchCity(city);
}

//On search pass to geocode fetch function
//take the top result and from geo code and pass it into local storage and the weather fetch.
const apiKey = '7ae0bf3ccd81cce7de86e274da5f7efd';

function searchCity(query) {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${apiKey}`)
        .then(function (response) {
            //console.log(response)
            return response.json();
        }).then(function (data) {
            if (!data[0]) {
                alert(`No results found for "${query}".`);
                return;
            }
            let { name: cityName, lat: cityLat, lon: cityLon } = data[0];
            //console.log(`city: ${cityName}\nCords: ${cityLat}, ${cityLon}`);
            addToHistory(cityName);
            weatherFetch(cityLat, cityLon);
        });
}

function weatherFetch(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=imperial&appid=${apiKey}`)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            printCurrent(data['current']);
            printForecast(data['daily']);
        });
}

function printCurrent(currentWeather) {
    let { dt: unixTime, weather: [{ icon: iconID }] } = currentWeather;
    document.querySelector('#date').textContent = unixTimeConversion(unixTime);
    document.querySelector('#main-icon').setAttribute('src', `http://openweathermap.org/img/wn/${iconID}.png`)
    const items = document.querySelectorAll('.current-weather');
    items.forEach(element => {
        const key = element.id.split('-')[1];
        element.textContent = currentWeather[key];
    });
}

function printForecast(forecastWeather) {
    for (let i = 1; i < 6; i++) {
        let { dt: unixTime, temp: { day: temp }, wind_speed: wind, humidity: humid, weather: [{ icon: iconID }] } = forecastWeather[i];
        document.querySelector(`#day${i}-day`).textContent = unixTimeConversion(unixTime, true);
        document.querySelector(`#day${i}-icon`).setAttribute('src', `http://openweathermap.org/img/wn/${iconID}.png`);
        document.querySelector(`#day${i}-temp`).textContent = temp;
        document.querySelector(`#day${i}-wind`).textContent = wind;
        document.querySelector(`#day${i}-humid`).textContent = humid;
    }
}
//local storage function updates every search. Loads cities onto buttons. Most recent one on the top.
function addToHistory(city, isInitalLoad) {
    let index = presets.indexOf(city);
    if (index > -1) {
        presets.splice(index, 1);
    }
    else {
        presets.pop();
    }
    presets.unshift(city);

    if (isInitalLoad) {
        return;
    }
    document.querySelector('#city-name').textContent = city;
    const historyBtns = document.querySelectorAll('.historyButton');
    for (let i = 0; i < historyBtns.length; i++) {
        const btn = historyBtns[i];
        const content = presets[i];
        btn.textContent = content;
        btn.setAttribute('value', content);
    }
    localStorage.setItem('search-history', presets.join());
}
//deconstruct weather response and change text content on page.


window.addEventListener('load', function () {
    const formEl = document.querySelector('#search-form');
    const historyBtns = document.querySelectorAll('.historyButton');
    let recentSearches = localStorage.getItem('search-history');

    formEl.addEventListener('submit', (event) => {
        event.preventDefault();
        let query = document.querySelector('#city-search').value.trim();
        if (query) {
            searchCity(query);
            formEl.reset();
        }
        else {
            console.log(`"${query}" is not a valid search term!`)
        }
    });

    if (recentSearches) {
        recentSearches = recentSearches.split(',')
        for (let i = recentSearches.length - 1; i >= 0; i--) {
            addToHistory(recentSearches[i], true)
        }
    }
    //document.querySelector('#city-name').textContent = presets[0];
    searchCity(presets[0]);
    for (let i = 0; i < historyBtns.length; i++) {
        const btn = historyBtns[i];
        const content = presets[i];
        btn.textContent = content;
        btn.setAttribute('value', content);
        btn.addEventListener('click', onPresetClick)
    }

});