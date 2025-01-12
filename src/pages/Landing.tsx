import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { translate } from '../utils/translate';
import ChatbotInterface from '../components/ChatbotInterface';
import { ArrowRight, Sparkles, Shield, Zap, ChevronDown, ExternalLink } from 'lucide-react';
import serviceImage from '../assests/images/image1.jpg'
import faqImage from '../assests/images/faq.png'
import logo from '../assests/images/logo.png'
import featureImage from '../assests/images/feature.png'




export function Landing() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-[#FFFAF5]">
      {/* Hero Section */}
      <section className="relative pt-16 overflow-hidden">
        <div className="container px-4 mx-auto relative">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 text-amber-600 mb-8">
                  <span className="font-medium">New Release</span>
                  <span className="text-amber-600">•</span>
                  <span>Discover GovSchemes 2.0</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-serif mb-8 text-slate-900 leading-tight tracking-tight">
                  {translate('Unlock', language)}
                </h1>

                <p className="text-lg md:text-xl text-slate-600 mb-12 leading-relaxed max-w-2xl lg:max-w-none mx-auto">
                  {translate('subheading', language)}
                </p>

                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-amber-600 text-white rounded-full hover:bg-amber-700 transition-all"
                >
                  {translate('startJourney', language)}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="relative lg:h-[600px] order-first lg:order-last">
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-100/20 to-rose-100/20 rounded-[2rem] transform rotate-3"></div>
                <img
                  src={
                    serviceImage
                  }
                  alt="Government Services Illustration"
                  className="relative w-full h-full object-cover rounded-[2rem] shadow-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-24">
              {[
                {
                  icon: Sparkles,
                  title: translate('personalizedMatching', language),
                  desc: translate('aiPowered', language)
                },
                {
                  icon: Shield,
                  title: translate('securePrivate', language),
                  desc: translate('dataEncrypted', language)
                },
                {
                  icon: Zap,
                  title: translate('instantSupport', language),
                  desc: translate('support247', language)
                }
              ].map((feature, idx) => (
                <div key={idx} className="text-center p-8">
                  <feature.icon className="w-8 h-8 text-amber-600 mb-4 mx-auto" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6">
                  {translate('unlockeligibilty', language)}
                </h2>
                <p className="text-lg text-slate-600 mb-8">
                  {translate('para', language)}
                </p>
                <div className="space-y-6">
                  {[
                    {
                      title: translate('createProfile', language),
                      desc: translate('oneTimeSetup', language)
                    },
                    {
                      title: translate('getMatched', language),
                      desc: translate('aiMatches', language)
                    },
                    {
                      title: translate('accessBenefits', language),
                      desc: translate('directAccess', language)
                    }
                  ].map((step, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                        <span className="text-amber-600 font-medium">{idx + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-900 mb-1">{step.title}</h3>
                        <p className="text-slate-600">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-100/20 to-rose-100/20 rounded-[2rem] transform rotate-3"></div>
                <img
                  src={featureImage}
                  alt="Feature Illustration"
                  className="relative rounded-[2rem] shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section className="py-16 bg-gradient-to-b from-white to-amber-50/30">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif text-center text-slate-900 mb-16">
            {translate('commonQuestions', language)}
          </h2>

          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              {/* Left side - FAQ Image */}
              <div className="relative">
                <div className="sticky top-8">
                  <div className="relative aspect-square w-full max-w-md mx-auto">
                    <div className="absolute inset-0 bg-[#F7F8FA] rounded-[2rem] pattern-topography-amber-50/30"></div>
                    <div className="relative h-full flex items-center justify-center p-8">
                      <img
                        src={faqImage}
                        alt="FAQ Illustration"
                        className="w-48 h-48 md:w-64 md:h-64 object-contain"
                      />
                    </div>
                  </div>
                  <div className="mt-8 text-center">
                    <h3 className="text-xl font-medium text-slate-900 mb-2">

                    </h3>
                  </div>
                </div>
              </div>

              {/* Right side - FAQ Items */}
              <div className="space-y-4">
                {[
                  {
                    question: "What is Niti-Nirman, and how does it work?",
                    answer: "Niti-Nirman is an AI-driven platform that simplifies access to government schemes. By providing your details, the platform matches you with schemes you're eligible for and offers secure document verification for applications."
                  },
                  {
                    question: "Is my personal information safe on Niti-Nirman?",
                    answer: "Yes, we prioritize your privacy and security. All data is encrypted, and sensitive documents are securely stored using blockchain technology."
                  },
                  {
                    question: "How can I check my eligibility for schemes?",
                    answer: "Simply sign up, complete your profile, and our platform will recommend schemes based on your details, such as age, income, and location."
                  },
                  {
                    question: "Can Niti-Nirman help with applying for schemes?",
                    answer: "Niti-Nirman provides essential information about schemes and verifies your eligibility. For applications, we guide you to the official portals and ensure you have the required documentation ready."
                  },
                  {
                    question: "Does Niti-Nirman include state-specific schemes as well?",
                    answer: "Yes, our platform covers both central and state government schemes, ensuring you have access to the widest range of benefits available."
                  }
                ].map((faq, idx) => (
                  <details
                    key={idx}
                    className="group bg-white/60 backdrop-blur-sm rounded-xl border border-slate-100 hover:border-slate-200 transition-colors"
                  >
                    <summary className="flex items-center justify-between cursor-pointer p-6 [&::-webkit-details-marker]:hidden">
                      <h3 className="text-lg font-medium text-slate-900">{faq.question}</h3>
                      <ChevronDown className="w-5 h-5 text-slate-400 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="px-6 pb-6">
                      <p className="text-slate-600">{faq.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6">
              {translate('readyToUnlock', language)}
            </h2>
            <p className="text-lg text-slate-600 mb-12">
              {translate('joinThousands', language)}
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors"
            >
              {translate('createYourProfile', language)}
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>


      <footer className="py-20 bg-white">
        <div className="container px-4 mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              <div className="col-span-2 md:col-span-1">
                <Link to="/" className="inline-block mb-6">
                  <img
                    src={logo}
                    alt="Niti-Nirman Logo"
                    className="h-12 w-auto sm:h-16"
                  />
                </Link>
                <p className="text-slate-600 text-sm">
                  {translate('empoweringCitizens', language)}
                </p>
              </div>

              {[
                {
                  title: translate('quickLinks', language),
                  links: [
                    { label: translate('aboutUs', language), href: "/about" },
                    { label: translate('schemes', language), href: "/schemes" }
                  ]
                },
                {
                  title: translate('contact', language),
                  links: [
                    { label: translate('emailUs', language), href: "mailto:support@nitinirman.com" },
                    { label: translate('helpCenter', language), href: "/help" }
                  ]
                },
                {
                  title: translate('legal', language),
                  links: [
                    { label: translate('privacyPolicy', language), href: "/privacy" },
                    { label: translate('termsConditions', language), href: "/terms" }
                  ]
                }
              ].map((section, idx) => (
                <div key={idx}>
                  <h4 className="font-medium text-slate-900 mb-4">{section.title}</h4>
                  <ul className="space-y-2">
                    {section.links.map((link, linkIdx) => (
                      <li key={linkIdx}>
                        <Link
                          to={link.href}
                          className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-slate-100">
              <p className="text-sm text-slate-600 text-center">
                © {new Date().getFullYear()} Niti-Nirman™. {translate('allRightsReserved', language)}
              </p>
            </div>
          </div>
        </div>
      </footer>

      <ChatbotInterface />
    </div>
  );
}

