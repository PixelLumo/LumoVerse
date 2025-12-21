# 📱 PixelLumoApp - Complete Deployment & Publishing Guide

## Overview

Complete guide for deploying PixelLumoApp to iOS App Store and Google Play Store using Expo and EAS CLI.

---

## 🖥️ 1. System Requirements

### Operating Systems
- **Android Development**: Windows 10/11 or macOS
- **iOS Development**: macOS required (Xcode only available on macOS)

### Required Versions
| Component | Version | Notes |
|-----------|---------|-------|
| Node.js | v20.x (LTS) | Download from nodejs.org |
| npm | v10.x | Comes with Node.js |
| Expo CLI | v49.x | Frontend framework |
| EAS CLI | v5.9.1+ | Build & publish tool |
| Android Studio | Latest | For Android builds |
| Android SDK | Platform 33+ | Build tools 33+ |
| Xcode | 15.x+ | macOS only, for iOS |
| Yarn | Latest | Optional, recommended |

### Verify Installation
```bash
node -v          # Should show v20.x.x
npm -v           # Should show v10.x.x
expo --version   # Should show 49.x.x
eas --version    # Should show 5.9.1+
```

---

## 🚀 2. Global Installations

Install globally on your system:

### Step 1: Verify Node & npm
```bash
node -v
npm -v
```

### Step 2: Install Expo CLI
```bash
npm install -g expo-cli@49.0.0
```

Verify:
```bash
expo --version
# Output: 49.0.0
```

### Step 3: Install EAS CLI
```bash
npm install -g eas-cli@5.9.1
```

Verify:
```bash
eas --version
# Output: 5.9.1+
```

### Step 4: Install Yarn (Optional)
```bash
npm install -g yarn
```

Verify:
```bash
yarn --version
```

---

## 📦 3. Frontend Dependencies

Navigate to your project root (`PixelLumoApp/`) and install:

### Core Dependencies
```bash
npm install react@18.2.0 react-native@0.72.3 expo@49.0.0
```

Packages installed:
- **react** - UI library
- **react-native** - Mobile framework
- **expo** - Development & build platform

### Navigation
```bash
npm install @react-navigation/native@6.1.8 \
  @react-navigation/native-stack@6.9.13 \
  @react-navigation/bottom-tabs@6.5.10
```

Native support:
```bash
expo install react-native-screens react-native-safe-area-context \
  react-native-gesture-handler
```

### Storage & Networking
```bash
npm install @react-native-async-storage/async-storage@1.19.3 \
  axios@1.4.0 moment@2.29.4 socket.io-client@4.7.2
```

Packages:
- **axios** - HTTP client
- **socket.io-client** - Real-time communication
- **moment** - Date/time handling
- **@react-native-async-storage** - Local device storage

### Complete Install Command
```bash
npm install react@18.2.0 react-native@0.72.3 expo@49.0.0 \
  @react-navigation/native@6.1.8 @react-navigation/native-stack@6.9.13 \
  @react-navigation/bottom-tabs@6.5.10 \
  @react-native-async-storage/async-storage@1.19.3 \
  axios moment socket.io-client
```

Then install native dependencies:
```bash
expo install react-native-screens react-native-safe-area-context \
  react-native-gesture-handler
```

### Development Dependencies
```bash
npm install --save-dev typescript@5.1.3 @babel/core@7.20.0 \
  @types/react@18.2.14
```

---

## 🔙 4. Backend Dependencies

For your Node.js/Express backend:

```bash
cd backend
npm install express@4.18.2 mongoose@7.3.2 cors@2.8.5 \
  morgan@1.10.0 dotenv@16.3.1 bcryptjs@2.4.3 \
  jsonwebtoken@9.0.0 express-validator@7.0.0 socket.io@4.7.2
```

### Packages Installed
| Package | Purpose |
|---------|---------|
| express | Server framework |
| mongoose | MongoDB ORM |
| cors | Cross-origin requests |
| morgan | HTTP logging |
| dotenv | Environment variables |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT authentication |
| express-validator | Input validation |
| socket.io | Real-time messaging |

---

## 🤖 5. Android Build Setup

### Install Android Studio
1. Download from: https://developer.android.com/studio
2. Follow installation wizard
3. Install Android SDK (API 33+)
4. Install Build Tools 33+

