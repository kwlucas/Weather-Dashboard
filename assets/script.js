//https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=imperial&appid=${apiKeyVar}

//http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

//Use geo coding to get lat and lon of city then pass the coords into the weather one call to get curent weather and daily forcasts.



//PSUDO CODE
const apiKey = 'e17c20c8e54a5e97f8112c71afd2a764'

//On load get latests searches and fill in buttons. Fill page with last search.
//If there are no or not enough latestes searches fill in with major cities.

//On search pass to geocode fetch function
//take the top result and from geo code and pass it into local storage and the weather fetch.
function searchCity(query) {
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${apiKey}`)
        .then(function (response) {
            //console.log(response)
            return response.json();
        }).then(function (data) {
            //console.log(data)
            let {name:cityName, lat:cityLat, lon:cityLon} = data[0];
            console.log(`city: ${cityName}\nCords: ${cityLat}, ${cityLon}`);
            weatherFetch(cityLat, cityLon);
        });
}

function weatherFetch(lat, lon){
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=imperial&appid=${apiKey}`)
        .then(function (response) {
            console.log(response)
            return response.json();
        }).then(function (data) {
            console.log(data)
        });
}
//local storage function updates every search. Loads cities onto buttons. Most recent one on the top.

//deconstruct weather response and change text content on page.


window.addEventListener('load', function () {
    let recentSearches = localStorage.getItem('search-history');
    if(recentSearches){
        recentSearches[0]
        for (let i = 1; i < recentSearches.length; i++) {
            
        }
    }
    testHandle()
    
});

function testHandle(){
    //searchCity('Boston');
    let {name:cityName, lat:cityLat, lon:cityLon} = testResultGeo[0];
    console.log(`city: ${cityName}\nCords: ${cityLat}, ${cityLon}`);
    weatherFetch(cityLat, cityLon);
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