const input = document.getElementById('country-input');
const spinner = document.getElementById('loading-spinner');
const countryInfo = document.getElementById('country-info');
const borderingCountries = document.getElementById('bordering-countries');
const errorMessage = document.getElementById('error-message');

async function searchCountry(countryName) {
    try {
        if (!countryName) {
            throw new Error("Please enter a country name.");
        }

        // Reset UI
        errorMessage.classList.add('hidden');
        countryInfo.classList.add('hidden');
        borderingCountries.classList.add('hidden');
        borderingCountries.innerHTML = "";

        //1. Show spinner
        spinner.classList.remove('hidden');

        //2. Fetch country data
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        
        if (!response.ok) {
            throw new Error("Country not found.");
        }

        const data = await response.json();
        const country = data[0];

        //3. Update country info
        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="${country.name.common} flag" width="100">
        `;

        countryInfo.classList.remove('hidden');

        //4. Fetch bordering countries
        if (country.borders) {
            borderingCountries.classList.remove('hidden');

            for (let code of country.borders) {
                const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
                const borderData = await borderResponse.json();
                const borderCountry = borderData[0];

                const borderCard = document.createElement('div');
                borderCard.classList.add('border-card');
                borderCard.innerHTML = `
                    <p>${borderCountry.name.common}</p>
                    <img src="${borderCountry.flags.svg}" alt="${borderCountry.name.common} flag" width="60">
                `;
                borderingCountries.appendChild(borderCard);
            }
        }

    } catch (error) {
        errorMessage.textContent = error.message;
        errorMessage.classList.remove('hidden');
    } finally {
        // Hide spinner
        spinner.classList.add('hidden');
    }
}

// Button click event
document.getElementById('search-btn').addEventListener('click', () => {
    const country = document.getElementById('country-input').value;
    searchCountry(country);
});

// Enter key event
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchCountry(input.value.trim());
    }
});