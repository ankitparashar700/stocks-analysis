import { NextRequest, NextResponse } from 'next/server';
import { yahooFinanceApi } from '@/app/lib/yahoo-finance-api';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');
    const count = searchParams.get('count') || '4';
              const region = searchParams.get('region') || 'IN';
    
    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol parameter is required' },
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
    const response = await yahooFinanceApi.getEarnings(symbol, count, region);
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in get-earnings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch earnings data from Yahoo Finance API' },
      { status: 500 }
    );
  }
} 