const mealsEl = document.getElementById('meals');
const favoriteContainer = document.getElementById('fav-meals');
const mealPopup = document.getElementById('meal-popup');
const mealInfoEl = document.getElementById('meal-info');
const popupCloseBtn = document.getElementById('close-popup');
const searchTerm = document.getElementById('search-term');
const searchBtn = document.getElementById('search');

let randomMealsFetched = 0;
const totalRandomMeals = 10;

document.addEventListener('DOMContentLoaded', function () {
  const darkModePreference = localStorage.getItem('darkMode');

  if (darkModePreference !== null) {
    toggleDarkMode(darkModePreference === 'true');
  }
});

async function getMealById(id) {
  showLoadingIndicator();
  const resp = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
  const respData = await resp.json();
  hideLoadingIndicator();
  return respData.meals[0];
}

async function getMealsBySearch(term) {
  showLoadingIndicator();
  const resp = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
  const respData = await resp.json();
  hideLoadingIndicator();
  return respData.meals;
}

function addMeal(mealData, random = false) {
  const meal = document.createElement('div');
  meal.classList.add('meal');

  const mealImage = mealData.strMealThumb
    ? `<img src="${mealData.strMealThumb}" alt="${mealData.strMeal}" />`
    : `<div class="no-image">No Images Available</div>`;

  meal.innerHTML = `
        <div class="meal-header">
            ${random ? `<span class="random">Recipe For You</span>` : ''}
            ${mealImage}
        </div>
        <div class="meal-body">
            <h4>${mealData.strMeal}</h4>
            <button class="fav-btn" title="Add to Favorites">
                <i class="fas fa-heart"></i>
            </button>
        </div>
    `;

  const btn = meal.querySelector('.meal-body .fav-btn');

  btn.addEventListener('click', () => {
    if (btn.classList.contains('active')) {
      removeMealLS(mealData.idMeal);
      btn.classList.remove('active');
    } else {
      addMealLS(mealData.idMeal);
      btn.classList.add('active');
    }
    fetchFavMeals();
  });

  meal.addEventListener('click', () => {
    showMealInfo(mealData);
  });

  mealsEl.appendChild(meal);

  randomMealsFetched++;
  if (randomMealsFetched === totalRandomMeals) {
    hideLoadingIndicator();
  }
}

function addMealLS(mealId) {
  const mealIds = getMealsLS();

  localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealId]));
}

function removeMealLS(mealId) {
  const mealIds = getMealsLS();

  localStorage.setItem('mealIds', JSON.stringify(mealIds.filter(id => id !== mealId)));
}

function getMealsLS() {
  const mealIds = JSON.parse(localStorage.getItem('mealIds'));
  return mealIds === null ? [] : mealIds;
}

async function fetchFavMeals() {
  favoriteContainer.innerHTML = '';

  const mealIds = getMealsLS();

  for (let i = 0; i < mealIds.length; i++) {
    const mealId = mealIds[i];
    meal = await getMealById(mealId);

    addMealFav(meal);
  }
}

function addMealFav(mealData) {
  const favMeal = document.createElement('li');
  favMeal.innerHTML = `
        <img
            src="${mealData.strMealThumb}"
            alt="${mealData.strMeal}"
        /><span>${mealData.strMeal}</span>
        <button class="clear" style="color: red"><i class="fas fa-window-close"></i></button>
    `;

  const btn = favMeal.querySelector('.clear');
  btn.addEventListener('click', () => {
    removeMealLS(mealData.idMeal);

    fetchFavMeals();
  });
  favMeal.addEventListener('click', () => {
    showMealInfo(mealData);
  });
  favoriteContainer.appendChild(favMeal);
}

function showLoadingIndicator() {
  document.getElementById('loadingIndicator').style.display = 'block';
}

function hideLoadingIndicator() {
  document.getElementById('loadingIndicator').style.display = 'none';
}