### Set Environment Variables

**Windows PowerShell:**
```powershell
# Add to system environment variables
$env:ANDROID_HOME = "C:\Users\[YourUsername]\AppData\Local\Android\sdk"
```

Or permanently in System Properties → Environment Variables.

**macOS/Linux:**
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Add to ~/.zshrc or ~/.bash_profile for persistence
```

### Verify Android Setup
```bash
echo $ANDROID_HOME  # Should show SDK path
adb --version       # Should show ADB version
```

### Local Android Testing
```bash
expo start --android
```

This opens the app in Android emulator or connected device.

### Build APK for Google Play
```bash
eas build -p android --profile production
```

This creates an APK file for Google Play Store submission.

---

## 🍎 6. iOS Build Setup (macOS Only)

### Install Xcode
```bash
# Install Xcode from App Store or:
xcode-select --install
```

### Verify Xcode
```bash
xcode-select -p
# Output: /Applications/Xcode.app/Contents/Developer

xcodebuild -version
# Should show Xcode 15.x+
```

### Apple Developer Account
1. Go to: https://developer.apple.com/
2. Sign in or create account
3. Enroll in Apple Developer Program ($99/year)
4. Accept agreements

### Manage Signing Credentials
```bash
eas credentials
# Follow prompts to setup iOS signing
```

### Local iOS Testing
```bash
expo start --ios
```

Opens app in iOS simulator.

### Build IPA for App Store
```bash
eas build -p ios --profile production
```

Creates IPA file for App Store submission.

---

## 📋 7. Expo & EAS Configuration

### Login to EAS
```bash
eas login
# Enter your Expo username & password
```

Verify login:
```bash
eas whoami
```

### eas.json Configuration

Your `eas.json` should look like:

```json
{
  "cli": {
    "version": ">= 5.9.1",
    "promptToConfigurePushNotifications": false
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  },
  "submit": {
    "production": {
      "ios": {
        "ascAppId": "YOUR_APP_ID"
      }
    }
  }
}
```

### app.json Configuration

Ensure `app.json` has:

```json
{
  "expo": {
    "name": "PixelLumoApp",
    "slug": "pixellumoapp",
    "version": "1.0.0",
    "assetBundlePatterns": ["**/*"],
    "platforms": ["ios", "android"],
    "ios": {
      "supportsTabletMode": true,
      "bundleIdentifier": "com.yourcompany.pixellumoapp",
      "buildNumber": "1"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.yourcompany.pixellumoapp",
      "versionCode": 1
    }
  }
}
```

### Configure Credentials

```bash
eas credentials
# Follow prompts for Android & iOS
```

---

## 📝 8. Environment Configuration

Create `.env` file in project root:

```env
# Frontend API Configuration
EXPO_PUBLIC_API_URL=https://your-backend-domain.com/api
EXPO_PUBLIC_SOCKET_URL=https://your-backend-domain.com

