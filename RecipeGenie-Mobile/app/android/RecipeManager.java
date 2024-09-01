package app;

import android.content.Context;
import java.util.ArrayList;
import java.util.List;
import java.util.Iterator;

public class RecipeManager {
    private List<Recipe> recipes;
    private static RecipeManager instance;
    private Context context;

    private RecipeManager(Context context) {
        this.context = context;
        this.recipes = new ArrayList<>();
        this.instance = this;
        loadRecipes();
    }

    public static synchronized RecipeManager getInstance(Context context) {
        if (instance == null) {
            instance = new RecipeManager(context.getApplicationContext());
        }
        return instance;
    }

    public static synchronized RecipeManager getInstance() {
        if (instance == null) {
            throw new IllegalStateException(RecipeManager.class.getSimpleName() +
                    " is not initialized, call getInstance(...) first");
        }
        return instance;
    }

    private void loadRecipes() {
        recipes.add(new Recipe(1, "Pasta Carbonara", "A classic Italian pasta dish with a creamy egg sauce."));
        recipes.add(new Recipe(2, "Chicken Curry", "A flavorful Indian dish with a rich, spicy sauce."));
        recipes.add(new Recipe(3, "Chicken Noodle Soup", "A hearty soup with chicken, noodles, and vegetables."));
        recipes.add(new Recipe(4, "Chicken Parmesan", "A classic Italian dish with breaded chicken and tomato sauce."));
        recipes.add(new Recipe(5, "Chicken Salad", "A light salad with chicken, lettuce, and vegetables."));
        recipes.add(new Recipe(6, "Chicken Tacos", "A Mexican dish with chicken, salsa, and cheese."));
        recipes.add(new Recipe(7, "Chicken Stir Fry", "A Chinese dish with chicken and vegetables."));
        recipes.add(new Recipe(8, "Chicken Pot Pie", "A hearty pie with chicken, vegetables, and gravy."));
        recipes.add(new Recipe(9, "Chicken Cordon Bleu", "A classic French dish with chicken, ham, and cheese."));
        recipes.add(new Recipe(10, "Chicken Marsala", "A classic Italian dish with chicken and a Marsala wine sauce."));
        recipes.add(new Recipe(11, "Chicken Enchiladas", "A Mexican dish with chicken, cheese, and a spicy sauce."));
        recipes.add(new Recipe(12, "Chicken Fajitas", "A Mexican dish with chicken, peppers, and onions."));
        recipes.add(new Recipe(13, "Chicken Alfredo", "A classic Italian dish with chicken and a creamy sauce."));
        recipes.add(new Recipe(14, "Chicken Wings", "A classic American dish with chicken and a spicy sauce."));
        recipes.add(new Recipe(15, "Chicken Fried Rice", "A Chinese dish with chicken, rice, and vegetables."));
        recipes.add(new Recipe(16, "Chicken Piccata", "A classic Italian dish with chicken and a lemon sauce."));
        recipes.add(new Recipe(17, "Chicken Tortilla Soup", "A Mexican soup with chicken, vegetables, and tortillas."));
        recipes.add(new Recipe(18, "Chicken Noodle Casserole", "A hearty casserole with chicken, noodles, and vegetables."));
        recipes.add(new Recipe(19, "Chicken and Dumplings", "A hearty soup with chicken, vegetables, and dumplings."));
        recipes.add(new Recipe(20, "Chicken Lo Mein", "A Chinese dish with chicken, noodles, and vegetables."));
        recipes.add(new Recipe(21, "Chicken Cacciatore", "A classic Italian dish with chicken, tomatoes, and peppers."));
        recipes.add(new Recipe(22, "Chicken Quesadillas", "A Mexican dish with chicken, cheese, and peppers."));
        recipes.add(new Recipe(23, "Chicken Tikka Masala", "A flavorful Indian dish with chicken and a creamy sauce."));
        recipes.add(new Recipe(24, "Chicken and Rice", "A hearty dish with chicken, rice, and vegetables."));
        recipes.add(new Recipe(25, "Chicken and Dumplings", "A hearty soup with chicken, vegetables, and dumplings."));
        recipes.add(new Recipe(26, "Chicken and Waffles", "A classic American dish with chicken and waffles."));
        recipes.add(new Recipe(27, "Chicken and Rice Casserole", "A hearty casserole with chicken, rice, and vegetables."));
        recipes.add(new Recipe(28, "Chicken and Broccoli", "A Chinese dish with chicken and broccoli."));
        recipes.add(new Recipe(29, "Chicken and Rice Soup", "A hearty soup with chicken, rice, and vegetables."));
    }

    public List<Recipe> getRecipes() {
        return new ArrayList<>(recipes);
    }

    public Recipe getRecipeById(int id) {
        for (Recipe recipe : recipes) {
            if (recipe.getId() == id) {
                return recipe;
            }
        }
        return null;
    }

    public void addRecipe(Recipe recipe) {
        recipes.add(recipe);
        saveRecipes();
    }

    public void updateRecipe(Recipe recipe) {
        for (Iterator<Recipe> iterator = recipes.iterator(); iterator.hasNext();) {
            Recipe r = iterator.next();
            if (r.getId() == recipe.getId()) {
                iterator.remove();
                break;
            }
        }
        recipes.add(recipe);
        saveRecipes();
    }

    public void deleteRecipe(int id) {
        for (Iterator<Recipe> iterator = recipes.iterator(); iterator.hasNext();) {
            Recipe r = iterator.next();
            if (r.getId() == id) {
                iterator.remove();
                break;
            }
        }
        saveRecipes();
    }

    public void deleteAllRecipes() {
        recipes.clear();
        saveRecipes();
    }

    public void saveRecipes() {
        for (Recipe recipe : recipes) {
            RecipeDbHelper.getInstance(context).saveRecipe(recipe);
        }
    }

    public void loadRecipes() {
        recipes = RecipeDbHelper.getInstance(context).getRecipes();
    }

    public String getRecipeDescription(int id) {
        for (Recipe recipe : recipes) {
            if (recipe.getId() == id) {
                return recipe.getDescription();
            }
        }
        return null;
    }

    public String getRecipeName(int id) {
        for (Recipe recipe : recipes) {
            if (recipe.getId() == id) {
                return recipe.getName();
            }
        }
        return null;
    }

    public int getRecipeId(String name) {
        for (Recipe recipe : recipes) {
            if (recipe.getName() == name) {
                return recipe.getId();
            }
        }
        return null;
    }

    public Image getRecipeImage(int id) {
        for (Recipe recipe : recipes) {
            if (recipe.getId() == id) {
                return recipe.getImage();
            }
        }
        return null;
    }

    public static class Recipe {
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
    }

    private class RecipeDbHelper {
        private static RecipeDbHelper instance;
        private Context context;

        private RecipeDbHelper(Context context) {
            this.context = context;
        }

        public static synchronized RecipeDbHelper getInstance(Context context) {
            if (instance == null) {
                instance = new RecipeDbHelper(context.getApplicationContext());
            }
            return instance;
        }

        public void saveRecipe(Recipe recipe) {
    }
}
