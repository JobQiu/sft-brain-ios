# Capacitor iOS Conversion Guide

This guide will walk you through converting the SFT Brain mobile web app into a native iOS application using Capacitor.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [Building the iOS App](#building-the-ios-app)
- [Testing](#testing)
- [iOS-Specific Configuration](#ios-specific-configuration)
- [App Store Preparation](#app-store-preparation)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

1. **macOS**: iOS development requires a Mac
2. **Xcode 14+**: Download from Mac App Store
3. **Command Line Tools**:
   ```bash
   xcode-select --install
   ```
4. **CocoaPods**:
   ```bash
   sudo gem install cocoapods
   ```
5. **Node.js 18+** and npm

### Apple Developer Account

- Free account: Test on your own devices
- Paid account ($99/year): Required for App Store distribution

## Initial Setup

### 1. Install Dependencies

```bash
cd sft-brain-ios
npm install
```

### 2. Add iOS Platform

```bash
# This creates the ios/ directory with Xcode project
npx cap add ios
```

This will create:
- `ios/` directory
- `App/` folder with native iOS project
- `Podfile` for iOS dependencies

### 3. Initial Sync

```bash
# Build web assets and copy to iOS project
npm run build:mobile
npx cap sync ios
```

## Building the iOS App

### Development Build

```bash
# Step 1: Build the web app
npm run build:mobile

# Step 2: Sync to iOS
npx cap sync ios

# Step 3: Open in Xcode
npx cap open ios
```

### In Xcode

1. **Select Your Team**
   - Click on "App" in the project navigator
   - Go to "Signing & Capabilities"
   - Select your Apple Developer team
   - Xcode will automatically create a provisioning profile

2. **Update Bundle Identifier** (if needed)
   - Change from `com.sftbrain.mobile` to your own
   - Format: `com.yourcompany.appname`

3. **Choose Deployment Target**
   - Recommended: iOS 13.0 or higher
   - Set in "General" → "Deployment Info"

4. **Build the App**
   - Select a device or simulator: Product → Destination
   - Click the Play button or press Cmd+R
   - First build may take 5-10 minutes

## Testing

### Simulator Testing

```bash
# Open Xcode
npx cap open ios

# Select any iPhone simulator
# Click Play button (Cmd+R)
```

**Available Simulators:**
- iPhone SE (small screen)
- iPhone 14/15 (standard)
- iPhone 14 Pro Max (large screen)
- iPad Pro (tablet)

### Physical Device Testing

1. **Connect iPhone/iPad via USB**

2. **Trust Computer on Device**
   - Dialog will appear on device
   - Enter passcode and tap "Trust"

3. **Select Device in Xcode**
   - Top toolbar → select your device
   - Build and run (Cmd+R)

4. **Trust Developer on Device**
   - Settings → General → VPN & Device Management
   - Tap your developer account
   - Tap "Trust"

### Testing Checklist

- [ ] Login with email/password
- [ ] Login with Google OAuth (if backend connected)
- [ ] Create new QA pair
- [ ] Edit existing QA pair
- [ ] Delete QA pair
- [ ] Review QA pairs
- [ ] Search and filter
- [ ] View dashboard statistics
- [ ] Test offline functionality
- [ ] Test app lifecycle (background/foreground)
- [ ] Test different screen sizes
- [ ] Test dark mode (if implemented)

## iOS-Specific Configuration

### App Icons

1. **Generate Icons**
   - Create a 1024x1024 PNG icon
   - Use online tool: https://www.appicon.co
   - Or use Capacitor Assets:
     ```bash
     npm install @capacitor/assets --save-dev
     # Place icon.png (1024x1024) in resources/
     npx capacitor-assets generate --ios
     ```

2. **Manual Setup**
   - Open `ios/App/App/Assets.xcassets/AppIcon.appiconset`
   - Drag and drop icons for each size

### Splash Screen

1. **Using Capacitor Config** (`capacitor.config.ts`):
   ```typescript
   plugins: {
     SplashScreen: {
       launchShowDuration: 2000,
       backgroundColor: '#ffffff',
       showSpinner: false,
     },
   }
   ```

2. **Custom Splash**
   - Create 2048x2048 PNG
   - Add to `ios/App/App/Assets.xcassets/Splash.imageset`

### Permissions

Add to `ios/App/App/Info.plist` as needed:

```xml
<!-- Camera (if using image upload) -->
<key>NSCameraUsageDescription</key>
<string>We need camera access to capture images for QA pairs</string>

<!-- Photo Library (if using image upload) -->
<key>NSPhotoLibraryUsageDescription</key>
<string>We need access to your photos to attach images to QA pairs</string>

<!-- Microphone (if using voice input) -->
<key>NSMicrophoneUsageDescription</key>
<string>We need microphone access for voice input</string>
```

### Deep Linking (for OAuth)

1. **Add URL Scheme** in `Info.plist`:
   ```xml
   <key>CFBundleURLTypes</key>
   <array>
     <dict>
       <key>CFBundleURLSchemes</key>
       <array>
         <string>sftbrain</string>
       </array>
     </dict>
   </array>
   ```

2. **Handle Deep Links** in your app (already implemented in auth-context)

### App Display Name

Edit `ios/App/App/Info.plist`:
```xml
<key>CFBundleDisplayName</key>
<string>SFT Brain</string>
```

## App Store Preparation

### 1. Update Version and Build Number

In Xcode:
- General → Identity → Version: `1.0.0`
- General → Identity → Build: `1`

Or edit `ios/App/App.xcodeproj/project.pbxproj`

### 2. Create App Store Connect Listing

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click "My Apps" → "+" → "New App"
3. Fill in:
   - Platform: iOS
   - Name: SFT Brain
   - Primary Language: English
   - Bundle ID: Select your bundle ID
   - SKU: Unique identifier (e.g., `sftbrain-ios-001`)

### 3. Prepare Marketing Materials

- **Screenshots** (required for all device sizes):
  - 6.7" (iPhone 14 Pro Max): 1290 x 2796
  - 6.5" (iPhone 14 Plus): 1284 x 2778
  - 5.5" (iPhone 8 Plus): 1242 x 2208
  - iPad Pro 12.9": 2048 x 2732

- **App Preview Video** (optional but recommended)
  - 15-30 seconds
  - Showcase key features

- **App Description**
  ```
  SFT Brain - AI-Powered Learning Companion
  
  Master any subject with intelligent spaced repetition. Create question-answer 
  pairs, and let our smart algorithm optimize your review schedule for maximum 
  retention.
  
  Features:
  • Smart spaced repetition algorithm
  • Rich content support (Markdown, code, images)
  • Progress tracking and analytics
  • Tag-based organization
  • Offline support
  • Clean, intuitive interface
  ```

### 4. Archive and Upload

1. **Archive the App**:
   - In Xcode: Product → Archive
   - Wait for archive to complete (~5-10 min)

2. **Upload to App Store Connect**:
   - Window → Organizer
   - Select your archive
   - Click "Distribute App"
   - Follow the wizard

3. **Submit for Review**:
   - Return to App Store Connect
   - Go to your app → TestFlight or App Store tab
   - Fill in required information
   - Submit for review

### 5. TestFlight (Beta Testing)

Before public release, test with TestFlight:

1. Upload build to App Store Connect
2. Go to TestFlight tab
3. Add internal testers (up to 100)
4. Or create public link for external testers

## Development Workflow

### Making Changes

```bash
# 1. Edit your web code in app/, components/, lib/
# 2. Test in browser first
npm run dev

# 3. When ready, build and sync to iOS
npm run build:mobile
npx cap sync ios

# 4. Open and test in Xcode
npx cap open ios
```

### Live Reload (Optional)

For faster development, use Capacitor's live reload:

1. **Find your computer's IP**: `ifconfig` (look for en0)

2. **Update capacitor.config.ts**:
   ```typescript
   server: {
     url: 'http://YOUR_IP:3001',
     cleartext: true
   }
   ```

3. **Start dev server**: `npm run dev`

4. **Sync and run**: 
   ```bash
   npx cap sync ios
   npx cap open ios
   ```

Now changes will reload on device without rebuilding!

**Note**: Remove `server.url` before production builds.

## Troubleshooting

### Common Issues

#### 1. "No provisioning profiles found"

**Solution**:
- Xcode → Preferences → Accounts
- Add your Apple ID
- Download Manual Profiles

#### 2. "Failed to code sign"

**Solution**:
- Select your Team in Signing & Capabilities
- Change Bundle Identifier to something unique
- Clean build folder: Product → Clean Build Folder

#### 3. "App crashes on launch"

**Solution**:
- Check Xcode console for errors
- Verify `capacitor.config.ts` has correct `webDir: 'out'`
- Ensure you ran `npm run build:mobile` before sync

#### 4. "White screen on iOS"

**Solution**:
- Check browser console in Safari
- Enable Developer → Show Web Inspector on iOS
- Verify all assets loaded correctly
- Check for JavaScript errors

#### 5. "Pod install failed"

**Solution**:
```bash
cd ios/App
pod repo update
pod install
cd ../..
npx cap sync ios
```

### Enable Safari Debugging

1. **On iPhone**:
   - Settings → Safari → Advanced → Web Inspector ON

2. **On Mac**:
   - Open Safari
   - Develop → [Your iPhone] → [Your App]
   - Access full browser console

### Useful Commands

```bash
# Clean everything and start fresh
rm -rf ios node_modules package-lock.json
npm install
npx cap add ios
npm run build:mobile
npx cap sync ios

# Update Capacitor
npm install @capacitor/core@latest @capacitor/cli@latest @capacitor/ios@latest
npx cap sync ios

# View Capacitor logs
npx cap run ios
# Then check Xcode console
```

## Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Capacitor iOS Guide](https://capacitorjs.com/docs/ios)
- [Apple Developer Documentation](https://developer.apple.com/documentation/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/ios)

## Next Steps

After building the iOS app:

1. **Test thoroughly** on different devices and iOS versions
2. **Gather feedback** from beta testers via TestFlight
3. **Optimize performance** (image loading, animations, etc.)
4. **Implement analytics** (if needed)
5. **Set up crash reporting** (Sentry, Firebase, etc.)
6. **Plan update strategy** (how to handle API changes, new features)

Good luck with your iOS app! 🚀
