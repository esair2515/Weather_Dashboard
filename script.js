document.addEventListener('DOMContentLoaded', () => {
    loadFavorites();
    loadRecentSearches();
});

document.getElementById('city-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const cityName = e.target.value.trim();

        if (cityName === '') {
            displayError('Please enter a city name.');
        } else {
            displayMockWeatherData(cityName);
            addToRecentSearches(cityName);
            saveRecentSearches();
            clearInput();
        }
    }
});

document.getElementById('add-favorite').addEventListener('click', function() {
    const cityName = document.getElementById('city-input').value.trim();
    
    if (cityName !== '') {
        addToFavorites(cityName);
        saveFavorites();
        clearInput();
    }
});

document.getElementById('clear-recent-searches').addEventListener('click', function() {
    clearRecentSearches();
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

    // Update background based on weather
    if (mockData.description.toLowerCase() === 'sunny') {
        weatherInfoDiv.style.backgroundColor = '#FFD700'; // Gold
    } else if (mockData.description.toLowerCase() === 'cloudy') {
        weatherInfoDiv.style.backgroundColor = '#C0C0C0'; // Silver
    } else if (mockData.description.toLowerCase() === 'rainy') {
        weatherInfoDiv.style.backgroundColor = '#87CEFA'; // Light Sky Blue
    }

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

    // Add the list item to the recent searches list
    recentSearchesList.prepend(listItem);
}

function saveRecentSearches() {
    const recentSearchesList = document.getElementById('recent-searches-list');
    const cities = [];

    recentSearchesList.querySelectorAll('li').forEach(li => {
        cities.push(li.textContent);
    });

    localStorage.setItem('recentSearches', JSON.stringify(cities));
}

function loadRecentSearches() {
    const recentSearches = JSON.parse(localStorage.getItem('recentSearches'));
    if (recentSearches) {
        recentSearches.forEach(city => addToRecentSearches(city));
    }
}

function clearRecentSearches() {
    const recentSearchesList = document.getElementById('recent-searches-list');
    recentSearchesList.innerHTML = '';
    localStorage.removeItem('recentSearches');
}

function addToFavorites(city) {
    const favoritesList = document.getElementById('favorites-list');
    
    // Check if the city is already in the favorites
    const existingItem = Array.from(favoritesList.children).find(li => li.textContent.includes(city));
    if (existingItem) {
        return;
    }

    // Create a new list item
    const listItem = document.createElement('li');
    listItem.textContent = city;
    
    // Add remove button
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.classList.add('remove-favorite');
    removeBtn.addEventListener('click', () => {
        listItem.remove();
        saveFavorites();
    });

    listItem.appendChild(removeBtn);

    // Add the list item to the favorites list
    favoritesList.appendChild(listItem);
}

function saveFavorites() {
    const favoritesList = document.getElementById('favorites-list');
    const cities = [];

    favoritesList.querySelectorAll('li').forEach(li => {
        cities.push(li.textContent.replace('Remove', '').trim());
    });

    localStorage.setItem('favorites', JSON.stringify(cities));
}

function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites'));
    if (favorites) {
        favorites.forEach(city => addToFavorites(city));
    }
}

function clearInput() {
    document.getElementById('city-input').value = '';
}
