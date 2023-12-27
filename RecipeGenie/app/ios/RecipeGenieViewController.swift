import UIKit

class RecipeGenieViewController: UIViewController {

    // MARK: - Properties
    var recipes: [Recipe] = []

    // MARK: - UI Elements
    let tableView = UITableView()

    // MARK: - Lifecycle Methods
    override func viewDidLoad() {
        super.viewDidLoad()
        setupTableView()
        fetchRecipes()
    }

    // MARK: - Setup TableView
    private func setupTableView() {
        tableView.dataSource = self
        tableView.delegate = self
        tableView.register(UITableViewCell.self, forCellReuseIdentifier: "cell")
        view.addSubview(tableView)
        tableView.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            tableView.topAnchor.constraint(equalTo: view.topAnchor),
            tableView.leftAnchor.constraint(equalTo: view.leftAnchor),
            tableView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            tableView.rightAnchor.constraint(equalTo: view.rightAnchor)
        ])
    }

    // MARK: - Networking
    private func fetchRecipes() {
        guard let url = URL(string: "https://api.yourrecipesource.com/recipes") else { return }

        URLSession.shared.dataTask(with: url) { [weak self] data, response, error in
            guard let self = self, let data = data, error == nil else { return }

            do {
                let recipes = try JSONDecoder().decode([Recipe].self, from: data)
                DispatchQueue.main.async {
                    self.recipes = recipes
                    self.tableView.reloadData()
                }
            }
            catch {
                print("Error decoding data: \(error)")
            }
        }.resume()
    }

    // MARK: - Actions
    @IBAction func addRecipe(_ sender: Any) {
        let alert = UIAlertController(title: "Add Recipe", message: nil, preferredStyle: .alert)
        alert.addTextField { textField in
            textField.placeholder = "Name"
        }
        alert.addTextField { textField in
            textField.placeholder = "Description"
        }
        alert.addTextField { textField in
            textField.placeholder = "Ingredients"
        }
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel))
        alert.addAction(UIAlertAction(title: "Add", style: .default) { [weak self] _ in
            guard let self = self else { return }
            guard let name = alert.textFields?[0].text, !name.isEmpty else { return }
            guard let description = alert.textFields?[1].text, !description.isEmpty else { return }
            guard let ingredients = alert.textFields?[2].text, !ingredients.isEmpty else { return }
            let recipe = Recipe(id: 0, name: name, description: description, ingredients: ingredients.components(separatedBy: ","))
            self.recipes.append(recipe)
            self.tableView.reloadData()
        })
        present(alert, animated: true)
    }

    @IBAction func deleteRecipe(_ sender: Any) {
        let alert = UIAlertController(title: "Delete Recipe", message: nil, preferredStyle: .alert)
        alert.addTextField { textField in
            textField.placeholder = "Name"
        }
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel))
        alert.addAction(UIAlertAction(title: "Delete", style: .destructive) { [weak self] _ in
            guard let self = self else { return }
            guard let name = alert.textFields?[0].text, !name.isEmpty else { return }
            guard let index = self.recipes.firstIndex(where: { $0.name == name }) else { return }
            self.recipes.remove(at: index)
            self.tableView.reloadData()
        })
        present(alert, animated: true)
    }

    @IBAction func updateRecipe(_ sender: Any) {
        let alert = UIAlertController(title: "Update Recipe", message: nil, preferredStyle: .alert)
        alert.addTextField { textField in
            textField.placeholder = "Name"
        }
        alert.addTextField { textField in
            textField.placeholder = "Description"
        }
        alert.addTextField { textField in
            textField.placeholder = "Ingredients"
        }
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel))
        alert.addAction(UIAlertAction(title: "Update", style: .default) { [weak self] _ in
            guard let self = self else { return }
            guard let name = alert.textFields?[0].text, !name.isEmpty else { return }
            guard let description = alert.textFields?[1].text, !description.isEmpty else { return }
            guard let ingredients = alert.textFields?[2].text, !ingredients.isEmpty else { return }
            guard let index = self.recipes.firstIndex(where: { $0.name == name }) else { return }
            self.recipes[index].description = description
            self.recipes[index].ingredients = ingredients.components(separatedBy: ",")
            self.tableView.reloadData()
        })
        present(alert, animated: true)
    }

    @IBAction func saveRecipes(_ sender: Any) {
        let alert = UIAlertController(title: "Save Recipes", message: nil, preferredStyle: .alert)
        alert.addTextField { textField in
            textField.placeholder = "Filename"
        }
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel))
        alert.addAction(UIAlertAction(title: "Save", style: .default) { [weak self] _ in
            guard let self = self else { return }
            guard let filename = alert.textFields?[0].text, !filename.isEmpty else { return }
            let recipes = Recipe.toDictArray(self.recipes)
            let json = Recipe.toJsonArray(self.recipes)
            let plist = Recipe.toPlistArray(self.recipes)
            let xml = Recipe.toXmlArray(self.recipes)
            let yaml = Recipe.toYamlArray(self.recipes)
            let documentsDirectory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
            let jsonFile = documentsDirectory.appendingPathComponent("\(filename).json")
            let plistFile = documentsDirectory.appendingPathComponent("\(filename).plist")
            let xmlFile = documentsDirectory.appendingPathComponent("\(filename).xml")
            let yamlFile = documentsDirectory.appendingPathComponent("\(filename).yaml")
            do {
                try json.write(to: jsonFile, atomically: true, encoding: .utf8)
                try plist.write(to: plistFile, atomically: true, encoding: .utf8)
                try xml.write(to: xmlFile, atomically: true, encoding: .utf8)
                try yaml.write(to: yamlFile, atomically: true, encoding: .utf8)
            }
            catch {
                print("Error saving recipes: \(error)")
            }
        })
        present(alert, animated: true)
    }

    @IBAction func loadRecipes(_ sender: Any) {
        let alert = UIAlertController(title: "Load Recipes", message: nil, preferredStyle: .alert)
        alert.addTextField { textField in
            textField.placeholder = "Filename"
        }
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel))
        alert.addAction(UIAlertAction(title: "Load", style: .default) { [weak self] _ in
            guard let self = self else { return }
            guard let filename = alert.textFields?[0].text, !filename.isEmpty else { return }
            let documentsDirectory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
            let jsonFile = documentsDirectory.appendingPathComponent("\(filename).json")
            let plistFile = documentsDirectory.appendingPathComponent("\(filename).plist")
            let xmlFile = documentsDirectory.appendingPathComponent("\(filename).xml")
            let yamlFile = documentsDirectory.appendingPathComponent("\(filename).yaml")
            do {
                let json = try String(contentsOf: jsonFile, encoding: .utf8)
                let plist = try String(contentsOf: plistFile, encoding: .utf8)
                let xml = try String(contentsOf: xmlFile, encoding: .utf8)
                let yaml = try String(contentsOf: yamlFile, encoding: .utf8)
                self.recipes = Recipe.fromDictArray(Recipe.fromJsonArray(json))
                self.recipes = Recipe.fromDictArray(Recipe.fromPlistArray(plist))
                self.recipes = Recipe.fromDictArray(Recipe.fromXmlArray(xml))
                self.recipes = Recipe.fromDictArray(Recipe.fromYamlArray(yaml))
                self.tableView.reloadData()
            }
            catch {
                print("Error loading recipes: \(error)")
            }
        })
        present(alert, animated: true)
    }

    @IBAction func clearRecipes(_ sender: Any) {
        let alert = UIAlertController(title: "Clear Recipes", message: nil, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel))
        alert.addAction(UIAlertAction(title: "Clear", style: .destructive) { [weak self] _ in
            guard let self = self else { return }
            self.recipes = []
            self.tableView.reloadData()
        })
        present(alert, animated: true)
    }

    @IBAction func exportRecipes(_ sender: Any) {
        let alert = UIAlertController(title: "Export Recipes", message: nil, preferredStyle: .alert)
        alert.addTextField { textField in
            textField.placeholder = "Filename"
        }
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel))
        alert.addAction(UIAlertAction(title: "Export", style: .default) { [weak self] _ in
            guard let self = self else { return }
            guard let filename = alert.textFields?[0].text, !filename.isEmpty else { return }
            let documentsDirectory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
            let jsonFile = documentsDirectory.appendingPathComponent("\(filename).json")
            let plistFile = documentsDirectory.appendingPathComponent("\(filename).plist")
            let xmlFile = documentsDirectory.appendingPathComponent("\(filename).xml")
            let yamlFile = documentsDirectory.appendingPathComponent("\(filename).yaml")
            do {
                try Recipe.toJsonArray(self.recipes).write(to: jsonFile, atomically: true, encoding: .utf8)
                try Recipe.toPlistArray(self.recipes).write(to: plistFile, atomically: true, encoding: .utf8)
                try Recipe.toXmlArray(self.recipes).write(to: xmlFile, atomically: true, encoding: .utf8)
                try Recipe.toYamlArray(self.recipes).write(to: yamlFile, atomically: true, encoding: .utf8)
            }
            catch {
                print("Error exporting recipes: \(error)")
            }
        })
        present(alert, animated: true)
    }

    @IBAction func importRecipes(_ sender: Any) {
        let alert = UIAlertController(title: "Import Recipes", message: nil, preferredStyle: .alert)
        alert.addTextField { textField in
            textField.placeholder = "Filename"
        }
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel))
        alert.addAction(UIAlertAction(title: "Import", style: .default) { [weak self] _ in
            guard let self = self else { return }
            guard let filename = alert.textFields?[0].text, !filename.isEmpty else { return }
            let documentsDirectory = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
            let jsonFile = documentsDirectory.appendingPathComponent("\(filename).json")
            let plistFile = documentsDirectory.appendingPathComponent("\(filename).plist")
            let xmlFile = documentsDirectory.appendingPathComponent("\(filename).xml")
            let yamlFile = documentsDirectory.appendingPathComponent("\(filename).yaml")
            do {
                let json = try String(contentsOf: jsonFile, encoding: .utf8)
                let plist = try String(contentsOf: plistFile, encoding: .utf8)
                let xml = try String(contentsOf: xmlFile, encoding: .utf8)
                let yaml = try String(contentsOf: yamlFile, encoding: .utf8)
                self.recipes = Recipe.fromJsonArray(json)
                self.recipes = Recipe.fromPlistArray(plist)
                self.recipes = Recipe.fromXmlArray(xml)
                self.recipes = Recipe.fromYamlArray(yaml)
                self.tableView.reloadData()
            }
            catch {
                print("Error importing recipes: \(error)")
            }
        })
        present(alert, animated: true)
    }
}

