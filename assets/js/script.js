var searchedCityArray = JSON.parse(localStorage.getItem("cities"));

if (!searchedCityArray) {
    searchedCityArray = [];
    localStorage.setItem("cities", JSON.stringify(searchedCityArray))
}

function loadSearch() {

    $(".city-btn").remove();

    for (let i = 0; i < searchedCityArray.length; i++) {
        $("<button>")
            .addClass("btn city-btn mb-3")
            .html(searchedCityArray[i])
            .appendTo($(".saved-col"));
    };

    $(".saved-col").on("click", ".city-btn", function (event) {
        event.preventDefault();
        buttonCity = $(this).text().toLowerCase();
        getCoordinates(buttonCity);
    });
};

function buttonMaker(city) {
    $("<button>")
        .addClass("btn city-btn mb-3")
        .text(city)
        .appendTo($(".saved-col"));

    searchedCityArray = searchedCityArray.filter(e => e !== city);

    searchedCityArray.unshift(city);
    localStorage.setItem("cities", JSON.stringify(searchedCityArray));
    loadSearch();
}

function getCoordinates(city) {
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=7a31f75531bd46ded33bdb3c9d2612a9")
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                alert("ERROR")
            }
        })
        .then(function (data) {
            getForecast(data);
        })
};

function getForecast(city) {
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + city.coord.lat + "&lon=" + city.coord.lon + "&appid=7a31f75531bd46ded33bdb3c9d2612a9")
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

function displayWeather(current, forecast) {
    console.log("Weather Data:");
    console.log(current);
    console.log(forecast);
    var date = new Date();
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

//Search Listeners
$(".search-col").on("submit", function (event) {
    event.preventDefault();
    searchTerm = $("#city-input").val().trim().toLowerCase();
    if (searchTerm.length != 0) {
        getCoordinates(searchTerm);
        buttonMaker(searchTerm);
        $(".input-field").val("");
    }
});

loadSearch();