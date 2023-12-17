import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
import pickle

class CuisinePredictor:
    def __init__(self):
        self.vectorizer = CountVectorizer()
        self.classifier = RandomForestClassifier()

    def train(self, recipes_df):
        """
        Train the model using the provided recipes DataFrame.
        :param recipes_df: A DataFrame with 'ingredients' and 'cuisine' columns.
        """
        # Prepare training data
        X = self.vectorizer.fit_transform(recipes_df['ingredients'])
        y = recipes_df['cuisine']

        # Split the data into training and testing sets
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # Train the RandomForest Classifier
        self.classifier.fit(X_train, y_train)

        # Evaluate the classifier
        y_pred = self.classifier.predict(X_test)
        print(classification_report(y_test, y_pred))

        # Train the model using the provided recipes DataFrame.
        # :param recipes_df: A DataFrame with 'ingredients' and 'cuisine' columns.
        # Prepare training data
        X = self.vectorizer.fit_transform(recipes_df['ingredients'])
        y = recipes_df['cuisine']

    def predict(self, ingredients):
        """
        Predict the cuisine of a given list of ingredients.
        :param ingredients: A string containing all ingredients separated by a space.
        :return: Predicted cuisine.
        """
        ingredients_vector = self.vectorizer.transform([ingredients])
        return self.classifier.predict(ingredients_vector)[0]

    def save_model(self, filename='cuisine_predictor.pkl'):
        """
        Save the trained model to a file.
        :param filename: Name of the file to save the model.
        """
        with open(filename, 'wb') as file:
            pickle.dump((self.vectorizer, self.classifier), file)

    def load_model(self, filename='cuisine_predictor.pkl'):
        """
        Load a trained model from a file.
        :param filename: Name of the file to load the model from.
        """
        with open(filename, 'rb') as file:
            self.vectorizer, self.classifier = pickle.load(file)

    def get_vectorizer(self):
        """
        Returns the trained CountVectorizer.
        :return: The trained CountVectorizer.
        """
        return self.vectorizer

    def get_classifier(self):
        """
        Returns the trained RandomForestClassifier.
        :return: The trained RandomForestClassifier.
        """
        return self.classifier

if __name__ == '__main__':
    # Load the recipes dataset
    recipes_df = pd.read_csv('recipes.csv')

    # Initialize the Cuisine Predictor
    cuisine_predictor = CuisinePredictor()

    # Train the model
    cuisine_predictor.train(recipes_df)

    # Save the model
    cuisine_predictor.save_model()

    # Predict the cuisine of a recipe
    print(cuisine_predictor.predict('chicken butter salt pepper'))

    # Load the model
    cuisine_predictor.load_model()

    # Predict the cuisine of a recipe
    print(cuisine_predictor.predict('chicken butter salt pepper'))

def main():
    # Load the recipes dataset
    recipes_df = pd.read_csv('recipes.csv')

    # Initialize the Cuisine Predictor
    cuisine_predictor = CuisinePredictor()

    # Train the model
    cuisine_predictor.train(recipes_df)

    # Save the model
    cuisine_predictor.save_model()

    # Predict the cuisine of a recipe
    print(cuisine_predictor.predict('chicken butter salt pepper'))

    # Load the model
    cuisine_predictor.load_model()

    # Predict the cuisine of a recipe
    print(cuisine_predictor.predict('chicken butter salt pepper'))
