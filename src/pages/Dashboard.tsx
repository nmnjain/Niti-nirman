import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, RefreshCw, X } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { useLanguage } from '../context/LanguageContext';
import ChatbotInterface from '../components/ChatbotInterface';

// Types
interface Scheme {
  id: string;
  scheme_name: string;
  details: string | null;
  benefits: string | null;
  documents_required: string | null;
}

interface UserProfile {
  email: string;
  gender: string;
  age: number;
  location: string;
  caste: string;
  disability: string;
  minority: string;
  student: string;
  bpl: string;
  income: number;
}

// Supabase client setup
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// SchemeDocumentsModal Component
const SchemeDocumentsModal = ({ 
  isOpen, 
  onClose, 
  documents, 
  schemeName 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  documents: string | null; 
  schemeName: string; 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold leading-6 text-gray-900">
                Documents Required - {schemeName}
              </h3>
              <button
                onClick={onClose}
                className="rounded-md text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="mt-4">
              {documents ? (
                <div className="prose prose-sm">
                  {documents.split('\n').map((doc, index) => (
                    <div key={index} className="flex items-start py-1">
                      {doc.startsWith('-') ? (
                        <>
                          <span className="text-blue-600 mr-2">•</span>
                          <span>{doc.slice(1).trim()}</span>
                        </>
                      ) : (
                        <span>{doc}</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No documents information available.</p>
              )}
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
export function Dashboard() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [hasExistingSchemes, setHasExistingSchemes] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) throw authError;
        if (!user) {
          navigate('/login');
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('email', user.email)
          .single();

        if (profileError) throw profileError;
        setUserProfile(profile);

        const { data: existingSchemes, error: schemesError } = await supabase
          .from('user_eligible_schemes')
          .select('scheme_id')
          .eq('user_email', user.email);

        if (schemesError) throw schemesError;
        
        if (existingSchemes && existingSchemes.length > 0) {
          setHasExistingSchemes(true);
          await fetchExistingSchemes(user.email);
        }
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    };

    checkAuth();
  }, [navigate]);

  const fetchExistingSchemes = async (userEmail: string) => {
    try {
      setLoading(true);
      const { data: schemeDetails, error: schemeError } = await supabase
        .from('user_eligible_schemes')
        .select(`
          scheme_id,
          schemes:schemes(*)
        `)
        .eq('user_email', userEmail);

      if (schemeError) throw schemeError;

      if (schemeDetails && schemeDetails.length > 0) {
        const formattedSchemes = schemeDetails.map(item => item.schemes);
        setSchemes(formattedSchemes);
      }
    } catch (err) {
      console.error('Error fetching existing schemes:', err);
      setError('Failed to fetch existing schemes');
    } finally {
      setLoading(false);
    }
  };

  const findNewSchemes = async () => {
    if (!userProfile?.email) {
      setError('User profile not found');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const recommendationsResponse = await fetch('http://127.0.0.1:5000/get_recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userProfile.email }),
      });

      if (!recommendationsResponse.ok) {
        throw new Error(`Backend error: ${recommendationsResponse.statusText}`);
      }

      const recommendationsData = await recommendationsResponse.json();
      
      if (!recommendationsData.eligible_scheme_ids || !Array.isArray(recommendationsData.eligible_scheme_ids)) {
        throw new Error('Invalid response format from recommendations server');
      }

      await supabase
        .from('user_eligible_schemes')
        .delete()
        .eq('user_email', userProfile.email);

      for (const schemeId of recommendationsData.eligible_scheme_ids) {
        await supabase
          .from('user_eligible_schemes')
          .insert({
            user_email: userProfile.email,
            scheme_id: schemeId
          });
      }

      await fetchExistingSchemes(userProfile.email);
      setHasExistingSchemes(true);
    } catch (err) {
      console.error('Error finding schemes:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch eligible schemes');
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
        <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
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
          onClick={findNewSchemes}
          disabled={loading}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {hasExistingSchemes ? (
            <>
              <RefreshCw className="mr-2 h-5 w-5" />
              {loading ? 'Refreshing...' : 'Refresh Schemes'}
            </>
          ) : (
            <>
              <Search className="mr-2 h-5 w-5" />
              {loading ? 'Searching...' : 'Find Schemes for Me'}
            </>
          )}
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
                  onClick={() => {
                    setSelectedScheme(scheme);
                    setIsModalOpen(true);
                  }}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Documents Required
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <SchemeDocumentsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedScheme(null);
        }}
        documents={selectedScheme?.documents_required || ''}
        schemeName={selectedScheme?.scheme_name || ''}
      />

      <ChatbotInterface />
    </div>
  );
}