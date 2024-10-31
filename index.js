// Initial load with Germany's details
document.addEventListener('DOMContentLoaded', async () => {
    await loadCountry('Germany');
});

// Handle search input
document.getElementById('searchInput').addEventListener('input', async function () {
    const query = this.value.toLowerCase();
    const suggestionsElement = document.getElementById('suggestions');

    // Clear previous suggestions
    suggestionsElement.innerHTML = '';

    if (query) {
        try {
            // Fetch data from the API
            const response = await fetch('https://restcountries.com/v3.1/all');
            const countries = await response.json();

            // Filter countries by search input
            const filteredCountries = countries.filter(country =>
                country.name.common.toLowerCase().includes(query)
            );

            // Show suggestions
            if (filteredCountries.length > 0) {
                suggestionsElement.style.display = 'block';
                filteredCountries.forEach(country => {
                    const item = document.createElement('div');
                    item.className = 'dropdown-item';
                    item.textContent = country.name.common;
                    item.onclick = () => loadCountry(country.name.common); // Load country on click
                    suggestionsElement.appendChild(item);
                });
            } else {
                suggestionsElement.style.display = 'none'; // No matches
            }
        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        clearResult(); // Clear results if input is empty
        suggestionsElement.style.display = 'none'; // Hide suggestions
    }
});

// Load country data
async function loadCountry(countryName) {
    try {
        const response = await fetch('https://restcountries.com/v3.1/name/' + countryName);
        const countryData = await response.json();
        displayResult(countryData[0]); // Display the first match
    } catch (error) {
        console.error('Error:', error);
    }
}

// Animate text
function animateText(element, text) {
    element.textContent = ''; // Clear text
    let index = 0;
    const interval = setInterval(() => {
        if (index < text.length) {
            element.textContent += text[index++];
        } else {
            clearInterval(interval); // Stop the animation
            element.style.opacity = 1; // Ensure the element is fully visible after animation
        }
    }, 100); // Adjust the speed here (in milliseconds)
}

function displayResult(country) {
    const countryNameElement = document.getElementById('countryName');
    const countryFlagElement = document.getElementById('countryFlag');
    const countryCapitalElement = document.getElementById('countryCapital');
    const countryPopulationElement = document.getElementById('countryPopulation');
    const countryRegionElement = document.getElementById('countryRegion');
    const countrySubregionElement = document.getElementById('countrySubregion');
    const suggestionsElement = document.getElementById('suggestions');

    // Inject the country name and flag into pre-created elements
    animateText(countryNameElement, `Country Name: ${country.name.common}`);
    countryFlagElement.src = country.flags.png; // Set flag image source
    animateText(countryCapitalElement, `Capital: ${country.capital ? country.capital[0] : 'N/A'}`);
    animateText(countryPopulationElement, `Population: ${country.population.toLocaleString()}`);
    animateText(countryRegionElement, `Region: ${country.region}`);
    animateText(countrySubregionElement, `Subregion: ${country.subregion || 'N/A'}`);

    // Display map
    displayMap(country.latlng[0], country.latlng[1]); // Pass latitude and longitude

    // Clear suggestions
    suggestionsElement.innerHTML = '';
    suggestionsElement.style.display = 'none'; // Hide dropdown after selection
}

function displayMap(lat, lng) {
    const mapElement = document.getElementById('map');

    // Clear previous map
    mapElement.innerHTML = '';

    // Initialize the map
    const map = L.map(mapElement).setView([lat, lng], 5); // Set initial view

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([lat, lng]).addTo(map); // Add a marker
}

function clearResult() {
    const countryNameElement = document.getElementById('countryName');
    const countryFlagElement = document.getElementById('countryFlag');
    const countryCapitalElement = document.getElementById('countryCapital');
    const countryPopulationElement = document.getElementById('countryPopulation');
    const countryRegionElement = document.getElementById('countryRegion');
    const countrySubregionElement = document.getElementById('countrySubregion');

    animateText(countryNameElement, 'Country Name:');
    countryFlagElement.src = ''; // Clear flag
    animateText(countryCapitalElement, 'Capital:');
    animateText(countryPopulationElement, 'Population:');
    animateText(countryRegionElement, 'Region:');
    animateText(countrySubregionElement, 'Subregion:');
}

// Close dropdown when clicking outside
document.addEventListener('click', (event) => {
    const suggestionsElement = document.getElementById('suggestions');
    const searchInput = document.getElementById('searchInput');
    if (!suggestionsElement.contains(event.target) && event.target !== searchInput) {
        suggestionsElement.style.display = 'none'; // Hide dropdown
    }
});
