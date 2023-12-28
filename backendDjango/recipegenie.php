<?php
session_start();

// Database configuration
$servername = "localhost";
$username = "username";
$password = "password";
$dbname = "recipegenie";

// Create database connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Database setup
$sql = "CREATE TABLE IF NOT EXISTS recipes (
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL
)";
$conn->query($sql);

// Database check
$sql = "SELECT id FROM recipes";
$result = $conn->query($sql);
if ($result->num_rows == 0) {
    $sql = "INSERT INTO recipes (title, ingredients, instructions) VALUES ('Pancakes', '1 cup flour, 1 cup milk, 1 egg', 'Mix ingredients, cook on griddle')";
    $conn->query($sql);
}

// Function to handle user login
function loginUser($username, $password) {
    global $conn;

    // Security measure to prevent SQL injection
    $username = $conn->real_escape_string($username);
    $password = md5($password); // Simple hash for password

    $sql = "SELECT id FROM users WHERE username = '$username' AND password = '$password'";
    $result = $conn->query($sql);

    if ($result->num_rows == 1) {
        $_SESSION['username'] = $username;
        return true;
    } else {
        return false;
    }
}

// Function to check if the user is logged in
function isUserLoggedIn() {
    return isset($_SESSION['username']);
}

// Function to handle user logout
function logoutUser() {
    session_destroy();
}

// Function to handle user registration
function registerUser($username, $password) {
    global $conn;

    $username = $conn->real_escape_string($username);
    $password = md5($password);

    $sql = "INSERT INTO users (username, password) VALUES ('$username', '$password')";
    if ($conn->query($sql) === TRUE) {
        $_SESSION['username'] = $username;
        return true;
    } else {
        return false;
    }
}

// Function to check if a user exists
function userExists($username) {
    global $conn;

    $username = $conn->real_escape_string($username);

    $sql = "SELECT id FROM users WHERE username = '$username'";
    $result = $conn->query($sql);

    return $result->num_rows > 0;
}

// Function to add a new recipe
function addRecipe($title, $ingredients, $instructions) {
    global $conn;

    $title = $conn->real_escape_string($title);
    $ingredients = $conn->real_escape_string($ingredients);
    $instructions = $conn->real_escape_string($instructions);

    $sql = "INSERT INTO recipes (title, ingredients, instructions) VALUES ('$title', '$ingredients', '$instructions')";
    if ($conn->query($sql) === TRUE) {
        return $conn->insert_id;
    } else {
        return false;
    }
}

// Function to update a recipe
function updateRecipe($id, $title, $ingredients, $instructions) {
    global $conn;

    $id = $conn->real_escape_string($id);
    $title = $conn->real_escape_string($title);
    $ingredients = $conn->real_escape_string($ingredients);
    $instructions = $conn->real_escape_string($instructions);

    $sql = "UPDATE recipes SET title = '$title', ingredients = '$ingredients', instructions = '$instructions' WHERE id = $id";
    return $conn->query($sql) === TRUE;
}

// Function to delete a recipe
function deleteRecipe($id) {
    global $conn;

    $id = $conn->real_escape_string($id);

    $sql = "DELETE FROM recipes WHERE id = $id";
    return $conn->query($sql) === TRUE;
}

// Function to check if a recipe exists
function recipeExists($title) {
    global $conn;

    $title = $conn->real_escape_string($title);

    $sql = "SELECT id FROM recipes WHERE title = '$title'";
    $result = $conn->query($sql);

    return $result->num_rows > 0;
}

// Function to get all recipes
function getAllRecipes() {
    global $conn;

    $sql = "SELECT id, title FROM recipes";
    $result = $conn->query($sql);

    $recipes = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $recipes[] = $row;
        }
    }
    return $recipes;
}

// Function to get a single recipe by ID
function getRecipeById($id) {
    global $conn;

    $id = $conn->real_escape_string($id);

    $sql = "SELECT * FROM recipes WHERE id = $id";
    $result = $conn->query($sql);

    if ($result->num_rows == 1) {
        return $result->fetch_assoc();
    }
    else {
        return false;
    }
}

