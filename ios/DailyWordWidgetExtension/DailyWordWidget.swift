import WidgetKit
import SwiftUI

struct DailyWordWidget: Widget {
    let kind: String = "DailyWordWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: DailyWordProvider()) { entry in
            DailyWordWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Daily Word")
        .description("Shows a daily word with its definition")
        .supportedFamilies([.accessoryRectangular, .accessoryInline, .systemSmall])
    }
}

struct DailyWordProvider: TimelineProvider {
    func placeholder(in context: Context) -> DailyWordEntry {
        DailyWordEntry(
            date: Date(),
            word: "Hello",
            definition: "a greeting or expression of goodwill"
        )
    }

    func getSnapshot(in context: Context, completion: @escaping (DailyWordEntry) -> ()) {
        let entry = getCurrentEntry()
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        var entries: [DailyWordEntry] = []
        let currentEntry = getCurrentEntry()
        entries.append(currentEntry)
        
        // Schedule next update for tomorrow
        let nextUpdate = Calendar.current.startOfDay(for: Date().addingTimeInterval(86400))
        let timeline = Timeline(entries: entries, policy: .after(nextUpdate))
        completion(timeline)
    }
    
    private func getCurrentEntry() -> DailyWordEntry {
        let sharedDefaults = UserDefaults(suiteName: "group.com.dailywordwidget")
        let word = sharedDefaults?.string(forKey: "word") ?? "Loading..."
        let definition = sharedDefaults?.string(forKey: "definition") ?? "Fetching word..."
        
        return DailyWordEntry(
            date: Date(),
            word: word,
            definition: definition
        )
    }
}

struct DailyWordEntry: TimelineEntry {
    let date: Date
    let word: String
    let definition: String
}

struct DailyWordWidgetEntryView: View {
    var entry: DailyWordProvider.Entry

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(entry.word)
                .font(.headline)
                .fontWeight(.bold)
            Text(entry.definition)
                .font(.caption)
                .lineLimit(2)
        }
        .padding()
    }
}

// Lock screen widget views
struct DailyWordLockScreenRectangularView: View {
    var entry: DailyWordEntry
    
    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text(entry.word)
                    .font(.headline)
                    .fontWeight(.bold)
                Text(entry.definition)
                    .font(.caption)
                    .lineLimit(1)
            }
            Spacer()
        }
        .padding(.horizontal, 8)
        .padding(.vertical, 4)
    }
}

struct DailyWordLockScreenInlineView: View {
    var entry: DailyWordEntry
    
    var body: some View {
        Text("\(entry.word): \(entry.definition)")
            .font(.caption)
    }
}

// Widget bundle
@main
struct DailyWordWidgetBundle: WidgetBundle {
    var body: some Widget {
        DailyWordWidget()
    }
}
