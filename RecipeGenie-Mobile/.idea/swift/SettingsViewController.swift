import UIKit

class SettingsViewController: UIViewController {
    let darkModeSwitch = UISwitch()

    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        updateSwitchState()
    }

    private func setupUI() {
        darkModeSwitch.addTarget(self, action: #selector(toggleDarkMode), for: .valueChanged)
    }

    private func updateSwitchState() {
        if let isDarkModeEnabled = UserDefaults.standard.object(forKey: "isDarkMode") as? Bool {
            darkModeSwitch.isOn = isDarkModeEnabled
        }
    }

    @objc private func toggleDarkMode() {
        UserDefaults.standard.set(darkModeSwitch.isOn, forKey: "isDarkMode")
    }
}
