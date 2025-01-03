// services/api.ts
import { createClient } from '@supabase/supabase-js';
import { Scheme } from '../types';

const API_URL = 'http://127.0.0.1:5000';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function getRecommendations(email: string): Promise<Scheme[]> {
  try {
    // First, get eligible scheme IDs from Python API
    const response = await fetch(`${API_URL}/get_recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new ApiError(error.error || 'Failed to fetch recommendations', response.status);
    }

    const data = await response.json();
    const schemeIds = data.eligible_scheme_ids;

    if (!schemeIds || !schemeIds.length) {
      return [];
    }

    // Then, fetch scheme details from Supabase
    const { data: schemes, error } = await supabase
      .from('schemes')
      .select('*')
      .in('id', schemeIds);

    if (error) {
      throw new ApiError('Failed to fetch scheme details from database', 500);
    }

    return schemes || [];
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Failed to connect to the server', 500);
  }
}