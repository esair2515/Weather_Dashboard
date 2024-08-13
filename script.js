let tempUnit = 'C';

document.addEventListener('DOMContentLoaded', () => {
    loadFavorites();
    loadRecentSearches();
});

document.getElementById('toggle-temp').addEventListener('click', function() {
    tempUnit = tempUnit === 'C' ? 'F' : 'C';
    document.getElementById('toggle-temp').textContent = tempUnit === 'C' ? '°C / °F' : '°F / °C';
    
    const cityName = document.querySelector('#weather-info h2')?.textContent;
    if (cityName) displayMockWeatherData(cityName);
});

document.getElementById('city-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const cityName = e.target.value.trim();

        if (cityName === '') {
            displayError('Please enter a city name.');
        } else {
            showLoadingSpinner();
            setTimeout(() => {
                displayMockWeatherData(cityName);
                addToRecentSearches(cityName);
                saveRecentSearches();
                clearInput();
            }, 1000);
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

document.getElementById('export-data').addEventListener('click', function() {
    exportData();
});

document.getElementById('import-data').addEventListener('click', function() {
    document.getElementById('import-file').click();
});

document.getElementById('import-file').addEventListener('change', function(event) {
    importData(event.target.files[0]);
});

function displayMockWeatherData(city) {
    const weatherInfoDiv = document.getElementById('weather-info');
    hideLoadingSpinner();

    weatherInfoDiv.innerHTML = '';

    const mockData = {
        name: city,
        temp: tempUnit === 'C' ? 22 : (22 * 9/5) + 32,
        description: 'Sunny',
        humidity: 40,
        windSpeed: 10,
        sunrise: '6:00 AM',
        sunset: '8:00 PM',
        icon: 'sunny-icon.png'
    };

    if (mockData.description.toLowerCase() === 'sunny') {
        weatherInfoDiv.style.backgroundColor = '#FFD700';
    } else if (mockData.description.toLowerCase() === 'cloudy') {
        weatherInfoDiv.style.backgroundColor = '#C0C0C0';
    } else if (mockData.description.toLowerCase() === 'rainy') {
        weatherInfoDiv.style.backgroundColor = '#87CEFA';
    }

    weatherInfoDiv.innerHTML = `
        <img src="${mockData.icon}" alt="${mockData.description}">
        <h2>${mockData.name}</h2>
        <p>Temperature: ${mockData.temp.toFixed(1)}°${tempUnit}</p>
        <p>Description: ${mockData.description}</p>
        <p>Humidity: ${mockData.humidity}%</p>
        <p>Wind Speed: ${mockData.windSpeed} m/s</p>
        <p>Sunrise: ${mockData.sunrise}</p>
        <p>Sunset: ${mockData.sunset}</p>
    `;

    weatherInfoDiv.classList.add('visible');
}

function displayError(message) {
    const weatherInfoDiv = document.getElementById('weather-info');
    hideLoadingSpinner();
    weatherInfoDiv.innerHTML = `<p class="error">${message}</p>`;
    weatherInfoDiv.classList.add('visible');
}

function showLoadingSpinner() {
    const spinner = document.getElementById('loading-spinner');
    spinner.style.display = 'block';
    document.getElementById('weather-info').classList.remove('visible');
}

function hideLoadingSpinner() {
    const spinner = document.getElementById('loading-spinner');
    spinner.style.display = 'none';
}

function addToRecentSearches(city) {
    const recentSearchesList = document.getElementById('recent-searches-list');

    const existingItem = Array.from(recentSearchesList.children).find(li => li.textContent.includes(city));
    if (existingItem) {
        existingItem.remove();
    }

    const listItem = document.createElement('li');
    listItem.textContent = city;

    recentSearchesList.prepend(listItem);
}
