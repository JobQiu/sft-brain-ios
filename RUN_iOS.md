# Running the iOS App

## Current Status

The iOS project has been set up with Capacitor, but the Next.js build has issues with static export that need to be resolved.

## Quick Run (for testing the simulator)

The iOS project is currently set up with a minimal HTML file. To run it:

1. Open Xcode: `open ios/App/App.xcodeproj`
2. Select a simulator (iPhone 15 Pro recommended)
3. Click Run (▶️) or press Cmd+R

## To Get the Full App Working

The Next.js app needs to be built without pre-rendering auth-protected pages. Here are the options:

### Option 1: Use Development Server (Recommended for testing)

1. Start the Next.js dev server:
   ```bash
   npm run dev
   ```

2. Update `capacitor.config.ts` to point to localhost:
   ```typescript
   server: {
     url: 'http://localhost:3001',
     cleartext: true
   }
   ```

3. Sync and run:
   ```bash
   npx cap sync ios
   npx cap open ios
   ```

### Option 2: Fix Static Export Build

The build fails because pages are trying to use auth context during static generation. To fix:

1. Ensure all auth-protected pages export a `generateStaticParams` function
2. Make sure no server-side auth checks happen during build
3. Use client-side only auth checking

### Option 3: Use Server Build Instead of Static Export

Change `next.config.mjs`:
```javascript
// Remove: output: 'export'
// This will create a server build that can't be used with Capacitor's static hosting
```

## Files Created/Modified

- ✅ iOS platform added (`ios/` directory)
- ✅ Capacitor config synced
- ✅ Missing components created
- ✅ TypeScript errors fixed (mostly)
- ⚠️  Static export build needs auth context fixes

## Next Steps

1. Choose one of the options above
2. Run the app in the simulator
3. Test the functionality
4. Fix remaining build issues for production deployment
