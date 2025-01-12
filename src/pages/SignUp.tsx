import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useState } from 'react';
import type { UserProfile, GenderType, LocationType, YesNoType } from '../types';
import { ArrowRight, User, MapPin, IndianRupee, Upload, Loader2 } from 'lucide-react';

interface PostOffice {
  State: string;
  District: string;
  [key: string]: any;
}

interface PinCodeResponse {
  Message: string;
  Status: string;
  PostOffice: PostOffice[] | null;
}

export function SignUp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  const [loadingLocation, setLoadingLocation] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    gender: '',
    age: '',
    pincode: '',
    state: '',
    city: '',
    location: '',
    caste: '',
    disability: '',
    minority: '',
    student: '',
    bpl: '',
    income: '',
  });

  const handlePincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const pincode = e.target.value.trim();
    setFormData(prev => ({ ...prev, pincode }));
    if (pincode.length !== 6) {
      setFormData(prev => ({ ...prev, state: '', city: '' }));
      return;
    }

    setLoadingLocation(true);
    setError(null);

    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data: PinCodeResponse[] = await response.json();

      if (data[0]?.Status === 'Success' && data[0]?.PostOffice?.[0]) {
        const postOffice = data[0].PostOffice[0];
        setFormData(prev => ({
          ...prev,
          state: postOffice.State,
          city: postOffice.District
        }));
      } else {
        setError('Invalid PIN code or no data found');
        setFormData(prev => ({ ...prev, state: '', city: '' }));
      }
    } catch (error) {
      console.error('Error fetching location:', error);
      setError('Error fetching location data. Please try again.');
      setFormData(prev => ({ ...prev, state: '', city: '' }));
    } finally {
      setLoadingLocation(false);
    }
  };



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Calculate age when DOB changes
    if (name === 'dob') {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear() - 
          ((today.getMonth() < birthDate.getMonth() || 
          (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) ? 1 : 0);
      setFormData(prev => ({ ...prev, age: age.toString() }));
  }
  };



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        const userProfile: UserProfile = {
          email: formData.email,
          name: formData.name,
          gender: formData.gender as GenderType,
          age: parseInt(formData.age),
          state: formData.state,
          city: formData.city,
          pincode: formData.pincode,
          location: formData.location as LocationType,
          caste: formData.caste,
          disability: formData.disability as YesNoType,
          minority: formData.minority as YesNoType,
          student: formData.student as YesNoType,
          bpl: formData.bpl as YesNoType,
          income: parseFloat(formData.income),
        };

        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert([userProfile]);

        if (profileError) throw profileError;

        navigate('/login');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-slate-300 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-slate-300 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-slate-300 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                placeholder="••••••••"
              />
            </div>


          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="dob" className="block text-sm font-medium text-slate-700">
                  Date of Birth
                </label>
                <input
                  id="dob"
                  name="dob"
                  type="date"
                  required
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-slate-300 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-slate-700">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  required
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-slate-300 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="pincode" className="block text-sm font-medium text-slate-700">
                  PIN Code
                </label>
                <div className="relative">
                  <input
                    id="pincode"
                    name="pincode"
                    type="text"
                    maxLength={6}
                    pattern="\d{6}"
                    required
                    value={formData.pincode}
                    onChange={handlePincodeChange}
                    className="mt-1 block w-full border border-slate-300 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Enter 6-digit PIN code"
                  />
                  {loadingLocation && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
                    </div>
                  )}
                </div>
                {error && (
                  <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    readOnly
                    className="mt-1 block w-full border border-slate-300 rounded-xl shadow-sm py-3 px-4 bg-slate-50"
                    placeholder={loadingLocation ? "Loading..." : "State will appear here"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    readOnly
                    className="mt-1 block w-full border border-slate-300 rounded-xl shadow-sm py-3 px-4 bg-slate-50"
                    placeholder={loadingLocation ? "Loading..." : "City will appear here"}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-slate-700">
                  Location Type
                </label>
                <select
                  id="location"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-slate-300 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="">Select location</option>
                  <option value="Urban">Urban</option>
                  <option value="Rural">Rural</option>
                </select>
              </div>


              <div>
                <label htmlFor="caste" className="block text-sm font-medium text-slate-700">
                  Caste
                </label>
                <select
                  id="caste"
                  name="caste"
                  required
                  value={formData.caste}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-slate-300 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="">Select category</option>
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="PVTG">PVTG</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                </select>
              </div>
            </div>
          </div>

        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Disability
                </label>
                <select
                  name="disability"
                  required
                  value={formData.disability}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-slate-300 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="">Select </option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                 Minority
                </label>
                <select
                  name="minority"
                  required
                  value={formData.minority}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-slate-300 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="">Select </option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                student
              </label>
              <select
                name="student"
                required
                value={formData.student}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-slate-300 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="">Select </option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Below Poverty Line (BPL) family?
              </label>
              <select
                name="bpl"
                required
                value={formData.bpl}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-slate-300 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            <div>
              <label htmlFor="income" className="block text-sm font-medium text-slate-700">
                Annual Income (in ₹)
              </label>
              <input
                id="income"
                name="income"
                type="number"
                required
                min="0"
                value={formData.income}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-slate-300 rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                placeholder="Enter your annual income"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepIcon = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return User;
      case 2:
        return MapPin;
      case 3:
        return IndianRupee;
      default:
        return User;
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFAF5] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-serif font-bold text-slate-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-amber-600 hover:text-amber-500">
              Sign in
            </Link>
          </p>
        </div>

        <div className="flex justify-center space-x-4 mt-8">
          {[1, 2, 3].map((s) => {
            const Icon = getStepIcon(s);
            return (
              <div
                key={s}
                className={`flex items-center ${s === step ? 'text-amber-600' : 'text-slate-400'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${s === step
                    ? 'bg-amber-100'
                    : s < step
                      ? 'bg-amber-50 text-amber-600'
                      : 'bg-slate-100'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                {s < 3 && (
                  <div
                    className={`w-8 h-0.5 ${s < step ? 'bg-amber-600' : 'bg-slate-200'
                      }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-md sm:rounded-2xl sm:px-10">
          {error && (
            <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-100">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {renderStep()}

            <div className="mt-8 flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-xl shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                >
                  Back
                </button>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 ml-auto"
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 ml-auto disabled:opacity-50"
                >
                  {loading ? 'Creating account...' : 'Create account'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;