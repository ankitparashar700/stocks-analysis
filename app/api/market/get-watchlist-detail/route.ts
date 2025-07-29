import { NextRequest, NextResponse } from 'next/server';
import { yahooFinanceApi } from '@/app/lib/yahoo-finance-api';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const watchlistId = searchParams.get('watchlistId');
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
    const response = await yahooFinanceApi.getWatchlistDetail(watchlistId, region);
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in get-watchlist-detail:', error);
    return NextResponse.json(
      { error: 'Failed to fetch watchlist detail from Yahoo Finance API' },
      { status: 500 }
    );
  }
} 