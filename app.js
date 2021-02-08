const search = document.getElementById("search"),
  submit = document.getElementById("submit"),
  mealsEl = document.getElementById("meals"),
  resultHeading = document.getElementById("result-heading"),
  single_mealEl = document.getElementById("single-meal");
function searchMeal(e) {
  e.preventDefault();
  single_mealEl.innerHTML = "";
  const term = search.value;
  if (term.trim()) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        resultHeading.innerHTML = `<h2>Search results for <span class="search-keywords">'${term}'</span></h2>`;
        if (data.meals === null) {
          resultHeading.innerHTML = `<p>There are no search results. Try again!</p>`;
        } else {
          mealsEl.innerHTML = data.meals
            .map(
              (meal) => `
            <div class="meal">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
              <div class="meal-info" data-mealID="${meal.idMeal}">
                <h3>${meal.strMeal}</h3>
              </div>
            </div>`
            )
            .join("");
        }
      });
    search.value = "";
  } else {
    alert("Please enter a search term");
  }
}
function getMealById(mealID) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      addMealToDOM(meal);
    });
}
function addMealToDOM(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]}-${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }
  single_mealEl.innerHTML = `
  <div class="single-meal">
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
    <h2>${meal.strMeal}</h2>
    
    <div class="main">
        <h4>Ingredients</h4>
        <ul>
            ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
        </ul>
    </div>
  </div>`;
}
submit.addEventListener("submit", searchMeal);
mealsEl.addEventListener("click", (e) => {
  const mealInfo = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains("meal-info");
    } else {
      return false;
    }
  });
  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealid");
    getMealById(mealID);
  }
});
