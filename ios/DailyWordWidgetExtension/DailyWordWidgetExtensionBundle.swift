//
//  DailyWordWidgetExtensionBundle.swift
//  DailyWordWidgetExtension
//
//  Created by Stoica, Eduard-Constantin on 09.01.2026.
//

import WidgetKit
import SwiftUI

@main
struct DailyWordWidgetExtensionBundle: WidgetBundle {
    var body: some Widget {
        DailyWordWidgetExtension()
        DailyWordWidgetExtensionControl()
        DailyWordWidgetExtensionLiveActivity()
    }
}