// Function to update a recipe
function updateRecipe($id, $title, $ingredients, $instructions) {
    global $conn;

    $id = $conn->real_escape_string($id);
    $title = $conn->real_escape_string($title);
    $ingredients = $conn->real_escape_string($ingredients);
    $instructions = $conn->real_escape_string($instructions);

    $sql = "UPDATE recipes SET title = '$title', ingredients = '$ingredients', instructions = '$instructions' WHERE id = $id";
    return $conn->query($sql) === TRUE;
}

// Function to delete a recipe
function deleteRecipe($id) {
    global $conn;

    $id = $conn->real_escape_string($id);

    $sql = "DELETE FROM recipes WHERE id = $id";
    return $conn->query($sql) === TRUE;
}

// Function to generate a random password
function generatePassword($length = 8) {
    $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    $password = '';
    for ($i = 0; $i < $length; $i++) {
        $password .= $chars[rand(0, strlen($chars) - 1)];
    }
    return $password;
}

// Function to add a new user
function addUser($username, $password) {
    global $conn;

    $username = $conn->real_escape_string($username);
    $password = md5($password);

    $sql = "INSERT INTO users (username, password) VALUES ('$username', '$password')";
    if ($conn->query($sql) === TRUE) {
        return $conn->insert_id;
    }
    else {
        return false;
    }
}

// Function to get all users
function getAllUsers() {
    global $conn;

    $sql = "SELECT id, username FROM users";
    $result = $conn->query($sql);

    $users = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $users[] = $row;
        }
    }
    return $users;
}

// Function to get a single user by ID
function getUserById($id) {
    global $conn;

    $id = $conn->real_escape_string($id);

    $sql = "SELECT * FROM users WHERE id = $id";
    $result = $conn->query($sql);

    if ($result->num_rows == 1) {
        return $result->fetch_assoc();
    }
    else {
        return false;
    }
}

// Function to get a single user by username
function getUserByUsername($username) {
    global $conn;

    $username = $conn->real_escape_string($username);

    $sql = "SELECT * FROM users WHERE username = '$username'";
    $result = $conn->query($sql);

    if ($result->num_rows == 1) {
        return $result->fetch_assoc();
    }
    else {
        return false;
    }
}

// Function to update a user's username
function updateUsername($id, $username) {
    global $conn;

    $id = $conn->real_escape_string($id);
    $username = $conn->real_escape_string($username);

    $sql = "UPDATE users SET username = '$username' WHERE id = $id";
    return $conn->query($sql) === TRUE;
}

// Function to update a user's password
function updatePassword($id, $password) {
    global $conn;

    $id = $conn->real_escape_string($id);
    $password = md5($password);

    $sql = "UPDATE users SET password = '$password' WHERE id = $id";
    return $conn->query($sql) === TRUE;
}

// Function to update a user
function updateUser($id, $username, $password) {
    global $conn;

    $id = $conn->real_escape_string($id);
    $username = $conn->real_escape_string($username);
    $password = md5($password);

    $sql = "UPDATE users SET username = '$username', password = '$password' WHERE id = $id";
    return $conn->query($sql) === TRUE;
}

// Function to delete a user
function deleteUser($id) {
    global $conn;

    $id = $conn->real_escape_string($id);

    $sql = "DELETE FROM users WHERE id = $id";
    return $conn->query($sql) === TRUE;
}

// Function to update a user's password
function updatePassword($id, $password) {
    global $conn;

    $id = $conn->real_escape_string($id);
    $password = md5($password);

    $sql = "UPDATE users SET password = '$password' WHERE id = $id";
    return $conn->query($sql) === TRUE;
}

// Handle GET requests
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    if (isset($_GET['logout'])) {
        logoutUser();
        header("Location: index.php");
    }
    else if (isset($_GET['user'])) {
        echo json_encode(isUserLoggedIn());
    }
    else {
        if (!isUserLoggedIn()) {
            header("Location: index.php");
        }
    }
    if (isset($_GET['recipes'])) {
        echo json_encode(getAllRecipes());
    }
    else if (isset($_GET['recipe'])) {
        echo json_encode(getRecipeById($_GET['recipe']));
    }

