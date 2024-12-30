import React from 'react';
import { Navigation } from './Navigation';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isAuthPage = ['/Login', '/SignUp'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-transparent">
      {!isAuthPage && <Navigation />}
      <main className="w-full mx-auto sm:px-6 lg:px-8">
        {children}
      </main>
      <div id="google_translate_element" className="hidden" />
    </div>
  );
}