document.getElementById('search-term').addEventListener('input', async function () {
  const searchTerm = this.value.trim();
  const searchResultsContainer = document.getElementById('search-results-container');

  if (searchTerm.length === 0) {
    searchResultsContainer.innerHTML = '';
    return;
  }

  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(searchTerm)}`);
    const data = await response.json();

    searchResultsContainer.innerHTML = '';

    if (data.meals) {
      data.meals.slice(0, 5).forEach(meal => {
        const mealCard = document.createElement('div');
        mealCard.classList.add('meal-card');
        mealCard.innerHTML = `
                    <img src="${meal.strMealThumb}" alt="Image of ${meal.strMeal}">
                    <div class="meal-name" style="color: black">${meal.strMeal}</div>
                `;

        mealCard.addEventListener('click', async () => {
          const mealData = await getMealById(meal.idMeal);
          showMealInfo(mealData);
        });

        searchResultsContainer.appendChild(mealCard);
      });
    } else {
      searchResultsContainer.innerHTML = '<div style="margin-bottom: 20px">No matches found.</div>';
    }
  } catch (error) {
    console.error('Error fetching meals:', error);
    searchResultsContainer.innerHTML = '<div>Unable to fetch meals. Please try again.</div>';
  }
});

function showMealInfo(mealData) {
  mealInfoEl.innerHTML = '';
  const mealElement = document.createElement('div');
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (mealData['strIngredient' + i]) {
      ingredients.push(`${mealData['strIngredient' + i]} - ${mealData['strMeasure' + i]}`);
    } else {
      break;
    }
  }

  const youtubeButton = mealData.strYoutube ? `<a href="${mealData.strYoutube}" target="_blank" class="link-button">Watch on YouTube</a>` : '';
  const sourceButton = mealData.strSource ? `<a href="${mealData.strSource}" target="_blank" class="link-button">Recipe Source</a>` : '';

  let tagsMarkup = '';
  if (mealData.strTags) {
    const tags = mealData.strTags.split(',');
    tagsMarkup = tags.map(tag => `<span class="tag" onclick="searchByTag('${tag.trim()}')">${tag.trim()}</span>`).join(' ');
  } else {
    tagsMarkup = '<p>No tags available</p>';
  }

  mealElement.innerHTML = `
        <h1>${mealData.strMeal}</h1>
        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}" />
        <p>${mealData.strInstructions}</p>
        <h3>Ingredients:</h3>
        <ul id="ingredients" style="text-align: left;">${ingredients.map(ing => `<li>${ing}</li>`).join('')}</ul>
        ${youtubeButton}
        ${sourceButton}
        <h3>Tags:</h3>
        <div class="tags-container">${tagsMarkup}</div>
    `;

  mealInfoEl.appendChild(mealElement);
  mealPopup.classList.remove('hidden');
  toggleSideElements(false);
}

popupCloseBtn.addEventListener('click', () => {
  mealPopup.classList.add('hidden');
  toggleSideElements(true);
});

searchBtn.addEventListener('click', async () => {
  mealsEl.innerHTML = '';

  const search = searchTerm.value;
  const meals = await getMealsBySearch(search);

  if (meals) {
    meals.forEach(meal => {
      addMeal(meal);
    });
  }
  document.getElementById('back-to-home-btn').classList.add('visible');
  document.getElementById('back-to-home-btn').style.display = 'block';
});

searchTerm.addEventListener('keydown', async e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    mealsEl.innerHTML = '';

    const search = searchTerm.value;
    const meals = await getMealsBySearch(search);

    if (meals) {
      meals.forEach(meal => {
        addMeal(meal);
      });
    }
    document.getElementById('back-to-home-btn').classList.add('visible');
    document.getElementById('back-to-home-btn').style.display = 'block';
  }
});

function searchByTag(tag) {
  mealPopup.classList.add('hidden');
  searchTerm.value = tag;
  searchBtn.click();
  toggleSideElements(true);
}

window.addEventListener('resize', () => {
  const isPopupHidden = mealPopup.classList.contains('hidden');
  toggleSideElements(isPopupHidden);
});

toggleSideElements(true);

function resetToHomepage() {
  document.getElementById('search-term').value = '';
  mealsEl.innerHTML = '';
  for (let i = 0; i < 10; i++) {
    getRandomMeal();
  }
  document.getElementById('back-to-home-btn').classList.add('hidden');
}

document.getElementById('back-to-home-btn').addEventListener('click', () => {
  const backToHomeBtn = document.getElementById('back-to-home-btn');
  backToHomeBtn.style.display = 'none';
  const searchResultsContainer = document.getElementById('search-results-container');
  searchResultsContainer.innerHTML = '';
  resetToHomepage();
});

popupCloseBtn.addEventListener('click', () => {
  mealPopup.classList.add('hidden');
});

function toggleSideElements(show) {
  if (!mealPopup.classList.contains('hidden')) {
    return;
  }

  const elements = document.querySelectorAll('.side-element');

  if (window.innerWidth >= 1230) {
    elements.forEach(el => (el.style.display = 'block'));
  } else {
    elements.forEach(el => (el.style.display = 'none'));
  }
}

function addReloadButton() {
  const reloadButton = document.createElement('button');
  reloadButton.id = 'reload-page-btn';
  reloadButton.innerHTML = '<i class="fas fa-sync-alt"></i> Reload Page';
  reloadButton.onclick = () => window.location.reload();
  reloadButton.style.marginBottom = '20px';

  const searchHeader = document.getElementById('app-header');
  searchHeader.appendChild(reloadButton);
}

function toggleDarkMode(enable) {
  if (enable) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }

  localStorage.setItem('darkMode', enable);
}

// Example of consistent Font Awesome icons and styling:

const minimizeBtn = document.getElementById('minimizeChatbot');
let isMinimized = true;

// Initially minimized
chatbotBody.style.display = 'none';
chatbotInput.style.display = 'none';

// Use fa-angle-up for "maximize" by default:
minimizeBtn.innerHTML = '<i class="fas fa-angle-up"></i>';
minimizeBtn.setAttribute('title', 'Maximize Chatbot');

// Optional styling for the header border radius:
document.getElementById('chatbotHeader').style.borderRadius = '8px';

// Click to toggle
minimizeBtn.addEventListener('click', function () {
  if (isMinimized) {
    // If minimized, we now show the chatbot body/input
    chatbotBody.style.display = 'block';
    chatbotInput.style.display = 'block';

    // Change icon to fa-angle-down
    minimizeBtn.innerHTML = '<i class="fas fa-angle-down"></i>';
    minimizeBtn.setAttribute('title', 'Minimize Chatbot');
    document.getElementById('chatbotHeader').style.borderBottomLeftRadius = '0';
    document.getElementById('chatbotHeader').style.borderBottomRightRadius = '0';
  } else {
    // Hide the chatbot body/input
    chatbotBody.style.display = 'none';
    chatbotInput.style.display = 'none';

    // Change icon to fa-angle-up
    minimizeBtn.innerHTML = '<i class="fas fa-angle-up"></i>';
    minimizeBtn.setAttribute('title', 'Maximize Chatbot');

    // Restore border radius
    document.getElementById('chatbotHeader').style.borderBottomLeftRadius = '8px';
    document.getElementById('chatbotHeader').style.borderBottomRightRadius = '8px';
  }

  isMinimized = !isMinimized;
});

const seasonalRecipes = {
  spring: ['salad', 'asparagus', 'lemon chicken'],
  summer: ['grilled', 'avocado', 'berries'],
  autumn: ['pumpkin', 'squash', 'stew'],
  winter: ['soup', 'roast', 'hot chocolate'],
};

const dayOfWeekRecipes = {
  Monday: 'vegetarian',
  Tuesday: 'chicken',
  Wednesday: 'beef',
  Thursday: 'seafood',
  Friday: 'pasta',
  Saturday: 'stew',
  Sunday: 'dessert',
};

function getDayOfWeek() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long' });
}

const darkModeToggle = document.getElementById('dark-mode-toggle');

function updateDarkMode(isDarkMode) {
  if (isDarkMode) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
  localStorage.setItem('darkMode', isDarkMode);
}

function loadDarkModePreference() {
  const darkModePreference = localStorage.getItem('darkMode');
  if (darkModePreference !== null) {
    updateDarkMode(darkModePreference === 'true');
  }
}

darkModeToggle.addEventListener('click', function () {
  const isDarkModeEnabled = document.body.classList.contains('dark-mode');
  toggleDarkMode(!isDarkModeEnabled);
});

loadDarkModePreference();

async function fetchRecipeOfTheDay() {
  const today = new Date().toDateString();
  let savedRecipe = localStorage.getItem('recipeOfTheDay');
  savedRecipe = savedRecipe ? JSON.parse(savedRecipe) : null;

  if (!savedRecipe || savedRecipe.date !== today) {
    const season = getSeason();
    const dayOfWeek = getDayOfWeek();
    const searchTerm = dayOfWeekRecipes[dayOfWeek];
    const seasonalIngredient = seasonalRecipes[season][Math.floor(Math.random() * seasonalRecipes[season].length)];
    const recipeKeyword = searchTerm + ',' + seasonalIngredient;

    const resp = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${recipeKeyword}`);
    const respData = await resp.json();
    let meals = respData.meals;

    if (!meals || meals.length === 0) {
      const randomResp = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
      const randomData = await randomResp.json();
      meals = randomData.meals;
    }

    const recipe = meals[Math.floor(Math.random() * meals.length)];

    savedRecipe = { date: today, data: recipe };
    localStorage.setItem('recipeOfTheDay', JSON.stringify(savedRecipe));
    displayRecipeOfTheDay(recipe);
  } else {
    displayRecipeOfTheDay(savedRecipe.data);
  }
}

