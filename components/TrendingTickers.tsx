'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowUpIcon, ArrowDownIcon, FireIcon } from '@heroicons/react/24/solid';

interface TrendingTicker {
  symbol: string;
  shortName?: string;
  longName?: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketVolume: number;
  marketCap: number;
  currency: string;
}

export default function TrendingTickers() {
  const [trendingTickers, setTrendingTickers] = useState<TrendingTicker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState('20');

  const fetchTrendingTickers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/market/get-trending-tickers?count=${count}&region=IN`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch trending tickers');
      }
      
      const data = await response.json();
      
      // Handle the actual Yahoo Finance API response structure
      if (data.finance && data.finance.result && data.finance.result.length > 0) {
        const quotes = data.finance.result[0].quotes || [];
        setTrendingTickers(quotes);
      } else {
        setTrendingTickers([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [count]);

  useEffect(() => {
    fetchTrendingTickers();
  }, [fetchTrendingTickers]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.5) return 'text-green-600';
    if (sentiment > 0) return 'text-yellow-600';
    if (sentiment > -0.5) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FireIcon className="h-6 w-6 text-orange-500" />
            <h2 className="text-lg font-semibold text-gray-900">Trending Stocks</h2>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={count}
              onChange={(e) => setCount(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Number of trending stocks to display"
            >
              <option value="10">Top 10</option>
              <option value="20">Top 20</option>
              <option value="50">Top 50</option>
            </select>
            <button
              onClick={fetchTrendingTickers}
              disabled={loading}
              className="px-4 py-1 bg-orange-600 text-white rounded-md text-sm hover:bg-orange-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        {error ? (
          <div className="p-6 text-center text-red-600">
            {error}
          </div>
        ) : loading ? (
          <div className="p-6 text-center text-gray-500">
            Loading trending stocks...
          </div>
        ) : trendingTickers.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No trending stocks available for the Indian market at this time.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Symbol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Change
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Volume
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Market Cap
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {trendingTickers.map((ticker, index) => (
                <tr key={ticker.symbol} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      #{index + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {ticker.symbol}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {ticker.shortName || ticker.longName || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatPrice(ticker.regularMarketPrice)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {ticker.regularMarketChange >= 0 ? (
                        <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${
                        ticker.regularMarketChange >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatPrice(Math.abs(ticker.regularMarketChange))} ({Number.isFinite(ticker.regularMarketChangePercent) ? ticker.regularMarketChangePercent.toFixed(2) : 'N/A'}%)
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ticker.regularMarketVolume.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {ticker.marketCap >= 1e9 
                      ? (ticker.marketCap / 1e9).toFixed(2) + 'B'
                      : ticker.marketCap >= 1e6 
                        ? (ticker.marketCap / 1e6).toFixed(2) + 'M'
                        : ticker.marketCap.toLocaleString()
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
} 