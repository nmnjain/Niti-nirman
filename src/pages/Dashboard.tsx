import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, RefreshCw, X, ArrowRight, FileText, Shield, Gift } from 'lucide-react';
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

const SchemeCard = ({ 
  scheme, 
  onViewDocuments 
}: { 
  scheme: Scheme; 
  onViewDocuments: () => void;
}) => (
  <div className="bg-white rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-lg border border-slate-100 flex flex-col h-full">
    <div className="p-6 flex-1">
      <h3 className="text-xl font-serif font-semibold text-slate-900 mb-3">
        {scheme.scheme_name}
      </h3>
      {scheme.details && (
        <p className="text-slate-600 mb-4 leading-relaxed">
          {scheme.details}
        </p>
      )}
      {scheme.benefits && (
        <div className="space-y-3">
          <div className="flex items-center text-amber-600">
            <Gift className="h-5 w-5 mr-2" />
            <h4 className="font-medium">Benefits</h4>
          </div>
          <p className="text-slate-600 pl-7">
            {scheme.benefits}
          </p>
        </div>
      )}
    </div>
    <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 mt-auto">
      <button
        onClick={onViewDocuments}
        className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-200"
      >
        <FileText className="w-4 h-4 mr-2" />
        View Required Documents
      </button>
    </div>
  </div>
);

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
        className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-6 py-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center">
                <Shield className="h-6 w-6 text-amber-600 mr-3" />
                <h3 className="text-xl font-serif font-semibold text-slate-900">
                  Required Documents
                </h3>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-500 hover:bg-slate-100 transition-all duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mt-4">
              <h4 className="text-lg font-medium text-slate-900 mb-4">{schemeName}</h4>
              {documents ? (
                <div className="space-y-3">
                  {documents.split('\n').map((doc, index) => (
                    <div key={index} className="flex items-start">
                      {doc.startsWith('-') ? (
                        <>
                          <div className="h-2 w-2 rounded-full bg-amber-600 mt-2 mr-3" />
                          <span className="text-slate-600">{doc.slice(1).trim()}</span>
                        </>
                      ) : (
                        <span className="text-slate-600">{doc}</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500">No documents information available.</p>
              )}
            </div>
          </div>

          <div className="bg-slate-50 px-6 py-4 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-200"
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
      <div className="min-h-screen bg-[#FFFAF5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-32 bg-amber-100 rounded-full mx-auto" />
            <div className="h-4 w-48 bg-amber-50 rounded-full mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFAF5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4">
            Welcome Back!
          </h1>
          <p className="text-lg text-slate-600 mb-8">
            Discover government schemes tailored to your profile
          </p>
          <button
            onClick={findNewSchemes}
            disabled={loading}
            className="inline-flex items-center px-6 py-3 text-base font-medium rounded-full text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {hasExistingSchemes ? (
              <>
                <RefreshCw className={`mr-2 h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Refreshing...' : 'Refresh Schemes'}
              </>
            ) : (
              <>
                <Search className="mr-2 h-5 w-5" />
                {loading ? 'Searching...' : 'Find Schemes for Me'}
              </>
            )}
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="p-4 rounded-lg bg-red-50 border border-red-100">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {schemes.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {schemes.map((scheme) => (
              <SchemeCard
                key={scheme.id}
                scheme={scheme}
                onViewDocuments={() => {
                  setSelectedScheme(scheme);
                  setIsModalOpen(true);
                }}
              />
            ))}
          </div>
        )}

        {!loading && schemes.length === 0 && (
          <div className="text-center max-w-md mx-auto mt-12">
            <div className="bg-white rounded-2xl p-6 border border-slate-100">
              <Search className="h-12 w-12 text-amber-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                No schemes found yet
              </h3>
              <p className="text-slate-600">
                Click the button above to find government schemes that match your profile.
              </p>
            </div>
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
      </div>

      <ChatbotInterface />
    </div>
  );
}
