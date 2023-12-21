package app;

import android.os.Bundle;
import android.os.AsyncTask;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import org.json.JSONArray;
import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;

public class MainActivity extends AppCompatActivity {

    private ListView listView;
    private ArrayList<String> recipeNames;
    private ArrayList<Recipe> recipeList;
    private ArrayList<String> ingredientNames;
    private ArrayList<Ingredient> ingredientList;
    private ArrayList<String> recipeIngredientNames;
    private ArrayList<RecipeIngredient> recipeIngredientList;
    private ArrayList<String> recipeStepDescriptions;
    private ArrayList<RecipeStep> recipeStepList;
    private ArrayList<String> recipeTagNames;
    private ArrayList<RecipeTag> recipeTagList;
    private ArrayList<String> tagNames;
    private ArrayList<Tag> tagList;
    private ArrayList<String> unitNames;
    private ArrayList<Unit> unitList;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        listView = findViewById(R.id.listView);
        recipeNames = new ArrayList<>();
        recipeList = new ArrayList<>();
        ingredientNames = new ArrayList<>();
        ingredientList = new ArrayList<>();
        recipeIngredientNames = new ArrayList<>();
        recipeIngredientList = new ArrayList<>();
        recipeStepDescriptions = new ArrayList<>();
        recipeStepList = new ArrayList<>();
        recipeTagNames = new ArrayList<>();
        recipeTagList = new ArrayList<>();
        tagNames = new ArrayList<>();
        tagList = new ArrayList<>();
        unitNames = new ArrayList<>();
        unitList = new ArrayList<>();