// MARK: - TableView DataSource & Delegate
extension RecipeGenieViewController: UITableViewDataSource, UITableViewDelegate {
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

    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        let recipe = recipes[indexPath.row]
        let alert = UIAlertController(title: recipe.name, message: recipe.description, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .cancel))
        present(alert, animated: true)
        print("Selected recipe: \(recipe.name)")
    }

    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 100
    }
}

// MARK: - Recipe Model
struct Recipe: Codable {
    let id: Int
    let name: String
    let description: String
    let ingredients: [String]

    enum CodingKeys: String, CodingKey {
        case id
        case name
        case description
        case ingredients
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        self.id = try container.decode(Int.self, forKey: CodingKeys.id)
        self.name = try container.decode(String.self, forKey: CodingKeys.name)
        self.description = try container.decode(String.self, forKey: CodingKeys.description)
        self.ingredients = try container.decode([String].self, forKey: CodingKeys.ingredients)
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(id, forKey: CodingKeys.id)
        try container.encode(name, forKey: CodingKeys.name)
        try container.encode(description, forKey: CodingKeys.description)
        try container.encode(ingredients, forKey: CodingKeys.ingredients)
    }

    init(id: Int, name: String, description: String, ingredients: [String]) {
        self.id = id
        self.name = name
        self.description = description
        self.ingredients = ingredients
    }

