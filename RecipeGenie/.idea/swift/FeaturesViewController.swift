import UIKit

class FeaturesViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
    }

    private func setupUI() {
        view.backgroundColor = .white
        setupButtons()
    }

    @objc private func showCookingTips() {
        let tipsViewController = TipsViewController()
        tipsViewController.modalPresentationStyle = .fullScreen
        tipsViewController.tipType = .cooking
        present(tipsViewController, animated: true, completion: nil)
    }

    @objc private func showSeasonalIngredients() {
        let ingredientsViewController = IngredientsViewController()
        ingredientsViewController.modalPresentationStyle = .fullScreen
        ingredientsViewController.season = getCurrentSeason()
        present(ingredientsViewController, animated: true, completion: nil)
    }

    @objc private func showNutritionalTips() {
        let tipsViewController = TipsViewController()
        tipsViewController.modalPresentationStyle = .fullScreen
        tipsViewController.tipType = .nutritional
        present(tipsViewController, animated: true, completion: nil)
    }

    @objc private func showFlavorPairs() {
        let flavorPairViewController = FlavorPairViewController()
        flavorPairViewController.modalPresentationStyle = .fullScreen
        present(flavorPairViewController, animated: true, completion: nil)
    }

    @objc private func showConversionTool() {
        let conversionToolViewController = ConversionToolViewController()
        conversionToolViewController.modalPresentationStyle = .fullScreen
        present(conversionToolViewController, animated: true, completion: nil)
    }

    private func getCurrentSeason() -> String {
        if let month = Calendar.current.dateComponents([.month], from: Date()).month {
            switch month {
            case 3...5:
                return "Spring"
            case 6...8:
                return "Summer"
            case 9...11:
                return "Fall"
            default:
                return "Winter"
            }
        }
    }

    func setupButtons() {
        let cookingTipsButton = UIButton()
        cookingTipsButton.setTitle("Cooking Tips", for: .normal)
        cookingTipsButton.setTitleColor(.black, for: .normal)
        cookingTipsButton.addTarget(self, action: #selector(showCookingTips), for: .touchUpInside)
        view.addSubview(cookingTipsButton)
        cookingTipsButton.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            cookingTipsButton.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 20),
            cookingTipsButton.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20)
        ])

        let seasonalIngredientsButton = UIButton()
        seasonalIngredientsButton.setTitle("Seasonal Ingredients", for: .normal)
        seasonalIngredientsButton.setTitleColor(.black, for: .normal)
        seasonalIngredientsButton.addTarget(self, action: #selector(showSeasonalIngredients), for: .touchUpInside)
        view.addSubview(seasonalIngredientsButton)
        seasonalIngredientsButton.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            seasonalIngredientsButton.topAnchor.constraint(equalTo: cookingTipsButton.bottomAnchor, constant: 20),
            seasonalIngredientsButton.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20)
        ])

        let nutritionalTipsButton = UIButton()
        nutritionalTipsButton.setTitle("Nutritional Tips", for: .normal)
        nutritionalTipsButton.setTitleColor(.black, for: .normal)
        nutritionalTipsButton.addTarget(self, action: #selector(showNutritionalTips), for: .touchUpInside)
        view.addSubview(nutritionalTipsButton)
        nutritionalTipsButton.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            nutritionalTipsButton.topAnchor.constraint(equalTo: seasonalIngredientsButton.bottomAnchor, constant: 20),
            nutritionalTipsButton.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20)
        ])

        let flavorPairsButton = UIButton()
        flavorPairsButton.setTitle("Flavor Pairs", for: .normal)
        flavorPairsButton.setTitleColor(.black, for: .normal)
        flavorPairsButton.addTarget(self, action: #selector(showFlavorPairs), for: .touchUpInside)
        view.addSubview(flavorPairsButton)
        flavorPairsButton.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            flavorPairsButton.topAnchor.constraint(equalTo: nutritionalTipsButton.bottomAnchor, constant: 20),
            flavorPairsButton.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20)
        ])

        let conversionToolButton = UIButton()
        conversionToolButton.setTitle("Conversion Tool", for: .normal)
        conversionToolButton.setTitleColor(.black, for: .normal)
        conversionToolButton.addTarget(self, action: #selector(showConversionTool), for: .touchUpInside)
        view.addSubview(conversionToolButton)
        conversionToolButton.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            conversionToolButton.topAnchor.constraint(equalTo: flavorPairsButton.bottomAnchor, constant: 20),
            conversionToolButton.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20)
        ])
    }
}

// Placeholder ViewControllers for each feature
class TipsViewController: UIViewController {
    var tipType: TipType = .cooking
}

class IngredientsViewController: UIViewController {
    var season: String = ""
}

class FlavorPairViewController: UIViewController {}

class ConversionToolViewController: UIViewController {}

enum TipType {
    case cooking, nutritional
}
