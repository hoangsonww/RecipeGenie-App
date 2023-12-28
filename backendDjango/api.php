<?php
// Database credentials
$host = 'localhost';
$dbname = 'recipegenie';
$username = 'root';
$password = '';

// Create a connection
$conn = new mysqli($host, $username, $password, $dbname);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Set the content type to JSON
header('Content-Type: application/json');

// CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Utility function to execute SQL and return results
function executeQuery($conn, $sql) {
    $result = $conn->query($sql);
    $data = [];

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        return $data;
    } else {
        return [];
    }
}

// Handling different request methods
$method = $_SERVER['REQUEST_METHOD'];
switch($method) {
    case 'GET':
        // Fetch meals based on query parameters
        $sql = "SELECT * FROM meals";
        if (isset($_GET['category'])) {
            $category = $conn->real_escape_string($_GET['category']);
            $sql .= " WHERE category = '$category'";
        }
        elseif (isset($_GET['search'])) {
            $search = $conn->real_escape_string($_GET['search']);
            $sql .= " WHERE name LIKE '%$search%'";
        }
        $meals = executeQuery($conn, $sql);
        echo json_encode($meals);
        break;

    case 'POST':
        // Add a new meal
        $data = json_decode(file_get_contents('php://input'), true);
        $name = $conn->real_escape_string($data['name']);
        $description = $conn->real_escape_string($data['description']);
        $ingredients = $conn->real_escape_string($data['ingredients']);
        $category = $conn->real_escape_string($data['category']);
        $image_url = $conn->real_escape_string($data['image_url']);

        $sql = "INSERT INTO meals (name, description, ingredients, category, image_url) VALUES ('$name', '$description', '$ingredients', '$category', '$image_url')";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["message" => "New meal added successfully"]);
        }
        else {
            echo json_encode(["error" => "Error adding meal: " . $conn->error]);
        }
        break;

    case 'PUT':
        // Update an existing meal
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'];
        $name = $conn->real_escape_string($data['name']);
        $description = $conn->real_escape_string($data['description']);
        $ingredients = $conn->real_escape_string($data['ingredients']);
        $category = $conn->real_escape_string($data['category']);
        $image_url = $conn->real_escape_string($data['image_url']);

        $sql = "UPDATE meals SET name = '$name', description = '$description', ingredients = '$ingredients', category = '$category', image_url = '$image_url' WHERE id = $id";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["message" => "Meal updated successfully"]);
        }
        else {
            echo json_encode(["error" => "Error updating meal: " . $conn->error]);
        }
        break;

    case 'DELETE':
        // Delete a meal
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'];

        $sql = "DELETE FROM meals WHERE id = $id";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["message" => "Meal deleted successfully"]);
        }
        else {
            echo json_encode(["error" => "Error deleting meal: " . $conn->error]);
        }
        break;

    case 'OPTIONS':
        // CORS preflight request
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
        break;

    default:
        echo json_encode(["error" => "Invalid request method"]);
        break;
}

$conn->close();
?>
