package app;

import android.os.AsyncTask;
import android.os.Bundle;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;
import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class RecipeDetailActivity extends AppCompatActivity {

    private TextView recipeNameTextView;
    private TextView recipeDescriptionTextView;
    private ImageView recipeImageView;
    private int recipeId;

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        outState.putInt("RECIPE_ID", recipeId);
    }

    @Override
    protected void onRestoreInstanceState(Bundle savedInstanceState) {
        super.onRestoreInstanceState(savedInstanceState);
        recipeId = savedInstanceState.getInt("RECIPE_ID");
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_recipe_detail);

        recipeNameTextView = findViewById(R.id.recipeNameTextView);
        recipeDescriptionTextView = findViewById(R.id.recipeDescriptionTextView);
        recipeImageView = findViewById(R.id.recipeImageView);

        recipeId = getIntent().getIntExtra("RECIPE_ID", 0);
        new FetchRecipeDetailTask().execute("https://api.themealsdb.com/recipes/" + recipeId);
    }

    @Override
    protected void onResume() {
        super.onResume();
        new fetchImageTask(recipeImageView).execute("https://api.themealsdb.com/recipes/" + recipeId);
        new downloadRecipeDetailsTask().execute("https://api.themealsdb.com/recipes/" + recipeId);
    }

    @Override
    protected void onPause() {
        super.onPause();
    }

    @Override
    protected void onStop() {
        super.onStop();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
    }

    @Override
    protected void onRestart() {
        super.onRestart();
    }

    @Override
    protected void onStart() {
        super.onStart();
    }

    private class FetchRecipeDetailTask extends AsyncTask<String, Void, String> {
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
        protected void onPreExecute() {
            super.onPreExecute();
        }

        @Override
        protected void onPostExecute(String result) {
            super.onPostExecute(result);
            try {
                JSONObject recipeJson = new JSONObject(result);
                String name = recipeJson.getString("name");
                String description = recipeJson.getString("description");
                String imageUrl = recipeJson.getString("image_url");

                recipeNameTextView.setText(name);
                recipeDescriptionTextView.setText(description);
                new DownloadImageTask(recipeImageView).execute(imageUrl);
                Picasso.get().load(imageUrl).into(recipeImageView);
            }
            catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    private class DownloadImageTask extends AsyncTask<String, Void, Bitmap> {
        ImageView imageView;

        public DownloadImageTask(ImageView imageView) {
            this.imageView = imageView;
        }

        @Override
        protected Bitmap doInBackground(String... urls) {
            String imageUrl = urls[0];
            Bitmap bitmap = null;
            try {
                InputStream inputStream = new URL(imageUrl).openStream();
                bitmap = BitmapFactory.decodeStream(inputStream);
            }
            catch (Exception e) {
                e.printStackTrace();
            }
            return bitmap;
        }

        @Override
        protected void onPostExecute(Bitmap bitmap) {
            super.onPostExecute(bitmap);
            imageView.setImageBitmap(bitmap);
        }
    }

    private class fetchImageTask extends AsyncTask<String, Void, Bitmap> {
        ImageView imageView;

        public fetchImageTask(ImageView imageView) {
            this.imageView = imageView;
        }

        @Override
        protected Bitmap doInBackground(String... urls) {
            String imageUrl = urls[0];
            Bitmap bitmap = null;
            try {
                InputStream inputStream = new URL(imageUrl).openStream();
                bitmap = BitmapFactory.decodeStream(inputStream);
            }
            catch (Exception e) {
                e.printStackTrace();
            }
            return bitmap;
        }

        @Override
        protected void onPostExecute(Bitmap bitmap) {
            super.onPostExecute(bitmap);
            imageView.setImageBitmap(bitmap);
        }
    }

    private class downloadRecipeDetailsTask extends AsyncTask<String, Void, String> {
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
        protected void onPreExecute() {
            super.onPreExecute();
        }

        @Override
        protected void onPostExecute(String result) {
            super.onPostExecute(result);
            try {
                JSONObject recipeJson = new JSONObject(result);
                String name = recipeJson.getString("name");
                String description = recipeJson.getString("description");
                String imageUrl = recipeJson.getString("image_url");

                recipeNameTextView.setText(name);
                recipeDescriptionTextView.setText(description);
                new DownloadImageTask(recipeImageView).execute(imageUrl);
                Picasso.get().load(imageUrl).into(recipeImageView);
            }
            catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    private class fetchFavoritesTask extends AsyncTask<String, Void, String> {
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
        protected void onPreExecute() {
            super.onPreExecute();
        }

        @Override
        protected void onPostExecute(String result) {
            super.onPostExecute(result);
            try {
                JSONObject recipeJson = new JSONObject(result);
                String name = recipeJson.getString("name");
                String description = recipeJson.getString("description");
                String imageUrl = recipeJson.getString("image_url");

                recipeNameTextView.setText(name);
                recipeDescriptionTextView.setText(description);
                new DownloadImageTask(recipeImageView).execute(imageUrl);
                Picasso.get().load(imageUrl).into(recipeImageView);
            }
            catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
