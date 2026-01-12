//
//  DailyWordWidgetExtensionLiveActivity.swift
//  DailyWordWidgetExtension
//
//  Created by Stoica, Eduard-Constantin on 09.01.2026.
//

import ActivityKit
import SwiftUI
import WidgetKit

struct DailyWordWidgetExtensionAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        // Dynamic stateful properties about your activity go here!
        var word: String
        var phonetic: String
        var definition: String
    }

    // Fixed non-changing properties about your activity go here!
    var name: String
}

struct DailyWordWidgetExtensionLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: DailyWordWidgetExtensionAttributes.self) { context in
            // Lock screen/banner UI goes here
            VStack(alignment: .leading, spacing: 6) {
                Text(context.state.word)
                    .font(.headline)
                    .fontWeight(.semibold)
                Text(context.state.phonetic)
                    .font(.subheadline)
                    .italic()
                    .foregroundColor(.secondary)
                Text(context.state.definition)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .lineLimit(2)
            }
            .activityBackgroundTint(Color.cyan)
            .activitySystemActionForegroundColor(Color.black)

        } dynamicIsland: { context in
            DynamicIsland {
                // Expanded UI goes here.  Compose the expanded UI through
                // various regions, like leading/trailing/center/bottom
                DynamicIslandExpandedRegion(.leading) {
                    Text(context.state.word)
                        .font(.headline)
                }
                DynamicIslandExpandedRegion(.trailing) {
                    Text(context.state.phonetic)
                }
                DynamicIslandExpandedRegion(.bottom) {
                    Text(context.state.definition)
                        .lineLimit(2)
                    // more content
                }
            } compactLeading: {
                Text(context.state.word)
            } compactTrailing: {
                Text(context.state.phonetic)
            } minimal: {
                Text(context.state.word)
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
    fileprivate static var sample1: DailyWordWidgetExtensionAttributes.ContentState {
        DailyWordWidgetExtensionAttributes.ContentState(
            word: "Serendipity", phonetic: "/ˌsɛrənˈdɪpɪti/",
            definition:
                "The occurrence and development of events by chance in a happy or beneficial way.")
    }

    fileprivate static var sample2: DailyWordWidgetExtensionAttributes.ContentState {
        DailyWordWidgetExtensionAttributes.ContentState(
            word: "Ephemeral", phonetic: "/ɪˈfɛmərəl/", definition: "Lasting for a very short time."
        )
    }
}
