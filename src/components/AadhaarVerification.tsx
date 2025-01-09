import React, { useState } from 'react';
import { Shield, Upload, Loader2, Check } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);

const Alert = ({ children, variant = 'error' }) => {
    const styles = {
        error: 'bg-red-50 border-red-200 text-red-700',
        success: 'bg-green-50 border-green-200 text-green-700'
    };

    return (
        <div className={`p-4 rounded-lg border ${styles[variant]}`}>
            {children}
        </div>
    );
};

const AadhaarVerification = ({ isVerified, email, onVerificationSuccess }) => {
    const [frontImage, setFrontImage] = useState(null);
    const [backImage, setBackImage] = useState(null);
    const [frontPreview, setFrontPreview] = useState(null);
    const [backPreview, setBackPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleImageUpload = (e, side) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            if (side === 'front') {
                setFrontImage(file);
                setFrontPreview(reader.result);
            } else {
                setBackImage(file);
                setBackPreview(reader.result);
            }
        };
        reader.readAsDataURL(file);
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64String = reader.result.split(',')[1];
                resolve(base64String);
            };
            reader.onerror = (error) => reject(error);
        });
    };

    const handleVerification = async () => {
        if (!frontImage || !backImage) {
            setError('Please upload both front and back images of your Aadhaar card');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const frontBase64 = await convertToBase64(frontImage);
            const backBase64 = await convertToBase64(backImage);
    
            const response = await fetch('http://127.0.0.1:5000/verify_aadhaar', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    front_image: frontBase64,
                    back_image: backBase64
                })
            });

            const { verified } = await response.json();

            if (verified) {
                const { error: updateError } = await supabase
                    .from('user_profiles')
                    .update({ aadhar_verified: true })
                    .eq('email', email);

                if (updateError) {
                    throw new Error('Failed to update verification status');
                }
                onVerificationSuccess();
            } else {
                setError('Verification failed. Please ensure your Aadhaar details match your profile information.');
            }
        } catch (err) {
            setError('Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    if (isVerified) {
        return (
            <div className="bg-green-50 border border-green-100 rounded-xl p-6 flex items-center">
                <Shield className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                    <h3 className="text-lg font-medium text-green-900"> Profile Verified</h3>
                    <p className="text-green-700">Your identity has been verified successfully</p>
                </div>
                <Check className="h-6 w-6 text-green-600 ml-auto" />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="text-lg font-medium text-slate-900">Profile Verification</h3>
                <p className="text-sm text-slate-500">Upload your Aadhaar card images to verify your identity</p>
            </div>

            <div className="p-6 space-y-6">                                                                                                                                                                                                                                                                                                                                             
                {error && (
                    <Alert variant="error">
                        {error}
                    </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Front Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Front Side</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg">
                            {frontPreview ? (
                                <div className="relative w-full">
                                    <img src={frontPreview} alt="Front" className="max-h-48 mx-auto" />
                                    <button
                                        onClick={() => {
                                            setFrontImage(null);
                                            setFrontPreview(null);
                                        }}
                                        className="absolute top-2 right-2 bg-red-100 text-red-600 p-1 rounded-full"
                                    >
                                        ×
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-1 text-center">
                                    <Upload className="mx-auto h-12 w-12 text-slate-400" />
                                    <div className="flex text-sm text-slate-600">
                                        <label className="relative cursor-pointer rounded-md font-medium text-amber-600 hover:text-amber-500">
                                            <span>Upload front side</span>
                                            <input
                                                type="file"
                                                className="sr-only"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e, 'front')}
                                            />
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Back Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Back Side</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg">
                            {backPreview ? (
                                <div className="relative w-full">
                                    <img src={backPreview} alt="Back" className="max-h-48 mx-auto" />
                                    <button
                                        onClick={() => {
                                            setBackImage(null);
                                            setBackPreview(null);
                                        }}
                                        className="absolute top-2 right-2 bg-red-100 text-red-600 p-1 rounded-full"
                                    >
                                        ×
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-1 text-center">
                                    <Upload className="mx-auto h-12 w-12 text-slate-400" />
                                    <div className="flex text-sm text-slate-600">
                                        <label className="relative cursor-pointer rounded-md font-medium text-amber-600 hover:text-amber-500">
                                            <span>Upload back side</span>
                                            <input
                                                type="file"
                                                className="sr-only"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e, 'back')}
                                            />
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleVerification}
                        disabled={loading || !frontImage || !backImage}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                                Verifying...
                            </>
                        ) : (
                            <>
                                <Shield className="h-5 w-5 mr-2" />
                                Verify Aadhaar
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AadhaarVerification;