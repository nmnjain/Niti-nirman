import React from 'react';
import { Link } from 'react-router-dom';
import serviceImage from '../assests/images/image1.jpg'
import faqImage from '../assests/images/faq.png'
import { useLanguage } from '../context/LanguageContext';
import logoImage from '../assests/images/logo.png'
import { translate } from '../utils/translate';
import ChatbotInterface from '../components/ChatbotInterface';

export function Landing() {
  const { language, setLanguage } = useLanguage();
  return (
    <div className="w-full bg-gradient-to-b bg-transparent">
      

      <section className="bg-transparent w-full">
        <div className="container w-full mx-auto py-8 px-4 text-center lg:py-16 lg:px-12">
          
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2">
            <a href="/Login" className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200" role="alert">
            <span className="text-xs bg-blue-600 rounded-full text-white px-4 py-1.5 mr-3">New</span> 
            <span className="text-sm font-medium">GovSchemes is out! See what's new</span> 
            <svg className="ml-2 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
            </svg>
          </a>
              <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl">
                {translate('Unlock', language)}
              </h1>
              <p className="mb-8 text-lg font-normal text-gray-600 lg:text-xl">
              {translate('subheading', language)}
              </p>
              <Link
                to="/signup"
                className="inline-flex items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
              >
                {translate('create', language)}
                <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </Link>
            </div>
            <div className="md:w-1/2 mt-8 md:mt-0 ml-10">
              <img
                src={serviceImage}
                alt="Government Services Illustration"
                className="w-full max-w-xxl mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-transparent">
        <div className="container mx-auto px-4">
        <section className="py-16 container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Left Column */}
          <div className="md:w-1/2">
            <span className="text-gray-700 font-medium mb-4 block"></span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {translate('unlockeligibilty', language)}
            </h1>
          </div>

          {/* Right Column */}
          <div className="md:w-1/2">
            <p className="text-lg text-gray-600 leading-relaxed">
            {translate('para', language)}
              </p>
          </div>
        </div>
      </section>

          <div className="grid md:grid-cols-3 gap-20 max-w-8xl mx-auto">
            {/* Feature 1 */}
            <div className="p-6 bg-purple-50 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
              <p className="text-gray-600">
                Register and fill in your details once. We'll handle everything else to match you with the right schemes.
              </p>
            </div>

            {/* Feature 2 */}
            

            
            <div className="p-6 bg-purple-50 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Instant Recommendations</h3>
              <p className="text-gray-600">
                Receive personalized scheme suggestions based on your profile and eligibility criteria.
              </p>
            </div>
            {/* Feature 3 */}

            <div className="p-6 bg-purple-50 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">24*7 Support</h3>
              <p className="text-gray-600">
                Round the clock support to help you with your queries available at your fingertips.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/IignUp"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Get Started
              <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-transparent">
  <div className="container mx-auto px-4">
    <div className="flex flex-col md:flex-row items-center gap-12">
      {/* Left side - Image */}
      <div className="md:w-1/2">
        <img 
          src={faqImage} // You'll need to add your FAQ illustration here
          alt="FAQ Illustration"
          className="w-full max-w-md mx-auto"
        />
      </div>

      {/* Right side - FAQ Content */}
      <div className="md:w-1/2">
        <div className="mb-8">
          <span className="text-gray-500 mb-2 block">Frequently Asked Questions</span>
          <h2 className="text-4xl font-bold">
            Checkout our knowledge base for some of your answers!
          </h2>
        </div>

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
          ].map((faq, index) => (
            <details
              key={index}
              className="group bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <summary className="flex items-center justify-between cursor-pointer p-6">
                <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                <span className="ml-6 flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-gray-400 group-open:rotate-180 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </summary>
              <div className="px-6 pb-6">
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>

<footer className="bg-transparent">
    <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
              <Link to="/" className="flex items-center">
                  {/* Replace with your logo */}
                  <img src={logoImage} className="h-12 md:h-16 lg:h-20"
            style={{ minWidth: '120px' }} />
                  <span className="self-center text-2xl font-semibold whitespace-nowrap"></span>
              </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
              <div>
                  <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">Quick Links</h2>
                  <ul className="text-gray-500 font-medium">
                      <li className="mb-4">
                          <Link to="/about" className="hover:underline">About Us</Link>
                      </li>
                      <li>
                          <Link to="/schemes" className="hover:underline">Schemes</Link>
                      </li>
                  </ul>
              </div>
              <div>
                  <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">Contact</h2>
                  <ul className="text-gray-500 font-medium">
                      <li className="mb-4">
                          <a href="mailto:support@nitinirman.com" className="hover:underline">Email Us</a>
                      </li>
                      <li>
                          <Link to="/help" className="hover:underline">Help Center</Link>
                      </li>
                  </ul>
              </div>
              <div>
                  <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase">Legal</h2>
                  <ul className="text-gray-500 font-medium">
                      <li className="mb-4">
                          <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
                      </li>
                      <li>
                          <Link to="/terms" className="hover:underline">Terms &amp; Conditions</Link>
                      </li>
                  </ul>
              </div>
          </div>
      </div>
      <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />
      <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center">
            © {new Date().getFullYear()} <Link to="/" className="hover:underline">NitiNirman™</Link>. All Rights Reserved.
          </span>
          <div className="flex mt-4 sm:justify-center sm:mt-0">
              <a href="#" className="text-gray-500 hover:text-gray-900">
                  <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 8 19">
                        <path fillRule="evenodd" d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z" clipRule="evenodd"/>
                  </svg>
                  <span className="sr-only">Facebook page</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900 ms-5">
                  <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 17">
                    <path fillRule="evenodd" d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z" clipRule="evenodd"/>
                </svg>
                  <span className="sr-only">Twitter page</span>
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-900 ms-5">
                  <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z" clipRule="evenodd"/>
                  </svg>
                  <span className="sr-only">GitHub account</span>
              </a>
              
          </div>
      </div>
    </div>
</footer>

<ChatbotInterface />


    </div>

  );
}