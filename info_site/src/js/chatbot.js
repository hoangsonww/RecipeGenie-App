import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

/* ----------------- LOADING ANIMATION (3-dot cycle) ----------------- */
let loadingIntervalId = null;

function showLoadingMessage() {
  if (document.getElementById('chatbot-loading')) return;

  const loadingElem = document.createElement('div');
  loadingElem.id = 'chatbot-loading';
  loadingElem.classList.add('chatbot-message', 'assistant');
  loadingElem.innerText = 'Loading';
  chatbotBody.appendChild(loadingElem);
  scrollToBottom();

  let dotCount = 0;
  loadingIntervalId = setInterval(() => {
    dotCount = (dotCount + 1) % 4;
    loadingElem.innerText = 'Loading' + '.'.repeat(dotCount);
    scrollToBottom();
  }, 500);
}

function hideLoadingMessage() {
  const loadingElem = document.getElementById('chatbot-loading');
  if (loadingElem) {
    clearInterval(loadingIntervalId);
    loadingElem.remove();
    loadingIntervalId = null;
  }
}

/* ----------------- SCROLL HELPER ----------------- */
function scrollToBottom() {
  chatbotBody.scrollTop = chatbotBody.scrollHeight;
}

/* ----------------- REMOVE MARKDOWN ----------------- */
function removeMarkdown(text) {
  return text
    .replace(/[#*_`>~-]/g, '')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1');
}

/* ----------------- DARK MODE ----------------- */
function toggleDarkMode(enable) {
  if (enable) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
  localStorage.setItem('darkMode', enable);
}

/* ----------------- RECIPE SEARCH ----------------- */
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
          <div class="chatbot-message assistant">
            No recipes found for '${searchTerm}'. Please try a different search.
          </div>
        `;
      }
      scrollToBottom();
    })
    .catch(error => {
      console.error('Error fetching meals:', error);
      chatbotBody.innerHTML += `
        <div class="chatbot-message assistant">
          An error occurred while searching for recipes. Please try again later.
        </div>
      `;
      scrollToBottom();
    });
}

/* ----------------- GEMINI REQUEST ----------------- */
async function getGeminiResponse(userMessage) {
  let responseText = "I'm having trouble, please try again later.";
  try {
    const genAI = new GoogleGenerativeAI(getAIResponse());
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: "You are RecipeGenie, a helpful cooking and recipe chatbot. You can answer cooking-related questions, offer recipes, and provide tips."
    });
    const chatSession = model.startChat({
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 1024,
        responseMimeType: "text/plain"
      },
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE }
      ],
      history: conversationHistory
    });
    const result = await chatSession.sendMessage(userMessage);
    responseText = await result.response.text();
  } catch (error) {
    console.error('Error fetching Gemini response:', error.message);
    responseText = "An error occurred. Please try again or rephrase your question.";
  }
  return removeMarkdown(responseText);
}

/* ----------------- LOCAL IF-ELSE LOGIC ----------------- */
function elizaResponse(message) {
  const lowerMessage = message.toLowerCase();
  if (lowerMessage.startsWith('recipe for ')) {
    const term = lowerMessage.replace('recipe for ', '');
    searchAndDisplayMeals(term);
    return `Searching for recipes for ${term}...`;
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
  }
  return null;
}

/* ----------------- CHAT MESSAGE DISPATCH ----------------- */
async function handleUserMessage(message) {
  const localReply = elizaResponse(message);
  if (localReply !== null) {
    return localReply;
  }
  showLoadingMessage();
  const geminiReply = await getGeminiResponse(message);
  conversationHistory.push({ role: "model", parts: [{ text: geminiReply }] });
  hideLoadingMessage();
  return geminiReply;
}

function removeMarkdownAndDisplay(botReply) {
  const assistantMsg = document.createElement('div');
  assistantMsg.classList.add('chatbot-message', 'assistant');
  assistantMsg.innerHTML = botReply;
  chatbotBody.appendChild(assistantMsg);
  scrollToBottom();
}

function getAIResponse() {
  let str =
    "QUl6" +
    "YVN5RE" +
    "w3OUR" +
    "IdkJxQ" +
    "TFJQ3d" +
    "haGVVW" +
    "WlSektx" +
    "M091OS" +
    "1RUmY0";
  return atob(str);
}

/* ----------------- SENDING MESSAGES ----------------- */
function sendMessage(message) {
  const userMsgElem = document.createElement('div');
  userMsgElem.classList.add('chatbot-message', 'user');
  userMsgElem.innerText = message;
  chatbotBody.appendChild(userMsgElem);
  scrollToBottom();

  conversationHistory.push({ role: "user", parts: [{ text: message }] });

  setTimeout(async () => {
    const response = await handleUserMessage(message);
    removeMarkdownAndDisplay(response);
  }, 300);
}

/* ----------------- WELCOME ----------------- */
function sendWelcomeMessage() {
  const welcomeMessage =
    "Welcome to RecipeGenie! 🌟 Here's how to get started:<br><br>" +
    "- To search for a recipe, type 'recipe for [your ingredient or dish]' and hit Enter.<br>" +
    "- Say 'enable dark mode' or 'disable dark mode' to toggle the dark mode.<br>" +
    "- Looking for something specific? Just type your query and I'll help you find it.<br>" +
    "- You can also ask for cooking tips, nutritional advice, and more.<br><br>" +
    "If you need help at any point, just ask! Let's make cooking fun and easy. 🍳🥗";

  const welcomeElem = document.createElement('div');
  welcomeElem.classList.add('chatbot-message', 'assistant');
  welcomeElem.innerHTML = welcomeMessage;
  chatbotBody.appendChild(welcomeElem);
  scrollToBottom();
}

/* ----------------- GLOBALS ----------------- */
let conversationHistory = [];
const chatbotBody = document.getElementById('chatbotBody');
const chatbotInput = document.getElementById('chatbotInput');

/* ----------------- ON LOAD ----------------- */
document.addEventListener('DOMContentLoaded', function () {
  sendWelcomeMessage();
});

/* ----------------- USER INPUT ----------------- */
chatbotInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter' && event.target.value.trim()) {
    const userMessage = event.target.value.trim();
    event.target.value = '';
    sendMessage(userMessage);
  }
});

const mealsEl = document.getElementById('meals');
const favoriteContainer = document.getElementById('fav-meals');
const mealPopup = document.getElementById('meal-popup');
const mealInfoEl = document.getElementById('meal-info');
const popupCloseBtn = document.getElementById('close-popup');
const searchTerm = document.getElementById('search-term');
const searchBtn = document.getElementById('search');
let randomMealsFetched = 0;
const totalRandomMeals = 10;

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
    <ul id="ingredients" style="text-align: left;">
      ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
    </ul>
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

function toggleSideElements(show) {
  if (!mealPopup.classList.contains('hidden')) return;
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

document.getElementById('dark-mode-toggle').addEventListener('click', function () {
  const isDarkModeEnabled = document.body.classList.contains('dark-mode');
  toggleDarkMode(!isDarkModeEnabled);
});

document.addEventListener('DOMContentLoaded', async function () {
  randomMealsFetched = 0;
  showLoadingIndicator();
  for (let i = 0; i < totalRandomMeals; i++) {
    await getRandomMeal();
  }
});

document.getElementById('scroll-top-btn').addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
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

document.addEventListener('DOMContentLoaded', function () {
  const darkModePreference = localStorage.getItem('darkMode');

  if (darkModePreference !== null) {
    toggleDarkMode(darkModePreference === 'true');
  }
});

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