# Backend Configuration (in backend/.env)
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/pixellumo
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=production
```

### Important Notes
- Prefix frontend env vars with `EXPO_PUBLIC_` to expose them to Expo
- Backend URL should be production domain, not localhost
- Use MongoDB Atlas for production database
- Change JWT_SECRET to strong random string

---

## 🏗️ 9. Building Locally

### Development Build

**Android:**
```bash
expo start --android
```

**iOS (macOS):**
```bash
expo start --ios
```

### Production Build with EAS

**Android APK:**
```bash
eas build -p android --profile production
```

Output: Ready for Google Play Store

**iOS IPA:**
```bash
eas build -p ios --profile production
```

Output: Ready for App Store (via Transporter)

### Monitor Build Status
```bash
eas build:list
eas build:view BUILD_ID
```

---

## 🎯 10. Publishing to Google Play Store

### Prerequisites
- ✅ Google Developer Account ($25 one-time fee)
- ✅ APK file from `eas build -p android --profile production`
- ✅ App icon (512x512 PNG)
- ✅ Screenshots (at least 2)
- ✅ Privacy policy URL
- ✅ App description (short & long)

### Step 1: Create Google Play Developer Account
1. Visit: https://play.google.com/console/
2. Create developer account ($25)
3. Accept terms and conditions

### Step 2: Create New App
1. Click "Create app"
2. Enter app name: "PixelLumoApp"
3. Select language: English
4. Confirm category
5. Click "Create"

### Step 3: Upload APK
1. Navigate to "Testing" → "Internal testing"
2. Click "Create new release"
3. Upload APK from EAS build
4. Review release details
5. Save & publish to internal testers

### Step 4: Set Up App Listing
1. Go to "App listing"
2. Upload app icon (512x512)
3. Upload 4-8 screenshots
4. Write app title (50 chars max)
5. Write short description (80 chars)
6. Write full description (4000 chars)
7. Add screenshots for different device types
8. Select app category & content rating
9. Add support email & privacy policy

### Step 5: Complete Store Listing
1. Fill all required fields
2. Upload promotional image
3. Select countries/regions
4. Set pricing (Free or Paid)
5. Accept policies
6. Save

### Step 6: Submit for Review
1. Go to "Releases" → "Production"
2. Create release with current APK
3. Review all details
4. Click "Submit for review"

**Review Timeline:** 2-4 hours typically

---

## 🍎 11. Publishing to Apple App Store

### Prerequisites
- ✅ Apple Developer Account ($99/year)
- ✅ IPA file from `eas build -p ios --profile production`
- ✅ App icon (1024x1024 PNG)
- ✅ Screenshots (5-8 images)
- ✅ Privacy policy URL
- ✅ App description
- ✅ Transporter app installed

### Step 1: Create Apple Developer Account
1. Visit: https://developer.apple.com/
2. Enroll in Apple Developer Program ($99/year)
3. Accept agreements
4. Set up payment method

### Step 2: Create App in App Store Connect
1. Visit: https://appstoreconnect.apple.com/
2. Click "My Apps"
3. Click "+" → "New App"
4. Fill in app details:
   - Platform: iOS
   - Name: PixelLumoApp
   - Bundle ID: com.yourcompany.pixellumoapp
   - SKU: pixellumoapp001
   - Language: English
5. Click "Create"

### Step 3: Configure App Information
1. Go to "App Information"
2. Select category: Social Networking
3. Set content rating
4. Add privacy policy URL
5. Set COPPA compliance

### Step 4: Set Up Pricing and Distribution
1. Go to "Pricing and Availability"
2. Select "Free"
3. Select available countries/regions

### Step 5: Prepare for Submission
1. Go to "Prepare for Submission"
2. Upload screenshots (5-8 per device type)
3. Write preview text (30 chars)
4. Write description (4000 chars)
5. Set keywords (100 chars)
6. Upload app icon (1024x1024)
7. Add support URL & privacy policy
8. Add review notes if needed

### Step 6: Upload IPA File

**Option A: Using Transporter App**
```bash
# Download Transporter from App Store
# Sign in with Apple ID
# Select IPA file from EAS build
# Click "Deliver"
```

**Option B: Using Xcode**
```bash
xcode-select --install
# Open Xcode
# Window → Organizer
# Select your app
# Upload Built Products
```

### Step 7: Submit for Review
1. Go to "Build"
2. Select your uploaded build
3. Configure version info
4. Click "Submit for Review"

**Review Timeline:** 24-48 hours typically

---

## 🛠️ 12. Optional Development Tools

### Postman
- Test backend APIs: https://www.postman.com/
- Import collection: `backend/PixelLumoApp.postman_collection.json`

### VS Code Extensions
```json
{
  "extensions": [
    "Prettier - Code formatter",
    "ESLint - Code quality",
    "React Native Tools",
    "GitHub Copilot (optional)",
    "MongoDB for VS Code",
    "Thunder Client - API testing"
  ]
}
```

Install via VS Code Extensions marketplace.

### MongoDB Atlas (Cloud Database)
1. Create account: https://www.mongodb.com/cloud/atlas
2. Create cluster (free tier available)
3. Get connection string
4. Update `MONGO_URI` in backend/.env

### GitHub (Version Control)
```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

---

## ✅ 13. Complete Deployment Checklist

