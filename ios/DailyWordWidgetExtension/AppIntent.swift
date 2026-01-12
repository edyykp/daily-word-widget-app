//
//  AppIntent.swift
//  DailyWordWidgetExtension
//
//  Created by Stoica, Eduard-Constantin on 09.01.2026.
//

import AppIntents
import WidgetKit

struct ConfigurationAppIntent: WidgetConfigurationIntent {
    static var title: LocalizedStringResource { "Configuration" }
    static var description: IntentDescription { "This is an example widget." }

    // No configurable emoji parameter anymore — UI uses a language badge and part-of-speech.
}
