import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { UserCircle, MapPin, IndianRupee, Save, Loader2, Upload, Shield, GraduationCap, Users, Check } from 'lucide-react';
import AadhaarVerification from '../components/AadhaarVerification';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const ProfilePage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [photoPreview, setPhotoPreview] = useState(null);
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        gender: '',
        age: 0,
        location: '',
        state: '',
        city: '',
        caste: '',
        disability: '',
        minority: '',
        student: '',
        bpl: '',
        income: 0,
        profile_photo: null,
        aadhaarVerified: false
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError) throw authError;
            if (!user) {
                navigate('/login');
                return;
            }

            const { data, error: profileError } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('email', user.email)
                .single();

            if (profileError) throw profileError;
            setProfile({
                ...data,
                aadhaarVerified: data.aadhar_verified 
            });
            if (data.profile_photo) {
                const { data: photoData } = await supabase.storage
                    .from('profiles')
                    .getPublicUrl(data.profile_photo);
                setPhotoPreview(photoData.publicUrl);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
            const fileExt = file.name.split('.').pop();
            const fileName = `${profile.email}-${Math.random()}.${fileExt}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('profile-photos')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { error: updateError } = await supabase
                .from('user_profiles')
                .update({ profile_photo: fileName })
                .eq('email', profile.email);

            if (updateError) throw updateError;

            setSuccessMessage('Profile photo updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccessMessage('');

        try {
            const { error: updateError } = await supabase
                .from('user_profiles')
                .update({
                    age: parseInt(profile.age),
                    state: profile.state,
                    city: profile.city,
                    income: profile.income
                })
                .eq('email', profile.email);

            if (updateError) throw updateError;
            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FFFAF5] flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-amber-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFFAF5] py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Profile Header */}
                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mb-8 overflow-hidden">
                    <div className="px-8 py-6 bg-gradient-to-r from-amber-500 to-amber-600">
                        <div className="flex items-center">
                            <div className="relative">
                                {photoPreview ? (
                                    <img
                                        src={photoPreview}
                                        alt="Profile"
                                        className="h-24 w-24 rounded-full object-cover border-4 border-white"
                                    />
                                ) : (
                                    <UserCircle className="h-24 w-24 text-white" />
                                )}
                                <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer">
                                    <Upload className="h-4 w-4 text-amber-600" />
                                    <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                                </label>
                                
                            </div>
                            <div className="ml-6">
                                <div className="flex items-center gap-2">
                                    <h1 className="text-2xl font-serif font-bold text-white">{profile.name}</h1>
                                    {profile.aadhaarVerified && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            <Check className="h-3 w-3 mr-1" />
                                            Verified
                                        </span>
                                    )}
                                </div>
                                <p className="text-amber-100">{profile.email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center">
                        <Shield className="h-10 w-10 text-amber-600" />
                        <div className="ml-4">
                            <p className="text-sm text-slate-500">Caste Category</p>
                            <p className="text-lg font-medium text-slate-900">{profile.caste}</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center">
                        <GraduationCap className="h-10 w-10 text-amber-600" />
                        <div className="ml-4">
                            <p className="text-sm text-slate-500">Student Status</p>
                            <p className="text-lg font-medium text-slate-900">{profile.student}</p>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-center">
                        <Users className="h-10 w-10 text-amber-600" />
                        <div className="ml-4">
                            <p className="text-sm text-slate-500">Minority Status</p>
                            <p className="text-lg font-medium text-slate-900">{profile.minority}</p>
                        </div>
                    </div>
                </div>

                
                {!profile.aadhaarVerified && (
                    <div className="mb-8">
                        <AadhaarVerification
                            isVerified={profile.aadhaarVerified}
                            email={profile.email}
                            onVerificationSuccess={() => {
                                setProfile({ ...profile, aadhaarVerified: true });
                                setSuccessMessage('Aadhaar verification successful!');
                            }}
                        />
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="px-8 py-6">
                        <h2 className="text-xl font-serif font-semibold text-slate-900 mb-6">Update Profile</h2>

                        {error && (
                            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        {successMessage && (
                            <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-100">
                                <p className="text-sm text-green-700">{successMessage}</p>
                            </div>
                        )}

                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Age</label>
                                <input
                                    type="number"
                                    value={profile.age || ''}
                                    onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                                    className="mt-1 block w-full border-slate-200 rounded-lg shadow-sm focus:ring-amber-500 focus:border-amber-500"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        <div className="flex items-center">
                                            <MapPin className="h-4 w-4 mr-2 text-amber-600" />
                                            State
                                        </div>
                                    </label>
                                    <input
                                        type="text"
                                        value={profile.state || ''}
                                        onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                                        className="mt-1 block w-full border-slate-200 rounded-lg shadow-sm focus:ring-amber-500 focus:border-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                                    <input
                                        type="text"
                                        value={profile.city || ''}
                                        onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                                        className="mt-1 block w-full border-slate-200 rounded-lg shadow-sm focus:ring-amber-500 focus:border-amber-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    <div className="flex items-center">
                                        <IndianRupee className="h-4 w-4 mr-2 text-amber-600" />
                                        Annual Income
                                    </div>
                                </label>
                                <input
                                    type="number"
                                    value={profile.income || ''}
                                    onChange={(e) => setProfile({ ...profile, income: parseFloat(e.target.value) })}
                                    className="mt-1 block w-full border-slate-200 rounded-lg shadow-sm focus:ring-amber-500 focus:border-amber-500"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 mb-1">Gender</label>
                                    <p className="text-slate-900">{profile.gender}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 mb-1">Location Type</label>
                                    <p className="text-slate-900">{profile.location}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 mb-1">Disability Status</label>
                                    <p className="text-slate-900">{profile.disability}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 mb-1">BPL Status</label>
                                    <p className="text-slate-900">{profile.bpl}</p>
                                </div>
                            </div>

                            <div className="flex justify-end pt-6">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="animate-spin h-5 w-5 mr-2" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-5 w-5 mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;