import Foundation

class FlavorPairingGuide {
    private var pairings: [String: String] = [
        "apple": "cinnamon",
        "salmon": "dill",
        "chocolate": "orange",
        "chicken": "lemon",
        "pork": "apple",
        "beef": "mushroom",
        "egg": "bacon",
        "potato": "rosemary",
        "tomato": "basil",
        "corn": "butter",
        "rice": "soy sauce",
        "carrot": "ginger",
        "peas": "mint",
        "lamb": "garlic",
        "shrimp": "lemon",
        "strawberry": "chocolate",
        "banana": "peanut butter",
        "avocado": "lime",
        "spinach": "lemon",
        "onion": "garlic",
        "garlic": "onion",
        "ginger": "carrot",
        "lemon": "chicken",
        "lime": "avocado",
        "orange": "chocolate",
        "rosemary": "potato",
        "basil": "tomato",
        "mint": "peas",
        "dill": "salmon",
        "soy sauce": "rice",
        "butter": "corn",
        "mushroom": "beef",
        "peanut butter": "banana",
        "bacon": "egg",
        "cinnamon": "apple",
        "chicken": "lemon",
        "lemon": "chicken",
        "apple": "cinnamon",
        "dill": "salmon"
    ]

    func getPairing(forIngredient ingredient: String) -> String? {
        return pairings[ingredient]
    }
}
