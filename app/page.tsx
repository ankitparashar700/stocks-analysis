'use client';

import { useState, useEffect, useMemo } from 'react';
import StockQuotes from '../components/StockQuotes';
import MarketMovers from '../components/MarketMovers';
import TrendingTickers from '../components/TrendingTickers';
import Watchlists from '../components/Watchlists';
import EarningsCalendar from '../components/EarningsCalendar';
import SparkCharts from '../components/SparkCharts';
import { Tab } from '@headlessui/react';

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);
  const [now, setNow] = useState('');

  useEffect(() => {
    const update = () => setNow(new Date().toLocaleTimeString());
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">Stock Market Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Last updated: {now || '...'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-8">
            <Tab
              className={({ selected }: { selected: boolean }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                ${selected 
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                }`
              }
            >
              Market Overview
            </Tab>
            <Tab
              className={({ selected }: { selected: boolean }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                ${selected 
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                }`
              }
            >
              Trending Stocks
            </Tab>
            <Tab
              className={({ selected }: { selected: boolean }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                ${selected 
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                }`
              }
            >
              Watchlists
            </Tab>
            <Tab
              className={({ selected }: { selected: boolean }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                ${selected 
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                }`
              }
            >
              Earnings
            </Tab>
            <Tab
              className={({ selected }: { selected: boolean }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                ${selected 
                  ? 'bg-white text-blue-700 shadow'
                  : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                }`
              }
            >
              Charts
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-2">
            <Tab.Panel>
              <div className="space-y-6">
                <StockQuotes />
                <MarketMovers />
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <TrendingTickers />
            </Tab.Panel>
            <Tab.Panel>
              <Watchlists />
            </Tab.Panel>
            <Tab.Panel>
              <EarningsCalendar />
            </Tab.Panel>
            <Tab.Panel>
              <SparkCharts />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </main>
    </div>
  );
}