function displayRecipeOfTheDay(recipe) {
  const container = document.getElementById('recipe-of-the-day');
  const mealId = recipe.idMeal || recipe.id;

  container.innerHTML = `
        <div class="meal" onclick="fetchAndShowMealInfo(${mealId})">
            <div class="meal-header">
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" />
            </div>
            <div class="meal-body">
                <h4>${recipe.strMeal}</h4>
                <button style="font: inherit; cursor: pointer" onclick="fetchAndShowMealInfo(${mealId})" class="detail-btn">View Details</button>
            </div>
        </div>
    `;
}

async function fetchAndShowMealInfo(mealId) {
  const mealData = await getMealById(mealId);
  showMealInfo(mealData);
}

document.addEventListener('DOMContentLoaded', fetchRecipeOfTheDay);

const timerContainer = document.getElementById('active-timers');

document.getElementById('timer-start-btn').addEventListener('click', () => {
  let minutes = parseInt(document.getElementById('timer-input').value);
  if (isNaN(minutes) || minutes <= 0) {
    alert('Please enter a valid number of minutes.');
    return;
  }
  createTimer(minutes);
});

function createTimer(minutes) {
  const endTime = new Date(new Date().getTime() + minutes * 60000);
  const timerItem = document.createElement('li');
  const endTimeSpan = document.createElement('span');
  const countdownSpan = document.createElement('span');
  const removeBtn = document.createElement('button');

  removeBtn.innerText = 'Remove';
  removeBtn.onclick = () => {
    clearInterval(timerItem.intervalId);
    timerItem.remove();
  };

  endTimeSpan.innerText = `Ends at ${endTime.toLocaleTimeString()} `;
  countdownSpan.innerText = `${minutes}m 00s remaining`;

  timerItem.appendChild(endTimeSpan);
  timerItem.appendChild(countdownSpan);
  timerItem.appendChild(removeBtn);
  timerContainer.appendChild(timerItem);

  timerItem.intervalId = setInterval(() => {
    const now = new Date();
    const timeLeft = endTime.getTime() - now.getTime();

    if (timeLeft <= 0) {
      clearInterval(timerItem.intervalId);
      countdownSpan.innerText = `Time's up!`;
      playSound('../../utils/timer-sound.mp3');
      setTimeout(function () {
        alert('Timer complete!');
      }, 100);
    } else {
      const minutesLeft = Math.floor(timeLeft / 60000);
      const secondsLeft = Math.floor((timeLeft % 60000) / 1000);
      countdownSpan.innerText = `${minutesLeft}m ${secondsLeft}s remaining`;
    }
  }, 1000);
}

