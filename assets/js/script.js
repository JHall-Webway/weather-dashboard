function getWeather(city) {
    fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=7a31f75531bd46ded33bdb3c9d2612a9")
        .then(function (response) {
            if (response.ok) {
                return response.json()
            } else {
                alert("ERROR")
            }
        })
        .then(function (data) {
            displayWeather(data);
        })
}


//Search Listeners
$(".search-col").on("submit", function (event) {
    event.preventDefault();
    searchTerm = $("#city-input").val().toLowerCase();
    getWeather(searchTerm);
});
$(".saved-col").on("click", ".city-btn", function (event) {
    event.preventDefault();
    buttonCity = $(this).text().toLowerCase();
    getWeather(buttonCity);
});