document.addEventListener('DOMContentLoaded', () => {
    const btnSearch = document.getElementById('btnSearch');
    const btnClear = document.getElementById('btnClear');

    function resetSearch() {
        document.getElementById("searchInput").value = "";
    }

    function searchCondition() {
        const input = document.getElementById('searchInput').value.toLowerCase();
        let resultDiv = document.getElementById('result');
        if (!resultDiv) {
            resultDiv = document.createElement('div');
            resultDiv.id = 'result';
            document.body.appendChild(resultDiv);
        }
        resultDiv.innerHTML = '';

        fetch('travel_recommendation_api.json')
            .then(response => response.json())
            .then(data => {
                if (input.includes("beach")) {
                    displayResults(data.beaches, resultDiv);
                } else if (input.includes("temple")) {
                    displayResults(data.temples, resultDiv);
                } else {
                    const matchingCountry = data.countries.find(country => 
                        country.name.toLowerCase() === input || 
                        country.cities.some(city => city.name.toLowerCase().includes(input))
                    );

                    if (matchingCountry) {
                        displayResults(matchingCountry.cities, resultDiv);
                    } else {
                        resultDiv.innerHTML = '<p>No matching results found. Try "beach," "temple," or a country name.</p>';
                    }
                }
            })
            .catch(error => {
                console.error('Error:', error);
                resultDiv.innerHTML = '<p>An error occurred while fetching data.</p>';
            });
    }

    function displayResults(items, resultDiv) {
        if (!items || items.length === 0) {
            resultDiv.innerHTML = '<p>No recommendations found.</p>';
            return;
        }

        items.slice(0, 2).forEach(item => {
            resultDiv.innerHTML += `
                <div class="result-item">
                    <h3>${item.name}</h3>
                    <img src="${item.imageUrl}" alt="${item.name}" class="result-image">
                    <p>${item.description}</p>
                </div>
            `;
        });
    }

    btnSearch.addEventListener('click', searchCondition);
    btnClear.addEventListener('click', resetSearch);
});
