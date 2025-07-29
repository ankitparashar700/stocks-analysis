'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

interface MarketMover {
  symbol: string;
  shortName?: string;
  longName?: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketVolume: number;
  marketCap: number;
  regularMarketPreviousClose: number;
  currency: string;
}

async function fetchQuotesForSymbols(symbols: string[]): Promise<MarketMover[]> {
  if (!symbols.length) return [];
  const response = await fetch(`/api/market/v2/get-quotes?symbols=${symbols.join(',')}&region=IN`);
  if (!response.ok) return [];
  const data = await response.json();
  if (data.quoteResponse && data.quoteResponse.result) {
    return data.quoteResponse.result;
  }
  return [];
}

export default function MarketMovers() {
  const [gainers, setGainers] = useState<MarketMover[]>([]);
  const [losers, setLosers] = useState<MarketMover[]>([]);
  const [actives, setActives] = useState<MarketMover[]>([]);
  const [loadingGainers, setLoadingGainers] = useState(true);
  const [loadingLosers, setLoadingLosers] = useState(true);
  const [loadingActives, setLoadingActives] = useState(true);
  const [errorGainers, setErrorGainers] = useState<string | null>(null);
  const [errorLosers, setErrorLosers] = useState<string | null>(null);
  const [errorActives, setErrorActives] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  const fetchMovers = useCallback(async (direction: string) => {
    try {
      if (direction === 'gainers') { setLoadingGainers(true); setErrorGainers(null); }
      if (direction === 'losers') { setLoadingLosers(true); setErrorLosers(null); }
      if (direction === 'actives') { setLoadingActives(true); setErrorActives(null); }
      const response = await fetch(`/api/market/v2/get-movers?direction=${direction}&count=10&region=IN`);
      if (!response.ok) {
        throw new Error('Failed to fetch market movers');
      }
      const data = await response.json();
      if (data.finance && data.finance.result && data.finance.result.length > 0) {
        const quotes = data.finance.result[0].quotes || [];
        const symbols = quotes.map((q: any) => q.symbol).filter(Boolean);
        const fullQuotes = await fetchQuotesForSymbols(symbols);
        switch (direction) {
          case 'gainers':
            setGainers(fullQuotes);
            setLoadingGainers(false);
            break;
          case 'losers':
            setLosers(fullQuotes);
            setLoadingLosers(false);
            break;
          case 'actives':
            setActives(fullQuotes);
            setLoadingActives(false);
            break;
        }
      } else {
        switch (direction) {
          case 'gainers':
            setGainers([]);
            setLoadingGainers(false);
            setErrorGainers('No data available');
            break;
          case 'losers':
            setLosers([]);
            setLoadingLosers(false);
            setErrorLosers('No data available');
            break;
          case 'actives':
            setActives([]);
            setLoadingActives(false);
            setErrorActives('No data available');
            break;
        }
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'An error occurred';
      switch (direction) {
        case 'gainers':
          setErrorGainers(errMsg);
          setLoadingGainers(false);
          break;
        case 'losers':
          setErrorLosers(errMsg);
          setLoadingLosers(false);
          break;
        case 'actives':
          setErrorActives(errMsg);
          setLoadingActives(false);
          break;
      }
    }
  }, []);

  useEffect(() => {
    fetchMovers('gainers');
    fetchMovers('losers');
    fetchMovers('actives');
  }, [fetchMovers]);

  const formatNumber = (num: number | undefined | null) => {
    if (!Number.isFinite(num)) return 'N/A';
    const safeNum = num as number;
    if (safeNum >= 1e9) return (safeNum / 1e9).toFixed(2) + 'B';
    if (safeNum >= 1e6) return (safeNum / 1e6).toFixed(2) + 'M';
    if (safeNum >= 1e3) return (safeNum / 1e3).toFixed(2) + 'K';
    return safeNum.toFixed(2);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const renderMoversTable = (movers: MarketMover[], title: string, loading: boolean, error: string | null) => (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        {error ? (
          <div className="p-6 text-center text-red-600">
            {error}
          </div>
        ) : loading ? (
          <div className="p-6 text-center text-gray-500">
            Loading {title.toLowerCase()}...
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
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
              {movers.map((mover) => (
                <tr key={mover.symbol} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {mover.symbol}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {mover.shortName || mover.longName || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatPrice(mover.regularMarketPrice)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {mover.regularMarketChange >= 0 ? (
                        <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${
                        mover.regularMarketChange >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatPrice(Math.abs(mover.regularMarketChange))} ({Number.isFinite(mover.regularMarketChangePercent) ? mover.regularMarketChangePercent.toFixed(2) : 'N/A'}%)
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatNumber(mover.regularMarketVolume)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatNumber(mover.marketCap)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <button
          onClick={() => setActiveTab(0)}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            activeTab === 0
              ? 'bg-green-100 text-green-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Top Gainers
        </button>
        <button
          onClick={() => setActiveTab(1)}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            activeTab === 1
              ? 'bg-red-100 text-red-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Top Losers
        </button>
        <button
          onClick={() => setActiveTab(2)}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            activeTab === 2
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Most Active
        </button>
      </div>

      {activeTab === 0 && renderMoversTable(gainers, 'Top Gainers', loadingGainers, errorGainers)}
      {activeTab === 1 && renderMoversTable(losers, 'Top Losers', loadingLosers, errorLosers)}
      {activeTab === 2 && renderMoversTable(actives, 'Most Active', loadingActives, errorActives)}
    </div>
  );
} 