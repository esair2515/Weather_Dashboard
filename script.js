document.getElementById('city-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const cityName = e.target.value.trim();

        if (cityName === '') {
            displayError('Please enter a city name.');
        } else {
            displayMockWeatherData(cityName);
            addToRecentSearches(cityName);
        }
    }
});

document.getElementById('add-favorite').addEventListener('click', function() {
    const cityName = document.getElementById('city-input').value.trim();
    
    if (cityName !== '') {
        addToFavorites(cityName);
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
        humidity: 40,
        windSpeed: 10,       // in m/s
        sunrise: '6:00 AM',
        sunset: '8:00 PM',
    };

    weatherInfoDiv.innerHTML = `
        <img src="path/to/sunny-icon.png" alt="Sunny">
        <h2>${mockData.name}</h2>
        <p>Temperature: ${mockData.temp}°C</p>
        <p>Description: ${mockData.description}</p>
        <p>Humidity: ${mockData.humidity}%</p>
        <p>Wind Speed: ${mockData.windSpeed} m/s</p>
        <p>Sunrise: ${mockData.sunrise}</p>
        <p>Sunset: ${mockData.sunset}</p>
    `;

    // Add visible class to trigger transition
    weatherInfoDiv.classList.add('visible');
}

function displayError(message) {
    const weatherInfoDiv = document.getElementById('weather-info');
    weatherInfoDiv.innerHTML = `<p class="error">${message}</p>`;
    weatherInfoDiv.classList.add('visible');
}

function addToRecentSearches(city) {
    const recentSearchesList = document.getElementById('recent-searches-list');
    
    // Create a new list item
    const listItem = document.createElement('li');
    listItem.textContent = city;
    listItem.addEventListener('click', () => {
        displayMockWeatherData(city);
    });

    // Add to the beginning of the list
    recentSearchesList.insertBefore(listItem, recentSearchesList.firstChild);
}

function addToFavorites(city) {
    const favoritesList = document.getElementById('favorites-list');

    // Create a new list item
    const listItem = document.createElement('li');
    listItem.textContent = city;
    listItem.addEventListener('click', () => {
        displayMockWeatherData(city);
    });

    // Add to the list
    favoritesList.appendChild(listItem);
}
