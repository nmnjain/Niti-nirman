
import React from 'react';
import { FileText, Shield, Gift, ArrowRight, X, Info } from 'lucide-react';

interface Scheme {
    id: string;
    scheme_name: string;
    details: string | null;
    benefits: string | null;
    documents_required: string | null;
    application_Process: string | null;
}

interface SchemeCardProps {
    scheme: Scheme;
    isVerified: boolean;
    onButtonClick: (type: 'details' | 'benefits' | 'documents' | 'process', scheme: Scheme) => void;
}

const SchemeCard = ({ scheme, isVerified, onButtonClick }) => (
    <div className="bg-white rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-lg border border-slate-100 flex flex-col h-full">
        <div className="p-6 flex-1">
            <h3 className="text-xl font-serif font-semibold text-slate-900 mb-6 text-center">
                {scheme.scheme_name}
            </h3>

            <div className="space-y-3">
                {isVerified ? (
                    <>
                        <button
                            onClick={() => onButtonClick('details', scheme)}
                            className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-slate-200 text-sm font-medium rounded-xl text-slate-700 bg-slate-50 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-200"
                        >
                            <Info className="w-4 h-4 mr-2 text-amber-600" />
                            View Details
                        </button>

                        <button
                            onClick={() => onButtonClick('benefits', scheme)}
                            className="w-full inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-xl text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-200"
                        >
                            <Gift className="w-4 h-4 mr-2" />
                            View Benefits
                        </button>

                        <button
                            onClick={() => onButtonClick('documents', scheme)}
                            className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-amber-100 text-sm font-medium rounded-xl text-amber-700 bg-amber-50 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-200"
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            Required Documents
                        </button>

                        <button
                            onClick={() => onButtonClick('process', scheme)}
                            className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-slate-200 text-sm font-medium rounded-xl text-slate-600 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-200"
                        >
                            <ArrowRight className="w-4 h-4 mr-2" />
                            Application Process
                        </button>
                    </>
                ) : (
                    <button
                        className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-slate-200 text-sm font-medium rounded-xl text-slate-400 bg-slate-50 cursor-not-allowed"
                        disabled
                    >
                        <Shield className="w-4 h-4 mr-2" />
                        Verify Profile to View Details
                    </button>
                )}
            </div>
        </div>
    </div>
);

const SchemeModal = ({ isOpen, onClose, title, content, schemeName }) => {
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
                                <div className="p-2 bg-amber-50 rounded-xl mr-3">
                                    <Shield className="h-6 w-6 text-amber-600" />
                                </div>
                                <h3 className="text-xl font-serif font-semibold text-slate-900">
                                    {title}
                                </h3>
                            </div>
                            <button
                                onClick={onClose}
                                className="rounded-lg p-2 text-slate-400 hover:text-slate-500 hover:bg-slate-100 transition-all duration-200"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mt-4">
                            <h4 className="text-lg font-medium text-slate-900 mb-4">{schemeName}</h4>
                            {content ? (
                                <div className="space-y-3">
                                    {content.split('\n').map((line, index) => (
                                        <div key={index} className="flex items-start">
                                            {line.startsWith('-') ? (
                                                <>
                                                    <div className="h-2 w-2 rounded-full bg-amber-500 mt-2 mr-3" />
                                                    <span className="text-slate-600">{line.slice(1).trim()}</span>
                                                </>
                                            ) : (
                                                <span className="text-slate-600">{line}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-500">No information available.</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-slate-50 px-6 py-4 flex justify-end">
                        <button
                            onClick={onClose}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-200"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { SchemeCard, SchemeModal };