function playSound(filename) {
  const audio = new Audio(filename);
  audio.play();
}

const tips = [
  'To keep potatoes from sprouting, place an apple in the bag with the potatoes.',
  'To prevent butter from over-browning in your pan, add a little bit of lemon juice.',
  'Use a microplane to grate garlic, ginger, and hard cheeses.',
  'For fluffier, whiter rice, add a teaspoon of lemon juice to the boiling water.',
  'Let roasted meats rest before carving to keep them juicy.',
  "Use yogurt instead of cream to thicken soups – it's healthier and gives a tangy flavor.",
  'Marinate meat with acidic ingredients like vinegar or citrus to tenderize.',
  'To keep your brown sugar soft, store it with a slice of bread.',
  'Grate cold butter to make it easier to spread.',
  'To ripen avocados quickly, place them in a paper bag with a banana.',
  'Use parchment paper when baking for an easy cleanup.',
  'Freeze herbs in olive oil in ice cube trays for future use.',
  'To get more juice out of lemons or limes, roll them on the counter before squeezing.',
  'Keep your spices away from sources of heat like the stove or lights to preserve their flavor.',
  'To clean a grill, cut an onion in half and rub it over the grates.',
  'Refresh limp vegetables by soaking them in ice water.',
  'Soak wooden skewers in water for 30 minutes before grilling to prevent burning.',
  'To keep your cutting board from slipping, place a damp paper towel underneath.',
  'To keep brown sugar soft, add a slice of bread to the container.',
  'To keep cookies soft, store them with a slice of bread.',
  'To keep bananas from browning, wrap the stems in plastic wrap.',
];

