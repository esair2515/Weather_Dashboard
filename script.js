document.getElementById('city-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const cityName = e.target.value;
        displayMockWeatherData(cityName);
    }
});

function displayMockWeatherData(city) {
    const weatherInfoDiv = document.getElementById('weather-info');

    // Clear previous data
    weatherInfoDiv.innerHTML = '';

    // Mock data
    const mockData = {
        name: city,
        temp: 22,
        description: 'Sunny',
        humidity: 40
    };

    weatherInfoDiv.innerHTML = `
        <img src="path/to/sunny-icon.png" alt="Sunny">
        <h2>${mockData.name}</h2>
        <p>Temperature: ${mockData.temp}°C</p>
        <p>Description: ${mockData.description}</p>
        <p>Humidity: ${mockData.humidity}%</p>
    `;

    // Add visible class to trigger transition
    weatherInfoDiv.classList.add('visible');
}
