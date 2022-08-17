//https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={minutely,hourly,alerts}&appid={API key}

//http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}


//Use geo coding to get lat and lon of city then pass the coords into the weather one call to get curent weather and daily forcasts.



//PSUDO CODE

//On load get latests searches and fill in buttons. Fill page with last search.
//If there are no or not enough latestes searches fill in with major cities.

//On search pass to geocode fetch function
//take the top result and from geo code and pass it into local storage and the weather fetch.

//local storage function updates every search. Loads cities onto buttons. Most recent one on the top.

//deconstruct weather response and change text content on page.