function updateClock() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  document.getElementById('clock-time').textContent = `${hours}:${minutes}:${seconds}`;
}

updateClock();
setInterval(updateClock, 1000);

// document.getElementById('quick-tip-btn').addEventListener('click', function() {
//     const randomIndex = Math.floor(Math.random() * tips.length);
//     document.getElementById('tip-content').textContent = tips[randomIndex];
//     document.getElementById('tip-popover').classList.remove('hidden');
// });

// document.getElementById('close-tip').addEventListener('click', function() {
//     document.getElementById('tip-popover').classList.add('hidden');
// });

document.getElementById('convert-btn').addEventListener('click', function () {
  const conversionType = document.getElementById('conversion-type').value;
  const valueToConvert = parseFloat(document.getElementById('conversion-input').value);
  let resultUnit;
  let result;
  if (isNaN(valueToConvert)) {
    alert('Please enter a valid number.');
    return;
  }
  switch (conversionType) {
    case 'tablespoons-teaspoons':
      result = valueToConvert * 3;
      resultUnit = 'teaspoons';
      break;
    case 'teaspoons-tablespoons':
      result = valueToConvert / 3;
      resultUnit = 'tablespoons';
      break;
    case 'cups-milliliters':
      result = valueToConvert * 236.588;
      resultUnit = 'milliliters';
      break;
    case 'milliliters-cups':
      result = valueToConvert / 236.588;
      resultUnit = 'cups';
      break;
    case 'fahrenheit-celsius':
      result = ((valueToConvert - 32) * 5) / 9;
      resultUnit = 'celsius';
      break;
    case 'celsius-fahrenheit':
      result = (valueToConvert * 9) / 5 + 32;
      resultUnit = 'fahrenheit';
      break;
    case 'pounds-kilograms':
      result = valueToConvert * 0.453592;
      resultUnit = 'kilograms';
      break;
    case 'kilograms-pounds':
      result = valueToConvert / 0.453592;
      resultUnit = 'pounds';
      break;
    case 'ounces-grams':
      result = valueToConvert * 28.3495;
      resultUnit = 'grams';
      break;
    case 'grams-ounces':
      result = valueToConvert / 28.3495;
      resultUnit = 'ounces';
      break;
    case 'liters-quarts':
      result = valueToConvert * 1.05669;
      resultUnit = 'quarts';
      break;
    case 'quarts-liters':
      result = valueToConvert / 1.05669;
      resultUnit = 'liters';
      break;
    case 'gallons-liters':
      result = valueToConvert * 3.78541;
      resultUnit = 'liters';
      break;
    case 'liters-gallons':
      result = valueToConvert / 3.78541;
      resultUnit = 'gallons';
      break;
    case 'tablespoons-milliliters':
      result = valueToConvert * 14.7868;
      resultUnit = 'milliliters';
      break;
    case 'milliliters-tablespoons':
      result = valueToConvert / 14.7868;
      resultUnit = 'tablespoons';
      break;
  }
  document.getElementById('conversion-result').textContent = `Result: ${result.toFixed(2)} ${resultUnit}`;
});

