import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../context/LanguageContext';
import { Menu, LogOut, X } from 'lucide-react';
import { useState } from 'react';
import logoImage from '../assests/images/logo.png'
import { translate } from '../utils/translate';

export function Navigation() {
  const { user, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
  };

  return (
    <nav className="bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img 
                src={logoImage} 
                className="h-12 w-auto sm:h-20" 
                alt="Niti-Nirman Logo" 
              />
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="border-amber-500 text-slate-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                About
              </Link>
              <Link
                to="/services"
                className="border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Services
              </Link>
              <Link
                to="/contact"
                className="border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Contact
              </Link>
              {user && (
                <Link
                  to="/dashboard"
                  className="border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  My Schemes
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="ml-3 text-slate-600 bg-white border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="ta">தமிழ்</option>
              <option value="te">తెలుగు</option>
              <option value="ml">മലയാളം</option>
              <option value="bn">বাংলা</option>
              <option value="gu">ગુજરાતી</option>
              <option value="kn">ಕನ್ನಡ</option>
              <option value="pa">ਪੰਜਾਬੀ</option>
              <option value="or">ଓଡ଼ିଆ</option>
              <option value="ur">اردو</option>
            </select>
            {!user ? (
              <div className="ml-3 flex items-center space-x-3">
                <Link
                  to="/Login"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-amber-700 bg-amber-100 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                >
                  {translate('login', language)}
                </Link>
                <Link
                  to="/SignUp"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                >
                  {translate('signup', language)}
                </Link>
              </div>
            ) : (
              <div className="ml-3 flex items-center space-x-3">
                <Link
                  to="/profile"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-amber-700 bg-amber-100 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                >
                  {translate('profile', language)}
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {translate('logout', language)}
                </button>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500"
            >
              <span className="sr-only">Open main menu</span>
              <Menu className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`} />
              <X className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`} />
            </button>
          </div>
        </div>
      </div>

      <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className="bg-amber-50 border-amber-500 text-amber-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="border-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          >
            About
          </Link>
          <Link
            to="/services"
            className="border-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          >
            Services
          </Link>
          <Link
            to="/contact"
            className="border-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          >
            Contact
          </Link>
          {user && (
            <Link
              to="/dashboard"
              className="border-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              My Schemes
            </Link>
          )}
        </div>
        <div className="pt-4 pb-3 border-t border-slate-200">
          <div className="flex items-center px-4">
            <div className="flex-shrink-0">
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="ta">தமிழ்</option>
                <option value="te">తెలుగు</option>
                <option value="ml">മലയാളം</option>
                <option value="bn">বাংলা</option>
                <option value="gu">ગુજરાતી</option>
                <option value="kn">ಕನ್ನಡ</option>
                <option value="pa">ਪੰਜਾਬੀ</option>
                <option value="or">ଓଡ଼ିଆ</option>
                <option value="ur">اردو</option>
              </select>
            </div>
          </div>
          <div className="mt-3 space-y-1">
            {!user ? (
              <>
                <Link
                  to="/Login"
                  className="block px-4 py-2 text-base font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                >
                  {translate('login', language)}
                </Link>
                <Link
                  to="/SignUp"
                  className="block px-4 py-2 text-base font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                >
                  {translate('signup', language)}
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-base font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                >
                  {translate('profile', language)}
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                >
                  {translate('logout', language)}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