    init() {
        self.id = 0
        self.name = ""
        self.description = ""
        self.ingredients = []
    }

    static func == (lhs: Recipe, rhs: Recipe) -> Bool {
        return lhs.id == rhs.id
    }

    func hash(into hasher: inout Hasher) {
        hasher.combine(id)
    }

    func toString() -> String {
        return "Recipe(id: \(id), name: \(name), description: \(description), ingredients: \(ingredients))"
    }

    func toDict() -> [String: Any] {
        return [
            "id": id,
            "name": name,
            "description": description,
            "ingredients": ingredients
        ]
    }

    static func fromDict(_ dict: [String: Any]) -> Recipe {
        return Recipe(
            id: dict["id"] as! Int,
            name: dict["name"] as! String,
            description: dict["description"] as! String,
            ingredients: dict["ingredients"] as! [String]
        )
    }

    static func fromDictArray(_ dictArray: [[String: Any]]) -> [Recipe] {
        var recipes: [Recipe] = []
        for dict in dictArray {
            recipes.append(fromDict(dict))
        }
        return recipes
    }

    static func toDictArray(_ recipes: [Recipe]) -> [[String: Any]] {
        var dictArray: [[String: Any]] = []
        for recipe in recipes {
            dictArray.append(recipe.toDict())
        }
        return dictArray
    }

