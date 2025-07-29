'use client';

import { useState, useEffect, useCallback } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';

interface Watchlist {
  id: string;
  name: string;
  description: string;
  category: string;
  symbolCount: number;
  followerCount: number;
  performance: {
    oneDay: number;
    oneWeek: number;
    oneMonth: number;
    threeMonth: number;
    oneYear: number;
  };
  topHoldings: Array<{
    symbol: string;
    name: string;
    weight: number;
    price: number;
    change: number;
  }>;
  createdBy: string;
  createdAt: string;
  lastUpdated: string;
}

export default function Watchlists() {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState('all');
  const [count, setCount] = useState('10');

  const fetchWatchlists = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/market/get-popular-watchlists?category=${category}&count=${count}&region=IN`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch watchlists');
      }
      
      const data = await response.json();
      
      // Handle the actual Yahoo Finance API response structure
      if (data.finance && data.finance.result && data.finance.result.length > 0) {
        const watchlistsData = data.finance.result.map((result: Record<string, unknown>) => ({
          id: (result.id as string) || '',
          name: (result.title as string) || '',
          description: (result.description as string) || '',
          category: (result.canonicalName as string) || 'all',
          symbolCount: (result.quotes as unknown[])?.length || 0,
          followerCount: 0, // Not available in API
          performance: {
            oneDay: 0,
            oneWeek: 0,
            oneMonth: 0,
            threeMonth: 0,
            oneYear: 0
          },
          topHoldings: (result.quotes as unknown[])?.slice(0, 3).map((quote) => ({
            symbol: (quote as Record<string, unknown>).symbol as string || '',
            name: ((quote as Record<string, unknown>).shortName as string) || ((quote as Record<string, unknown>).longName as string) || '',
            weight: 0,
            price: (quote as Record<string, unknown>).regularMarketPrice as number || 0,
            change: (quote as Record<string, unknown>).regularMarketChangePercent as number || 0
          })) || [],
          createdBy: 'Yahoo Finance',
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        }));
        setWatchlists(watchlistsData);
      } else {
        setWatchlists([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [category, count]);

  useEffect(() => {
    fetchWatchlists();
  }, [fetchWatchlists]);

  const formatNumber = (num: number) => {
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toString();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const getPerformanceColor = (performance: number) => {
    return performance >= 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <StarIcon className="h-6 w-6 text-yellow-500" />
            <h2 className="text-lg font-semibold text-gray-900">Popular Watchlists</h2>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Watchlist category filter"
            >
              <option value="all">All Categories</option>
              <option value="technology">Technology</option>
              <option value="healthcare">Healthcare</option>
              <option value="finance">Finance</option>
              <option value="energy">Energy</option>
            </select>
            <select
              value={count}
              onChange={(e) => setCount(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Number of watchlists to display"
            >
              <option value="5">Top 5</option>
              <option value="10">Top 10</option>
              <option value="20">Top 20</option>
            </select>
            <button
              onClick={fetchWatchlists}
              disabled={loading}
              className="px-4 py-1 bg-yellow-600 text-white rounded-md text-sm hover:bg-yellow-700 disabled:opacity-50"
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
            Loading watchlists...
          </div>
        ) : watchlists.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No watchlists available for the Indian market at this time.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {watchlists.map((watchlist) => (
              <div key={watchlist.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{watchlist.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{watchlist.description}</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {watchlist.category}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Symbols</p>
                    <p className="text-sm font-medium text-gray-900">{watchlist.symbolCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Followers</p>
                    <p className="text-sm font-medium text-gray-900">{formatNumber(watchlist.followerCount)}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-2">Top Holdings</p>
                  <div className="space-y-1">
                    {watchlist.topHoldings.map((holding) => (
                      <div key={holding.symbol} className="flex items-center justify-between text-xs">
                        <span className="font-medium text-gray-900">{holding.symbol}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-600">{formatPrice(holding.price)}</span>
                          <span className={holding.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                            {holding.change >= 0 ? '+' : ''}{Number.isFinite(holding.change) ? holding.change.toFixed(2) : 'N/A'}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Created by {watchlist.createdBy} • {new Date(watchlist.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 