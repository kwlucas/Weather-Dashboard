let presets = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'London', 'Paris', 'Tokyo', 'Delhi']

function unixTimeConversion(timestamp, isShort) {
    //convert seconds to milliseconds
    let ms = new Date(timestamp * 1000);
    //array of days of the week to be appended to date
    let daysOfWeek = ['Sunday, ', 'Monday, ', 'Tuesday, ', 'Wednesday, ', 'Thursday, ', 'Friday, ', 'Saturday, '];
    if (isShort) {
        //set days of week to abriviated form if the is short argument is passed in as true
        daysOfWeek = ['Sun.\n', 'Mon.\n', 'Tue.\n', 'Wed.\n', 'Thur.\n', 'Fri.\n', 'Sat.\n'];
    }
    
    //concat date in Day, mm-dd-yyyy format
    return `${daysOfWeek[ms.getDay()]}${ms.getMonth() + 1}-${ms.getDate()}-${ms.getFullYear()}`; //day, mm-dd-yyyy
}

//Preset/history buttons event handling
function onPresetClick(event) {
    //get value of button and search for it
    const city = event.target.value;
    searchCity(city);
}

//API key should not be stored in public repos, but will remain until we gone over how to hide it
const apiKey = '7ae0bf3ccd81cce7de86e274da5f7efd';

function searchCity(query) {
    //get the first result for searching for a city
    fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${apiKey}`)
        .then(function (response) {
            //console.log(response)
            return response.json();
        }).then(function (data) {
            //if there is no data then send an alert.
            if (!data[0]) {
                alert(`No results found for "${query}".`);
                return;
            }
            //deconstruct data for the city name, and the lat and lon cords
            let { name: cityName, lat: cityLat, lon: cityLon } = data[0];
            //console.log(`city: ${cityName}\nCords: ${cityLat}, ${cityLon}`);
            //pass city into "addToHistory" function in order to add it to local history
            addToHistory(cityName);
            weatherFetch(cityLat, cityLon);
        });
}

function weatherFetch(lat, lon) {
    //get weather data using the city's lat and lon cords
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=imperial&appid=${apiKey}`)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            //send the current and forecast weather information to their respective print functions
            printCurrent(data['current']);
            printForecast(data['daily']);
        });
}

function printCurrent(currentWeather) {
    //deconstruct date(in unix timestamp) amd the weather icon id from passed argument
    let { dt: unixTime, weather: [{ icon: iconID }] } = currentWeather;
    //set the text content and image source of the date and icon html elements respectively
    document.querySelector('#date').textContent = unixTimeConversion(unixTime);
    document.querySelector('#main-icon').setAttribute('src', `https://openweathermap.org/img/wn/${iconID}.png`)

    const items = document.querySelectorAll('.current-weather');
    //for each element with the current-weather class take the second part of their id and use it to get data
    items.forEach(element => {
        const key = element.id.split('-')[1];
        element.textContent = currentWeather[key];
    });
    const uvIndexEl = document.querySelector('#main-uvi');
    const uvi = Number(currentWeather['uvi']);
    //clear color classes from uv index element
    uvIndexEl.classList.remove('success', 'caution', 'danger');
    //add a class to put a color around the UV index element depending on how hight the UV index is
    if(uvi <= 2){
        uvIndexEl.classList.add('success');
    }
    else if(uvi <= 5){
        uvIndexEl.classList.add('caution');
    }
    else {
        uvIndexEl.classList.add('danger');
    }
}

function printForecast(forecastWeather) {
    for (let i = 1; i < 6; i++) {
        //for each of the next five days get weather data and set the html elements
        let { dt: unixTime, temp: { day: temp }, wind_speed: wind, humidity: humid, weather: [{ icon: iconID }] } = forecastWeather[i];
        document.querySelector(`#day${i}-day`).textContent = unixTimeConversion(unixTime, true);
        document.querySelector(`#day${i}-icon`).setAttribute('src', `https://openweathermap.org/img/wn/${iconID}.png`);
        document.querySelector(`#day${i}-temp`).textContent = temp;
        document.querySelector(`#day${i}-wind`).textContent = wind;
        document.querySelector(`#day${i}-humid`).textContent = humid;
    }
}

function addToHistory(city, isInitalLoad) {
    let index = presets.indexOf(city);
    //if the city is already in the search history remove it
    if (index > -1) {
        presets.splice(index, 1);
    }
    else {
        //remove the last element in the search history
        presets.pop();
    }
    //add the new city to the front of the search history.
    presets.unshift(city);

    //if this is being called on the page load (if the "isInitalLoad" argument is passed in as true)
    //then stop the function here
    if (isInitalLoad) {
        return;
    }
    //set the city name to the newly added city
    document.querySelector('#city-name').textContent = city;

    const historyBtns = document.querySelectorAll('.historyButton');
    //set all the search history/preset buttons
    for (let i = 0; i < historyBtns.length; i++) {
        const btn = historyBtns[i];
        const content = presets[i];
        //set text on button
        btn.textContent = content;
        //set value of button
        btn.setAttribute('value', content);
    }
    //set search-history in the local storage as a string of the searcg history array divided by commas
    localStorage.setItem('search-history', presets.join());
}


//When the page loads
window.addEventListener('load', function () {
    const formEl = document.querySelector('#search-form');
    const historyBtns = document.querySelectorAll('.historyButton');
    let recentSearches = localStorage.getItem('search-history');

    formEl.addEventListener('submit', (event) => {
        //when the search form is submitted
        event.preventDefault();
        let query = document.querySelector('#city-search').value.trim();
        if (query) {
            searchCity(query);
            //reset/clear the search form
            formEl.reset();
        }
        else {
            console.log(`"${query}" is not a valid search term!`)
        }
    });

    //if there is search history stored in local storage
    if (recentSearches) {
        //turn the search-history string into an array
        recentSearches = recentSearches.split(',')
        //run through each item in the search history array, backwards
        for (let i = recentSearches.length - 1; i >= 0; i--) {
            //put the search history into the preset array by passing them through the addToHistory function with the "isInitalLoad" argument passed in as true
            addToHistory(recentSearches[i], true)
        }
    }
    //document.querySelector('#city-name').textContent = presets[0];
    searchCity(presets[0]);//Search and get data for the most recent city in search history
    //set all the search history/preset buttons
    for (let i = 0; i < historyBtns.length; i++) {
        const btn = historyBtns[i];
        const content = presets[i];
        //set text on button
        btn.textContent = content;
        //set value of button
        btn.setAttribute('value', content);
        btn.addEventListener('click', onPresetClick)
    }

});
