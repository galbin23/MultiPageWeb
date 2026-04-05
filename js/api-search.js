const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const status = document.getElementById("status");
const results = document.getElementById("results");

async function runSearch() {
    const term = searchInput.value.trim();

    if (!term) {
        status.textContent = "Please enter a meal name to search!";
        results.innerHTML = "";
        return;
    }

    status.textContent = "Loading delicious recipes...";
    results.innerHTML = "";

    try {
        const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(term)}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.meals) {
            status.textContent = `No recipes found for "${term}". Try something else!`;
            return;
        }

        status.textContent = `Found ${data.meals.length} recipe(s) for "${term}"`;

        results.innerHTML = data.meals.map(meal => `
            <div class="card">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <div class="card-content">
                    <h3>${meal.strMeal}</h3>
                    <p><strong>Category:</strong> ${meal.strCategory}</p>
                    <p><strong>Area:</strong> ${meal.strArea}</p>
                    ${meal.strYoutube ? `<p><strong>Video:</strong> <a href="${meal.strYoutube}" target="_blank">Watch on YouTube</a></p>` : ''}
                </div>
            </div>
        `).join("");

    } catch (error) {
        console.error(error);
        status.textContent = "Something went wrong. Please try again later.";
    }
}

searchBtn.addEventListener("click", runSearch);

searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") runSearch();
});
