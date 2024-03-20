import UIKit

class ChatbotViewController: UIViewController, UITextFieldDelegate {
    let messageTextField = UITextField()
    let sendButton = UIButton()
    var messages: [String] = []

    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
    }

    private func setupUI() {
        view.backgroundColor = .white
        setupMessageTextField()
        setupSendButton();
    }

    @objc private func sendMessage() {
        guard let message = messageTextField.text, !message.isEmpty else { return }
        messages.append(message)
        processMessage(message)
        messageTextField.text = ""
    }

    private func processMessage(_ message: String) {
        print("User said: \(message)")
    }

    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        sendMessage()
        return true
    }
}
