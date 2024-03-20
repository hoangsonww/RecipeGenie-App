import UIKit

class RandomRecipesViewController: UIViewController {
    var recipes: [Recipe] = []

    override func viewDidLoad() {
        super.viewDidLoad()
        fetchRandomRecipes()
    }

    private func fetchRandomRecipes() {
        recipes = fetchFromDataSource()
        updateUIWithRecipes()
    }

    private func fetchFromDataSource() -> [Recipe] {
        data = fetchFromNetwork()
        return data
    }

    private func updateUIWithRecipes() {
        // Update UI
        renderRecipes()
        return nil
    }
}

// Placeholder Recipe model
struct Recipe {
    let title: String
    let ingredients: [String]
}