| # | Task | Status |
|---|------|--------|
| 1 | Install Node.js v20.x | ☐ |
| 2 | Install npm v10.x | ☐ |
| 3 | Install expo-cli@49.0.0 globally | ☐ |
| 4 | Install eas-cli@5.9.1 globally | ☐ |
| 5 | Install frontend dependencies via npm | ☐ |
| 6 | Install native expo dependencies | ☐ |
| 7 | Install backend dependencies | ☐ |
| 8 | Install Android Studio | ☐ |
| 9 | Set ANDROID_HOME environment variable | ☐ |
| 10 | Install Xcode (macOS only) | ☐ |
| 11 | Create Apple Developer account | ☐ |
| 12 | Run `eas login` | ☐ |
| 13 | Configure `eas.json` & `app.json` | ☐ |
| 14 | Create `.env` with API URLs | ☐ |
| 15 | Test locally: `expo start --android` | ☐ |
| 16 | Test locally: `expo start --ios` | ☐ |
| 17 | Build Android APK: `eas build -p android` | ☐ |
| 18 | Build iOS IPA: `eas build -p ios` | ☐ |
| 19 | Create Google Play Developer account | ☐ |
| 20 | Create Google Play Store app listing | ☐ |
| 21 | Upload APK to Google Play | ☐ |
| 22 | Submit Android app for review | ☐ |
| 23 | Upload IPA to App Store Connect | ☐ |
| 24 | Submit iOS app for review | ☐ |
| 25 | Monitor review status | ☐ |

---

## 🚀 14. Quick Start Commands

### Local Development
```bash
# Frontend
cd PixelLumoApp
npm install
expo start

# Backend (separate terminal)
cd backend
npm install
npm start

# MongoDB (separate terminal)
mongod
```

### Build for Stores
```bash
# Android
eas build -p android --profile production

# iOS
eas build -p ios --profile production
```

### Publish to Stores
```bash
# Google Play
eas submit -p android --latest

# App Store
eas submit -p ios --latest
```

---

## 📊 15. Deployment Timeline

| Phase | Timeline | Tasks |
|-------|----------|-------|
| Preparation | Day 1 | Install all tools, configure accounts |
| Development | Days 2-3 | Local testing, bug fixes |
| Building | Day 4 | Create APK/IPA via EAS |
| Submission | Day 5 | Upload to stores, submit for review |
| Review | Days 6-8 | App Store review (24-48 hrs typically) |
| Launch | Day 9 | Apps live on stores |

---

## 🔐 16. Security Best Practices

1. **Never commit .env** - Use `.gitignore`
2. **Use strong JWT_SECRET** - Random 32+ character string
3. **Use MongoDB Atlas** - Managed cloud database with auth
4. **Enable HTTPS** - Always use https:// for API calls
5. **Validate inputs** - Use express-validator on backend
6. **Hide sensitive data** - Don't log tokens or passwords
7. **Update dependencies** - Regular security updates
8. **Test thoroughly** - Before submitting to stores

---

## 📞 17. Troubleshooting

### Build Fails
```bash
# Clear cache
npm cache clean --force
rm -rf node_modules
npm install

# Rebuild
eas build -p android --profile production --wait
```

### Android Emulator Issues
```bash
# Kill processes
adb kill-server
adb devices

# Reset emulator
emulator -avd Pixel_5_API_33 -wipe-data
```

### iOS Simulator Issues
```bash
# Reset simulator
xcrun simctl erase all

# Reinstall Xcode command line tools
xcode-select --reset
```

### Login Issues
```bash
eas logout
eas login
```

---

## 📚 18. Useful Links

| Resource | URL |
|----------|-----|
| Expo Documentation | https://docs.expo.dev/ |
| EAS CLI | https://docs.expo.dev/build/introduction/ |
| Google Play Console | https://play.google.com/console/ |
| App Store Connect | https://appstoreconnect.apple.com/ |
| Node.js | https://nodejs.org/ |
| Android Studio | https://developer.android.com/studio |
| Xcode | https://developer.apple.com/xcode/ |
| React Native | https://reactnative.dev/ |
| MongoDB Atlas | https://www.mongodb.com/cloud/atlas |

---

## 🎊 Success Indicators

When deployment is complete, you should see:

**Android (Google Play):**
- ✅ App visible on Google Play Store
- ✅ Installation count increasing
- ✅ Ratings and reviews appearing

**iOS (App Store):**
- ✅ App visible on Apple App Store
- ✅ Users can download from App Store
- ✅ Ratings and reviews appearing

---

**Status:** Ready for Production  
**Last Updated:** December 21, 2025  
**Version:** 1.0.0

---

*For questions or issues, refer to official Expo and store documentation.*
