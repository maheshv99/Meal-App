// Home Page
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const favoriteMeals = document.getElementById("favoriteMeals");

if (!localStorage.getItem("FavMeals")) {
  localStorage.setItem("FavMeals", JSON.stringify([]));
}

searchInput.addEventListener("input", async () => {
  const query = searchInput.value.trim();
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );
    let data = await response.json();
    // console.log(data);
    if (data.meals == null) {
      throw new Error("Search meal is not available!!!");
    }
    displaySearchResults(data.meals, searchResults);
  } catch (error) {
    console.log("Error fetching meals:", error);
    searchResults.innerHTML = `<h3 style="color:red;">${error}</h3>`;
  }
});

function displaySearchResults(meals, showResults) {
  showResults.innerHTML = "";
  let ss = JSON.parse(localStorage.getItem("FavMeals"));
  meals.forEach((meal) => {
    const li = document.createElement("li");

    const image = document.createElement("img");
    image.src = meal.strMealThumb;
    image.alt = "img";

    const caption = document.createElement("caption");
    caption.textContent = meal.strMeal;

    const buttonContainer = document.createElement("div");

    const detailsButton = document.createElement("button");
    detailsButton.textContent = "More details";
    detailsButton.addEventListener("click", () => {
      localStorage.setItem("selectedMeal", JSON.stringify(meal));
      window.location.href = "meal.html";
      loadMoreDetails();
    });

    const favButton = document.createElement("button");
    favButton.innerHTML = '<i class="fa-solid fa-heart"></i>';
    favButton.addEventListener("click", (event) => {
      handleFavBtn(event, meal);
    });

    for (const item of ss) {
      if (item.idMeal == meal.idMeal) {
        favButton.classList.add("FavMeal");
      }
    }

    buttonContainer.appendChild(detailsButton);
    buttonContainer.appendChild(favButton);

    li.appendChild(image);
    li.appendChild(caption);
    li.appendChild(buttonContainer);

    showResults.appendChild(li);
  });
}

function handleFavBtn(e, meal) {
  let ss = JSON.parse(localStorage.getItem("FavMeals"));

  if (e.target.closest("button").classList.contains("FavMeal")) {
    e.target.closest("button").classList.remove("FavMeal");

    ss = ss.filter((item) => item.idMeal !== meal.idMeal);
    localStorage.setItem("FavMeals", JSON.stringify(ss));
  } else {
    e.target.closest("button").classList.add("FavMeal");
    ss.push(meal);
    localStorage.setItem("FavMeals", JSON.stringify(ss));
  }
}

function loadFavMeals() {
  let meals = JSON.parse(localStorage.getItem("FavMeals"));
  displaySearchResults(meals, favoriteMeals);
}

// Meal Detail Page

function loadMoreDetails() {
  const mealDetailsContainer = document.getElementById("mealDetails");
  const selectedMeal = JSON.parse(localStorage.getItem("selectedMeal"));
  if (selectedMeal) {
    let ele = `
       <div class="mealDetailshead">
       <div>
       <img
         src="${selectedMeal.strMealThumb}"
         alt="img"
       />
     </div>
     <div>
       <h2><i>Pancakes</i></h2>
       <p><i>Category : ${selectedMeal.strCategory}</i></p>
       <p><i>Area : ${selectedMeal.strArea}</i></p>
     </div>
       </div>
          </div>
          <div>
            <h2>Instruction</h2> <br>
            <p>
            ${selectedMeal.strInstructions}
            </p>
          </div>
          <br>
          
          <button><a href="${selectedMeal.strYoutube}">Watch Video</a></button>
        `;
    mealDetailsContainer.innerHTML = ele;
  } else {
    mealDetailsContainer.innerHTML = "<p>No meal selected</p>";
  }
}
