'use client';

import { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartBarIcon } from '@heroicons/react/24/solid';

interface SparkData {
  symbol: string;
  timestamp: number[];
  close: number[];
  previousClose: number;
  chartPreviousClose: number;
  start: number;
  end: number;
  dataGranularity: number;
}

export default function SparkCharts() {
  const [sparkData, setSparkData] = useState<SparkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [symbols, setSymbols] = useState('RELIANCE.NS,TCS.NS,INFY.NS');
  const [range, setRange] = useState('1d');

  const fetchSparkData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/market/get-spark?symbols=${symbols}&range=${range}&region=IN`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch spark data');
      }
      
      const data = await response.json();
      
      // Handle the actual Yahoo Finance API response structure
      const sparkDataArray: SparkData[] = [];
      for (const [symbol, sparkData] of Object.entries(data)) {
        if (typeof sparkData === 'object' && sparkData !== null) {
          sparkDataArray.push({
            symbol,
            ...(sparkData as SparkData)
          });
        }
      }
      
      setSparkData(sparkDataArray);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [symbols, range]);

  useEffect(() => {
    fetchSparkData();
  }, [fetchSparkData]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    switch (range) {
      case '1d':
        return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      case '5d':
      case '1mo':
        return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      default:
        return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    }
  };

  const getPriceChange = (data: SparkData) => {
    if (!Array.isArray(data.close) || data.close.length < 2) return 0;
    const firstPrice = data.close[0];
    const lastPrice = data.close[data.close.length - 1];
    return ((lastPrice - firstPrice) / firstPrice) * 100;
  };

  const getPriceChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ChartBarIcon className="h-6 w-6 text-indigo-500" />
            <h2 className="text-lg font-semibold text-gray-900">Price Charts</h2>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={symbols}
              onChange={(e) => setSymbols(e.target.value)}
              placeholder="Enter symbols (e.g., RELIANCE.NS,TCS.NS,INFY.NS)"
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Chart time range"
            >
              <option value="1d">1 Day</option>
              <option value="5d">5 Days</option>
              <option value="1mo">1 Month</option>
              <option value="3mo">3 Months</option>
              <option value="6mo">6 Months</option>
              <option value="1y">1 Year</option>
            </select>
            <button
              onClick={fetchSparkData}
              disabled={loading}
              className="px-4 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Update'}
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {error ? (
          <div className="text-center text-red-600">
            {error}
          </div>
        ) : loading ? (
          <div className="text-center text-gray-500">
            Loading charts...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {sparkData.map((data) => {
              const priceChange = getPriceChange(data);
              const chartData = Array.isArray(data.timestamp) && Array.isArray(data.close)
                ? data.timestamp.map((timestamp, index) => ({
                    time: formatDate(timestamp),
                    price: data.close[index],
                    index
                  }))
                : [];

              const minPrice = Array.isArray(data.close) && data.close.length > 0 ? Math.min(...data.close) : 0;
              const maxPrice = Array.isArray(data.close) && data.close.length > 0 ? Math.max(...data.close) : 0;

              return (
                <div key={data.symbol} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{data.symbol}</h3>
                      <p className="text-sm text-gray-600">Previous Close: {formatPrice(data.previousClose)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {Array.isArray(data.close) && data.close.length > 0 ? formatPrice(data.close[data.close.length - 1]) : 'N/A'}
                      </p>
                      <p className={`text-sm font-medium ${getPriceChangeColor(priceChange)}`}>
                        {priceChange >= 0 ? '+' : ''}{Number.isFinite(priceChange) ? priceChange.toFixed(2) : 'N/A'}%
                      </p>
                    </div>
                  </div>

                  <div className="h-32 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="time" 
                          tick={{ fontSize: 10 }}
                          interval="preserveStartEnd"
                        />
                        <YAxis 
                          tick={{ fontSize: 10 }}
                          domain={[minPrice - 1, maxPrice + 1]}
                        />
                        <Tooltip 
                          formatter={(value: number) => [formatPrice(value), 'Price']}
                          labelFormatter={(label: string) => `Time: ${label}`}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="price" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-gray-500">Previous Close</p>
                      <p className="font-medium text-gray-900">
                        {formatPrice(data.previousClose)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Range</p>
                      <p className="font-medium text-gray-900">
                        {formatPrice(minPrice)} - {formatPrice(maxPrice)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Data Points</p>
                      <p className="font-medium text-gray-900">
                        {Array.isArray(data.close) ? data.close.length : 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Time Range</p>
                      <p className="font-medium text-gray-900">
                        {formatDate(data.start)} - {formatDate(data.end)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 