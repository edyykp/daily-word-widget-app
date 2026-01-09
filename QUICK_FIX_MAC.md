# Quick Fix for Mac Build Errors

## Immediate Steps (Run these on your Mac):

### 1. Install CocoaPods Dependencies

```bash
cd /path/to/DailyWordWidget/ios
pod install
```

If `pod` command is not found:

```bash
sudo gem install cocoapods
pod install
```

### 2. Open Xcode and Add Missing Files

1. Open `DailyWordWidget.xcodeproj` in Xcode
2. In the Project Navigator (left sidebar), find the `DailyWordWidget` folder
3. Right-click on `DailyWordWidget` folder → **Add Files to "DailyWordWidget"...**
4. Navigate to and select:
   - `ios/DailyWordWidget/WidgetModule.swift`
   - `ios/DailyWordWidget/WidgetBridge.m`
5. **IMPORTANT:**
   - UNCHECK "Copy items if needed"
   - CHECK "Add to targets: DailyWordWidget"
6. Click **Add**

### 3. Clean and Rebuild

In Xcode:

- **Product → Clean Build Folder** (Shift + Cmd + K)
- **Product → Build** (Cmd + B)

### 4. If Still Getting Errors

Try this in Terminal:

```bash
cd /path/to/DailyWordWidget/ios
rm -rf Pods Podfile.lock
pod install
```

Then in Xcode:

- Close Xcode
- Delete `~/Library/Developer/Xcode/DerivedData/DailyWordWidget-*`
- Reopen Xcode
- Clean Build Folder again
- Build

## The Error "fatal error module map file not found fctswiftui"

This error usually means:

1. **CocoaPods not installed** - Run `pod install`
2. **Files not in Xcode project** - Add WidgetModule.swift and WidgetBridge.m
3. **Build cache corrupted** - Clean DerivedData

## If You Just Want the App to Run (Skip Widget for Now)

1. In Xcode, remove `WidgetModule.swift` and `WidgetBridge.m` from the project
2. In `App.tsx`, comment out the widget initialization:
   ```typescript
   // useEffect(() => {
   //   const initializeWidget = async () => {
   //     try {
   //       const word = await getCurrentDailyWord();
   //       await updateWidget(word);
   //     } catch (error) {
   //       console.error('Error initializing widget:', error);
   //     }
   //   };
   //   initializeWidget();
   // }, []);
   ```
3. Build and run - the app should work without widgets
