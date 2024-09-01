import UIKit
import WebKit

class MainActivity: UIViewController, WKNavigationDelegate, WKScriptMessageHandler {

    private var webView: WKWebView!

    override func loadView() {
        let webConfiguration = WKWebViewConfiguration()
        webConfiguration.userContentController.add(self, name: "callbackHandler")

        webView = WKWebView(frame: .zero, configuration: webConfiguration)
        webView.navigationDelegate = self
        view = webView
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        if let url = URL(string: "https://hoangsonww.github.io/RecipeGenie-App/") {
            let request = URLRequest(url: url)
            webView.load(request)
        }

        webView.allowsBackForwardNavigationGestures = true
    }

    // MARK: - WebKit Navigation Delegate

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        print("WebView content loaded.")
    }

    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        print("WebView failed to load content with error: \(error.localizedDescription)")
    }

    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        print("WebView failed to load content with error: \(error.localizedDescription)")
    }

    func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
        print("WebView started to load content.")
    }

    func webView(_ webView: WKWebView, didCommit navigation: WKNavigation!) {
        print("WebView content started to load.")
    }

    // MARK: - User Actions

    func searchForMeal(mealName: String) {
        let jsSearchScript = "document.getElementById('search-term').value = '\(mealName)'; document.getElementById('search').click();"
        webView.evaluateJavaScript(jsSearchScript, completionHandler: nil)
    }

    func showFavorites() {
        let jsShowFavorites = "document.getElementById('fav-meals').style.display = 'block';"
        webView.evaluateJavaScript(jsShowFavorites, completionHandler: nil)
    }

    func getRecipeOfTheDay() {
        let jsGetRecipeOfDay = "document.getElementById('recipe-of-the-day').click();"
        webView.evaluateJavaScript(jsGetRecipeOfDay, completionHandler: nil)
    }

    func startTimer(minutes: Int) {
        let jsStartTimer = "document.getElementById('timer-input').value = '\(minutes)'; document.getElementById('timer-start-btn').click();"
        webView.evaluateJavaScript(jsStartTimer, completionHandler: nil)
    }

    func convertMeasurements(type: String, value: Double) {
        let jsConvertMeasurement = "document.getElementById('conversion-type').value = '\(type)'; document.getElementById('conversion-input').value = '\(value)'; document.getElementById('convert-btn').click();"
        webView.evaluateJavaScript(jsConvertMeasurement, completionHandler: nil)
    }

    // MARK: - WKScriptMessageHandler

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if message.name == "callbackHandler", let messageBody = message.body as? String {
            print("Received callback from web content: \(messageBody)")
        }
    }

    func scriptMessageHandler(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if message.name == "callbackHandler", let messageBody = message.body as? String {
            print("Received callback from web content: \(messageBody)")
        }
    }

    func hostContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if message.name == "callbackHandler", let messageBody = message.body as? String {
            print("Received callback from web content: \(messageBody)")
        }
    }

    // MARK: - Additional Functions

    func injectJavaScript() {
        let jsScript = "document.getElementById('search-term').value = 'Chicken'; document.getElementById('search').click();"
        webView.evaluateJavaScript(jsScript, completionHandler: nil)
    }

    func injectCSS() {
        let cssString = "body { background-color: #f0f0f0; }"
        let jsScript = "var style = document.createElement('style'); style.innerHTML = '\(cssString)'; document.head.appendChild(style);"
        webView.evaluateJavaScript(jsScript, completionHandler: nil)
    }

    func injectHTML() {
        let htmlString = "<h1>Hello, World!</h1>"
        webView.loadHTMLString(htmlString, baseURL: nil)
    }

    func loadLocalHTML() {
        if let url = Bundle.main.url(forResource: "index", withExtension: "html") {
            webView.loadFileURL(url, allowingReadAccessTo: url)
        }
    }

    func loadLocalHTMLWithJavaScript() {
        if let url = Bundle.main.url(forResource: "index", withExtension: "html") {
            webView.loadFileURL(url, allowingReadAccessTo: url)
            let request = URLRequest(url: url)
            webView.load(request)
        }
    }

    func loadRemoteHTML() {
        if let url = URL(string: "https://hoangsonww.github.io/RecipeGenie-App/") {
            let request = URLRequest(url: url)
            webView.load(request)
        }
    }

    func loadRemoteHTMLWithJavaScript() {
        if let url = URL(string: "https://hoangsonww.github.io/RecipeGenie-App/") {
            let request = URLRequest(url: url)
            webView.load(request)
        }
    }

    func loadRemoteHTMLWithJavaScriptAndCSS() {
        if let url = URL(string: "https://hoangsonww.github.io/RecipeGenie-App/") {
            let request = URLRequest(url: url)
            webView.load(request)
        }
    }

    func loadRemoteHTMLWithJavaScriptAndCSSAndCookies() {
        if let url = URL(string: "https://hoangsonww.github.io/RecipeGenie-App/") {
            let request = URLRequest(url: url)
            webView.load(request)
        }
    }

    func loadRemoteHTMLWithJavaScriptAndCSSAndCookiesAndHeaders() {
        if let url = URL(string: "https://hoangsonww.github.io/RecipeGenie-App/") {
            var request = URLRequest(url: url)
            request.setValue("RecipeGenie", forHTTPHeaderField: "User-Agent")
            webView.load(request)
        }
    }

    func loadRemoteHTMLWithJavaScriptAndCSSAndCookiesAndHeadersAndPostData() {
        if let url = URL(string: "https://hoangsonww.github.io/RecipeGenie-App/") {
            var request = URLRequest(url: url)
            request.httpMethod = "POST"
            request.httpBody = "key1=value1&key2=value2".data(using: .utf8)
            webView.load(request)
        }
    }

    func loadRemoteHTMLWithJavaScriptAndCSSAndCookiesAndHeadersAndPostDataAndCustomUserAgent() {
        if let url = URL(string: "https://hoangsonww.github.io/RecipeGenie-App/") {
            var request = URLRequest(url: url)
            request.httpMethod = "POST"
            request.httpBody = "key1=value1&key2=value2".data(using: .utf8)
            request.setValue("RecipeGenie", forHTTPHeaderField: "User-Agent")
            webView.load(request)
        }
    }

    func loadRemoteHTMLWithJavaScriptAndCSSAndCookiesAndHeadersAndPostDataAndCustomUserAgentAndCustomTimeout() {
        if let url = URL(string: "https://hoangsonww.github.io/RecipeGenie-App/") {
            var request = URLRequest(url: url)
            request.httpMethod = "POST"
            request.httpBody = "key1=value1&key2=value2".data(using: .utf8)
            request.setValue("RecipeGenie", forHTTPHeaderField: "User-Agent")
            request.timeoutInterval = 10
            webView.load(request)
        }
    }

    func loadRemoteHTMLWithJavaScriptAndCSSAndCookiesAndHeadersAndPostDataAndCustomUserAgentAndCustomTimeoutAndCustomCachePolicy() {
        if let url = URL(string: "https://hoangsonww.github.io/RecipeGenie-App/") {
            var request = URLRequest(url: url)
            request.httpMethod = "POST"
            request.httpBody = "key1=value1&key2=value2".data(using: .utf8)
            request.setValue("RecipeGenie", forHTTPHeaderField: "User-Agent")
            request.timeoutInterval = 10
            request.cachePolicy = .reloadIgnoringLocalAndRemoteCacheData
            webView.load(request)
        }
    }

    func loadRemoteHTMLWithJavaScriptAndCSSAndCookiesAndHeadersAndPostDataAndCustomUserAgentAndCustomTimeoutAndCustomCachePolicyAndCustomNetworkServiceType() {
        if let url = URL(string: "https://hoangsonww.github.io/RecipeGenie-App/") {
            var request = URLRequest(url: url)
            request.httpMethod = "POST"
            request.httpBody = "key1=value1&key2=value2".data(using: .utf8)
            request.setValue("RecipeGenie", forHTTPHeaderField: "User-Agent")
            request.timeoutInterval = 10
            request.cachePolicy = .reloadIgnoringLocalAndRemoteCacheData
            request.networkServiceType = .responsiveData
            webView.load(request)
        }
    }

    func loadRemoteHTMLWithJavaScriptAndCSSAndCookiesAndHeadersAndPostDataAndCustomUserAgentAndCustomTimeoutAndCustomCachePolicyAndCustomNetworkServiceTypeAndCustomAllowsCellularAccess() {
        if let url = URL(string: "https://hoangsonww.github.io/RecipeGenie-App/") {
            var request = URLRequest(url: url)
            request.httpMethod = "POST"
            request.httpBody = "key1=value1&key2=value2".data(using: .utf8)
            request.setValue("RecipeGenie", forHTTPHeaderField: "User-Agent")
            request.timeoutInterval = 10
            request.cachePolicy = .reloadIgnoringLocalAndRemoteCacheData
            request.networkServiceType = .responsiveData
            request.allowsCellularAccess = true
            webView.load(request)
        }
    }

}