// Handle POST requests
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (isset($_POST['login'])) {
        $username = $_POST['username'];
        $password = $_POST['password'];

        if (loginUser($username, $password)) {
            echo "Login successful!";
        } else {
            echo "Login failed!";
        }
    }
    else if (isset($_POST['addRecipe'])) {
        $title = $_POST['title'];
        $ingredients = $_POST['ingredients'];
        $instructions = $_POST['instructions'];

        if (addRecipe($title, $ingredients, $instructions)) {
            echo "Recipe added!";
        } else {
            echo "Recipe failed to add!";
        }
    }
    else if (isset($_POST['updateRecipe'])) {
        $id = $_POST['id'];
        $title = $_POST['title'];
        $ingredients = $_POST['ingredients'];
        $instructions = $_POST['instructions'];

        if (updateRecipe($id, $title, $ingredients, $instructions)) {
            echo "Recipe updated!";
        } else {
            echo "Recipe failed to update!";
        }
    } else if (isset($_POST['deleteRecipe'])) {
        $id = $_POST['id'];

        if (deleteRecipe($id)) {
            echo "Recipe deleted!";
        } else {
            echo "Recipe failed to delete!";
        }
    }
}

// Handle PUT requests
if ($_SERVER["REQUEST_METHOD"] == "PUT") {
    parse_str(file_get_contents("php://input"), $_PUT);

    if (isset($_PUT['register'])) {
        $username = $_PUT['username'];
        $password = $_PUT['password'];

        if (registerUser($username, $password)) {
            echo "Registration successful!";
        } else {
            echo "Registration failed!";
        }
    }
    else if (isset($_PUT['addUser'])) {
        $username = $_PUT['username'];
        $password = $_PUT['password'];

        if (addUser($username, $password)) {
            echo "User added!";
        } else {
            echo "User failed to add!";
        }
    }
    else if (isset($_PUT['updateUser'])) {
        $id = $_PUT['id'];
        $username = $_PUT['username'];
        $password = $_PUT['password'];

        if (updateUser($id, $username, $password)) {
            echo "User updated!";
        } else {
            echo "User failed to update!";
        }
    }
    else if (isset($_PUT['updatePassword'])) {
        $id = $_PUT['id'];
        $password = $_PUT['password'];

        if (updatePassword($id, $password)) {
            echo "Password updated!";
        } else {
            echo "Password failed to update!";
        }
    }
}

// Handle DELETE requests
if ($_SERVER["REQUEST_METHOD"] == "DELETE") {
    parse_str(file_get_contents("php://input"), $_DELETE);

    if (isset($_DELETE['deleteUser'])) {
        $id = $_DELETE['id'];

        if (deleteUser($id)) {
            echo "User deleted!";
        } else {
            echo "User failed to delete!";
        }
    }
}

// Handle OPTIONS requests
if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
}

// Handle HEAD requests
if ($_SERVER["REQUEST_METHOD"] == "HEAD") {
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
}

// Handle PATCH requests
if ($_SERVER["REQUEST_METHOD"] == "PATCH") {
    parse_str(file_get_contents("php://input"), $_PATCH);

    if (isset($_PATCH['updateUser'])) {
        $id = $_PATCH['id'];
        $username = $_PATCH['username'];
        $password = $_PATCH['password'];

        if (updateUser($id, $username, $password)) {
            echo "User updated!";
        }
        else {
            echo "User failed to update!";
        }
    }
}

// Handle TRACE requests
if ($_SERVER["REQUEST_METHOD"] == "TRACE") {
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
}

// Handle CONNECT requests
if ($_SERVER["REQUEST_METHOD"] == "CONNECT") {
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
}

// Handle LINK requests
if ($_SERVER["REQUEST_METHOD"] == "LINK") {
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
}

// Handle UNLINK requests
if ($_SERVER["REQUEST_METHOD"] == "UNLINK") {
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
}

// Handle PURGE requests
if ($_SERVER["REQUEST_METHOD"] == "PURGE") {
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
}

// Handle LOCK requests
if ($_SERVER["REQUEST_METHOD"] == "LOCK") {
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
}

// Handle UNLOCK requests
if ($_SERVER["REQUEST_METHOD"] == "UNLOCK") {
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
}

// Close database connection
$conn->close();
?>