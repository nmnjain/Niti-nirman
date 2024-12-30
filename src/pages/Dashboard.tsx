// components/Dashboard.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

import { getRecommendations } from '../services/api';
import type { Scheme, UserProfile } from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [schemes, setSchemes] = React.useState<Scheme[]>([]);
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);

  React.useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data: profiles, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', user.email)
        .single();

      if (profileError) {
        setError('Error fetching user profile');
        return;
      }

      setUserProfile(profiles);
    };

    checkAuth();
  }, [navigate]);

  const findSchemes = async () => {
    if (!userProfile?.email) return;

    setLoading(true);
    setError(null);
    setSchemes([]); // Clear previous results

    try {
      const recommendations = await getRecommendations(userProfile.email);
      setSchemes(recommendations);
      
      if (recommendations.length === 0) {
        setError('No eligible schemes found for your profile');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!userProfile) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 translate">Welcome Back!</h1>
        <p className="mt-4 text-lg text-gray-500">
          Find government schemes that match your profile
        </p>
      </div>

      {error && (
        <div className="mt-8 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <button
          onClick={findSchemes}
          disabled={loading}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <Search className="mr-2 h-5 w-5" />
          {loading ? 'Searching...' : 'Find Schemes for Me'}
        </button>
      </div>

      {schemes.length > 0 && (
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {schemes.map((scheme) => (
            <div
              key={scheme.id}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200"
            >
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {scheme.scheme_name}
                </h3>
                {scheme.details && (
                  <p className="mt-2 text-sm text-gray-500">
                    {scheme.details}
                  </p>
                )}
                {scheme.benefits && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900">Benefits:</h4>
                    <p className="mt-1 text-sm text-gray-500">{scheme.benefits}</p>
                  </div>
                )}
                
              </div>
              <div className="px-4 py-4 border-t">
                <button
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Check Your Eligibility
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      
    </div>
  );
}