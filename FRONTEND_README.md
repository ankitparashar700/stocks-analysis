# Stock Market Dashboard Frontend

A modern, responsive React frontend for the stock market API with real-time data visualization and interactive components.

## Features

### 🏠 **Dashboard Overview**
- **Tabbed Interface**: Clean navigation between different market views
- **Real-time Updates**: Auto-refresh functionality for live data
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

### 📊 **Components**

#### 1. **Stock Quotes** (`StockQuotes.tsx`)
- Real-time stock quotes with price, change, and volume
- Customizable symbol input
- Auto-refresh every 30 seconds
- Color-coded price changes (green/red)

#### 2. **Market Movers** (`MarketMovers.tsx`)
- Top gainers, losers, and most active stocks
- Tabbed interface for different categories
- Real-time market movement tracking
- Volume and market cap information

#### 3. **Trending Stocks** (`TrendingTickers.tsx`)
- Social sentiment analysis
- Trending score visualization
- News count tracking
- Sector and industry classification

#### 4. **Popular Watchlists** (`Watchlists.tsx`)
- Grid layout of popular watchlists
- Performance metrics (1D, 1W, 1M, 3M)
- Top holdings preview
- Category filtering

#### 5. **Earnings Calendar** (`EarningsCalendar.tsx`)
- Earnings history with estimates vs actual
- Revenue analysis
- Beat rate statistics
- Surprise percentage calculations

#### 6. **Price Charts** (`SparkCharts.tsx`)
- Interactive line charts using Recharts
- Multiple time ranges (1D, 5D, 1M, 3M, 6M, 1Y)
- Price range and volume information
- Responsive chart containers

## 🛠 **Technology Stack**

- **React 19** with TypeScript
- **Next.js 15** App Router
- **Tailwind CSS** for styling
- **Headless UI** for accessible components
- **Heroicons** for icons
- **Recharts** for data visualization

## 📦 **Dependencies**

```json
{
  "@headlessui/react": "^2.0.0",
  "@heroicons/react": "^2.0.0",
  "recharts": "^2.8.0"
}
```

## 🚀 **Getting Started**

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Set up Environment Variables**:
   Create a `.env.local` file:
   ```env
   YAHOO_FINANCE_BASE_URL=https://yh-finance.p.rapidapi.com
   YAHOO_FINANCE_API_KEY=your_rapidapi_key_here
   YAHOO_FINANCE_HOST=yh-finance.p.rapidapi.com
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

4. **Open Browser**:
   Navigate to `http://localhost:3000`

## 🎨 **Design Features**

### **Color Scheme**
- **Primary**: Blue (#3B82F6) for main actions
- **Success**: Green (#10B981) for positive changes
- **Warning**: Red (#EF4444) for negative changes
- **Neutral**: Gray scale for text and backgrounds

### **Typography**
- **Headings**: Inter font family
- **Body**: System font stack
- **Monospace**: For numerical data

### **Layout**
- **Grid System**: Responsive grid layouts
- **Cards**: Elevated card components with shadows
- **Tables**: Clean, sortable data tables
- **Charts**: Interactive data visualization

## 📱 **Responsive Breakpoints**

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔧 **Component Architecture**

```
components/
├── StockQuotes.tsx          # Real-time quotes
├── MarketMovers.tsx         # Top gainers/losers
├── TrendingTickers.tsx      # Trending stocks
├── Watchlists.tsx           # Popular watchlists
├── EarningsCalendar.tsx     # Earnings data
└── SparkCharts.tsx          # Price charts
```

## 📊 **Data Flow**

1. **API Calls**: Each component makes calls to the backend API
2. **State Management**: React hooks for local state
3. **Error Handling**: Graceful error states and loading indicators
4. **Auto-refresh**: Timed updates for real-time data

## 🎯 **Key Features**

### **Real-time Updates**
- Auto-refresh functionality
- Loading states and error handling
- Optimistic UI updates

### **Interactive Elements**
- Hover effects on tables and cards
- Click handlers for detailed views
- Form inputs with validation

### **Accessibility**
- ARIA labels for screen readers
- Keyboard navigation support
- High contrast color schemes
- Semantic HTML structure

### **Performance**
- Lazy loading of components
- Optimized re-renders
- Efficient data fetching
- Memoized calculations

## 🧪 **Testing**

The frontend is designed with testability in mind:
- Component isolation
- Props-based data flow
- Mock API responses
- Error boundary handling

## 🚀 **Deployment**

### **Vercel** (Recommended)
```bash
npm run build
vercel --prod
```

### **Netlify**
```bash
npm run build
# Deploy dist folder
```

### **Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📈 **Future Enhancements**

- **Real-time WebSocket** connections
- **Advanced Charting** with more indicators
- **Portfolio Management** features
- **News Integration** with sentiment analysis
- **Mobile App** using React Native
- **Dark Mode** toggle
- **Internationalization** support

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 **License**

MIT License - see LICENSE file for details

---

**Built with ❤️ using Next.js, React, and Tailwind CSS** 