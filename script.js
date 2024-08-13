let tempUnit = 'C';

document.addEventListener('DOMContentLoaded', () => {
    loadFavorites();
    loadRecentSearches();
});

document.getElementById('toggle-temp').addEventListener('click', function() {
    tempUnit = tempUnit === 'C' ? 'F' : 'C';
    document.getElementById('toggle-temp').textContent = tempUnit === 'C' ? '°C / °F' : '°F / °C';
    
    const cityName = document.querySelector('#weather-info h2')?.textContent;
    if (cityName) {
        displayMockWeatherData(cityName);
        displayWeeklyForecast(cityName);
    }
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
                displayWeeklyForecast(cityName);
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
}

function displayWeeklyForecast(city) {
    const forecastList = document.getElementById('forecast-list');
    forecastList.innerHTML = '';

    const weeklyForecast = [
        { day: 'Monday', temp: tempUnit === 'C' ? 20 : (20 * 9/5) + 32, description: 'Sunny', icon: 'sunny-icon.png' },
        { day: 'Tuesday', temp: tempUnit === 'C' ? 22 : (22 * 9/5) + 32, description: 'Cloudy', icon: 'cloudy-icon.png' },
        { day: 'Wednesday', temp: tempUnit === 'C' ? 24 : (24 * 9/5) + 32, description: 'Rainy', icon: 'rainy-icon.png' },
        { day: 'Thursday', temp: tempUnit === 'C' ? 21 : (21 * 9/5) + 32, description: 'Sunny', icon: 'sunny-icon.png' },
        { day: 'Friday', temp: tempUnit === 'C' ? 23 : (23 * 9/5) + 32, description: 'Cloudy', icon: 'cloudy-icon.png' },
        { day: 'Saturday', temp: tempUnit === 'C' ? 25 : (25 * 9/5) + 32, description: 'Rainy', icon: 'rainy-icon.png' },
        { day: 'Sunday', temp: tempUnit === 'C' ? 26 : (26 * 9/5) + 32, description: 'Sunny', icon: 'sunny-icon.png' }
    ];

    weeklyForecast.forEach(day => {
        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');

        forecastItem.innerHTML = `
            <h4>${day.day}</h4>
            <img src="${day.icon}" alt="${day.description}">
            <p>${day.temp.toFixed(1)}°${tempUnit}</p>
            <p>${day.description}</p>
        `;

        forecastList.appendChild(forecastItem);
    });
}

function showLoadingSpinner() {
    document.getElementById('loading-spinner').style.display = 'block';
}

function hideLoadingSpinner() {
    document.getElementById('loading-spinner').style.display = 'none';
}

function displayError(message) {
    alert(message);
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
    if (recentSearchesList.children.length > 5) {
        recentSearchesList.removeChild(recentSearchesList.lastChild);
    }
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

    const existingItem = Array.from(favoritesList.children).find(li => li.textContent.includes(city));
    if (existingItem) {
        existingItem.remove();
    }

    const listItem = document.createElement('li');
    listItem.textContent = city;

    const removeButton = document.createElement('button');
    removeButton.classList.add('remove-favorite');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => {
        listItem.remove();
        saveFavorites();
    });

    listItem.appendChild(removeButton);
    favoritesList.appendChild(listItem);
}