    static func fromJson(_ json: String) -> Recipe {
        let data = json.data(using: .utf8)!
        let decoder = JSONDecoder()
        return try! decoder.decode(Recipe.self, from: data)
    }

    static func fromJsonArray(_ jsonArray: String) -> [Recipe] {
        let data = jsonArray.data(using: .utf8)!
        let decoder = JSONDecoder()
        return try! decoder.decode([Recipe].self, from: data)
    }

    static func toJson(_ recipe: Recipe) -> String {
        let encoder = JSONEncoder()
        encoder.outputFormatting = .prettyPrinted
        let data = try! encoder.encode(recipe)
        return String(data: data, encoding: .utf8)!
    }

    static func toJsonArray(_ recipes: [Recipe]) -> String {
        let encoder = JSONEncoder()
        encoder.outputFormatting = .prettyPrinted
        let data = try! encoder.encode(recipes)
        return String(data: data, encoding: .utf8)!
    }

    static func fromPlist(_ plist: String) -> Recipe {
        let data = plist.data(using: .utf8)!
        let decoder = PropertyListDecoder()
        return try! decoder.decode(Recipe.self, from: data)
    }

    static func fromPlistArray(_ plistArray: String) -> [Recipe] {
        let data = plistArray.data(using: .utf8)!
        let decoder = PropertyListDecoder()
        return try! decoder.decode([Recipe].self, from: data)
    }

    static func toPlist(_ recipe: Recipe) -> String {
        let encoder = PropertyListEncoder()
        encoder.outputFormat = .xml
        let data = try! encoder.encode(recipe)
        return String(data: data, encoding: .utf8)!
    }

    static func toPlistArray(_ recipes: [Recipe]) -> String {
        let encoder = PropertyListEncoder()
        encoder.outputFormat = .xml
        let data = try! encoder.encode(recipes)
        return String(data: data, encoding: .utf8)!
    }

    static func fromXml(_ xml: String) -> Recipe {
        let data = xml.data(using: .utf8)!
        let decoder = XMLDecoder()
        return try! decoder.decode(Recipe.self, from: data)
    }

    static func fromXmlArray(_ xmlArray: String) -> [Recipe] {
        let data = xmlArray.data(using: .utf8)!
        let decoder = XMLDecoder()
        return try! decoder.decode([Recipe].self, from: data)
    }

    static func toXml(_ recipe: Recipe) -> String {
        let encoder = XMLEncoder()
        encoder.outputFormatting = .prettyPrinted
        let data = try! encoder.encode(recipe)
        return String(data: data, encoding: .utf8)!
    }

    static func toXmlArray(_ recipes: [Recipe]) -> String {
        let encoder = XMLEncoder()
        encoder.outputFormatting = .prettyPrinted
        let data = try! encoder.encode(recipes)
        return String(data: data, encoding: .utf8)!
    }

    static func fromYaml(_ yaml: String) -> Recipe {
        let data = yaml.data(using: .utf8)!
        let decoder = YAMLDecoder()
        return try! decoder.decode(Recipe.self, from: data)
    }

    static func fromYamlArray(_ yamlArray: String) -> [Recipe] {
        let data = yamlArray.data(using: .utf8)!
        let decoder = YAMLDecoder()
        return try! decoder.decode([Recipe].self, from: data)
    }

    static func toYaml(_ recipe: Recipe) -> String {
        let encoder = YAMLEncoder()
        encoder.outputFormatting = .prettyPrinted
        let data = try! encoder.encode(recipe)
        return String(data: data, encoding: .utf8)!
    }

}
