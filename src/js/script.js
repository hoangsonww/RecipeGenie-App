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
  sendWelcomeMessage();
});

function sendWelcomeMessage() {
  const welcomeMessage = `Welcome to RecipeGenie! 🌟 Here's how to get started:
    - To search for a recipe, type 'recipe for [your ingredient or dish]' and hit Enter.
    - Say 'enable dark mode' or 'disable dark mode' to toggle the dark mode.
    - Looking for something specific? Just type your query and I'll help you find it.
    - You can also ask for cooking tips, nutritional advice, and more.
    
    If you need help at any point, just ask! Let's make cooking fun and easy. 🍳🥗`;

  chatbotBody.innerHTML += `
        <div style="text-align: left; margin-bottom: 10px; color: #000000;">${welcomeMessage}</div>
    `;
}

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
  resetToHomepage();
});

popupCloseBtn.addEventListener('click', () => {
  mealPopup.classList.add('hidden');
});

function searchAndDisplayMeals(searchTerm) {
  getMealsBySearch(searchTerm)
    .then(meals => {
      if (meals) {
        mealsEl.innerHTML = '';
        meals.forEach(meal => {
          addMeal(meal);
        });

        addReloadButton();
      } else {
        chatbotBody.innerHTML += `
                <div style="text-align: left; margin-bottom: 10px; color: #000000;">No recipes found for '${searchTerm}'. Please try a different search.</div>
            `;
      }
    })
    .catch(error => {
      console.error('Error fetching meals:', error);
      chatbotBody.innerHTML += `
            <div style="text-align: left; margin-bottom: 10px; color: #000000;">An error occurred while searching for recipes. Please try again later.</div>
        `;
    });
}

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

