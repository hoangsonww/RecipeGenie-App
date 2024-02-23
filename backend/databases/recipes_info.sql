-- Create Users Table
CREATE TABLE users (
                       user_id INT AUTO_INCREMENT PRIMARY KEY,
                       username VARCHAR(50) NOT NULL,
                       email VARCHAR(100) NOT NULL,
                       password_hash VARCHAR(255) NOT NULL,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Recipes Table
CREATE TABLE recipes (
                         recipe_id INT AUTO_INCREMENT PRIMARY KEY,
                         user_id INT,
                         title VARCHAR(255) NOT NULL,
                         description TEXT,
                         ingredients TEXT,
                         instructions TEXT,
                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Create Favorites Table
CREATE TABLE favorites (
                           user_id INT,
                           recipe_id INT,
                           FOREIGN KEY (user_id) REFERENCES users(user_id),
                           FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id),
                           PRIMARY KEY (user_id, recipe_id)
);
