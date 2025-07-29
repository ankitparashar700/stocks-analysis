interface YahooFinanceApiConfig {
  baseUrl: string;
  apiKey: string;
  host: string;
}

class YahooFinanceApi {
  private config: YahooFinanceApiConfig;

  constructor() {
    this.config = {
      baseUrl: process.env.YAHOO_FINANCE_BASE_URL || 'https://yh-finance.p.rapidapi.com',
      apiKey: process.env.YAHOO_FINANCE_API_KEY || '',
      host: process.env.YAHOO_FINANCE_HOST || 'yh-finance.p.rapidapi.com'
    };
  }

  private async makeRequest(endpoint: string, params: Record<string, string> = {}) {
    const url = new URL(endpoint, this.config.baseUrl);
    // User added console.logs here for debugging:
    // console.log(this.config.host,"::::>>>>host")
    // console.log(this.config.apiKey,"::::>>>>apiKey")

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'x-rapidapi-host': this.config.host,
        'x-rapidapi-key': this.config.apiKey,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Yahoo Finance API error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  async getQuotes(symbols: string, region: string = 'IN') {
    return this.makeRequest('/market/v2/get-quotes', {
      symbols,
      region
    });
  }

  async getMovers(direction: string = 'gainers', count: string = '10', region: string = 'IN') {
    return this.makeRequest('/market/v2/get-movers', {
      direction,
      count,
      region
    });
  }

  async getSummary(symbols: string, region: string = 'IN') {
    return this.makeRequest('/market/v2/get-summary', {
      symbols,
      region
    });
  }

  async getTickersByQuoteType(quoteType: string = 'EQUITY', count: string = '50', region: string = 'IN') {
    return this.makeRequest('/market/get-tickers-by-quote-type', {
      quoteType,
      count,
      region
    });
  }

  async getSpark(symbols: string, range: string = '1d', region: string = 'IN') {
    return this.makeRequest('/market/get-spark', {
      symbols,
      range,
      region
    });
  }

  async getEarnings(symbol: string, count: string = '4', region: string = 'IN') {
    return this.makeRequest('/market/get-earnings', {
      symbol,
      count,
      region
    });
  }

  async getTrendingTickers(count: string = '20', region: string = 'IN') {
    return this.makeRequest('/market/get-trending-tickers', {
      count,
      region
    });
  }

  async getPopularWatchlists(count: string = '10', category: string = 'all', region: string = 'IN') {
    return this.makeRequest('/market/get-popular-watchlists', {
      count,
      category,
      region
    });
  }

  async getWatchlistPerformance(watchlistId: string, period: string = '1mo', region: string = 'IN') {
    return this.makeRequest('/market/get-watchlist-performance', {
      watchlistId,
      period,
      region
    });
  }

  async getWatchlistDetail(watchlistId: string, region: string = 'IN') {
    return this.makeRequest('/market/get-watchlist-detail', {
      watchlistId,
      region
    });
  }
}

export const yahooFinanceApi = new YahooFinanceApi(); 