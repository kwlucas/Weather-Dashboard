let presets = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'London', 'Paris', 'Tokyo', 'Delhi']

//https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=imperial&appid=${apiKeyVar}

//http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

//Use geo coding to get lat and lon of city then pass the coords into the weather one call to get curent weather and daily forcasts.

function unixTimeConversion(timestamp, isShort) {
    let ms = new Date(timestamp * 1000);
    let daysOfWeek = ['Sunday, ', 'Monday, ', 'Tuesday, ', 'Wednesday, ', 'Thursday, ', 'Friday, ', 'Saturday, '];
    if(isShort){
        daysOfWeek = ['Sun.\n', 'Mon.\n', 'Tue.\n', 'Wed.\n', 'Thur.\n', 'Fri.\n', 'Sat.\n'];
    }
    //console.log(daysOfWeek);
    return `${daysOfWeek[ms.getDay()]}${ms.getMonth()+1}-${ms.getDate()}-${ms.getFullYear()}`; //day, mm-dd-yyyy
}


//PSUDO CODE
const apiKey = '7ae0bf3ccd81cce7de86e274da5f7efd';

//On load get latests searches and fill in buttons. Fill page with last search.
//If there are no or not enough latestes searches fill in with major cities.
function onPresetClick(event) {
    const city = event.target.value;
    console.log(city);
    //addToHistory(city)
    searchCity(city);
}
//On search pass to geocode fetch function
//take the top result and from geo code and pass it into local storage and the weather fetch.
function searchCity(query) {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${apiKey}`)
        .then(function (response) {
            //console.log(response)
            return response.json();
        }).then(function (data) {
            //console.log(data)
            let { name: cityName, lat: cityLat, lon: cityLon } = data[0];
            console.log(`city: ${cityName}\nCords: ${cityLat}, ${cityLon}`);
            addToHistory(cityName);
            weatherFetch(cityLat, cityLon);
        });
}
//https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=imperial&appid=${apiKey}
function weatherFetch(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=imperial&appid=${apiKey}`)
        .then(function (response) {
            //console.log(response)
            return response.json();
        }).then(function (data) {
            //console.log(data)
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
        //console.log(key);
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

    if(isInitalLoad){
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
    const historyBtns = document.querySelectorAll('.historyButton');
    let recentSearches = localStorage.getItem('search-history');
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
    //testHandle()

});

function testHandle() {
    //searchCity('Boston');
    let { name: cityName, lat: cityLat, lon: cityLon } = testResultGeo[0];
    console.log(`city: ${cityName}\nCords: ${cityLat}, ${cityLon}`);
    //let { dt: unixTime, temp: temp, wind_speed: wind, humidity: humid, uvi: uvIndex, weather: [{ icon: iconID }] } = testResultsOnecall['current'];
    printCurrent(testResultsOnecall['current']);
    //weatherFetch(cityLat, cityLon);
    printForecast(testResultsOnecall['daily']);
}

const testResultGeo = [
    {
        "name": "Denver",
        "local_names": {
            "zh": "丹佛",
            "lt": "Denveris",
            "ar": "دنفر",
            "hi": "डॅनवर",
            "el": "Ντένβερ",
            "bg": "Денвър",
            "ja": "デンバー",
            "be": "Дэнвер",
            "ce": "Денвер",
            "pl": "Denver",
            "eo": "Denvero (Koloradio)",
            "kk": "Дэнвер (Колорадо)",
            "sr": "Денвер",
            "en": "Denver",
            "sa": "डेन्वर्",
            "lv": "Denvera",
            "hy": "Դենվեր",
            "oc": "Denver",
            "ko": "덴버",
            "ta": "டென்வர்",
            "os": "Денвер",
            "kw": "Denver, Kolorado",
            "th": "เดนเวอร์",
            "ht": "Denver, Kolorado",
            "tl": "Denber, Kolorado",
            "ml": "ഡെൻവർ",
            "pa": "ਡੈਨਵਰ",
            "ru": "Денвер",
            "sl": "Denver, Kolorado",
            "mr": "डेन्व्हर",
            "fa": "دنور، کلرادو",
            "mk": "Денвер (Колорадо)",
            "ka": "დენვერი",
            "he": "דנוור",
            "te": "డెన్వర్",
            "mn": "Денвер",
            "uk": "Денвер",
            "la": "Denverium (Coloratum)",
            "ug": "Dénwér"
        },
        "lat": 39.7392364,
        "lon": -104.9848623,
        "country": "US",
        "state": "Colorado"
    }
]
//https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=imperial&appid=${apiKeyVar}
//https://api.openweathermap.org/data/2.5/onecall?lat=40.0497&lon=-105.2143&exclude=hourly,minutely&appid=f0bed1b0eff80d425a392e66c50eb063&units=imperial
const testResultsOnecall = {
    "lat": 40.0497,
    "lon": -105.2143,
    "timezone": "America/Denver",
    "timezone_offset": -21600,
    "current": {
        "dt": 1661012878,
        "sunrise": 1660997843,
        "sunset": 1661046684,
        "temp": 68.85,
        "feels_like": 68.02,
        "pressure": 1021,
        "humidity": 55,
        "dew_point": 52.03,
        "uvi": 4.63,
        "clouds": 0,
        "visibility": 10000,
        "wind_speed": 4.61,
        "wind_deg": 20,
        "weather": [
            {
                "id": 800,
                "main": "Clear",
                "description": "clear sky",
                "icon": "01d"
            }
        ]
    },
    "daily": [
        {
            "dt": 1661022000,
            "sunrise": 1660997843,
            "sunset": 1661046684,
            "moonrise": 1660975740,
            "moonset": 1661031480,
            "moon_phase": 0.8,
            "temp": {
                "day": 73.04,
                "min": 58.21,
                "max": 79.59,
                "night": 62.26,
                "eve": 67.06,
                "morn": 62.71
            },
            "feels_like": {
                "day": 72.21,
                "night": 62.08,
                "eve": 66.61,
                "morn": 61.65
            },
            "pressure": 1017,
            "humidity": 46,
            "dew_point": 51.06,
            "wind_speed": 12.46,
            "wind_deg": 223,
            "wind_gust": 15.59,
            "weather": [
                {
                    "id": 501,
                    "main": "Rain",
                    "description": "moderate rain",
                    "icon": "10d"
                }
            ],
            "clouds": 58,
            "pop": 0.88,
            "rain": 6.43,
            "uvi": 8.94
        },
        {
            "dt": 1661108400,
            "sunrise": 1661084301,
            "sunset": 1661132998,
            "moonrise": 1661064480,
            "moonset": 1661121300,
            "moon_phase": 0.83,
            "temp": {
                "day": 78.06,
                "min": 60.64,
                "max": 79.14,
                "night": 65.26,
                "eve": 71.24,
                "morn": 62.01
            },
            "feels_like": {
                "day": 77.54,
                "night": 64.45,
                "eve": 70.7,
                "morn": 61.29
            },
            "pressure": 1014,
            "humidity": 42,
            "dew_point": 51.35,
            "wind_speed": 10.69,
            "wind_deg": 280,
            "wind_gust": 11.68,
            "weather": [
                {
                    "id": 500,
                    "main": "Rain",
                    "description": "light rain",
                    "icon": "10d"
                }
            ],
            "clouds": 97,
            "pop": 0.84,
            "rain": 1.34,
            "uvi": 9.09
        },
        {
            "dt": 1661194800,
            "sunrise": 1661170759,
            "sunset": 1661219311,
            "moonrise": 1661153580,
            "moonset": 1661210820,
            "moon_phase": 0.86,
            "temp": {
                "day": 81.55,
                "min": 61.84,
                "max": 83.55,
                "night": 66.33,
                "eve": 73.89,
                "morn": 65.14
            },
            "feels_like": {
                "day": 80.02,
                "night": 64.96,
                "eve": 72.9,
                "morn": 64.17
            },
            "pressure": 1015,
            "humidity": 28,
            "dew_point": 43.95,
            "wind_speed": 9.15,
            "wind_deg": 113,
            "wind_gust": 10.27,
            "weather": [
                {
                    "id": 800,
                    "main": "Clear",
                    "description": "clear sky",
                    "icon": "01d"
                }
            ],
            "clouds": 1,
            "pop": 0.24,
            "uvi": 9.51
        },
        {
            "dt": 1661281200,
            "sunrise": 1661257216,
            "sunset": 1661305623,
            "moonrise": 1661243100,
            "moonset": 1661299920,
            "moon_phase": 0.89,
            "temp": {
                "day": 81.57,
                "min": 62.31,
                "max": 85.26,
                "night": 69.67,
                "eve": 84.09,
                "morn": 62.31
            },
            "feels_like": {
                "day": 79.92,
                "night": 68.41,
                "eve": 81.45,
                "morn": 60.73
            },
            "pressure": 1013,
            "humidity": 26,
            "dew_point": 42.37,
            "wind_speed": 9.28,
            "wind_deg": 262,
            "wind_gust": 8.93,
            "weather": [
                {
                    "id": 800,
                    "main": "Clear",
                    "description": "clear sky",
                    "icon": "01d"
                }
            ],
            "clouds": 3,
            "pop": 0.11,
            "uvi": 10.02
        },
        {
            "dt": 1661367600,
            "sunrise": 1661343674,
            "sunset": 1661391935,
            "moonrise": 1661332980,
            "moonset": 1661388660,
            "moon_phase": 0.92,
            "temp": {
                "day": 83.35,
                "min": 62.89,
                "max": 87.06,
                "night": 71.44,
                "eve": 85.73,
                "morn": 62.89
            },
            "feels_like": {
                "day": 81.01,
                "night": 69.84,
                "eve": 82.56,
                "morn": 61.03
            },
            "pressure": 1014,
            "humidity": 24,
            "dew_point": 41.36,
            "wind_speed": 7.25,
            "wind_deg": 109,
            "wind_gust": 7.38,
            "weather": [
                {
                    "id": 800,
                    "main": "Clear",
                    "description": "clear sky",
                    "icon": "01d"
                }
            ],
            "clouds": 0,
            "pop": 0.09,
            "uvi": 11
        },
        {
            "dt": 1661454000,
            "sunrise": 1661430131,
            "sunset": 1661478245,
            "moonrise": 1661423040,
            "moonset": 1661477040,
            "moon_phase": 0.95,
            "temp": {
                "day": 84.45,
                "min": 64.02,
                "max": 88.57,
                "night": 68.83,
                "eve": 80.91,
                "morn": 64.02
            },
            "feels_like": {
                "day": 81.79,
                "night": 67.91,
                "eve": 79.83,
                "morn": 62.01
            },
            "pressure": 1013,
            "humidity": 23,
            "dew_point": 41.02,
            "wind_speed": 9.62,
            "wind_deg": 244,
            "wind_gust": 12.39,
            "weather": [
                {
                    "id": 803,
                    "main": "Clouds",
                    "description": "broken clouds",
                    "icon": "04d"
                }
            ],
            "clouds": 61,
            "pop": 0.52,
            "uvi": 11
        },
        {
            "dt": 1661540400,
            "sunrise": 1661516588,
            "sunset": 1661564555,
            "moonrise": 1661513280,
            "moonset": 1661565120,
            "moon_phase": 0.98,
            "temp": {
                "day": 82.83,
                "min": 63.28,
                "max": 83.35,
                "night": 65.75,
                "eve": 64.33,
                "morn": 63.28
            },
            "feels_like": {
                "day": 81.01,
                "night": 64.65,
                "eve": 63.84,
                "morn": 61.99
            },
            "pressure": 1012,
            "humidity": 29,
            "dew_point": 45.52,
            "wind_speed": 9.98,
            "wind_deg": 353,
            "wind_gust": 16.44,
            "weather": [
                {
                    "id": 500,
                    "main": "Rain",
                    "description": "light rain",
                    "icon": "10d"
                }
            ],
            "clouds": 59,
            "pop": 0.64,
            "rain": 1.42,
            "uvi": 11
        },
        {
            "dt": 1661626800,
            "sunrise": 1661603045,
            "sunset": 1661650863,
            "moonrise": 1661603460,
            "moonset": 1661653020,
            "moon_phase": 0,
            "temp": {
                "day": 83.34,
                "min": 62.06,
                "max": 83.34,
                "night": 62.91,
                "eve": 69.69,
                "morn": 62.06
            },
            "feels_like": {
                "day": 81.07,
                "night": 61.86,
                "eve": 68.67,
                "morn": 60.4
            },
            "pressure": 1010,
            "humidity": 25,
            "dew_point": 42.49,
            "wind_speed": 8.41,
            "wind_deg": 257,
            "wind_gust": 8.55,
            "weather": [
                {
                    "id": 500,
                    "main": "Rain",
                    "description": "light rain",
                    "icon": "10d"
                }
            ],
            "clouds": 4,
            "pop": 0.4,
            "rain": 0.54,
            "uvi": 11
        }
    ]
}
//https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}
const testResultsCurrent = {
    "coord": {
        "lon": -104.9849,
        "lat": 39.7392
    },
    "weather": [
        {
            "id": 804,
            "main": "Clouds",
            "description": "overcast clouds",
            "icon": "04d"
        }
    ],
    "base": "stations",
    "main": {
        "temp": 70.99,
        "feels_like": 70.14,
        "temp_min": 65.52,
        "temp_max": 78.96,
        "pressure": 1015,
        "humidity": 50
    },
    "visibility": 10000,
    "wind": {
        "speed": 5.99,
        "deg": 30
    },
    "clouds": {
        "all": 100
    },
    "dt": 1660924404,
    "sys": {
        "type": 2,
        "id": 2004334,
        "country": "US",
        "sunrise": 1660911361,
        "sunset": 1660960284
    },
    "timezone": -21600,
    "id": 5419384,
    "name": "Denver",
    "cod": 200
}