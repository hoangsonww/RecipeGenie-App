import UIKit

class RecipeListViewController: UIViewController {

    // MARK: - Properties
    var tableView: UITableView!
    var recipes: [Recipe] = []

    // MARK: - Lifecycle
    override func viewDidLoad() {
        super.viewDidLoad()
        setupTableView()
        fetchRecipes()
    }

    // MARK: - Setup TableView
    private func setupTableView() {
        tableView = UITableView(frame: view.bounds, style: .plain)
        tableView.register(RecipeTableViewCell.self, forCellReuseIdentifier: RecipeTableViewCell.identifier)
        tableView.delegate = self
        tableView.dataSource = self
        view.addSubview(tableView)
    }

    // MARK: - Fetch Recipes
    private func fetchRecipes() {
        let urlString = "https://api.yourrecipeapp.com/recipes"
        guard let url = URL(string: urlString) else { return }

        let task = URLSession.shared.dataTask(with: url) { [weak self] data, response, error in
            guard let self = self, let data = data, error == nil else { return }

            do {
                let decoder = JSONDecoder()
                self.recipes = try decoder.decode([Recipe].self, from: data)
                DispatchQueue.main.async {
                    self.tableView.reloadData()
                }
            }
            catch {
                print("Failed to decode JSON: \(error)")
            }
        }
        task.resume()
    }
}

// MARK: - UITableViewDataSource
extension RecipeListViewController: UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return recipes.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        guard let cell = tableView.dequeueReusableCell(withIdentifier: RecipeTableViewCell.identifier, for: indexPath) as? RecipeTableViewCell else {
            return UITableViewCell()
        }
        let recipe = recipes[indexPath.row]
        cell.configure(with: recipe)
        return cell
    }
}

// MARK: - UITableViewDelegate
extension RecipeListViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let recipe = recipes[indexPath.row]
        let detailVC = RecipeDetailViewController(recipe: recipe)
        navigationController?.pushViewController(detailVC, animated: true)
    }
}

// MARK: - RecipeListViewController
extension RecipeListViewController {
    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        tableView.frame = view.bounds
    }
}

// MARK: - Recipe Model
struct Recipe: Codable {
    let id: Int
    let title: String
    let description: String
    let imageURL: String
    let ingredients: [String]
    let instructions: [String]
}

// MARK: - RecipeTableViewCell
class RecipeTableViewCell: UITableViewCell {
    static let identifier = "RecipeTableViewCell"

    func configure(with recipe: Recipe) {
        // Configure cell
        let title = recipe.title
        let description = recipe.description
        let imageURL = recipe.imageURL
        let ingredients = recipe.ingredients
        let instructions = recipe.instructions

        titleLabel.text = title
        descriptionLabel.text = description
        ingredientsLabel.text = ingredients.joined(separator: ", ")
        instructionsLabel.text = instructions.joined(separator: ", ")
    }
}

// MARK: - RecipeDetailViewController
class RecipeDetailViewController: UIViewController {
    var recipe: Recipe

    init(recipe: Recipe) {
        self.recipe = recipe
        super.init(nibName: nil, bundle: nil)
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}
