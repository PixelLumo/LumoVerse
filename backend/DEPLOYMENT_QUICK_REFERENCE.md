# 🚀 Deployment Quick Reference Card

## Global Installation Commands

```bash
# Install Expo CLI v49
npm install -g expo-cli@49.0.0

# Install EAS CLI v5.9.1
npm install -g eas-cli@5.9.1

# Verify installations
expo --version
eas --version
```

---

## Frontend Dependencies

```bash
# Navigate to project root
cd PixelLumoApp

# Core packages
npm install react@18.2.0 react-native@0.72.3 expo@49.0.0

# Navigation
npm install @react-navigation/native@6.1.8 \
  @react-navigation/native-stack@6.9.13 \
  @react-navigation/bottom-tabs@6.5.10

# Native dependencies
expo install react-native-screens react-native-safe-area-context \
  react-native-gesture-handler

# Storage & networking
npm install @react-native-async-storage/async-storage@1.19.3 \
  axios moment socket.io-client

# Development dependencies
npm install --save-dev typescript@5.1.3 @babel/core@7.20.0 \
  @types/react@18.2.14
```

---

## Backend Dependencies

```bash
# Navigate to backend
cd backend

# Install all backend packages
npm install express@4.18.2 mongoose@7.3.2 cors@2.8.5 \
  morgan@1.10.0 dotenv@16.3.1 bcryptjs@2.4.3 \
  jsonwebtoken@9.0.0 express-validator@7.0.0 socket.io@4.7.2
```

---

## Local Development

```bash
# Terminal 1: Start MongoDB
mongod

# Terminal 2: Start Backend
cd backend
npm start

# Terminal 3: Start Frontend (choose one)
cd PixelLumoApp

# Android
expo start --android

# iOS (macOS only)
expo start --ios

# Web (testing)
expo start --web
```

---

## Android Setup

### Environment Variables (Windows)
```powershell
# In PowerShell (Admin mode)
[Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Users\[YourUsername]\AppData\Local\Android\sdk", "User")
```

### Build & Deploy
```bash
# Build APK for Google Play
eas build -p android --profile production

# Submit to Google Play
eas submit -p android --latest

# View build status
eas build:list
```

---

## iOS Setup (macOS only)

```bash
# Install/verify Xcode
xcode-select --install

# Verify installation
xcodebuild -version

# Build IPA for App Store
eas build -p ios --profile production

# Submit to App Store
eas submit -p ios --latest
```

---

## EAS & Expo Configuration

```bash
# Login to Expo/EAS
eas login

# Check login status
eas whoami

# Configure credentials
eas credentials

# View all builds
eas build:list

# View specific build
eas build:view BUILD_ID
```

---

## Essential Files

### .env (Root Level)
```env
EXPO_PUBLIC_API_URL=https://your-api-domain.com/api
EXPO_PUBLIC_SOCKET_URL=https://your-api-domain.com
```

### backend/.env
```env
PORT=5000
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/pixellumo
JWT_SECRET=your_strong_secret_key_here
NODE_ENV=production
```

### app.json (Key fields)
```json
{
  "expo": {
    "name": "PixelLumoApp",
    "slug": "pixellumoapp",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.yourcompany.pixellumoapp",
      "buildNumber": "1"
    },
    "android": {
      "package": "com.yourcompany.pixellumoapp",
      "versionCode": 1
    }
  }
}
```

### eas.json
```json
{
  "cli": {
    "version": ">= 5.9.1"
  },
  "build": {
    "production": {}
  }
}
```

---

## Google Play Store

### Account Setup
1. Go to: https://play.google.com/console/
2. Pay $25 developer fee
3. Create new app
4. Fill in all required fields

### Upload APK
```bash
# Build APK
eas build -p android --profile production

# Submit directly
eas submit -p android --latest

# Or manual upload in Google Play Console
```

### Required Information
- ✅ App icon (512x512 PNG)
- ✅ Screenshots (4-8 images)
- ✅ App title (50 chars max)
- ✅ Short description (80 chars)
- ✅ Full description (4000 chars)
- ✅ Privacy policy URL
- ✅ Support email

### Review Timeline
- **Typical:** 2-4 hours
- **Maximum:** 24-48 hours

---

## Apple App Store

### Account Setup
1. Go to: https://developer.apple.com/
2. Enroll in Apple Developer Program ($99/year)
3. Go to: https://appstoreconnect.apple.com/
4. Create new app

### Upload IPA
```bash
# Build IPA
eas build -p ios --profile production

# Submit using Transporter
# Download from App Store
# Sign in with Apple ID
# Select IPA file
# Click Deliver

# Or submit via EAS
eas submit -p ios --latest
```

### Required Information
- ✅ App icon (1024x1024 PNG)
- ✅ Screenshots (5-8 per device type)
- ✅ App title (50 chars max)
- ✅ Keywords (100 chars)
- ✅ Description (4000 chars)
- ✅ Support URL
- ✅ Privacy policy URL

### Review Timeline
- **Typical:** 24-48 hours
- **Maximum:** 72 hours

---

## Version Bumping

### For New Releases
```json
// app.json
"version": "1.0.1"

// iOS
"buildNumber": "2"

// Android
"versionCode": 2
```

Then rebuild:
```bash
eas build -p android --profile production
eas build -p ios --profile production
```

---

## Troubleshooting

### Clear Cache & Reinstall
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Android Emulator
```bash
# Kill all ADB servers
adb kill-server

# List devices
adb devices

# Reset emulator
emulator -avd Pixel_5_API_33 -wipe-data
```

### iOS Simulator
```bash
# Reset all simulators
xcrun simctl erase all

# Reset command line tools
xcode-select --reset
```

### Re-login to EAS
```bash
eas logout
eas login
```

---

## Version Reference

| Tool | Version | Command to Verify |
|------|---------|-------------------|
| Node.js | v20.x | `node -v` |
| npm | v10.x | `npm -v` |
| Expo CLI | 49.0.0 | `expo --version` |
| EAS CLI | 5.9.1+ | `eas --version` |
| React | 18.2.0 | Check package.json |
| React Native | 0.72.3 | Check package.json |

---

## Useful Links

| Resource | URL |
|----------|-----|
| Expo Docs | https://docs.expo.dev/ |
| EAS Docs | https://docs.expo.dev/build/ |
| Google Play Console | https://play.google.com/console/ |
| App Store Connect | https://appstoreconnect.apple.com/ |
| Node.js | https://nodejs.org/ |
| Android Studio | https://developer.android.com/studio |
| Xcode | https://developer.apple.com/xcode/ |

---

## Pre-Launch Checklist

- [ ] All versions installed correctly
- [ ] Frontend dependencies installed
- [ ] Backend dependencies installed
- [ ] Android SDK configured
- [ ] Xcode installed (macOS)
- [ ] EAS login completed
- [ ] app.json configured
- [ ] eas.json configured
- [ ] .env files created
- [ ] Local testing passed
- [ ] APK/IPA built successfully
- [ ] Google Play account created
- [ ] Apple Developer account active
- [ ] App Store Connect app created
- [ ] Ready to submit for review

---

## After Publishing

### Monitor Your App
```bash
# Check build history
eas build:list

# Check submission status
eas submit:list
```

### Update Your App
1. Bump version in app.json
2. Bump build number (iOS) / version code (Android)
3. Push code to git
4. Rebuild: `eas build -p android/ios --profile production`
5. Resubmit via app stores

---

**Status:** Ready for Production 🚀  
**Last Updated:** December 21, 2025
