'use client';

import { useState, useEffect, useCallback } from 'react';
import { CalendarIcon } from '@heroicons/react/24/solid';

interface Earnings {
  symbol: string;
  quarter: string;
  year: number;
  reportDate: string;
  estimate: number;
  actual: number;
  surprise: number;
  surprisePercent: number;
  revenueEstimate: number;
  revenueActual: number;
  revenueSurprise: number;
  revenueSurprisePercent: number;
}

export default function EarningsCalendar() {
  const [earnings, setEarnings] = useState<Earnings[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [symbol, setSymbol] = useState('RELIANCE.NS');
  const [count, setCount] = useState('4');

  const fetchEarnings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/market/get-earnings?symbol=${symbol}&count=${count}&region=IN`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch earnings data');
      }
      
      const data = await response.json();
      
      // Handle the actual Yahoo Finance API response structure
      if (data.earnings && data.earnings.earningsChart && data.earnings.earningsChart.quarterly) {
        const quarterlyEarnings = data.earnings.earningsChart.quarterly;
        const earningsData = quarterlyEarnings.map((quarter: Record<string, unknown>) => {
          const date = quarter.date as string;
          const estimate = quarter.estimate as number || 0;
          const actual = quarter.actual as number || 0;
          
          return {
            symbol: symbol,
            quarter: date.split('Q')[1] || '',
            year: parseInt(date.split('Q')[0]) || new Date().getFullYear(),
            reportDate: new Date().toISOString(), // Not available in API
            estimate: estimate,
            actual: actual,
            surprise: actual - estimate,
            surprisePercent: estimate ? ((actual - estimate) / estimate) * 100 : 0,
            revenueEstimate: 0, // Not available in API
            revenueActual: 0, // Not available in API
            revenueSurprise: 0,
            revenueSurprisePercent: 0
          };
        });
        setEarnings(earningsData);
      } else {
        setEarnings([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [symbol, count]);

  useEffect(() => {
    fetchEarnings();
  }, [fetchEarnings]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getSurpriseColor = (surprise: number) => {
    if (surprise > 0) return 'text-green-600';
    if (surprise < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-6 w-6 text-purple-500" />
            <h2 className="text-lg font-semibold text-gray-900">Earnings Calendar</h2>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="Enter symbol (e.g., RELIANCE.NS)"
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <select
              value={count}
              onChange={(e) => setCount(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="Number of quarters to display"
            >
              <option value="4">Last 4 Quarters</option>
              <option value="8">Last 8 Quarters</option>
              <option value="12">Last 12 Quarters</option>
            </select>
            <button
              onClick={fetchEarnings}
              disabled={loading}
              className="px-4 py-1 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Fetch'}
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
            Loading earnings data...
          </div>
        ) : earnings.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No earnings data available for this symbol.
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Earnings Table */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Earnings History</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quarter
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estimate
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actual
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Surprise
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {earnings.map((earning) => (
                        <tr key={`${earning.symbol}-${earning.quarter}-${earning.year}`} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            Q{earning.quarter} {earning.year}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(earning.estimate)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(earning.actual)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`text-sm font-medium ${getSurpriseColor(earning.surprise)}`}>
                              {earning.surprise > 0 ? '+' : ''}{formatCurrency(earning.surprise)} ({Number.isFinite(earning.surprisePercent) ? (earning.surprisePercent > 0 ? '+' : '') + earning.surprisePercent.toFixed(2) : 'N/A'}%)
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary Stats */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Summary</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-500">Average Beat Rate</h4>
                    <p className="text-2xl font-bold text-gray-900">
                      {earnings.filter(e => e.surprise > 0).length > 0 
                        ? ((earnings.filter(e => e.surprise > 0).length / earnings.length) * 100).toFixed(1)
                        : '0'}%
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-500">Average EPS Surprise</h4>
                    <p className="text-2xl font-bold text-gray-900">
                      {earnings.length > 0 
                        ? (earnings.reduce((sum, e) => sum + e.surprisePercent, 0) / earnings.length).toFixed(2)
                        : '0'}%
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-500">Total Quarters</h4>
                    <p className="text-2xl font-bold text-gray-900">
                      {earnings.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 