import { NextRequest, NextResponse } from 'next/server';
import { yahooFinanceApi } from '@/app/lib/yahoo-finance-api';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const count = searchParams.get('count') || '10';
    const category = searchParams.get('category') || 'all'; // all, technology, healthcare, etc.
              const region = searchParams.get('region') || 'IN';
    
    // Check if API key is configured
    if (!process.env.YAHOO_FINANCE_API_KEY) {
      return NextResponse.json(
        { error: 'Yahoo Finance API key not configured' },
        { status: 500 }
      );
    }

    // Make actual API call to Yahoo Finance
    const response = await yahooFinanceApi.getPopularWatchlists(count, category, region);
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in get-popular-watchlists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch popular watchlists from Yahoo Finance API' },
      { status: 500 }
    );
  }
} 