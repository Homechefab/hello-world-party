# Android Testing Guide (Without App Store)

## Option 1: Physical Android Device (RECOMMENDED - Easiest)

### Steps:
1. **Enable Developer Mode on your Android phone:**
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   - Developer Options will appear in Settings

2. **Enable USB Debugging:**
   - Go to Settings → Developer Options
   - Enable "USB Debugging"
   - Enable "Install via USB" (if available)

3. **Connect your phone to your PC via USB**
   - When prompted on phone, allow USB debugging from this computer

4. **Run the app:**
   ```powershell
   npx cap run android
   ```
   This will build the APK and install it directly on your connected phone!

---

## Option 2: Android Studio Emulator

### Steps:
1. **Open Android Studio:**
   ```powershell
   npx cap open android
   ```

2. **Set up an emulator:**
   - In Android Studio: Tools → Device Manager
   - Click "Create Device"
   - Choose a phone (e.g., Pixel 5)
   - Download a system image (e.g., API 33 - Android 13)
   - Finish setup

3. **Run the app:**
   - Click the green "Run" button in Android Studio
   - Or use command line:
   ```powershell
   npx cap run android
   ```

---

## Option 3: Build APK for Manual Installation

### Steps:
1. **Open Android Studio:**
   ```powershell
   npx cap open android
   ```

2. **Build APK:**
   - In Android Studio: Build → Build Bundle(s) / APK(s) → Build APK(s)
   - Wait for build to complete
   - APK location will be shown in a notification (usually: `android/app/build/outputs/apk/debug/app-debug.apk`)

3. **Transfer APK to phone:**
   - Email it to yourself
   - Use Google Drive / Dropbox
   - Use USB cable to copy file

4. **Install on phone:**
   - Open the APK file on your phone
   - Allow "Install from Unknown Sources" if prompted
   - Install the app

---

## Quick Commands Reference

```powershell
# Build web app
npm run build

# Sync with Android
npx cap sync android

# Open in Android Studio
npx cap open android

# Run on connected device/emulator
npx cap run android

# Live reload during development (OPTIONAL)
# 1. Uncomment the server config in capacitor.config.ts
# 2. Run: npx cap sync android
# 3. Run: npx cap run android
```

---

## Troubleshooting

### "ANDROID_HOME not set"
- Install Android Studio
- Set environment variable: `ANDROID_HOME = C:\Users\YourName\AppData\Local\Android\Sdk`

### "No devices found"
- For physical device: Make sure USB debugging is enabled
- For emulator: Create and start an emulator in Android Studio

### "App crashes on startup"
- Check Android Studio Logcat for errors
- Make sure all required permissions are in AndroidManifest.xml

---

## Testing Your App Features

Once installed, you can test:
- ✅ All UI components and navigation
- ✅ Authentication and user roles
- ✅ Shopping cart and orders
- ✅ Payment demo flows
- ✅ Chef application forms
- ✅ Admin dashboard
- ✅ All features work offline (after initial load)

---

## Next Steps for Distribution

When ready to share with others:
1. **Internal Testing**: Use Google Play Console's "Internal Testing" track
2. **Closed Beta**: Invite testers via email addresses
3. **APK Sharing**: Build release APK and share via Drive/Dropbox
4. **Firebase App Distribution**: Free distribution platform for testing

No need to publish to Play Store for testing!
