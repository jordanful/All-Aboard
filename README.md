# All Aboard

A real-time CTA bus and train tracker for Chicago. Pick a route, and All Aboard finds the nearest stop or station and shows you when the next one is coming.

## Features

- Live arrival predictions for all 129 CTA bus routes
- Real-time tracking for all 8 L train lines
- Automatically finds your nearest stop or station
- CTA service alerts
- Recently viewed routes for quick access

## Development

1. Clone the repo
2. `npm install`
3. `cd ios && pod install && cd ..`
4. `npm start`
5. Open `ios/AllAboard.xcodeproj` in Xcode and run

Requires Node 20+ and Xcode 16+.

## Architecture

Built with React Native 0.83. Local state only — no Redux, no backend, no user accounts.

- `index.js` — Root component with drawer navigation
- `src/actions/user.js` — Route selection, predictions, direction changes
- `src/api/api.js` — CTA Bus Tracker and Train Tracker API clients
- `src/components/` — React Native class components
- `src/data/stations.js` — L train station data (144 stations)
- `src/data/storage.js` — AsyncStorage for recently viewed routes

## License

MIT License. Copyright 2016-2026.
