import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, RefreshCw, X, ArrowRight, FileText, Shield, Gift, AlertTriangle } from 'lucide-react';

import { createClient } from '@supabase/supabase-js';
import { useLanguage } from '../context/LanguageContext';
import ChatbotInterface from '../components/ChatbotInterface';
import { SchemeAPI } from '../services/api';
import { SchemeCard, SchemeModal } from '../components/SchemeComponents';


interface Scheme {
  id: string;
  scheme_name: string;
  details: string | null;
  benefits: string | null;
  documents_required: string | null;
  application_Process: string | null;
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
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const VerificationPrompt = ({ onVerifyClick }: { onVerifyClick: () => void }) => (
  <div className="bg-white rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-lg border border-slate-100 flex flex-col h-full">
    <div className="p-6 flex-1">
      <div className="flex items-center justify-center mb-4">
        <AlertTriangle className="h-12 w-12 text-amber-500" />
      </div>
      <h3 className="text-xl font-serif font-semibold text-slate-900 mb-3 text-center">
        Verification Required
      </h3>
      <p className="text-slate-600 text-center mb-4">
        Please verify your profile so that we can show you schemes curated specifically for you.
      </p>
    </div>
    <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
      <button
        onClick={onVerifyClick}
        className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-200"
      >
        <Shield className="w-4 h-4 mr-2" />
        Verify Now
      </button>
    </div>
  </div>
);



export function Dashboard() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [hasExistingSchemes, setHasExistingSchemes] = useState(false);
  
  const [modalContent, setModalContent] = useState<{
    isOpen: boolean;
    title: string;
    content: string | null;
    schemeName: string;
  }>({
    isOpen: false,
    title: '',
    content: null,
    schemeName: ''
  });

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
      const recommendationsData = await SchemeAPI.getRecommendations(userProfile.email);

      if (!recommendationsData.eligible_scheme_ids || !Array.isArray(recommendationsData.eligible_scheme_ids)) {
        throw new Error('Invalid response format from recommendations server');
      }

      // Delete existing schemes
      await supabase
        .from('user_eligible_schemes')
        .delete()
        .eq('user_email', userProfile.email);

      // Insert new schemes
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
  const handleVerifyClick = () => {
    navigate('/profile'); // Adjust this route as needed
  };

  const handleSchemeButtonClick = (
    type: 'details' | 'benefits' | 'documents' | 'process',
    scheme: Scheme
  ) => {
    const contentMap = {
      details: {
        title: 'Scheme Details',
        content: scheme.details
      },
      benefits: {
        title: 'Scheme Benefits',
        content: scheme.benefits
      },
      documents: {
        title: 'Required Documents',
        content: scheme.documents_required
      },
      process: {
        title: 'Application Process',
        content: scheme.application_Process
      }
    };

    const selected = contentMap[type];
    setModalContent({
      isOpen: true,
      title: selected.title,
      content: selected.content,
      schemeName: scheme.scheme_name
    });
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
              userProfile?.aadhar_verified ? (
                <SchemeCard
                  key={scheme.id}
                  scheme={scheme}
                  isVerified={true}
                  onButtonClick={handleSchemeButtonClick}
                />
              ) : (
                <VerificationPrompt key="verification-prompt" onVerifyClick={handleVerifyClick} />
              )
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

        
      </div>

      <SchemeModal
        isOpen={modalContent.isOpen}
        onClose={() => setModalContent(prev => ({ ...prev, isOpen: false }))}
        title={modalContent.title}
        content={modalContent.content}
        schemeName={modalContent.schemeName}
      />
      <ChatbotInterface />
    </div>
  );
}
