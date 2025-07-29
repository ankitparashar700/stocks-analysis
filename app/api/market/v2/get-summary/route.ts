import { NextRequest, NextResponse } from 'next/server';
import { yahooFinanceApi } from '@/app/lib/yahoo-finance-api';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const symbols = searchParams.get('symbols');
              const region = searchParams.get('region') || 'IN';
    
    if (!symbols) {
      return NextResponse.json(
        { error: 'Symbols parameter is required' },
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
    const response = await yahooFinanceApi.getSummary(symbols, region);
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in get-summary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market summary from Yahoo Finance API' },
      { status: 500 }
    );
  }
} 