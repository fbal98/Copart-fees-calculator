
# Auction Fee Calculator PWA

Auction Fee Calculator is a Progressive Web Application (PWA) that helps users calculate auction fees. The app can be installed on mobile devices and works offline.

## Features

- Calculate auction fees based on user inputs
- Dynamic fee calculation for Copart auctions
- Support for currency conversion from USD to OMR
- Offline functionality through service worker
- Light/Dark mode toggle

## Installation

### Local Development

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/auction-fee-calculator.git
   cd auction-fee-calculator
   ```

2. Serve the app using a local server. You can use `http-server` for Node.js:

   ```bash
   npm install -g http-server
   http-server -p 8080
   ```

3. Open your browser and navigate to `http://localhost:8080`.

### Mobile Installation

1. Ensure your app is served over HTTPS. You can use [ngrok](https://ngrok.com/) for local development:

   ```bash
   ngrok http 8080
   ```

2. Open Safari on your iPhone and navigate to the ngrok URL (e.g., `https://your-app-name.ngrok.io`).

3. Tap the **Share** button and select **Add to Home Screen**.

4. Name the app and tap **Add**. The app icon will appear on your home screen.

## File Structure

```
.
├── README.md
├── copart_fees.json
├── icons
│   └── icon-512x512.png
├── index.html
├── manifest.json
├── script.js
├── service-worker.js
└── styles.css
```

## Service Worker

The service worker caches all necessary files for offline use. It is registered in `index.html` and handles caching and fetch events.

```javascript
const CACHE_NAME = "auction-fee-calculator-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/styles.css",
  "/script.js",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/copart_fees.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

## Manifest

The `manifest.json` defines how the app appears on the user's home screen and provides metadata for the PWA.

```json
{
  "name": "Auction Fee Calculator",
  "short_name": "AuctionCalc",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## Contact

For any questions or feedback, please contact [your-email@example.com](mailto:your-email@example.com).
