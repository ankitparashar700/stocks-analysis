# Stock Market API Endpoints

This document describes all the available API endpoints for the stocks analysis application.

## Base URL
All endpoints are prefixed with `/api`

## Endpoints

### 1. Market Quotes (v2)
**GET** `/api/market/v2/get-quotes`

Get real-time quotes for multiple symbols.

**Query Parameters:**
- `symbols` (required): Comma-separated list of stock symbols

**Example:**
```
GET /api/market/v2/get-quotes?symbols=AAPL,MSFT,GOOGL
```

**Response:**
```json
{
  "symbols": [
    {
      "symbol": "AAPL",
      "price": 150.25,
      "change": 2.15,
      "changePercent": 1.45,
      "volume": 50000000,
      "marketCap": 2500000000000,
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### 2. Market Movers (v2)
**GET** `/api/market/v2/get-movers`

Get top gainers, losers, or most active stocks.

**Query Parameters:**
- `direction` (optional): `gainers`, `losers`, or `actives` (default: `gainers`)
- `count` (optional): Number of results (default: `10`)

**Example:**
```
GET /api/market/v2/get-movers?direction=losers&count=20
```

### 3. Market Summary (v2)
**GET** `/api/market/v2/get-summary`

Get detailed summary information for symbols.

**Query Parameters:**
- `symbols` (required): Comma-separated list of stock symbols

**Example:**
```
GET /api/market/v2/get-summary?symbols=AAPL,MSFT
```

### 4. Get Tickers by Quote Type
**GET** `/api/market/get-tickers-by-quote-type`

Get tickers filtered by quote type.

**Query Parameters:**
- `quoteType` (optional): `EQUITY`, `OPTION`, `FUTURE`, etc. (default: `EQUITY`)
- `count` (optional): Number of results (default: `50`)

**Example:**
```
GET /api/market/get-tickers-by-quote-type?quoteType=OPTION&count=25
```

### 5. Get Spark Data
**GET** `/api/market/get-spark`

Get historical price data for spark charts.

**Query Parameters:**
- `symbols` (required): Comma-separated list of stock symbols
- `range` (optional): `1d`, `5d`, `1mo`, `3mo`, `6mo`, `1y`, `5y`, `max` (default: `1d`)

**Example:**
```
GET /api/market/get-spark?symbols=AAPL&range=1mo
```

### 6. Get Earnings
**GET** `/api/market/get-earnings`

Get earnings data for a specific symbol.

**Query Parameters:**
- `symbol` (required): Stock symbol
- `count` (optional): Number of quarters (default: `4`)

**Example:**
```
GET /api/market/get-earnings?symbol=AAPL&count=8
```

### 7. Get Trending Tickers
**GET** `/api/market/get-trending-tickers`

Get currently trending tickers.

**Query Parameters:**
- `count` (optional): Number of results (default: `20`)
- `region` (optional): Market region (default: `IN`)

**Example:**
```
GET /api/market/get-trending-tickers?count=50&region=IN
```

### 8. Get Popular Watchlists
**GET** `/api/market/get-popular-watchlists`

Get popular watchlists.

**Query Parameters:**
- `count` (optional): Number of results (default: `10`)
- `category` (optional): Watchlist category (default: `all`)

**Example:**
```
GET /api/market/get-popular-watchlists?category=technology&count=5
```

### 9. Get Watchlist Performance
**GET** `/api/market/get-watchlist-performance`

Get performance data for a specific watchlist.

**Query Parameters:**
- `watchlistId` (required): Watchlist identifier
- `period` (optional): Performance period (default: `1mo`)

**Example:**
```
GET /api/market/get-watchlist-performance?watchlistId=123&period=3mo
```

### 10. Get Watchlist Detail
**GET** `/api/market/get-watchlist-detail`

Get detailed information about a specific watchlist.

**Query Parameters:**
- `watchlistId` (required): Watchlist identifier

**Example:**
```
GET /api/market/get-watchlist-detail?watchlistId=123
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message description"
}
```

**HTTP Status Codes:**
- `200`: Success
- `400`: Bad Request (missing required parameters)
- `500`: Internal Server Error

## Usage Examples

### Frontend JavaScript Example
```javascript
// Get quotes for multiple symbols
const response = await fetch('/api/market/v2/get-quotes?symbols=AAPL,MSFT,GOOGL');
const data = await response.json();
console.log(data.symbols);

// Get trending tickers
const trendingResponse = await fetch('/api/market/get-trending-tickers?count=10');
const trendingData = await trendingResponse.json();
console.log(trendingData.trendingTickers);
```

### cURL Examples
```bash
# Get quotes
curl "http://localhost:3000/api/market/v2/get-quotes?symbols=AAPL,MSFT"

# Get market movers
curl "http://localhost:3000/api/market/v2/get-movers?direction=losers&count=5"

# Get earnings
curl "http://localhost:3000/api/market/get-earnings?symbol=AAPL&count=4"
```

## Environment Setup

Create a `.env.local` file in your project root with the following variables:

```env
YAHOO_FINANCE_BASE_URL=https://yh-finance.p.rapidapi.com
YAHOO_FINANCE_API_KEY=your_rapidapi_key_here
YAHOO_FINANCE_HOST=yh-finance.p.rapidapi.com
```

## Notes

- All endpoints now make actual calls to the Yahoo Finance API via RapidAPI
- You need a valid RapidAPI key to use these endpoints
- The API key should be obtained from RapidAPI's Yahoo Finance API
- Consider implementing rate limiting and authentication for production use
- Add proper error handling and validation for production deployment 