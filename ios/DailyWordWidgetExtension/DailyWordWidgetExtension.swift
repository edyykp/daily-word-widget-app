//
//  DailyWordWidgetExtension.swift
//  DailyWordWidgetExtension
//
//  Created by Stoica, Eduard-Constantin on 09.01.2026.
//

import AppIntents
import SwiftUI
import WidgetKit

struct Provider: AppIntentTimelineProvider {
    func placeholder(in context: Context) -> SimpleEntry {
        // Provide a rich placeholder with phonetic and definition
        loadSharedEntry(configuration: ConfigurationAppIntent())
    }

    func snapshot(for configuration: ConfigurationAppIntent, in context: Context) async
        -> SimpleEntry
    {
        loadSharedEntry(configuration: configuration)
    }

    func timeline(for configuration: ConfigurationAppIntent, in context: Context) async -> Timeline<
        SimpleEntry
    > {
        var entries: [SimpleEntry] = []

        // Generate a timeline consisting of five entries an hour apart, starting from the current date.
        let currentDate = Date()
        for hourOffset in 0..<5 {
            let entryDate = Calendar.current.date(
                byAdding: .hour, value: hourOffset, to: currentDate)!
            // Each timeline entry uses the shared UserDefaults data so widgets update when the app writes new data
            let sharedEntry = loadSharedEntry(configuration: configuration)
            let entry = SimpleEntry(
                date: entryDate,
                configuration: configuration,
                word: sharedEntry.word,
                definition: sharedEntry.definition,
                phonetic: sharedEntry.phonetic,
                partOfSpeech: sharedEntry.partOfSpeech,
                language: sharedEntry.language,
                isPlaying: sharedEntry.isPlaying)
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

    // New fields passed through UserDefaults (App Group)
    let word: String
    let definition: String
    let phonetic: String
    let partOfSpeech: String
    let language: String
    let isPlaying: Bool
}

// Helper: load current widget data from shared UserDefaults
private func loadSharedEntry(configuration: ConfigurationAppIntent) -> SimpleEntry {
    let shared = UserDefaults(suiteName: "group.com.dailywordwidget")
    let word = shared?.string(forKey: "word") ?? "Serendipity"
    let definition =
        shared?.string(forKey: "definition")
        ?? "The occurrence and development of events by chance in a happy or beneficial way."
    let phonetic = shared?.string(forKey: "phonetic") ?? "/ˌsɛrənˈdɪpɪti/"
    let partOfSpeech = shared?.string(forKey: "partOfSpeech") ?? "noun"
    let language = shared?.string(forKey: "language") ?? "en"
    let isPlaying = shared?.bool(forKey: "isPlaying") ?? false
    return SimpleEntry(
        date: Date(), configuration: configuration, word: word, definition: definition,
        phonetic: phonetic, partOfSpeech: partOfSpeech, language: language, isPlaying: isPlaying)
}

struct DailyWordWidgetExtensionEntryView: View {
    var entry: Provider.Entry
    @Environment(\.widgetFamily) private var family: WidgetFamily

    // Placeholder sample data until widget plumbing supplies real words
    private var sampleWord: String { "Serendipity" }
    private var sampleDefinition: String {
        "The occurrence and development of events by chance in a happy or beneficial way."
    }
    private var samplePhonetic: String { "/ˌsɛrənˈdɪpɪti/" }

    @ViewBuilder
    private var content: some View {
        switch family {
        case .systemSmall:
            VStack(alignment: .leading, spacing: 6) {
                // Word + phonetic on the first line
                HStack(alignment: .firstTextBaseline) {
                    VStack(alignment: .leading, spacing: 2) {
                        Text(entry.word.isEmpty ? sampleWord : entry.word)
                            .font(.headline)
                            .fontWeight(.semibold)
                            .foregroundColor(Color.black)
                            .lineLimit(1)

                        Text(entry.phonetic.isEmpty ? samplePhonetic : entry.phonetic)
                            .font(.caption2)
                            .italic()
                            .foregroundColor(Color.black.opacity(0.85))
                            .lineLimit(1)
                    }

                    Spacer()

                    // small decorative accent — language badge + play action
                    VStack(spacing: 6) {
                        RoundedRectangle(cornerRadius: 6)
                            .fill(Color.black.opacity(0.06))
                            .frame(width: 36, height: 36)
                            .overlay(
                                Text(entry.language.uppercased())
                                    .font(.caption2)
                                    .foregroundColor(Color.black)
                            )

                    }
                }

                Text(entry.definition.isEmpty ? sampleDefinition : entry.definition)
                    .font(.caption)
                    .foregroundColor(Color.black.opacity(0.85))
                    .lineLimit(2)
            }

        case .systemMedium:
            HStack(spacing: 12) {
                VStack(alignment: .leading, spacing: 6) {
                    Text(entry.word.isEmpty ? sampleWord : entry.word)
                        .font(.title2)
                        .fontWeight(.bold)
                        .foregroundColor(Color.black)

                    Text(entry.phonetic.isEmpty ? samplePhonetic : entry.phonetic)
                        .font(.subheadline)
                        .italic()
                        .foregroundColor(Color.black.opacity(0.9))

                    Text(entry.definition.isEmpty ? sampleDefinition : entry.definition)
                        .font(.subheadline)
                        .foregroundColor(Color.black.opacity(0.9))
                        .lineLimit(3)
                }

                Spacer()

                VStack(alignment: .center, spacing: 6) {
                    // Part of speech badge
                    Text(entry.partOfSpeech.capitalized)
                        .font(.caption)
                        .fontWeight(.semibold)
                        .padding(.vertical, 6)
                        .padding(.horizontal, 10)
                        .background(Color.black.opacity(0.08))
                        .clipShape(RoundedRectangle(cornerRadius: 12))
                        .foregroundColor(Color.black)

                }
            }

        default:  // large and accessory families
            VStack(alignment: .leading, spacing: 12) {
                HStack(alignment: .top) {
                    VStack(alignment: .leading, spacing: 6) {
                        Text(entry.word.isEmpty ? sampleWord : entry.word)
                            .font(.title)
                            .fontWeight(.heavy)
                            .foregroundColor(Color.black)

                        Text(entry.phonetic.isEmpty ? samplePhonetic : entry.phonetic)
                            .font(.subheadline)
                            .italic()
                            .foregroundColor(Color.black.opacity(0.9))

                        Text(entry.definition.isEmpty ? sampleDefinition : entry.definition)
                            .font(.body)
                            .foregroundColor(Color.black.opacity(0.9))
                            .lineLimit(4)
                    }

                    Spacer()

                    // Language badge + play action
                    VStack(spacing: 10) {
                        Text(entry.language.uppercased())
                            .font(.system(size: 18))
                            .padding(10)
                            .background(Color.black.opacity(0.06))
                            .clipShape(Circle())
                            .foregroundColor(Color.black)

                    }
                }

                HStack {
                    Spacer()
                    Text(entry.date, style: .time)
                        .font(.caption2)
                        .foregroundColor(Color.black.opacity(0.75))
                }
            }
        }
    }

    var body: some View {
        content
    }
}

struct DailyWordWidgetExtension: Widget {
    let kind: String = "DailyWordWidgetExtension"

    var body: some WidgetConfiguration {
        AppIntentConfiguration(
            kind: kind, intent: ConfigurationAppIntent.self, provider: Provider()
        ) { entry in
            DailyWordWidgetExtensionEntryView(entry: entry)
                .containerBackground(.fill.tertiary, for: .widget)
        }
    }
}

extension ConfigurationAppIntent {
    fileprivate static var sample1: ConfigurationAppIntent {
        ConfigurationAppIntent()
    }

    fileprivate static var sample2: ConfigurationAppIntent {
        ConfigurationAppIntent()
    }
}

// AppIntents to play and stop phonetic without opening the host app

// Previews
#Preview(as: .systemSmall) {
    DailyWordWidgetExtension()
} timeline: {
    SimpleEntry(
        date: .now, configuration: .sample1, word: "Serendipity",
        definition:
            "The occurrence and development of events by chance in a happy or beneficial way.",
        phonetic: "/ˌsɛrənˈdɪpɪti/", partOfSpeech: "noun", language: "en", isPlaying: false)
    SimpleEntry(
        date: .now, configuration: .sample2, word: "Ephemeral",
        definition: "Lasting for a very short time.", phonetic: "/ɪˈfɛmərəl/", partOfSpeech: "adj",
        language: "en", isPlaying: false)
}
