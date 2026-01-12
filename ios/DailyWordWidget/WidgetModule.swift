import AVFoundation
import Foundation
import React
import WidgetKit

@objc(WidgetModule)
class WidgetModule: NSObject, AVSpeechSynthesizerDelegate {

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }

  @objc
  func updateWidget(
    _ data: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    DispatchQueue.main.async {
      // Save data to UserDefaults with App Group
      let sharedDefaults = UserDefaults(suiteName: "group.com.dailywordwidget")

      sharedDefaults?.set(data["word"] as? String ?? "", forKey: "word")
      sharedDefaults?.set(data["definition"] as? String ?? "", forKey: "definition")
      sharedDefaults?.set(data["phonetic"] as? String ?? "", forKey: "phonetic")
      sharedDefaults?.set(data["partOfSpeech"] as? String ?? "", forKey: "partOfSpeech")
      sharedDefaults?.set(data["example"] as? String ?? "", forKey: "example")
      sharedDefaults?.set(data["date"] as? String ?? "", forKey: "date")
      sharedDefaults?.set(data["language"] as? String ?? "en", forKey: "language")
      sharedDefaults?.synchronize()

      // Reload widget timelines (app widget and extension widget kinds)
      if #available(iOS 14.0, *) {
        WidgetCenter.shared.reloadTimelines(ofKind: "DailyWordWidget")
        WidgetCenter.shared.reloadTimelines(ofKind: "DailyWordWidgetExtension")
      }

      resolve(nil)
    }
  }

  @objc
  func reloadWidget(
    _ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    DispatchQueue.main.async {
      if #available(iOS 14.0, *) {
        WidgetCenter.shared.reloadTimelines(ofKind: "DailyWordWidget")
        WidgetCenter.shared.reloadTimelines(ofKind: "DailyWordWidgetExtension")
      }
      resolve(nil)
    }
  }

  // Play phonetic via native TTS (promise resolves when finished)
  private var synth: AVSpeechSynthesizer?
  private var pendingResolve: RCTPromiseResolveBlock?
  private var pendingReject: RCTPromiseRejectBlock?

  @objc
  func playPhonetic(
    _ phonetic: NSString, resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    DispatchQueue.main.async {
      let text = phonetic as String
      guard !text.isEmpty else {
        resolve(nil)
        return
      }

      // Mark playing in shared defaults and reload widget timelines
      let sharedDefaults = UserDefaults(suiteName: "group.com.dailywordwidget")
      sharedDefaults?.set(true, forKey: "isPlaying")
      sharedDefaults?.synchronize()
      if #available(iOS 14.0, *) {
        WidgetCenter.shared.reloadTimelines(ofKind: "DailyWordWidget")
        WidgetCenter.shared.reloadTimelines(ofKind: "DailyWordWidgetExtension")
      }

      self.pendingResolve = resolve
      self.pendingReject = reject

      let utterance = AVSpeechUtterance(string: text)
      utterance.rate = AVSpeechUtteranceDefaultSpeechRate
      let s = AVSpeechSynthesizer()
      s.delegate = self
      s.speak(utterance)
      self.synth = s
    }
  }

  // AVSpeechSynthesizerDelegate
  func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didFinish utterance: AVSpeechUtterance)
  {
    print("WidgetModule: TTS finished")
    let sharedDefaults = UserDefaults(suiteName: "group.com.dailywordwidget")
    sharedDefaults?.set(false, forKey: "isPlaying")
    sharedDefaults?.synchronize()
    if #available(iOS 14.0, *) {
      WidgetCenter.shared.reloadTimelines(ofKind: "DailyWordWidget")
      WidgetCenter.shared.reloadTimelines(ofKind: "DailyWordWidgetExtension")
    }
    self.synth = nil
    self.pendingResolve?(nil)
    self.pendingResolve = nil
    self.pendingReject = nil
  }

  func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didCancel utterance: AVSpeechUtterance)
  {
    print("WidgetModule: TTS cancelled")
    let sharedDefaults = UserDefaults(suiteName: "group.com.dailywordwidget")
    sharedDefaults?.set(false, forKey: "isPlaying")
    sharedDefaults?.synchronize()
    if #available(iOS 14.0, *) {
      WidgetCenter.shared.reloadTimelines(ofKind: "DailyWordWidget")
      WidgetCenter.shared.reloadTimelines(ofKind: "DailyWordWidgetExtension")
    }
    self.synth = nil
    self.pendingResolve?(nil)
    self.pendingResolve = nil
    self.pendingReject = nil
  }

  @objc
  func stopPhonetic(
    _ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    DispatchQueue.main.async {
      self.synth?.stopSpeaking(at: .immediate)
      let sharedDefaults = UserDefaults(suiteName: "group.com.dailywordwidget")
      sharedDefaults?.set(false, forKey: "isPlaying")
      sharedDefaults?.synchronize()
      if #available(iOS 14.0, *) {
        WidgetCenter.shared.reloadTimelines(ofKind: "DailyWordWidget")
        WidgetCenter.shared.reloadTimelines(ofKind: "DailyWordWidgetExtension")
      }
      self.synth = nil
      resolve(nil)
    }
  }

  @objc
  func getIsPlaying(
    _ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    DispatchQueue.main.async {
      let sharedDefaults = UserDefaults(suiteName: "group.com.dailywordwidget")
      let val = sharedDefaults?.bool(forKey: "isPlaying") ?? false
      resolve(val)
    }
  }
}
