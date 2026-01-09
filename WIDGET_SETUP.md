# Widget Setup Instructions

This app provides lock screen widgets (iOS) and home screen widgets (Android) that display a daily word with its definition.

## iOS Setup

### 1. Add Widget Extension in Xcode

1. Open the project in Xcode: `ios/DailyWordWidget.xcodeproj`
2. In Xcode, go to **File > New > Target**
3. Select **Widget Extension** and click **Next**
4. Configure:
   - Product Name: `DailyWordWidgetExtension`
   - Language: Swift
   - Include Configuration Intent: No
5. Click **Finish** and **Activate** the scheme

### 2. Configure App Groups

1. Select the main app target (`DailyWordWidget`) in Xcode
2. Go to **Signing & Capabilities**
3. Click **+ Capability** and add **App Groups**
4. Create a new group: `group.com.dailywordwidget`
5. Select the Widget Extension target
6. Add the same App Group capability with the same group name

### 3. Add Widget Files

The widget Swift files are already created in `ios/DailyWordWidgetExtension/`. You need to:

1. In Xcode, right-click on the Widget Extension target
2. Select **Add Files to "DailyWordWidgetExtension"...**
3. Add the following files:
   - `DailyWordWidget.swift`
   - `Info.plist` (if not already added)

### 4. Update Info.plist

Make sure the Widget Extension's `Info.plist` includes:

- `NSExtension` with `NSExtensionPointIdentifier` set to `com.apple.widgetkit-extension`

### 5. Build and Run

1. Select the Widget Extension scheme
2. Build and run on a device or simulator (iOS 16+ for lock screen widgets)

## Android Setup

### 1. Widget Files

The Android widget files are already created:

- `DailyWordWidgetProvider.kt` - Widget provider class
- `daily_word_widget.xml` - Widget layout
- `daily_word_widget_info.xml` - Widget configuration
- `WidgetModule.kt` - React Native bridge module

### 2. Build and Run

1. Run `npm run android` or build from Android Studio
2. The widget will be available in the widget picker

### 3. Add Widget to Home Screen

1. Long press on the home screen
2. Tap **Widgets**
3. Find **Daily Word Widget**
4. Drag it to your home screen

**Note:** Lock screen widgets on Android are limited. Android 12+ supports lock screen widgets, but they're primarily home screen widgets.

## Adding Widget to Lock Screen (iOS)

1. Long press on your lock screen
2. Tap **Customize**
3. Tap the widget area below the time
4. Tap the **+** button
5. Search for **Daily Word Widget**
6. Select the widget size you want
7. Tap **Done**

## Testing

1. Open the app and let it fetch the daily word
2. The widget should automatically update
3. You can manually refresh the word using the "Refresh Word" button in the app
4. The widget will update daily automatically

## Troubleshooting

### iOS Widget Not Showing

- Make sure App Groups are configured correctly
- Check that the Widget Extension target is included in the build
- Verify the widget kind matches in both the extension and the bridge module
- Ensure you're running on iOS 16+ for lock screen widgets

### Android Widget Not Updating

- Check that the widget is properly registered in `AndroidManifest.xml`
- Verify SharedPreferences are being saved correctly
- Check logcat for any errors

### Word Not Updating Daily

- The word updates automatically when the date changes
- You can manually refresh using the app
- Check that the storage service is working correctly
