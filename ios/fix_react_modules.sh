#!/bin/bash

# Script to fix "Unable to find module dependency React" error
# Run this on your Mac in the ios directory

echo "🔧 Fixing React Native module dependencies..."
echo ""

# Check if we're in the ios directory
if [ ! -f "Podfile" ]; then
    echo "❌ Error: Podfile not found. Please run this script from the ios directory."
    exit 1
fi

echo "1️⃣  Cleaning old build artifacts..."
rm -rf Pods Podfile.lock
rm -rf build
rm -rf ~/Library/Developer/Xcode/DerivedData/DailyWordWidget-*

echo "2️⃣  Checking CocoaPods installation..."
if ! command -v pod &> /dev/null; then
    echo "❌ CocoaPods not found. Installing..."
    sudo gem install cocoapods
else
    echo "✅ CocoaPods found: $(pod --version)"
fi

echo "3️⃣  Installing CocoaPods dependencies..."
pod install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Pod installation complete!"
    echo ""
    echo "4️⃣  Verifying Pods directory..."
    if [ -d "Pods" ]; then
        echo "✅ Pods directory exists"
        echo ""
        echo "5️⃣  Opening workspace..."
        echo "⚠️  IMPORTANT: Make sure you open DailyWordWidget.xcworkspace, NOT .xcodeproj"
        open DailyWordWidget.xcworkspace
        echo ""
        echo "✅ Done! The workspace should now open in Xcode."
        echo ""
        echo "Next steps in Xcode:"
        echo "  1. Product → Clean Build Folder (Shift + Cmd + K)"
        echo "  2. Product → Build (Cmd + B)"
    else
        echo "❌ Error: Pods directory was not created. Check the pod install output above."
        exit 1
    fi
else
    echo "❌ Error: pod install failed. Check the error messages above."
    exit 1
fi
