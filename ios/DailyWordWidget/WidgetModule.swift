import Foundation
import React
import WidgetKit

@objc(WidgetModule)
class WidgetModule: NSObject, RCTBridgeModule {
  
  static func moduleName() -> String! {
    return "WidgetModule"
  }
  
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
  
  @objc
  func updateWidget(_ data: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      // Save data to UserDefaults with App Group
      let sharedDefaults = UserDefaults(suiteName: "group.com.dailywordwidget")
      
      sharedDefaults?.set(data["word"] as? String ?? "", forKey: "word")
      sharedDefaults?.set(data["definition"] as? String ?? "", forKey: "definition")
      sharedDefaults?.set(data["phonetic"] as? String ?? "", forKey: "phonetic")
      sharedDefaults?.set(data["partOfSpeech"] as? String ?? "", forKey: "partOfSpeech")
      sharedDefaults?.set(data["example"] as? String ?? "", forKey: "example")
      sharedDefaults?.set(data["date"] as? String ?? "", forKey: "date")
      sharedDefaults?.synchronize()
      
      // Reload widget timeline
      if #available(iOS 14.0, *) {
        WidgetCenter.shared.reloadTimelines(ofKind: "DailyWordWidget")
      }
      
      resolve(nil)
    }
  }
  
  @objc
  func reloadWidget(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      if #available(iOS 14.0, *) {
        WidgetCenter.shared.reloadTimelines(ofKind: "DailyWordWidget")
      }
      resolve(nil)
    }
  }
}
