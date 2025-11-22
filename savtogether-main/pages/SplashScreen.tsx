import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SplashScreen() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoading) {
        if (isAuthenticated) {
          navigate('/dashboard');
        } else {
          navigate('/onboarding');
        }
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
      <div className="relative">
        <div className="absolute inset-0 bg-primary-100 rounded-full animate-ping opacity-20"></div>
        <div className="relative z-10 bg-gradient-to-br from-primary-500 to-orange-500 p-6 rounded-2xl shadow-xl transform transition-all duration-500 hover:scale-105">
          <Heart size={48} className="text-white fill-white animate-pulse" />
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight font-display">SavTogether</h1>
        <p className="text-gray-500 mt-2 font-medium">Two hearts beating in sync</p>
      </div>

      <div className="absolute bottom-12">
        <div className="w-12 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-primary-500 animate-[loading_2s_ease-in-out_infinite]"></div>
        </div>
      </div>
      
      <style>{`
        @keyframes loading {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 100%; transform: translateX(0); }
          100% { width: 100%; transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
