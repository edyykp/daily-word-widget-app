# Fix: "Unable to find module dependency React" Error

This error occurs when Xcode can't find the React Native modules. Follow these steps **on your Mac**:

## Step 1: Verify You're Opening the Workspace

**CRITICAL**: You must open `DailyWordWidget.xcworkspace`, NOT `DailyWordWidget.xcodeproj`

```bash
cd /path/to/DailyWordWidget/ios
open DailyWordWidget.xcworkspace
```

If you opened `.xcodeproj` instead, close it and open `.xcworkspace`.

## Step 2: Clean Everything

In Terminal on your Mac:

```bash
cd /path/to/DailyWordWidget/ios

# Remove Pods and lock file
rm -rf Pods Podfile.lock

# Remove Xcode derived data
rm -rf ~/Library/Developer/Xcode/DerivedData/DailyWordWidget-*

# Remove build folder
rm -rf build
```

## Step 3: Reinstall CocoaPods Dependencies

```bash
cd /path/to/DailyWordWidget/ios

# Make sure CocoaPods is installed
pod --version

# If not installed:
sudo gem install cocoapods

# Install dependencies
pod install
```

**Important**: Wait for `pod install` to complete. It should show:

```
Pod installation complete! There are X dependencies from the Podfile.
```

## Step 4: Verify Pods Directory Exists

After `pod install`, check:

```bash
ls -la Pods/
```

You should see directories like:

- `React-Core/`
- `React-RCTAppDelegate/`
- `ReactAppDependencyProvider/`
- etc.

## Step 5: Open Workspace in Xcode

```bash
open DailyWordWidget.xcworkspace
```

## Step 6: Check Build Settings

In Xcode:

1. Select the **DailyWordWidget** project (blue icon at top)
2. Select the **DailyWordWidget** target
3. Go to **Build Settings** tab
4. Search for **"Framework Search Paths"**
5. Verify it includes:

   - `$(inherited)`
   - `"${PODS_CONFIGURATION_BUILD_DIR}/React-Core"` (or similar)
   - `"${PODS_ROOT}/Headers/Public"`

6. Search for **"Header Search Paths"**
7. Verify it includes:
   - `$(inherited)`
   - `"${PODS_ROOT}/Headers/Public"`

## Step 7: Clean and Rebuild

1. In Xcode: **Product → Clean Build Folder** (Shift + Cmd + K)
2. Close Xcode completely
3. Reopen `DailyWordWidget.xcworkspace`
4. **Product → Build** (Cmd + B)

## Step 8: If Still Not Working - Check Scheme

1. In Xcode, click on the scheme dropdown (next to the play/stop buttons)
2. Select **Edit Scheme...**
3. Go to **Build** tab
4. Make sure **DailyWordWidget** is checked and at the top
5. Make sure **Pods-DailyWordWidget** is also checked

## Step 9: Alternative - Use use_frameworks!

If the above doesn't work, try modifying the Podfile:

Edit `ios/Podfile` and change:

```ruby
# Change this:
linkage = ENV['USE_FRAMEWORKS']
if linkage != nil
  Pod::UI.puts "Configuring Pod with #{linkage}ally linked Frameworks".green
  use_frameworks! :linkage => linkage.to_sym
end

# To this (force static frameworks):
use_frameworks! :linkage => :static
```

Then run `pod install` again.

## Step 10: Nuclear Option - Complete Reset

If nothing works:

```bash
cd /path/to/DailyWordWidget/ios

# Remove everything
rm -rf Pods Podfile.lock build
rm -rf ~/Library/Developer/Xcode/DerivedData/DailyWordWidget-*
rm -rf ~/Library/Caches/CocoaPods

# Clear CocoaPods cache
pod cache clean --all

# Reinstall
pod install --repo-update

# Open workspace
open DailyWordWidget.xcworkspace
```

## Common Mistakes

1. ❌ Opening `.xcodeproj` instead of `.xcworkspace`
2. ❌ Running `pod install` in wrong directory
3. ❌ Not waiting for `pod install` to finish
4. ❌ Building before pods are installed
5. ❌ Having old DerivedData cached

## Verify It's Working

After following the steps, in Xcode:

- The imports in `AppDelegate.swift` should not show red errors
- You should be able to build (Cmd + B) without module errors
- The Pods project should appear in the Project Navigator

## Still Having Issues?

Check the `pod install` output for errors. Common issues:

- Node.js not found (needed for React Native pods)
- Ruby/CocoaPods version issues
- Network issues downloading pods

Run `pod install --verbose` to see detailed output.
