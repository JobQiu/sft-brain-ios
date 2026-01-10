# SFT Brain iOS

Standalone mobile web application for SFT Brain, ready for iOS conversion with Capacitor. This app runs completely standalone with mock data and can be easily connected to your backend API later.

## Features

- 📱 **Mobile-First Design**: Optimized for mobile devices with native iOS feel
- 🔐 **Dual Authentication**: Email/password login + Google OAuth support
- 📦 **Mock Data**: 50+ realistic QA pairs for testing
- 🎯 **Spaced Repetition**: Smart review scheduling algorithm
- 📊 **Progress Tracking**: Visual analytics and activity heatmaps
- 🏷️ **Tags & Search**: Organize and find QA pairs easily
- 📝 **Rich Content**: Markdown, code syntax highlighting
- 📱 **iOS Ready**: Configured for Capacitor iOS build

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone or navigate to the repository
cd sft-brain-ios

# Install dependencies
npm install

# Run development server
npm run dev
```

The app will be available at http://localhost:3001

### Demo Accounts

Use these accounts to log in (password: `password123` for all):
- user@example.com
- demo@example.com
- member1@example.com

## Project Structure

```
sft-brain-ios/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Protected routes (dashboard, QA, etc.)
│   ├── login/             # Login page with email/password + OAuth
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── mobile/            # Mobile-specific components
│   └── ui/                # shadcn/ui components
├── lib/                   # Utilities and logic
│   ├── mock/              # Mock data and API
│   │   ├── data.ts        # 50+ mock QA pairs
│   │   └── api.ts         # Mock API service
│   ├── api-client.ts      # API client (supports mock mode)
│   ├── types.ts           # TypeScript types
│   └── mobile/            # Mobile-specific utilities
├── public/                # Static assets
├── capacitor.config.ts    # Capacitor configuration
├── .env.local             # Environment variables
└── package.json           # Dependencies

```

## Available Scripts

```bash
# Development
npm run dev              # Start dev server on port 3001

# Build
npm run build            # Production build
npm run build:mobile     # Build for Capacitor (static export)

# Capacitor
npm run sync:ios         # Build and sync to iOS
npm run sync:android     # Build and sync to Android
npm run open:ios         # Open Xcode
npm run open:android     # Open Android Studio
```

## Running Standalone (Mock Mode)

The app is configured to run standalone by default using mock data:

1. **Mock Data**: 50+ realistic QA pairs covering programming, algorithms, system design, etc.
2. **Mock Authentication**: Email/password login with demo accounts
3. **Local Storage**: All changes saved to browser localStorage
4. **No Backend Required**: Fully functional without any server

### Mock API Features

All backend features are simulated:
- ✅ User authentication and sessions
- ✅ QA pair CRUD operations
- ✅ Spaced repetition algorithm
- ✅ Tags and search
- ✅ Dashboard statistics
- ✅ Review history tracking

## Environment Configuration

Edit `.env.local` to configure the app:

```bash
# Use mock data (true = standalone mode, false = connect to backend)
NEXT_PUBLIC_USE_MOCK_DATA=true

# Backend API URL (only used when mock mode is false)
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

## Converting to iOS App

See [CAPACITOR_GUIDE.md](./CAPACITOR_GUIDE.md) for detailed instructions on:
- Setting up iOS development environment
- Building the iOS app
- Testing on simulator and device
- Preparing for App Store submission

## Connecting to Backend

See [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) for instructions on:
- Switching from mock to real API
- Configuring environment variables
- API endpoints documentation
- Authentication flow

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI**: Tailwind CSS + shadcn/ui
- **Mobile**: Capacitor 8
- **State**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod validation

## Development Notes

### Hot Reload
Changes to files will automatically reload in the browser during development.

### Mock Data Persistence
- Mock data is loaded fresh on each page refresh
- User-created QA pairs are saved to localStorage
- Login state persists across sessions

### Mobile Testing
Test the app on mobile devices by accessing your computer's IP:
```bash
# Find your IP address
ifconfig  # macOS/Linux
ipconfig  # Windows

# Then access: http://YOUR_IP:3001
```

## Troubleshooting

### Port Already in Use
If port 3001 is occupied, edit `package.json` to use a different port:
```json
"dev": "next dev -p 3002"
```

### Dependencies Installation Failed
```bash
# Clear npm cache and retry
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Build Errors
```bash
# Ensure TypeScript types are correct
npm run build

# Check for errors in the console
```

## Contributing

This is a standalone version of SFT Brain mobile web. For the full project, see the parent repository.

## License

Part of the SFT Brain project.
