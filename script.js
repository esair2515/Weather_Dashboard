document.getElementById('city-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const cityName = e.target.value;
        console.log('City Name:', cityName);
        // Placeholder for fetch call to weather API
        fetchWeatherData(cityName);
    }
});

function fetchWeatherData(city) {
    // Placeholder function to fetch weather data
    // Will implement in the next session
}
