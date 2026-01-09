//
//  DailyWordWidgetExtensionLiveActivity.swift
//  DailyWordWidgetExtension
//
//  Created by Stoica, Eduard-Constantin on 09.01.2026.
//

import ActivityKit
import WidgetKit
import SwiftUI

struct DailyWordWidgetExtensionAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        // Dynamic stateful properties about your activity go here!
        var emoji: String
    }

    // Fixed non-changing properties about your activity go here!
    var name: String
}

struct DailyWordWidgetExtensionLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: DailyWordWidgetExtensionAttributes.self) { context in
            // Lock screen/banner UI goes here
            VStack {
                Text("Hello \(context.state.emoji)")
            }
            .activityBackgroundTint(Color.cyan)
            .activitySystemActionForegroundColor(Color.black)

        } dynamicIsland: { context in
            DynamicIsland {
                // Expanded UI goes here.  Compose the expanded UI through
                // various regions, like leading/trailing/center/bottom
                DynamicIslandExpandedRegion(.leading) {
                    Text("Leading")
                }
                DynamicIslandExpandedRegion(.trailing) {
                    Text("Trailing")
                }
                DynamicIslandExpandedRegion(.bottom) {
                    Text("Bottom \(context.state.emoji)")
                    // more content
                }
            } compactLeading: {
                Text("L")
            } compactTrailing: {
                Text("T \(context.state.emoji)")
            } minimal: {
                Text(context.state.emoji)
            }
            .widgetURL(URL(string: "http://www.apple.com"))
            .keylineTint(Color.red)
        }
    }
}

extension DailyWordWidgetExtensionAttributes {
    fileprivate static var preview: DailyWordWidgetExtensionAttributes {
        DailyWordWidgetExtensionAttributes(name: "World")
    }
}

extension DailyWordWidgetExtensionAttributes.ContentState {
    fileprivate static var smiley: DailyWordWidgetExtensionAttributes.ContentState {
        DailyWordWidgetExtensionAttributes.ContentState(emoji: "😀")
     }
     
     fileprivate static var starEyes: DailyWordWidgetExtensionAttributes.ContentState {
         DailyWordWidgetExtensionAttributes.ContentState(emoji: "🤩")
     }
}

#Preview("Notification", as: .content, using: DailyWordWidgetExtensionAttributes.preview) {
   DailyWordWidgetExtensionLiveActivity()
} contentStates: {
    DailyWordWidgetExtensionAttributes.ContentState.smiley
    DailyWordWidgetExtensionAttributes.ContentState.starEyes
}
