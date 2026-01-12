import AVFoundation
import React
import ReactAppDependencyProvider
import React_RCTAppDelegate
import UIKit
import WidgetKit

@main
class AppDelegate: UIResponder, UIApplicationDelegate, AVSpeechSynthesizerDelegate {
  var window: UIWindow?
  var synth: AVSpeechSynthesizer?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "DailyWordWidget",
      in: window,
      launchOptions: launchOptions
    )

    // Configure audio session for TTS playback when opened via widget play action
    do {
      try AVAudioSession.sharedInstance().setCategory(.playback, mode: .default, options: [])
      try AVAudioSession.sharedInstance().setActive(true)
    } catch {
      print("Failed to configure audio session: \(error)")
    }

    return true
  }

  // Handle custom URL scheme for play action: dailywordwidget://play?phonetic=...&action=play|stop
  func application(
    _ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]
  ) -> Bool {
    print("AppDelegate: open url called -> \(url.absoluteString)")
    guard url.scheme == "dailywordwidget" else { return false }
    if url.host == "play" {
      if let comps = URLComponents(url: url, resolvingAgainstBaseURL: false) {
        // Prefer phonetic, fallback to word text
        let phonetic = comps.queryItems?.first(where: { $0.name == "phonetic" })?.value ?? ""
        let wordText = comps.queryItems?.first(where: { $0.name == "word" })?.value ?? ""
        let action = comps.queryItems?.first(where: { $0.name == "action" })?.value ?? "play"
        let textToSpeak = phonetic.isEmpty ? wordText : phonetic

        print("AppDelegate: action=\(action), textToSpeak=\(textToSpeak)")

        // Ensure audio session is active
        do {
          try AVAudioSession.sharedInstance().setCategory(.playback, mode: .default, options: [])
          try AVAudioSession.sharedInstance().setActive(true)
        } catch {
          print("Failed to activate audio session in open url: \(error)")
        }

        let shared = UserDefaults(suiteName: "group.com.dailywordwidget")

        if action == "stop" {
          // Stop any current speaking
          synth?.stopSpeaking(at: .immediate)
          synth = nil
          shared?.set(false, forKey: "isPlaying")
          if #available(iOS 14.0, *) {
            WidgetCenter.shared.reloadTimelines(ofKind: "DailyWordWidget")
            WidgetCenter.shared.reloadTimelines(ofKind: "DailyWordWidgetExtension")
          }
          return true
        }

        if !textToSpeak.isEmpty {
          // Sleep state: set isPlaying flag and start speaking with delegate
          shared?.set(true, forKey: "isPlaying")
          shared?.synchronize()
          if #available(iOS 14.0, *) {
            WidgetCenter.shared.reloadTimelines(ofKind: "DailyWordWidget")
            WidgetCenter.shared.reloadTimelines(ofKind: "DailyWordWidgetExtension")
          }

          // Speak via AVSpeechSynthesizer
          let utterance = AVSpeechUtterance(string: textToSpeak)
          utterance.rate = AVSpeechUtteranceDefaultSpeechRate
          let s = AVSpeechSynthesizer()
          s.delegate = self
          s.speak(utterance)
          synth = s
          return true
        } else {
          print("AppDelegate: play url missing both phonetic and word")
        }
      }
    }
    return false
  }

  // AVSpeechSynthesizerDelegate
  func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didFinish utterance: AVSpeechUtterance)
  {
    print("AppDelegate: TTS finished")
    let shared = UserDefaults(suiteName: "group.com.dailywordwidget")
    shared?.set(false, forKey: "isPlaying")
    shared?.synchronize()
    if #available(iOS 14.0, *) {
      WidgetCenter.shared.reloadTimelines(ofKind: "DailyWordWidget")
      WidgetCenter.shared.reloadTimelines(ofKind: "DailyWordWidgetExtension")
    }
    synth = nil
  }

  func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didCancel utterance: AVSpeechUtterance)
  {
    print("AppDelegate: TTS cancelled")
    let shared = UserDefaults(suiteName: "group.com.dailywordwidget")
    shared?.set(false, forKey: "isPlaying")
    shared?.synchronize()
    if #available(iOS 14.0, *) {
      WidgetCenter.shared.reloadTimelines(ofKind: "DailyWordWidget")
      WidgetCenter.shared.reloadTimelines(ofKind: "DailyWordWidgetExtension")
    }
    synth = nil
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
    #if DEBUG
      RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
    #else
      Bundle.main.url(forResource: "main", withExtension: "jsbundle")
    #endif
  }
}
