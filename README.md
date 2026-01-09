# Daily Word Widget

A React Native app that displays a daily random word from the English dictionary with its definition. The app provides lock screen widgets (iOS) and home screen widgets (Android) that update automatically each day.

## Features

- 📱 **Daily Word**: Get a new random word with definition every day
- 🔄 **Auto-Update**: Words automatically refresh daily
- 📲 **Widgets**: Lock screen widgets (iOS) and home screen widgets (Android)
- 💾 **Offline Support**: Words are cached locally for offline viewing
- 🎨 **Clean UI**: Modern, user-friendly interface

## Widget Setup

For detailed widget setup instructions, see [WIDGET_SETUP.md](./WIDGET_SETUP.md).

### Quick Setup

**iOS:**

1. Add Widget Extension in Xcode (see WIDGET_SETUP.md for details)
2. Configure App Groups: `group.com.dailywordwidget`
3. Build and run on iOS 16+ device

**Android:**

1. Build and run the app
2. Long press home screen → Widgets → Add "Daily Word Widget"

This is a [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Development Tools

This project is configured with the following development tools:

## Code Quality

- **ESLint**: Configured with React Native, TypeScript, and React Hooks rules
- **Prettier**: Code formatter with consistent style
- **TypeScript**: Type checking and enhanced developer experience

## Available Scripts

- `npm start` - Start Metro bundler
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint and auto-fix issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking
- `npm test` - Run tests

## Git Hooks

This project uses **Husky** and **lint-staged** to automatically:

- Run ESLint and Prettier on staged files before commits
- Ensure code quality and consistency

## Configuration Files

- `.eslintrc.js` - ESLint configuration
- `.prettierrc.js` - Prettier configuration
- `.prettierignore` - Files to ignore for Prettier
- `.eslintignore` - Files to ignore for ESLint
- `.editorconfig` - Editor configuration for consistent coding styles
- `.lintstagedrc.js` - lint-staged configuration
- `tsconfig.json` - TypeScript configuration

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
