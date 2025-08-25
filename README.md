# Zustand + Immer Demo

A demonstration of advanced state management using Zustand with Immer for immutable updates, featuring localStorage persistence for app initialization state.

## Features

### 🚀 **State Management**
- **Zustand + Immer**: Advanced state management with immutable updates
- **localStorage Persistence**: Automatic persistence of app initialization state
- **React Bootstrap UI**: Modern, responsive interface components

### 📱 **App Initialization Tracking**
- **First Launch Detection**: Automatically detects if this is the first time the app is launched
- **Session Startup Types**: Tracks cold start, warm start, and deep link scenarios
- **Progress Tracking**: Visual progress bar showing app initialization stages
- **Persistent State**: Remembers user preferences and app state between sessions

### 🎯 **Key Components**
- **AppInit Store**: Manages application initialization state with localStorage persistence
- **Todo Management**: Interactive task list with progress tracking
- **User Management**: Fetches and displays user data with external user ID support
- **Session Context**: Manages user identity and session information

## localStorage Persistence

The app automatically persists the following state to your browser's localStorage:

- **`isFirstAppLaunch`**: Whether this is the first time the app has been launched
- **`sessionStartupType`**: The type of session startup (cold, warm, or deep link)

### How It Works

1. **Automatic Detection**: On first load, the app checks if localStorage contains any saved data
2. **State Restoration**: If data exists, the app state is automatically restored
3. **Real-time Updates**: Any changes to the persisted state are automatically saved
4. **Cross-session Persistence**: State persists between browser sessions and page reloads

### localStorage Management

The UI includes controls to:
- **View localStorage Status**: See if data is stored and its size
- **Refresh Information**: Update localStorage status display
- **Clear localStorage**: Remove all stored data and reset the app state

## Getting Started

### Prerequisites
- Node.js 16+ 
- Yarn package manager

### Installation
```bash
# Install dependencies
yarn install

# Start development server
yarn start

# Build for production
yarn build:win  # Windows with legacy OpenSSL support
yarn build      # Standard build
```

### Development
```bash
# Start development server
yarn start

# Lint code
yarn lint

# Build project
yarn build:win
```

## Architecture

### Store Structure
```
AppInit Store (with localStorage persistence)
├── currentStage: AppInitStage
├── isFirstAppLaunch: boolean (persisted)
├── sessionStartupType: SessionStartupType (persisted)
└── vendorActionMaps: Record<AppInitVendorActions, Function[]>
```

### Key Hooks
- `useAppInitStage()`: Access app initialization state
- `useTrackAppInitStage()`: Track and update initialization progress
- `useSessionContextIdentity()`: Manage user session context

## localStorage Key

The app uses the localStorage key: **`app-init-storage`**

You can inspect this in your browser's Developer Tools:
1. Open Developer Tools (F12)
2. Go to Application/Storage tab
3. Look for `app-init-storage` under localStorage

## Testing localStorage Persistence

1. **First Launch**: Open the app for the first time - `isFirstAppLaunch` will be `true`
2. **Toggle State**: Use the "Toggle IsFirstAppLaunch" button to change the state
3. **Refresh Page**: Reload the page - the state will persist
4. **Close Browser**: Close and reopen the browser - state still persists
5. **Clear Storage**: Use the "Clear localStorage & Reset" button to test reset functionality

## Dependencies

- **Zustand**: State management library
- **Immer**: Immutable state updates
- **React Bootstrap**: UI component library
- **Bootstrap**: CSS framework
- **ULID**: Unique identifier generation

## Browser Support

- Modern browsers with localStorage support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### localStorage Issues
- Ensure cookies/localStorage are enabled in your browser
- Check browser storage limits (usually 5-10MB)
- Clear browser data if experiencing issues

### Build Issues
- Use `yarn build:win` on Windows for OpenSSL compatibility
- Ensure Node.js version compatibility
- Check yarn.lock for dependency conflicts

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for demonstration purposes only.
