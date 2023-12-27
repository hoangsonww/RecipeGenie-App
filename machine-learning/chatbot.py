import nltk
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import random
import string

# Sample data - replace with your actual data
training_data = [
    "Hello! How can I assist you with recipes?",
    "You can search for recipes based on ingredients.",
    "Try different cuisines like Italian, Mexican, or Indian.",
    "Looking for vegan or gluten-free recipes? I can help.",
    "You can also search for recipes based on calories.",
    "I can help you find recipes based on your dietary needs.",
    "You can also search for recipes based on calories.",
    "How can I help you find recipes?",
    "You can search for recipes based on ingredients.",
    "Try different cuisines like Italian, Mexican, or Indian.",
    "Looking for vegan or gluten-free recipes? I can help.",
    "You can also search for recipes based on calories.",
    "I can help you find recipes based on your dietary needs.",
    "You can also search for recipes based on calories.",
    "How can I help you find recipes?",
    "You can search for recipes based on ingredients.",
    "Try different cuisines like Italian, Mexican, or Indian.",
    "Looking for vegan or gluten-free recipes? I can help.",
    "You can also search for recipes based on calories.",
    "I can help you find recipes based on your dietary needs.",
    "You can also search for recipes based on calories.",
    "How can I help you find recipes?",
    "You can search for recipes based on ingredients.",
    "Butter chicken is a popular Indian dish.",
    "How about some tacos?",
]

# Tokenization
nltk.download('punkt')
nltk.download('wordnet')
lemmer = nltk.stem.WordNetLemmatizer()

# Lemmatization
def LemTokens(tokens):
    return [lemmer.lemmatize(token) for token in tokens]

remove_punct_dict = dict((ord(punct), None) for punct in string.punctuation)

# Normalize text
def LemNormalize(text):
    return LemTokens(nltk.word_tokenize(text.lower().translate(remove_punct_dict)))

# Keyword matching
GREETING_INPUTS = ("hello", "hi", "greetings", "sup", "what's up", "hey")
GREETING_RESPONSES = ["hi", "hey", "hi there", "hello", "I am glad! You are talking to me"]

# Greeting
def greeting(sentence):
    for word in sentence.split():
        if word.lower() in GREETING_INPUTS:
            return random.choice(GREETING_RESPONSES)

# Generating response
def response(user_response):
    chatbot_response = ''
    TfidfVec = TfidfVectorizer(tokenizer=LemNormalize, stop_words='english')
    tfidf = TfidfVec.fit_transform(training_data + [user_response])
    vals = cosine_similarity(tfidf[-1], tfidf)
    idx = vals.argsort()[0][-2]
    flat = vals.flatten()
    flat.sort()
    req_tfidf = flat[-2]

    if(req_tfidf == 0):
        chatbot_response = chatbot_response + "I am sorry! I don't understand you"
        return chatbot_response
    else:
        chatbot_response = chatbot_response + training_data[idx]
        return chatbot_response

# Test the chatbot
user_response = "What recipes do you have?"
print("Bot:", response(user_response))
