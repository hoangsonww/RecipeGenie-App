import Foundation

class FavoritesManager {
    private var favorites: [String] = []

    func addFavorite(recipe: String) {
        if !favorites.contains(recipe) {
            favorites.append(recipe)
        }
    }

    func removeFavorite(recipe: String) {
        favorites.removeAll { $0 == recipe }
    }

    func getFavorites() -> [String] {
        return favorites
    }
}
