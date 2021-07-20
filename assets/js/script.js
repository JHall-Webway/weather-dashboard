//Pulls existing searches from local storage
var searchedCityArray = JSON.parse(localStorage.getItem("cities"));
//Creates array for stored searches if none already exist
if (!searchedCityArray) {
    searchedCityArray = [];
    localStorage.setItem("cities", JSON.stringify(searchedCityArray))
}
//Creates buttons for existing searches
function loadSearch() {
    //Removes any existing buttons
    $(".city-btn").remove();
    //Creates a button for each array item
    for (let i = 0; i < searchedCityArray.length; i++) {
        $("<button>")
            .addClass("btn city-btn mb-3")
            .html(searchedCityArray[i])
            .appendTo($(".saved-col"));
    };
    //Adds event listeners after buttons have been generated
    $(".saved-col").on("click", ".city-btn", function (event) {
        event.preventDefault();
        buttonCity = $(this).text().toLowerCase();
        getCoordinates(buttonCity);
    });
};
//Creates a button for a fresh search
function buttonMaker(city) {
    //Removes any previous instance of that city from array
    searchedCityArray = searchedCityArray.filter(e => e !== city);
    //Puts fresh search in the front of the array
    searchedCityArray.unshift(city);
    //Stores array in localstorage
    localStorage.setItem("cities", JSON.stringify(searchedCityArray));
    //Loads new array
    loadSearch();
}
//Fetches city coordinates from Openweather
function getCoordinates(city) {
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=4493e550e9acf995029c8985968d6001")
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
        })
        .then(function (data) {
            //Sends object to getForecast function
            getForecast(data);
        })
        .catch(function (error) {
            alert("Unable to connect to Openweather");
        });
};
//Fetches forecast data from Openweather
function getForecast(city) {
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + city.coord.lat + "&lon=" + city.coord.lon + "&appid=4493e550e9acf995029c8985968d6001")
        .then(function (response) {
            if (response.ok) {
                return response.json()
            } else {
                alert("ERROR")
            }
        })
        .then(function (data) {
            displayWeather(city, data);
        })
};
//Forecast element generator
function displayWeather(current, forecast) {
    //Logs raw data
    console.log("Weather Data:");
    console.log(current);
    console.log(forecast);
    var date = new Date();
    //Function for determining the UVI badge color
    function uviDanger() {
        var uviLvl = forecast.current.uvi;
        if (uviLvl < 3) {
            return "uvi-low";
        } else if (uviLvl >= 3 && uviLvl < 6) {
            return "uvi-moderate";
        } else if (uviLvl >= 6 && uviLvl < 8) {
            return "uvi-high";
        } else if (uviLvl >= 8 && uviLvl < 11) {
            return "uvi-very-high";
        } else {
            return "uvi-extreme";
        }
    }
    //Clear previous forecast
    $(".forecast-row").html("");
    //Create and attach current Weather
    var forecastRow = $(".forecast-row")
    var todaysForecast = $("<div>")
        .addClass("col-12 border border-dark");
    var todayName = $("<h2>")
        .html(current.name + " (" + date.toLocaleString().split(",")[0] + ") <img src='http://openweathermap.org/img/wn/" + current.weather[0].icon + ".png' />");
    var todayTemp = $("<p>")
        .text("Temperature: " + Math.floor(((current.main.temp - 273.15) * 9 / 5 + 32)) + " °F");
    var todayWind = $("<p>")
        .text("Wind: " + current.wind.speed + " MPH");
    var todayHum = $("<p>")
        .text("Humidity: " + forecast.current.humidity + "%");
    var todayUVI = $("<p>")
        .html("UV Index: <span class='badge " + uviDanger() + "'>" + forecast.current.uvi + "</span>");
    todaysForecast
        .append(todayName)
        .append(todayTemp)
        .append(todayWind)
        .append(todayHum)
        .append(todayUVI)
        .appendTo(forecastRow);
    //Create and attach forecasts
    forecastDiv = $("<div>")
        .addClass("col-12 d-flex row justify-content-between fs-lg-5");
    forecastLabel = $("<h3>")
        .addClass("col-12")
        .text("5-Day Forecast:");
    forecastDiv
        .append(forecastLabel)
        .appendTo(forecastRow);
    for (let i = 0; i < 5; i++) {
        date.setDate(date.getDate() + 1);
        var dayObj = forecast.daily[i + 2];
        var cardEl = $("<div>")
            .addClass("col-12 col-md-2 border card forecast-card")
        var cardBody = $("<div>")
            .addClass("card-body");
        var cardTitle = $("<h4>")
            .addClass("card-title")
            .text(date.toLocaleString().split(",")[0]);
        var cardIcon = $("<img src='http://openweathermap.org/img/wn/" + dayObj.weather[0].icon + ".png' />");
        var cardTemp = $("<p>")
            .addClass("card-text")
            .text("Temp: " + Math.floor(((dayObj.temp.day - 273.15) * 9 / 5 + 32)) + "°F");
        var cardWind = $("<p>")
            .addClass("card-text")
            .text("Wind: " + dayObj.wind_speed + " MPH");
        var cardHum = $("<p>")
            .addClass("card-text")
            .text("Humidity: " + dayObj.humidity + "%");
        cardBody
            .append(cardTitle)
            .append(cardIcon)
            .append(cardTemp)
            .append(cardWind)
            .append(cardHum)
            .appendTo(cardEl);
        cardEl
            .appendTo(forecastDiv);
    }
};
//Search Listener
$(".search-col").on("submit", function (event) {
    event.preventDefault();
    var searchTerm = $("#city-input").val().trim().toLowerCase();
    if (searchTerm.length != 0) {
        getCoordinates(searchTerm);
        buttonMaker(searchTerm);
        $(".input-field").val("");
    }
});
//Loads previous searches on startup
loadSearch();