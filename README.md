# React + Vite

> **[Vite](https://vitejs.dev)** + **[React](https://reactjs.org)** + **[Tailwind](https://tailwindcss.com)**

## Folder Structure

amazon-research-extension/
├── src/
│ ├── background/ # Background script
│ │ └── index.js # Main background logic
│ ├── content/ # Content scripts
│ │ ├── inject/ # UI injection logic
│ │ │ ├── AggregationCard.jsx
│ │ │ └── ProductMetaCard.jsx
│ │ ├── scrapers/ # Scraping modules
│ │ │ ├── searchResults.js
│ │ │ └── productDetails.js
│ │ └── index.js # Main content script
│ ├── lib/ # Shared utilities
│ │ ├── analysis.js # Data analysis functions
│ │ ├── dom.js # DOM helpers
│ │ └── storage.js # Storage wrapper
│ └── styles/ # Tailwind styles
│ └── content.css # Additional styles
├── manifest.json # Extension manifest
└── package.json
