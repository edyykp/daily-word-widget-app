//
//  DailyWordWidgetExtension.swift
//  DailyWordWidgetExtension
//
//  Created by Stoica, Eduard-Constantin on 09.01.2026.
//

import WidgetKit
import SwiftUI

struct Provider: AppIntentTimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), configuration: ConfigurationAppIntent())
    }

    func snapshot(for configuration: ConfigurationAppIntent, in context: Context) async -> SimpleEntry {
        SimpleEntry(date: Date(), configuration: configuration)
    }
    
    func timeline(for configuration: ConfigurationAppIntent, in context: Context) async -> Timeline<SimpleEntry> {
        var entries: [SimpleEntry] = []

        // Generate a timeline consisting of five entries an hour apart, starting from the current date.
        let currentDate = Date()
        for hourOffset in 0 ..< 5 {
            let entryDate = Calendar.current.date(byAdding: .hour, value: hourOffset, to: currentDate)!
            let entry = SimpleEntry(date: entryDate, configuration: configuration)
            entries.append(entry)
        }

        return Timeline(entries: entries, policy: .atEnd)
    }

//    func relevances() async -> WidgetRelevances<ConfigurationAppIntent> {
//        // Generate a list containing the contexts this widget is relevant in.
//    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let configuration: ConfigurationAppIntent
}

struct DailyWordWidgetExtensionEntryView : View {
    var entry: Provider.Entry
    @Environment(\._widgetFamily) private var family

    // Placeholder sample data until widget plumbing supplies real words
    private var sampleWord: String { "Serendipity" }
    private var sampleDefinition: String { "The occurrence and development of events by chance in a happy or beneficial way." }

    var body: some View {
        ZStack {
            // soft gradient background
            LinearGradient(
                colors: [Color(red: 0.09, green: 0.38, blue: 0.75), Color(red: 0.35, green: 0.71, blue: 0.92)],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )

            // content
            content
                .padding(16)
        }
        .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
        .containerBackground(.fill.tertiary, for: .widget)
    }

    @ViewBuilder
    private var content: some View {
        switch family {
        case .systemSmall:
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    Text(sampleWord)
                        .font(.headline)
                        .fontWeight(.semibold)
                        .foregroundColor(.white)
                        .lineLimit(1)
                    Spacer()
                    Text(entry.configuration.favoriteEmoji)
                        .font(.title2)
                }

                Text(sampleDefinition)
                    .font(.caption)
                    .foregroundColor(Color.white.opacity(0.9))
                    .lineLimit(2)
            }

        case .systemMedium:
            HStack(spacing: 12) {
                VStack(alignment: .leading, spacing: 8) {
                    Text(sampleWord)
                        .font(.title2)
                        .fontWeight(.bold)
                        .foregroundColor(.white)

                    Text(sampleDefinition)
                        .font(.subheadline)
                        .foregroundColor(Color.white.opacity(0.95))
                        .lineLimit(3)
                }

                Spacer()

                VStack {
                    Text(entry.configuration.favoriteEmoji)
                        .font(.largeTitle)
                        .padding(8)
                        .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 12))
                }
            }

        default: // large and accessory families
            VStack(alignment: .leading, spacing: 12) {
                HStack(alignment: .top) {
                    VStack(alignment: .leading, spacing: 6) {
                        Text(sampleWord)
                            .font(.title)
                            .fontWeight(.heavy)
                            .foregroundColor(.white)

                        Text(sampleDefinition)
                            .font(.body)
                            .foregroundColor(Color.white.opacity(0.95))
                            .lineLimit(4)
                    }

                    Spacer()

                    Text(entry.configuration.favoriteEmoji)
                        .font(.system(size: 44))
                }

                HStack {
                    Spacer()
                    Text(entry.date, style: .time)
                        .font(.caption2)
                        .foregroundColor(Color.white.opacity(0.8))
                }
            }
        }
    }
}

struct DailyWordWidgetExtension: Widget {
    let kind: String = "DailyWordWidgetExtension"

    var body: some WidgetConfiguration {
        AppIntentConfiguration(kind: kind, intent: ConfigurationAppIntent.self, provider: Provider()) { entry in
            DailyWordWidgetExtensionEntryView(entry: entry)
                .containerBackground(.fill.tertiary, for: .widget)
        }
    }
}

extension ConfigurationAppIntent {
    fileprivate static var smiley: ConfigurationAppIntent {
        let intent = ConfigurationAppIntent()
        intent.favoriteEmoji = "😀"
        return intent
    }
    
    fileprivate static var starEyes: ConfigurationAppIntent {
        let intent = ConfigurationAppIntent()
        intent.favoriteEmoji = "🤩"
        return intent
    }
}

#Preview(as: .systemSmall) {
    DailyWordWidgetExtension()
} timeline: {
    SimpleEntry(date: .now, configuration: .smiley)
    SimpleEntry(date: .now, configuration: .starEyes)
}