function elizaResponse(message) {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.startsWith('recipe for ')) {
    const searchTerm = lowerMessage.replace('recipe for ', '');
    searchAndDisplayMeals(searchTerm);
    return `Searching for recipes for ${searchTerm}...`;
  }

  if (lowerMessage.includes('enable dark mode') || lowerMessage.includes('dark mode on')) {
    toggleDarkMode(true);
    return 'Dark mode has been enabled.';
  } else if (lowerMessage.includes('disable dark mode') || lowerMessage.includes('dark mode off')) {
    toggleDarkMode(false);
    return 'Dark mode has been disabled.';
  } else if (lowerMessage.includes('dark mode')) {
    return "You can enable or disable dark mode by saying 'enable dark mode' or 'disable dark mode'.";
  }

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return 'Hello! Ready to cook something delicious with RecipeGenie? I can search for recipes for you, help you enable dark mode, and more!';
  } else if (lowerMessage.includes('how are you')) {
    return "I'm excited to explore tasty recipes with you! What are you in the mood for?";
  } else if (lowerMessage.includes('recipegenie')) {
    return 'RecipeGenie is your culinary companion, offering a plethora of recipes tailored to your taste, dietary preferences, and cooking time!';
  } else if (lowerMessage.includes('ingredient')) {
    return "You can search for recipes based on the ingredients you have on hand! Just type them in, and I'll suggest a variety of dishes.";
  } else if (lowerMessage.includes('dietary preference')) {
    return 'Whether you’re vegan, vegetarian, gluten-free, or have other dietary requirements, RecipeGenie has a diverse collection of recipes for you!';
  } else if (lowerMessage.includes('shopping list')) {
    return 'Every recipe comes with a detailed list of ingredients you can easily turn into a shopping list. Making grocery shopping a breeze!';
  } else if (lowerMessage.includes('meal planning')) {
    return 'RecipeGenie is perfect for meal planning! Save your favorite recipes, and you’ll always have inspiration at your fingertips.';
  } else if (lowerMessage.includes('dinner ideas')) {
    return "Absolutely! Whether you're looking for something quick and easy or a gourmet meal, RecipeGenie has a variety of dinner ideas to explore.";
  } else if (lowerMessage.includes('breakfast options')) {
    return 'From smoothie bowls to classic pancakes, explore a wide range of breakfast recipes to start your day right!';
  } else if (lowerMessage.includes('lunch ideas')) {
    return 'Discover a selection of lunch recipes that are both delicious and quick to prepare. Perfect for busy afternoons!';
  } else if (lowerMessage.includes('dessert')) {
    return 'Indulge in sweet treats from chocolate cakes to fruit tarts. RecipeGenie offers a variety of desserts to satisfy your cravings!';
  } else if (lowerMessage.includes('snacks')) {
    return 'Looking for something to munch on? Explore our snack recipes for quick bites that are both tasty and satisfying!';
  } else if (lowerMessage.includes('healthy recipes')) {
    return "Discover a range of nutritious recipes that don't compromise on flavor. Healthy eating has never been so exciting!";
  } else if (lowerMessage.includes('international cuisine')) {
    return 'Travel the world from your kitchen with RecipeGenie! Explore dishes from various cuisines globally.';
  } else if (lowerMessage.includes('thank')) {
    return "You're welcome! If you have more questions or need recipe inspiration, feel free to ask.";
  } else if (lowerMessage.includes('who are you')) {
    return "I'm your RecipeGenie Assistant, ready to guide you to your next delicious meal!";
  } else if (lowerMessage.includes('help')) {
    return 'Absolutely! Tell me what you need, whether it’s recipe ideas, cooking tips, or navigating the RecipeGenie app.';
  } else if (lowerMessage.includes('vegan')) {
    return "Absolutely! RecipeGenie has a multitude of vegan recipes that are both delicious and satisfying. Just search 'vegan' to explore them!";
  } else if (lowerMessage.includes('save recipe')) {
    return "Using RecipeGenie, you can save your favorite recipes for easy access later. Just click on the 'Save' option on any recipe you love!";
  } else if (lowerMessage.includes('share recipe')) {
    return "Found a recipe you love? You can easily share it with friends and family using the 'Share' option!";
  } else if (lowerMessage.includes('drink') || lowerMessage.includes('beverage')) {
    return 'While RecipeGenie focuses on delicious meals, we also have a selection of drink recipes to complement your meals!';
  } else if (lowerMessage.includes('allergies') || lowerMessage.includes('allergic')) {
    return "Safety first! Always review the ingredients in recipes to ensure they don’t contain allergens specific to you or anyone you're cooking for.";
  } else if (lowerMessage.includes('kids') || lowerMessage.includes('children')) {
    return 'Cooking for the little ones? RecipeGenie has kid-friendly recipes that are both nutritious and appealing to younger taste buds!';
  } else if (lowerMessage.includes('quick meals') || lowerMessage.includes('fast recipes')) {
    return 'In a rush? RecipeGenie offers a variety of recipes that can be made in 30 minutes or less. Perfect for those busy days!';
  } else if (lowerMessage.includes('seasonal recipes') || lowerMessage.includes('holidays')) {
    return "RecipeGenie also provides seasonal recipes perfect for holidays and special occasions. Check out our 'Seasonal' section!";
  } else if (lowerMessage.includes('baking')) {
    return 'Got a sweet tooth? Dive into our baking section for cakes, pies, cookies, and more. Perfect for all your dessert desires!';
  } else if (lowerMessage.includes('cooking tips') || lowerMessage.includes('kitchen hacks')) {
    return 'Need some help in the kitchen? Alongside our recipes, RecipeGenie offers cooking tips and tricks to enhance your culinary skills!';
  } else if (lowerMessage.includes('nutrition') || lowerMessage.includes('healthy')) {
    return "RecipeGenie not only focuses on taste but also on nutrition. We aim to provide balanced recipes to ensure you're nourishing your body right!";
  } else if (lowerMessage.includes('how does it work') || lowerMessage.includes('how to use')) {
    return "Simply enter what you're craving or the ingredients you have on hand into the search bar. RecipeGenie will then suggest recipes tailored just for you!";
  } else if (lowerMessage.includes('breakfast')) {
    return "Looking for a morning treat? RecipeGenie has a wide range of breakfast recipes to kickstart your day. From pancakes to omelettes, we've got you covered!";
  } else if (lowerMessage.includes('lunch')) {
    return 'Lunchtime cravings? RecipeGenie offers a plethora of lunch options from quick sandwiches to hearty salads!';
  } else if (lowerMessage.includes('dinner')) {
    return 'Planning dinner? RecipeGenie can suggest a myriad of dinner recipes, from pasta dishes to grilled entrees. Bon appétit!';
  } else if (lowerMessage.includes('dessert')) {
    return 'Sweet cravings are no match for RecipeGenie! Dive into our collection of delectable desserts, from brownies to cheesecakes!';
  } else if (lowerMessage.includes('snacks') || lowerMessage.includes('appetizers')) {
    return 'Need a bite to snack on or appetizers for your party? RecipeGenie has a selection of tasty tidbits to keep hunger at bay!';
  } else if (lowerMessage.includes('vegetarian')) {
    return "Yes! RecipeGenie has an extensive range of vegetarian recipes. Just input 'vegetarian' in the search to discover them!";
  } else if (lowerMessage.includes('ingredient')) {
    return 'If you have a specific ingredient on hand, just type it into the search. RecipeGenie will show recipes that feature it!';
  } else if (lowerMessage.includes('shopping list')) {
    return 'Found a recipe you like? RecipeGenie can automatically generate a shopping list for you. Making grocery shopping a breeze!';
  } else if (lowerMessage.includes('meal planning')) {
    return 'With RecipeGenie, meal planning is effortless. You can plan your weekly meals and generate a consolidated shopping list in no time!';
  } else if (lowerMessage.includes('world cuisine') || lowerMessage.includes('international dishes')) {
    return "Explore world cuisines with RecipeGenie! Whether you're craving Italian pasta, Japanese sushi, or Indian curry, we have recipes from every corner of the globe.";
  } else if (lowerMessage.includes('spices') || lowerMessage.includes('herbs')) {
    return 'Spices and herbs can elevate any dish! RecipeGenie offers tips on how to use them to bring out the best flavors in your meals.';
  } else if (lowerMessage.includes('cooking for one') || lowerMessage.includes('single serving')) {
    return 'Cooking for just yourself? RecipeGenie has single-serving recipes, ensuring no wastage and just the right portion!';
  } else if (lowerMessage.includes('large group') || lowerMessage.includes('party')) {
    return 'Hosting a party or cooking for a large group? RecipeGenie can suggest recipes perfect for feeding a crowd.';
  } else {
    return "I'm here to help with any questions or needs related to RecipeGenie. Could you please provide more details or try a different question?";
  }
}