        new FetchRecipesTask().execute("https://api.yourrecipesource.com/recipes");

        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                Recipe selectedRecipe = recipeList.get(position);
                Toast.makeText(MainActivity.this, "Selected: " + selectedRecipe.getName(), Toast.LENGTH_SHORT).show();
                Toast.makeText(MainActivity.this, "Description: " + selectedRecipe.getDescription(), Toast.LENGTH_LONG).show();
                Toast.makeText(MainActivity.this, "ID: " + selectedRecipe.getId(), Toast.LENGTH_SHORT).show();
                Toast.makeText(MainActivity.this, "Position: " + position, Toast.LENGTH_SHORT).show();
                Toast.makeText(MainActivity.this, "ID: " + id, Toast.LENGTH_SHORT).show();
                new FetchIngredientsTask().execute("https://api.themealsdb.com/ingredients");
                new FetchRecipeIngredientsTask().execute("https://api.themealsdb.com/recipeingredients");
                new FetchRecipeStepsTask().execute("https://api.themealsdb.com/recipesteps");
                new FetchRecipeTagsTask().execute("https://api.themealsdb.com/recipetags");
                new FetchTagsTask().execute("https://api.themealsdb.com/tags");
                new FetchUnitsTask().execute("https://api.themealsdb.com/units");
            }
        });
    }

    @Override
    protected void onStart() {
        super.onStart();
        Toast.makeText(MainActivity.this, "Started", Toast.LENGTH_SHORT).show();
    }

    @Override
    protected void onResume() {
        super.onResume();
        Toast.makeText(MainActivity.this, "Resumed", Toast.LENGTH_SHORT).show();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        Toast.makeText(MainActivity.this, "Destroyed", Toast.LENGTH_SHORT).show();
        Toast.makeText(MainActivity.this, "Recipe Names: " + recipeNames, Toast.LENGTH_SHORT).show();
        Toast.makeText(MainActivity.this, "Recipe List: " + recipeList, Toast.LENGTH_SHORT).show();
    }

    private class FetchRecipesTask extends AsyncTask<String, Void, String> {
        @Override
        protected String doInBackground(String... urls) {
            try {
                URL url = new URL(urls[0]);
                HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                connection.setRequestMethod("GET");
                BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                StringBuilder result = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    result.append(line);
                }
                reader.close();
                return result.toString();
            }
            catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        }

        @Override
        protected void onPostExecute(String result) {
            super.onPostExecute(result);
            try {
                JSONArray recipesJsonArray = new JSONArray(result);
                for (int i = 0; i < recipesJsonArray.length(); i++) {
                    JSONObject recipeJson = recipesJsonArray.getJSONObject(i);
                    Recipe recipe = new Recipe(
                        recipeJson.getInt("id"),
                        recipeJson.getString("name"),
                        recipeJson.getString("description")
                    );
                    recipeList.add(recipe);
                    recipeNames.add(recipe.getName());
                }
                ArrayAdapter<String> arrayAdapter = new ArrayAdapter<>(MainActivity.this, android.R.layout.simple_list_item_1, recipeNames);
                listView.setAdapter(arrayAdapter);
            }
            catch (Exception e) {
                e.printStackTrace();
            }
        }

        @Override
        protected void onCancelled() {
            super.onCancelled();
            Toast.makeText(MainActivity.this, "Cancelled", Toast.LENGTH_SHORT).show();
        }

        @Override
        protected void onPreExecute() {
            super.onPreExecute();
            Toast.makeText(MainActivity.this, "Fetching recipes...", Toast.LENGTH_SHORT).show();
        }

        @Override
        protected void onProgressUpdate(Void... values) {
            super.onProgressUpdate(values);
            Toast.makeText(MainActivity.this, "Progressing...", Toast.LENGTH_SHORT).show();
        }

        @Override
        protected void onCancelled(String s) {
            super.onCancelled(s);
            Toast.makeText(MainActivity.this, "Cancelled: " + s, Toast.LENGTH_SHORT).show();
        }
    }

    private class FetchIngredientsTask extends AsyncTask<String, Void, String> {
        @Override
        protected String doInBackground(String... urls) {
            try {
                URL url = new URL(urls[0]);
                HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                connection.setRequestMethod("GET");
                BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                StringBuilder result = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    result.append(line);
                }
                reader.close();
                return result.toString();
            }
            catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        }

        @Override
        protected void onPostExecute(String result) {
            super.onPostExecute(result);
            try {
                JSONArray ingredientsJsonArray = new JSONArray(result);
                for (int i = 0; i < ingredientsJsonArray.length(); i++) {
                    JSONObject ingredientJson = ingredientsJsonArray.getJSONObject(i);
                    Ingredient ingredient = new Ingredient(
                        ingredientJson.getInt("id"),
                        ingredientJson.getString("name"),
                        ingredientJson.getString("description")
                    );
                    ingredientList.add(ingredient);
                    ingredientNames.add(ingredient.getName());
                }
                ArrayAdapter<String> arrayAdapter = new ArrayAdapter<>(MainActivity.this, android.R.layout.simple_list_item_1, ingredientNames);
                listView.setAdapter(arrayAdapter);
            }
            catch (Exception e) {
                e.printStackTrace();
            }
        }

        @Override
        protected void onCancelled() {
            super.onCancelled();
            Toast.makeText(MainActivity.this, "Cancelled", Toast.LENGTH_SHORT).show();
        }

        @Override
        protected void onPreExecute() {
            super.onPreExecute();
            Toast.makeText(MainActivity.this, "Fetching ingredients...", Toast.LENGTH_SHORT).show();
        }

        @Override
        protected void onProgressUpdate(Void... values) {
            super.onProgressUpdate(values);
            Toast.makeText(MainActivity.this, "Progressing...", Toast.LENGTH_SHORT).show();
        }

        @Override
        protected void onCancelled(String s) {
            super.onCancelled(s);
            Toast.makeText(MainActivity.this, "Cancelled: " + s, Toast.LENGTH_SHORT).show();
        }
    }

    private class FetchRecipeIngredientsTask extends AsyncTask<String, Void, String> {
        @Override
        protected String doInBackground(String... urls) {
            try {
                URL url = new URL(urls[0]);
                HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                connection.setRequestMethod("GET");
                BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                StringBuilder result = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    result.append(line);
                }
                reader.close();
                return result.toString();
            }
            catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        }

        @Override
        protected void onPostExecute(String result) {
            super.onPostExecute(result);
            try {
                JSONArray recipeIngredientsJsonArray = new JSONArray(result);
                for (int i = 0; i < recipeIngredientsJsonArray.length(); i++) {
                    JSONObject recipeIngredientJson = recipeIngredientsJsonArray.getJSONObject(i);
                    RecipeIngredient recipeIngredient = new RecipeIngredient(
                        recipeIngredientJson.getInt("id"),
                        recipeIngredientJson.getInt("recipeId"),
                        recipeIngredientJson.getInt("ingredientId"),
                        recipeIngredientJson.getString("ingredientName"),
                        recipeIngredientJson.getString("ingredientDescription"),
                        recipeIngredientJson.getString("quantity"),
                        recipeIngredientJson.getString("unit")
                    );
                    recipeIngredientList.add(recipeIngredient);
                    recipeIngredientNames.add(recipeIngredient.getIngredientName());
                }
                ArrayAdapter<String> arrayAdapter = new ArrayAdapter<>(MainActivity.this, android.R.layout.simple_list_item_1, recipeIngredientNames);
                listView.setAdapter(arrayAdapter);
            }
            catch (Exception e) {
                e.printStackTrace();
            }
        }

        @Override
        protected void onCancelled() {
            super.onCancelled();
            Toast.makeText(MainActivity.this, "Cancelled", Toast.LENGTH_SHORT).show();
        }

        @Override
        protected void onPreExecute() {
            super.onPreExecute();
            Toast.makeText(MainActivity.this, "Fetching recipe ingredients...", Toast.LENGTH_SHORT).show();
        }

        @Override
        protected void onProgressUpdate(Void... values) {
            super.onProgressUpdate(values);
            Toast.makeText(MainActivity.this, "Progressing...", Toast.LENGTH_SHORT).show();
        }

        @Override
        protected void onCancelled(String s) {
            super.onCancelled(s);
            Toast.makeText(MainActivity.this, "Cancelled: " + s, Toast.LENGTH_SHORT).show();
        }
    }

    private class FetchRecipeTagsTask extends AsyncTask<String, Void, String> {
        @Override
        protected String doInBackground(String... urls) {
            try {
                URL url = new URL(urls[0]);
                HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                connection.setRequestMethod("GET");
                BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                StringBuilder result = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    result.append(line);
                }
                reader.close();
                return result.toString();
            }
            catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        }

        @Override
        protected void onPostExecute(String result) {
            super.onPostExecute(result);
            try {
                JSONArray recipeTagsJsonArray = new JSONArray(result);
                for (int i = 0; i < recipeTagsJsonArray.length(); i++) {
                    JSONObject recipeTagJson = recipeTagsJsonArray.getJSONObject(i);
                    RecipeTag recipeTag = new RecipeTag(
                        recipeTagJson.getInt("id"),
                        recipeTagJson.getInt("recipeId"),
                        recipeTagJson.getInt("tagId"),
                        recipeTagJson.getString("tagName"),
                        recipeTagJson.getString("tagDescription")
                    );
                    recipeTagList.add(recipeTag);
                    recipeTagNames.add(recipeTag.getTagName());
                }
                ArrayAdapter<String> arrayAdapter = new ArrayAdapter<>(MainActivity.this, android.R.layout.simple_list_item_1, recipeTagNames);
                listView.setAdapter(arrayAdapter);
            }
            catch (Exception e) {
                e.printStackTrace();
            }
        }

        @Override
        protected void onCancelled() {
            super.onCancelled();
            Toast.makeText(MainActivity.this, "Cancelled", Toast.LENGTH_SHORT).show();
        }

        @Override
        protected void onPreExecute() {
            super.onPreExecute();
            Toast.makeText(MainActivity.this, "Fetching recipe tags...", Toast.LENGTH_SHORT).show();
        }

        @Override
        protected void onProgressUpdate(Void... values) {
            super.onProgressUpdate(values);
            Toast.makeText(MainActivity.this, "Progressing...", Toast.LENGTH_SHORT).show();
        }

        @Override
        protected void onCancelled(String s) {
            super.onCancelled(s);
            Toast.makeText(MainActivity.this, "Cancelled: " + s, Toast.LENGTH_SHORT).show();
        }
    }

    private class FetchRecipeStepsTask extends AsyncTask<String, Void, String> {
        @Override
        protected String doInBackground(String... urls) {
            try {
                URL url = new URL(urls[0]);
                HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                connection.setRequestMethod("GET");
                BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                StringBuilder result = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    result.append(line);
                }
                reader.close();
                return result.toString();
            }
            catch (Exception e) {
                e.printStackTrace();
                return null;
            }
        }

        @Override
        protected void onPostExecute(String result) {
            super.onPostExecute(result);
            try {
                JSONArray recipeStepsJsonArray = new JSONArray(result);
                for (int i = 0; i < recipeStepsJsonArray.length(); i++) {
                    JSONObject recipeStepJson = recipeStepsJsonArray.getJSONObject(i);
                    RecipeStep recipeStep = new RecipeStep(
                        recipeStepJson.getInt("id"),
                        recipeStepJson.getInt("recipeId"),
                        recipeStepJson.getInt("stepNumber"),
                        recipeStepJson.getString("description")
                    );
                    recipeStepList.add(recipeStep);
                    recipeStepDescriptions.add(recipeStep.getDescription());
                }
                ArrayAdapter<String> arrayAdapter = new ArrayAdapter<>(MainActivity.this, android.R.layout.simple_list_item_1, recipeStepDescriptions);
                listView.setAdapter(arrayAdapter);
            }
            catch (Exception e) {
                e.printStackTrace();
            }
        }

        @Override
        protected void onCancelled() {
            super.onCancelled();
            Toast.makeText(MainActivity.this, "Cancelled", Toast.LENGTH_SHORT).show();
        }

        @Override
        protected void onPreExecute() {
            super.onPreExecute();
            Toast.makeText(MainActivity.this, "Fetching recipe steps...", Toast.LENGTH_SHORT).show();
        }

        @Override
        protected void onProgressUpdate(Void... values) {
            super.onProgressUpdate(values);
            Toast.makeText(MainActivity.this, "Progressing...", Toast.LENGTH_SHORT).show();
        }

        @Override
        protected void onCancelled(String s) {
            super.onCancelled(s);
            Toast.makeText(MainActivity.this, "Cancelled: " + s, Toast.LENGTH_SHORT).show();
        }
    }

    static class Recipe {
        private int id;
        private String name;
        private String description;

        public Recipe(int id, String name, String description) {
            this.id = id;
            this.name = name;
            this.description = description;
        }

        public int getId() {
            return id;
        }

        public String getName() {
            return name;
        }

        public String getDescription() {
            return description;
        }

        @Override
        public String toString() {
            return name;
        }

        @Override
        public boolean equals(Object o) {
            if (o == this) {
                return true;
            }
            if (!(o instanceof Recipe)) {
                return false;
            }
            Recipe r = (Recipe) o;
            return r.id == id && r.name.equals(name) && r.description.equals(description);
        }
    }

    static class Ingredient {
        private int id;
        private String name;
        private String description;

        public Ingredient(int id, String name, String description) {
            this.id = id;
            this.name = name;
            this.description = description;
        }

        public int getId() {
            return id;
        }

        public String getName() {
            return name;
        }

        public String getDescription() {
            return description;
        }

        @Override
        public String toString() {
            return name;
        }

        @Override
        public boolean equals(Object o) {
            if (o == this) {
                return true;
            }
            if (!(o instanceof Ingredient)) {
                return false;
            }
            Ingredient i = (Ingredient) o;
            return i.id == id && i.name.equals(name) && i.description.equals(description);
        }
    }

    static class RecipeIngredient {
        private int id;
        private int recipeId;
        private int ingredientId;
        private String ingredientName;
        private String ingredientDescription;
        private String quantity;
        private String unit;

        public RecipeIngredient(int id, int recipeId, int ingredientId, String ingredientName, String ingredientDescription, String quantity, String unit) {
            this.id = id;
            this.recipeId = recipeId;
            this.ingredientId = ingredientId;
            this.ingredientName = ingredientName;
            this.ingredientDescription = ingredientDescription;
            this.quantity = quantity;
            this.unit = unit;
        }

        public int getId() {
            return id;
        }

        public int getRecipeId() {
            return recipeId;
        }

        public int getIngredientId() {
            return ingredientId;
        }

        public String getIngredientName() {
            return ingredientName;
        }

        public String getIngredientDescription() {
            return ingredientDescription;
        }

        public String getQuantity() {
            return quantity;
        }

        public String getUnit() {
            return unit;
        }

        @Override
        public String toString() {
            return ingredientName + " " + quantity + " " + unit;
        }

        @Override
        public boolean equals(Object o) {
            if (o == this) {
                return true;
            }
            if (!(o instanceof RecipeIngredient)) {
                return false;
            }
            RecipeIngredient ri = (RecipeIngredient) o;
            return ri.id == id && ri.recipeId == recipeId && ri.ingredientId == ingredientId && ri.ingredientName.equals(ingredientName) && ri.ingredientDescription.equals(ingredientDescription) && ri.quantity.equals(quantity) && ri.unit.equals(unit);
        }
    }

    static class RecipeStep {
        private int id;
        private int recipeId;
        private int stepNumber;
        private String description;

        public RecipeStep(int id, int recipeId, int stepNumber, String description) {
            this.id = id;
            this.recipeId = recipeId;
            this.stepNumber = stepNumber;
            this.description = description;
        }

        public int getId() {
            return id;
        }

        public int getRecipeId() {
            return recipeId;
        }

        public int getStepNumber() {
            return stepNumber;
        }

        public String getDescription() {
            return description;
        }

        @Override
        public String toString() {
            return stepNumber + ". " + description;
        }

        @Override
        public boolean equals(Object o) {
            if (o == this) {
                return true;
            }
            if (!(o instanceof RecipeStep)) {
                return false;
            }
            RecipeStep rs = (RecipeStep) o;
            return rs.id == id && rs.recipeId == recipeId && rs.stepNumber == stepNumber && rs.description.equals(description);
        }
    }

    static class RecipeTag {
        private int id;
        private int recipeId;
        private int tagId;
        private String tagName;
        private String tagDescription;

        public RecipeTag(int id, int recipeId, int tagId, String tagName, String tagDescription) {
            this.id = id;
            this.recipeId = recipeId;
            this.tagId = tagId;
            this.tagName = tagName;
            this.tagDescription = tagDescription;
        }

        public int getId() {
            return id;
        }

        public int getRecipeId() {
            return recipeId;
        }

        public int getTagId() {
            return tagId;
        }

        public String getTagName() {
            return tagName;
        }

        public String getTagDescription() {
            return tagDescription;
        }

        @Override
        public String toString() {
            return tagName;
        }

        @Override
        public boolean equals(Object o) {
            if (o == this) {
                return true;
            }
            if (!(o instanceof RecipeTag)) {
                return false;
            }
            RecipeTag rt = (RecipeTag) o;
            return rt.id == id && rt.recipeId == recipeId && rt.tagId == tagId && rt.tagName.equals(tagName) && rt.tagDescription.equals(tagDescription);
        }
    }

    static class Tag {
        private int id;
        private String name;
        private String description;

        public Tag(int id, String name, String description) {
            this.id = id;
            this.name = name;
            this.description = description;
        }

        public int getId() {
            return id;
        }

        public String getName() {
            return name;
        }

        public String getDescription() {
            return description;
        }

        @Override
        public String toString() {
            return name;
        }

        @Override
        public boolean equals(Object o) {
            if (o == this) {
                return true;
            }
            if (!(o instanceof Tag)) {
                return false;
            }
            Tag t = (Tag) o;
            return t.id == id && t.name.equals(name) && t.description.equals(description);
        }
    }

    static class Unit {
        private int id;
        private String name;
        private String description;

        public Unit(int id, String name, String description) {
            this.id = id;
            this.name = name;
            this.description = description;
        }

        public int getId() {
            return id;
        }

        public String getName() {
            return name;
        }

        public String getDescription() {
            return description;
        }

        @Override
        public String toString() {
            return name;
        }

        @Override
        public boolean equals(Object o) {
            if (o == this) {
                return true;
            }
            if (!(o instanceof Unit)) {
                return false;
            }
            Unit u = (Unit) o;
            return u.id == id && u.name.equals(name) && u.description.equals(description);
        }
    }

    static class User {
        private int id;
        private String username;
        private String password;
        private String email;
        private String firstName;
        private String lastName;
        private String bio;

        public User(int id, String username, String password, String email, String firstName, String lastName, String bio) {
            this.id = id;
            this.username = username;
            this.password = password;
            this.email = email;
            this.firstName = firstName;
            this.lastName = lastName;
            this.bio = bio;
        }

        public int getId() {
            return id;
        }

        public String getUsername() {
            return username;
        }

        public String getPassword() {
            return password;
        }

        public String getEmail() {
            return email;
        }

        public String getFirstName() {
            return firstName;
        }

        public String getLastName() {
            return lastName;
        }

        public String getBio() {
            return bio;
        }

        @Override
        public String toString() {
            return username;
        }

        @Override
        public boolean equals(Object o) {
            if (o == this) {
                return true;
            }
            if (!(o instanceof User)) {
                return false;
            }
            User u = (User) o;
            return u.id == id && u.username.equals(username) && u.password.equals(password) && u.email.equals(email) && u.firstName.equals(firstName) && u.lastName.equals(lastName) && u.bio.equals(bio);
        }
    }

    static class UserRecipe {
        private int id;
        private int userId;
        private int recipeId;
        private String recipeName;
        private String recipeDescription;

        public UserRecipe(int id, int userId, int recipeId, String recipeName, String recipeDescription) {
            this.id = id;
            this.userId = userId;
            this.recipeId = recipeId;
            this.recipeName = recipeName;
            this.recipeDescription = recipeDescription;
        }

        public int getId() {
            return id;
        }

        public int getUserId() {
            return userId;
        }

        public int getRecipeId() {
            return recipeId;
        }

        public String getRecipeName() {
            return recipeName;
        }

        public String getRecipeDescription() {
            return recipeDescription;
        }

        @Override
        public String toString() {
            return recipeName;
        }

        @Override
        public boolean equals(Object o) {
            if (o == this) {
                return true;
            }
            if (!(o instanceof UserRecipe)) {
                return false;
            }
            UserRecipe ur = (UserRecipe) o;
            return ur.id == id && ur.userId == userId && ur.recipeId == recipeId && ur.recipeName.equals(recipeName) && ur.recipeDescription.equals(recipeDescription);
        }
    }

    static class UserRecipeIngredient {
        private int id;
        private int userRecipeId;
        private int recipeIngredientId;
        private String recipeIngredientName;
        private String recipeIngredientDescription;
        private String quantity;
        private String unit;

        public UserRecipeIngredient(int id, int userRecipeId, int recipeIngredientId, String recipeIngredientName, String recipeIngredientDescription, String quantity, String unit) {
            this.id = id;
            this.userRecipeId = userRecipeId;
            this.recipeIngredientId = recipeIngredientId;
            this.recipeIngredientName = recipeIngredientName;
            this.recipeIngredientDescription = recipeIngredientDescription;
            this.quantity = quantity;
            this.unit = unit;
        }

        public int getId() {
            return id;
        }

        public int getUserRecipeId() {
            return userRecipeId;
        }

        public int getRecipeIngredientId() {
            return recipeIngredientId;
        }

        public String getRecipeIngredientName() {
            return recipeIngredientName;
        }

        public String getRecipeIngredientDescription() {
            return recipeIngredientDescription;
        }

        public String getQuantity() {
            return quantity;
        }

        public String getUnit() {
            return unit;
        }

        @Override
        public String toString() {
            return recipeIngredientName + " " + quantity + " " + unit;
        }

        @Override
        public boolean equals(Object o) {
            if (o == this) {
                return true;
            }
            if (!(o instanceof UserRecipeIngredient)) {
                return false;
            }
            UserRecipeIngredient uri = (UserRecipeIngredient) o;
            return uri.id == id && uri.userRecipeId == userRecipeId && uri.recipeIngredientId == recipeIngredientId && uri.recipeIngredientName.equals(recipeIngredientName) && uri.recipeIngredientDescription.equals(recipeIngredientDescription) && uri.quantity.equals(quantity) && uri.unit.equals(unit);
        }
    }

    static class UserRecipeStep {
        private int id;
        private int userRecipeId;
        private int recipeStepId;
        private int stepNumber;
        private String description;

        public UserRecipeStep(int id, int userRecipeId, int recipeStepId, int stepNumber, String description) {
            this.id = id;
            this.userRecipeId = userRecipeId;
            this.recipeStepId = recipeStepId;
            this.stepNumber = stepNumber;
            this.description = description;
        }

        public int getId() {
            return id;
        }

        public int getUserRecipeId() {
            return userRecipeId;
        }

        public int getRecipeStepId() {
            return recipeStepId;
        }

        public int getStepNumber() {
            return stepNumber;
        }

        public String getDescription() {
            return description;
        }

        @Override
        public String toString() {
            return stepNumber + ". " + description;
        }

        @Override
        public boolean equals(Object o) {
            if (o == this) {
                return true;
            }
            if (!(o instanceof UserRecipeStep)) {
                return false;
            }
            UserRecipeStep urs = (UserRecipeStep) o;
            return urs.id == id && urs.userRecipeId == userRecipeId && urs.recipeStepId == recipeStepId && urs.stepNumber == stepNumber && urs.description.equals(description);
        }
    }

    static class UserRecipeTag {
        private int id;
        private int userRecipeId;
        private int recipeTagId;
        private String recipeTagName;
        private String recipeTagDescription;

        public UserRecipeTag(int id, int userRecipeId, int recipeTagId, String recipeTagName, String recipeTagDescription) {
            this.id = id;
            this.userRecipeId = userRecipeId;
            this.recipeTagId = recipeTagId;
            this.recipeTagName = recipeTagName;
            this.recipeTagDescription = recipeTagDescription;
        }

        public int getId() {
            return id;
        }

        public int getUserRecipeId() {
            return userRecipeId;
        }

        public int getRecipeTagId() {
            return recipeTagId;
        }

        public String getRecipeTagName() {
            return recipeTagName;
        }

        public String getRecipeTagDescription() {
            return recipeTagDescription;
        }

        @Override
        public String toString() {
            return recipeTagName;
        }

        @Override
        public boolean equals(Object o) {
            if (o == this) {
                return true;
            }
            if (!(o instanceof UserRecipeTag)) {
                return false;
            }
            UserRecipeTag urt = (UserRecipeTag) o;
            return urt.id == id && urt.userRecipeId == userRecipeId && urt.recipeTagId == recipeTagId && urt.recipeTagName.equals(recipeTagName) && urt.recipeTagDescription.equals(recipeTagDescription);
        }
    }

    static class UserTag {
        private int id;
        private int userId;
        private int tagId;
        private String tagName;
        private String tagDescription;

        public UserTag(int id, int userId, int tagId, String tagName, String tagDescription) {
            this.id = id;
            this.userId = userId;
            this.tagId = tagId;
            this.tagName = tagName;
            this.tagDescription = tagDescription;
        }

        public int getId() {
            return id;
        }

        public int getUserId() {
            return userId;
        }

        public int getTagId() {
            return tagId;
        }

        public String getTagName() {
            return tagName;
        }

        public String getTagDescription() {
            return tagDescription;
        }

        @Override
        public String toString() {
            return tagName;
        }

        @Override
        public boolean equals(Object o) {
            if (o == this) {
                return true;
            }
            if (!(o instanceof UserTag)) {
                return false;
            }
            UserTag ut = (UserTag) o;
            return ut.id == id && ut.userId == userId && ut.tagId == tagId && ut.tagName.equals(tagName) && ut.tagDescription.equals(tagDescription);
        }
    }

    static class UserUnit {
        private int id;
        private int userId;
        private int unitId;
        private String unitName;
        private String unitDescription;

        public UserUnit(int id, int userId, int unitId, String unitName, String unitDescription) {
            this.id = id;
            this.userId = userId;
            this.unitId = unitId;
            this.unitName = unitName;
            this.unitDescription = unitDescription;
        }

        public int getId() {
            return id;
        }

        public int getUserId() {
            return userId;
        }

        public int getUnitId() {
            return unitId;
        }

        public String getUnitName() {
            return unitName;
        }

        public String getUnitDescription() {
            return unitDescription;
        }

        @Override
        public String toString() {
            return unitName;
        }

        @Override
        public boolean equals(Object o) {
            if (o == this) {
                return true;
            }
            if (!(o instanceof UserUnit)) {
                return false;
            }
            UserUnit uu = (UserUnit) o;
            return uu.id == id && uu.userId == userId && uu.unitId == unitId && uu.unitName.equals(unitName) && uu.unitDescription.equals(unitDescription);
        }
    }

    static class UserUser {
        private int id;
        private int userId;
        private int friendId;
        private String friendUsername;
        private String friendPassword;
        private String friendEmail;
        private String friendFirstName;
        private String friendLastName;
        private String friendBio;

        public UserUser(int id, int userId, int friendId, String friendUsername, String friendPassword, String friendEmail, String friendFirstName, String friendLastName, String friendBio) {
            this.id = id;
            this.userId = userId;
            this.friendId = friendId;
            this.friendUsername = friendUsername;
            this.friendPassword = friendPassword;
            this.friendEmail = friendEmail;
            this.friendFirstName = friendFirstName;
            this.friendLastName = friendLastName;
            this.friendBio = friendBio;
        }

        public int getId() {
            return id;
        }

        public int getUserId() {
            return userId;
        }

        public int getFriendId() {
            return friendId;
        }

        public String getFriendUsername() {
            return friendUsername;
        }

        public String getFriendPassword() {
            return friendPassword;
        }

        public String getFriendEmail() {
            return friendEmail;
        }

        public String getFriendFirstName() {
            return friendFirstName;
        }

        public String getFriendLastName() {
            return friendLastName;
        }

        public String getFriendBio() {
            return friendBio;
        }

        @Override
        public String toString() {
            return friendUsername;
        }

        @Override
        public boolean equals(Object o) {
            if (o == this) {
                return true;
            }
            if (!(o instanceof UserUser)) {
                return false;
            }
            UserUser uu = (UserUser) o;
            return uu.id == id && uu.userId == userId && uu.friendId == friendId && uu.friendUsername.equals(friendUsername) && uu.friendPassword.equals(friendPassword) && uu.friendEmail.equals(friendEmail) && uu.friendFirstName.equals(friendFirstName) && uu.friendLastName.equals(friendLastName) && uu.friendBio.equals(friendBio);
        }
    }
}
