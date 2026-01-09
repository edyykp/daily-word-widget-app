# iOS Build Fix Instructions

If you're getting errors like "clang dependency scanner failure" or "fatal error module map file not found", follow these steps on your Mac:

## Step 1: Install CocoaPods Dependencies

Open Terminal on your Mac and run:

```bash
cd /path/to/DailyWordWidget/ios
bundle install  # If using bundler
bundle exec pod install
# OR if not using bundler:
pod install
```

## Step 2: Clean Xcode Build

1. Open Xcode
2. Go to **Product > Clean Build Folder** (Shift + Cmd + K)
3. Close Xcode

## Step 3: Remove Derived Data

In Terminal:

```bash
rm -rf ~/Library/Developer/Xcode/DerivedData
```

## Step 4: Add Files to Xcode Project

The Swift files need to be added to the Xcode project:

### Add WidgetModule.swift and WidgetBridge.m:

1. Open `DailyWordWidget.xcodeproj` in Xcode
2. Right-click on the `DailyWordWidget` folder in the Project Navigator
3. Select **Add Files to "DailyWordWidget"...**
4. Navigate to `ios/DailyWordWidget/`
5. Select:
   - `WidgetModule.swift`
   - `WidgetBridge.m`
6. Make sure **"Copy items if needed"** is UNCHECKED (files are already in the right place)
7. Make sure **"Add to targets: DailyWordWidget"** is CHECKED
8. Click **Add**

### Important: WidgetBridge.m Settings

After adding `WidgetBridge.m`:

1. Select `WidgetBridge.m` in Xcode
2. In the File Inspector (right panel), find **Target Membership**
3. Make sure **DailyWordWidget** is checked

## Step 5: Fix Import Issues

If you still see import errors:

1. Select the project in Xcode (top of Project Navigator)
2. Select the **DailyWordWidget** target
3. Go to **Build Settings**
4. Search for **"Swift Compiler - Search Paths"**
5. Make sure **Import Paths** includes:
   - `$(SRCROOT)/../node_modules/react-native/React`
   - `$(SRCROOT)/../node_modules/react-native/ReactCommon`

## Step 6: Widget Extension Setup (Optional - for now)

**Note:** The Widget Extension files are in `ios/DailyWordWidgetExtension/` but they should NOT be added to the main app target. They will be added when you create the Widget Extension target in Xcode (see WIDGET_SETUP.md).

For now, you can ignore the Widget Extension files if you just want to build the main app.

## Step 7: Rebuild

1. In Xcode, go to **Product > Clean Build Folder** (Shift + Cmd + K)
2. Close Xcode
3. Reopen Xcode
4. Build the project (Cmd + B)

## Common Issues

### Issue: "No such module 'React'"

**Solution:** Make sure CocoaPods is installed and `pod install` has been run. The React module comes from CocoaPods.

### Issue: "fatal error module map file not found"

**Solution:**

1. Clean build folder
2. Delete DerivedData
3. Run `pod install` again
4. Rebuild

### Issue: WidgetBridge.m not found

**Solution:** Make sure `WidgetBridge.m` is added to the Xcode project and included in the DailyWordWidget target.

### Issue: Swift/Objective-C Bridging

If you see bridging errors:

1. Select the project in Xcode
2. Select the DailyWordWidget target
3. Go to **Build Settings**
4. Search for **"Objective-C Bridging Header"**
5. If it's empty, you can leave it empty (React Native handles this)

## Alternative: Remove Widget Files Temporarily

If you just want to get the app running first (without widgets):

1. In Xcode, remove `WidgetModule.swift` and `WidgetBridge.m` from the project (right-click > Delete > Remove Reference)
2. Comment out widget-related code in `App.tsx` temporarily
3. Build and run

You can add the widget functionality back later once the basic app is working.