const chatbotInput = document.getElementById('chatbotInput');
const chatbotBody = document.getElementById('chatbotBody');

chatbotInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    sendMessage(chatbotInput.value);
    chatbotInput.value = '';
  }
});

function sendMessage(message) {
  chatbotBody.innerHTML += `
        <div style="text-align: right; margin-bottom: 10px; color: black;">${message}</div>
    `;
  let botReply = elizaResponse(message);
  setTimeout(() => {
    chatbotBody.innerHTML += `
            <div style="text-align: left; margin-bottom: 10px; color: #000000;">${botReply}</div>
        `;
  }, 1000);
}

const minimizeBtn = document.getElementById('minimizeChatbot');
let isMinimized = true;

chatbotBody.style.display = 'none';
chatbotInput.style.display = 'none';

minimizeBtn.innerHTML = '<i class="fas fa-window-maximize"></i>';
minimizeBtn.setAttribute('title', 'Maximize chatbot');
document.getElementById('chatbotHeader').style.borderRadius = '8px';

minimizeBtn.addEventListener('click', function () {
  minimizeBtn.style.paddingTop = '14px';
  if (isMinimized) {
    chatbotBody.style.display = 'block';
    chatbotInput.style.display = 'block';
    minimizeBtn.innerHTML = '<i class="fas fa-window-minimize"></i>';
    minimizeBtn.setAttribute('title', 'Minimize chatbot');
    document.getElementById('chatbotHeader').style.borderRadius = '8px';
    minimizeBtn.style.paddingTop = '14px !important';
  } else {
    chatbotBody.style.display = 'none';
    chatbotInput.style.display = 'none';
    minimizeBtn.innerHTML = '<i class="fas fa-window-maximize"></i>';
    minimizeBtn.setAttribute('title', 'Maximize chatbot');
    document.getElementById('chatbotHeader').style.borderRadius = '8px';
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
  let result;
  if (isNaN(valueToConvert)) {
    alert('Please enter a valid number.');
    return;
  }
  switch (conversionType) {
    case 'tablespoons-teaspoons':
      result = valueToConvert * 3;
      break;
    case 'teaspoons-tablespoons':
      result = valueToConvert / 3;
      break;
    case 'cups-milliliters':
      result = valueToConvert * 236.588;
      break;
    case 'milliliters-cups':
      result = valueToConvert / 236.588;
      break;
    case 'fahrenheit-celsius':
      result = ((valueToConvert - 32) * 5) / 9;
      break;
    case 'celsius-fahrenheit':
      result = (valueToConvert * 9) / 5 + 32;
      break;
    case 'pounds-kilograms':
      result = valueToConvert * 0.453592;
      break;
    case 'kilograms-pounds':
      result = valueToConvert / 0.453592;
      break;
    case 'ounces-grams':
      result = valueToConvert * 28.3495;
      break;
    case 'grams-ounces':
      result = valueToConvert / 28.3495;
      break;
    case 'liters-quarts':
      result = valueToConvert * 1.05669;
      break;
    case 'quarts-liters':
      result = valueToConvert / 1.05669;
      break;
    case 'gallons-liters':
      result = valueToConvert * 3.78541;
      break;
    case 'liters-gallons':
      result = valueToConvert / 3.78541;
      break;
    case 'tablespoons-milliliters':
      result = valueToConvert * 14.7868;
      break;
    case 'milliliters-tablespoons':
      result = valueToConvert / 14.7868;
      break;
  }
  document.getElementById('conversion-result').textContent = `Result: ${result.toFixed(2)}`;
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

// function updateSeasonalIngredients() {
//     const season = getSeason();
//     const ingredients = {
//         spring: ['asparagus', 'peas', 'mint', 'strawberries', 'rhubarb'],
//         summer: ['tomatoes', 'bell peppers', 'cucumbers', 'peaches', 'watermelon'],
//         autumn: ['pumpkins', 'apples', 'sweet potatoes', 'brussels sprouts', 'cranberries'],
//         winter: ['kale', 'citrus fruits', 'pomegranates', 'squash', 'beets']
//     };
//     const seasonalIngredientsElement = document.getElementById('seasonal-ingredients');
//     seasonalIngredientsElement.textContent = ingredients[season].join(', ');
// }
//
// updateSeasonalIngredients();

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
