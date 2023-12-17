import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

class RecipeRecommender:
    def __init__(self, recipes_df):
        """
        Initializes the Recipe Recommender.
        :param recipes_df: A DataFrame with recipes data.
        """
        self.recipes_df = recipes_df
        self.model = None
        self.fit_model()

    def fit_model(self):
        """
        Fits the TF-IDF Vectorizer model based on the recipes.
        """
        # Combine relevant features into a single text string per recipe
        self.recipes_df['combined_features'] = self.recipes_df.apply(
            lambda row: f"{row['title']} {row['ingredients']} {row['cuisine']} {row['meal_type']}", axis=1)

        # Initialize and fit the TF-IDF Vectorizer
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform(self.recipes_df['combined_features'])

        # Compute the cosine similarity matrix
        cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)

        # Store the model
        self.model = cosine_sim

    def recommend(self, recipe_title, top_n=5):
        """
        Recommends recipes similar to the given recipe title.
        :param recipe_title: The title of the recipe to find similar ones.
        :param top_n: Number of top similar recipes to return.
        :return: A list of recommended recipe titles.
        """
        if self.model is None:
            raise Exception("Model is not fitted.")

        # Find the index of the recipe that matches the title
        idx = self.recipes_df[self.recipes_df['title'] == recipe_title].index[0]

        # Get pairwise similarity scores of all recipes with that recipe
        sim_scores = list(enumerate(self.model[idx]))

        # Sort the recipes based on similarity scores
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

        # Scores of the top-n most similar recipes
        sim_scores = sim_scores[1:top_n+1]

        # Recipe indices
        recipe_indices = [i[0] for i in sim_scores]

        # Top-n most similar recipe titles
        return self.recipes_df['title'].iloc[recipe_indices].tolist()

    def get_recipes_df(self):
        """
        Returns the recipes DataFrame.
        :return: The recipes DataFrame.
        """
        return self.recipes_df

    def get_model(self):
        """
        Returns the TF-IDF Vectorizer model.
        :return: The TF-IDF Vectorizer model.
        """
        return self.model

def main():
    # Load the recipes data
    recipes_df = pd.read_csv('data/recipes.csv')

    # Initialize the recommender
    recommender = RecipeRecommender(recipes_df)

    # Get the top-5 recommended recipes
    print(recommender.recommend('Pasta Carbonara'))