function saveFavorites() {
    const favoritesList = document.getElementById('favorites-list');
    const cities = [];

    favoritesList.querySelectorAll('li').forEach(li => {
        cities.push(li.firstChild.textContent);
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

function exportData() {
    const recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    const data = {
        recentSearches,
        favorites
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'weather-dashboard-data.json';
    a.click();

    URL.revokeObjectURL(url);
}

function importData(file) {
    const reader = new FileReader();

    reader.onload = function(event) {
        try {
            const data = JSON.parse(event.target.result);

            if (data.recentSearches) {
                localStorage.setItem('recentSearches', JSON.stringify(data.recentSearches));
                loadRecentSearches();
            }

            if (data.favorites) {
                localStorage.setItem('favorites', JSON.stringify(data.favorites));
                loadFavorites();
            }
        } catch (error) {
            alert('Failed to import data. Please ensure the file is valid.');
        }
    };

    reader.readAsText(file);
}
document.addEventListener('DOMContentLoaded', () => {
    // Enable keyboard accessibility for file import
    const importDataLabel = document.getElementById('import-data-label');
    importDataLabel.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            document.getElementById('import-data').click();
        }
    });

    // ARIA live regions for updates
    const cityNameElement = document.getElementById('city-name');
    const temperatureElement = document.getElementById('temperature');
    const descriptionElement = document.getElementById('description');

    function updateWeatherInfo(city, temperature, description, iconSrc) {
        cityNameElement.textContent = city;
        temperatureElement.textContent = `${temperature.toFixed(1)}°${tempUnit}`;
        descriptionElement.textContent = description;
        document.getElementById('weather-icon').src = iconSrc;

        cityNameElement.setAttribute('aria-label', `City: ${city}`);
        temperatureElement.setAttribute('aria-label', `Temperature: ${temperature.toFixed(1)}°${tempUnit}`);
        descriptionElement.setAttribute('aria-label', `Description: ${description}`);
    }

    // Update the weekly forecast with ARIA support
    function displayWeeklyForecast(city) {
        const forecastList = document.getElementById('forecast-list');
        forecastList.innerHTML = '';

        const weeklyForecast = [
            { day: 'Monday', temp: tempUnit === 'C' ? 20 : (20 * 9/5) + 32, description: 'Sunny', icon: 'sunny-icon.png' },
            { day: 'Tuesday', temp: tempUnit === 'C' ? 22 : (22 * 9/5) + 32, description: 'Cloudy', icon: 'cloudy-icon.png' },
            { day: 'Wednesday', temp: tempUnit === 'C' ? 24 : (24 * 9/5) + 32, description: 'Rainy', icon: 'rainy-icon.png' },
            { day: 'Thursday', temp: tempUnit === 'C' ? 21 : (21 * 9/5) + 32, description: 'Sunny', icon: 'sunny-icon.png' },
            { day: 'Friday', temp: tempUnit === 'C' ? 23 : (23 * 9/5) + 32, description: 'Cloudy', icon: 'cloudy-icon.png' },
            { day: 'Saturday', temp: tempUnit === 'C' ? 25 : (25 * 9/5) + 32, description: 'Rainy', icon: 'rainy-icon.png' },
            { day: 'Sunday', temp: tempUnit === 'C' ? 26 : (26 * 9/5) + 32, description: 'Sunny', icon: 'sunny-icon.png' }
        ];

        weeklyForecast.forEach(day => {
            const forecastItem = document.createElement('div');
            forecastItem.classList.add('forecast-item');
            forecastItem.setAttribute('role', 'listitem');

            forecastItem.innerHTML = `
                <h4>${day.day}</h4>
                <img src="${day.icon}" alt="${day.description}" aria-hidden="true">
                <p aria-label="Temperature: ${day.temp.toFixed(1)}°${tempUnit}">${day.temp.toFixed(1)}°${tempUnit}</p>
                <p aria-label="Condition: ${day.description}">${day.description}</p>
            `;

            forecastList.appendChild(forecastItem);
        });
    }
});
document.addEventListener('DOMContentLoaded', () => {
    let tempUnit = 'C';
    const theme = localStorage.getItem('theme') || 'light';
    const unit = localStorage.getItem('unit') || 'celsius';
    const language = localStorage.getItem('language') || 'en';

    // Apply saved settings
    applyTheme(theme);
    applyUnit(unit);
    applyLanguage(language);

    // Open and close settings panel
    const settingsButton = document.getElementById('settings-button');
    const settingsPanel = document.getElementById('settings-panel');
    const closeSettingsButton = document.getElementById('close-settings');

    settingsButton.addEventListener('click', () => {
        settingsPanel.style.display = 'block';
    });

    closeSettingsButton.addEventListener('click', () => {
        settingsPanel.style.display = 'none';
    });

    // Theme change
    const themeSelect = document.getElementById('theme-select');
    themeSelect.value = theme;
    themeSelect.addEventListener('change', (e) => {
        const selectedTheme = e.target.value;
        applyTheme(selectedTheme);
        localStorage.setItem('theme', selectedTheme);
    });

    // Unit change
    const unitSelect = document.getElementById('unit-select');
    unitSelect.value = unit;
    unitSelect.addEventListener('change', (e) => {
        const selectedUnit = e.target.value;
        applyUnit(selectedUnit);
        localStorage.setItem('unit', selectedUnit);
    });

    // Language change
    const languageSelect = document.getElementById('language-select');
    languageSelect.value = language;
    languageSelect.addEventListener('change', (e) => {
        const selectedLanguage = e.target.value;
        applyLanguage(selectedLanguage);
        localStorage.setItem('language', selectedLanguage);
    });

    function applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    function applyUnit(unit) {
        tempUnit = unit === 'celsius' ? 'C' : 'F';
        document.getElementById('toggle-temp').textContent = `Toggle ${tempUnit === 'C' ? '°F' : '°C'}`;
    }

    function applyLanguage(language) {
        const translations = {
            en: {
                cityPlaceholder: "Enter city name",
                addFavorite: "Add to Favorites",
                toggleTemp: "Toggle °C/°F",
                recentSearches: "Recent Searches",
                clearRecentSearches: "Clear Recent Searches",
                favorites: "Favorites",
                exportData: "Export Data",
                importData: "Import Data",
                weeklyForecast: "Weekly Forecast",
                closeSettings: "Close",
                settingsHeading: "Settings",
                theme: "Theme:",
                unit: "Temperature Unit:",
                language: "Language:"
            },
            es: {
                cityPlaceholder: "Ingrese el nombre de la ciudad",
                addFavorite: "Añadir a Favoritos",
                toggleTemp: "Alternar °C/°F",
                recentSearches: "Búsquedas Recientes",
                clearRecentSearches: "Borrar Búsquedas Recientes",
                favorites: "Favoritos",
                exportData: "Exportar Datos",
                importData: "Importar Datos",
                weeklyForecast: "Pronóstico Semanal",
                closeSettings: "Cerrar",
                settingsHeading: "Configuraciones",
                theme: "Tema:",
                unit: "Unidad de Temperatura:",
                language: "Idioma:"
            },
            fr: {
                cityPlaceholder: "Entrez le nom de la ville",
                addFavorite: "Ajouter aux Favoris",
                toggleTemp: "Basculer °C/°F",
                recentSearches: "Recherches Récentes",
                clearRecentSearches: "Effacer les Recherches Récentes",
                favorites: "Favoris",
                exportData: "Exporter des Données",
                importData: "Importer des Données",
                weeklyForecast: "Prévisions Hebdomadaires",
                closeSettings: "Fermer",
                settingsHeading: "Paramètres",
                theme: "Thème:",
                unit: "Unité de Température:",
                language: "Langue:"
            },
            de: {
                cityPlaceholder: "Stadtnamen eingeben",
                addFavorite: "Zu Favoriten hinzufügen",
                toggleTemp: "Wechseln °C/°F",
                recentSearches: "Kürzliche Suchanfragen",
                clearRecentSearches: "Suchverlauf löschen",
                favorites: "Favoriten",
                exportData: "Daten exportieren",
                importData: "Daten importieren",
                weeklyForecast: "Wöchentliche Vorhersage",
                closeSettings: "Schließen",
                settingsHeading: "Einstellungen",
                theme: "Thema:",
                unit: "Temperatureinheit:",
                language: "Sprache:"
            }
        };

        const translation = translations[language];

        document.getElementById('city-input').placeholder = translation.cityPlaceholder;
        document.getElementById('add-favorite').textContent = translation.addFavorite;
        document.getElementById('toggle-temp').textContent = translation.toggleTemp;
        document.getElementById('recent-searches-heading').textContent = translation.recentSearches;
        document.getElementById('clear-recent-searches').textContent = translation.clearRecentSearches;
        document.getElementById('favorites-heading').textContent = translation.favorites;
        document.getElementById('export-data').textContent = translation.exportData;
        document.getElementById('import-data-label').textContent = translation.importData;
        document.querySelector('.forecast-container h3').textContent = translation.weeklyForecast;
        document.getElementById('close-settings').textContent = translation.closeSettings;
        document.getElementById('settings-heading').textContent = translation.settingsHeading;
        document.querySelector('label[for="theme-select"]').textContent = translation.theme;
        document.querySelector('label[for="unit-select"]').textContent = translation.unit;
        document.querySelector('label[for="language-select"]').textContent = translation.language;
    }

    // The rest of your existing code for updating weather info, weekly forecast, etc.
});


