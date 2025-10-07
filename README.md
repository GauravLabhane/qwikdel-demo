# QwikDel - Logistics AI Demo

A React-based dashboard for logistics operations management with AI insights, dispatch console, and pricing optimization.

## Features

- **Analytics Dashboard**: Real-time KPIs, cost trends, and performance metrics
- **Dispatch Console**: Live rider tracking and route optimization
- **Pricing Optimizer**: Dynamic pricing recommendations
- **AI Insights**: Automated recommendations and risk alerts

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **Shadcn/ui** - UI components

## Project Structure

```
src/
├── components/
│   └── ui/          # Reusable UI components
├── lib/
│   └── utils.js     # Utility functions
├── App.jsx          # Main application component
├── main.jsx         # Application entry point
└── index.css        # Global styles
```

## Demo Data

The application uses synthetic data representing a Jaipur pilot with 4 dark stores and ~120 orders per day. All data is mock data for demonstration purposes.

## Deployment

This project is configured for easy deployment to GitHub Pages. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### Quick Deploy to GitHub Pages:

1. Push your code to a GitHub repository
2. Enable GitHub Pages in repository settings
3. Select "GitHub Actions" as the source
4. Your site will be automatically deployed at `https://YOUR_USERNAME.github.io/qwikdel-demo/`

## License

This project is for demonstration purposes only.