function getSeason() {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) {
    return 'spring';
  } else if (month >= 5 && month <= 7) {
    return 'summer';
  } else if (month >= 8 && month <= 10) {
    return 'autumn';
  } else {
    return 'winter';
  }
}

const flavorPairs = {
  apple: 'cinnamon',
  salmon: 'dill',
  chocolate: 'orange',
  chicken: 'thyme',
  beef: 'rosemary',
  pork: 'apple',
  carrot: 'ginger',
  tomato: 'basil',
  strawberry: 'balsamic',
  lemon: 'lavender',
  shrimp: 'garlic',
  mushroom: 'parsley',
  spinach: 'nutmeg',
  banana: 'walnut',
  blueberry: 'lemon',
  egg: 'black pepper',
  potato: 'rosemary',
  avocado: 'lime',
  lime: 'cilantro',
  coffee: 'vanilla',
  pear: 'blue cheese',
  honey: 'ginger',
  orange: 'chocolate',
  watermelon: 'feta',
  mint: 'chocolate',
  pineapple: 'coconut',
  peach: 'balsamic',
  pumpkin: 'nutmeg',
  cherry: 'almond',
  asparagus: 'lemon',
  blackberry: 'ginger',
  raspberry: 'chocolate',
  cranberry: 'orange',
  fig: 'goat cheese',
  grape: 'blue cheese',
  mango: 'lime',
  artichoke: 'lemon',
  apricot: 'almond',
  brie: 'apple',
  cabbage: 'caraway',
  cantaloupe: 'prosciutto',
  cauliflower: 'cumin',
  celery: 'blue cheese',
  cheddar: 'apple',
  coconut: 'lime',
  corn: 'cilantro',
  cucumber: 'dill',
  fennel: 'orange',
  garlic: 'basil',
  grapefruit: 'mint',
  hazelnut: 'chocolate',
  jalapeno: 'cilantro',
  kale: 'lemon',
  kiwi: 'strawberry',
  lentil: 'cumin',
  olive: 'rosemary',
  onion: 'thyme',
  parmesan: 'balsamic',
  plum: 'cinnamon',
  pomegranate: 'mint',
  radish: 'butter',
  raisin: 'cinnamon',
  ricotta: 'lemon',
  sage: 'butternut squash',
  tarragon: 'chicken',
  watercress: 'orange',
};

document.getElementById('flavor-input').addEventListener('input', function () {
  const ingredient = this.value.trim().toLowerCase();
  const results = document.getElementById('pair-results');
  if (ingredient && flavorPairs[ingredient]) {
    results.textContent = `Pairs with: ${flavorPairs[ingredient]}`;
  } else if (ingredient) {
    results.textContent = 'No pair found. Try a different ingredient.';
  } else {
    results.textContent = 'Enter an ingredient to see its pair.';
  }
});

async function getRandomMeal() {
  try {
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    const respData = await resp.json();
    const randomMeal = respData.meals[0];
    addMeal(randomMeal, true);
  } catch (error) {
    console.error('Error fetching random meal:', error);
    randomMealsFetched++;
    if (randomMealsFetched === totalRandomMeals) {
      hideLoadingIndicator();
    }
  }
}

document.addEventListener('DOMContentLoaded', async function () {
  randomMealsFetched = 0;
  showLoadingIndicator();
  for (let i = 0; i < totalRandomMeals; i++) {
    await getRandomMeal();
  }
  fetchFavMeals();
});

document.getElementById('get-more-btn').addEventListener('click', function () {
  showLoadingIndicator();
  randomMealsFetched = 0;

  for (let i = 0; i < totalRandomMeals; i++) {
    getRandomMeal();
  }
});

document.getElementById('scroll-top-btn').addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});
