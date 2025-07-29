import { NextRequest, NextResponse } from 'next/server';
import { yahooFinanceApi } from '@/app/lib/yahoo-finance-api';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const watchlistId = searchParams.get('watchlistId');
    const period = searchParams.get('period') || '1mo'; // 1d, 1w, 1mo, 3mo, 6mo, 1y, 5y
              const region = searchParams.get('region') || 'IN';
    
    if (!watchlistId) {
      return NextResponse.json(
        { error: 'WatchlistId parameter is required' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.YAHOO_FINANCE_API_KEY) {
      return NextResponse.json(
        { error: 'Yahoo Finance API key not configured' },
        { status: 500 }
      );
    }

    // Make actual API call to Yahoo Finance
    const response = await yahooFinanceApi.getWatchlistPerformance(watchlistId, period, region);
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in get-watchlist-performance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch watchlist performance from Yahoo Finance API' },
      { status: 500 }
    );
  }
} 