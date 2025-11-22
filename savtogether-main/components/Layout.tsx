import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Target, Wallet, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const showNav = isAuthenticated && 
    ['/dashboard', '/goals', '/profile', '/activity'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden relative">
      <main className="flex-1 overflow-y-auto scrollbar-hide pb-20">
        {children}
      </main>

      {showNav && (
        <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-200 pb-safe pt-2 px-6 z-50">
          <div className="flex justify-between items-center h-16">
            <button 
              onClick={() => navigate('/dashboard')}
              className={`flex flex-col items-center gap-1 w-16 ${location.pathname === '/dashboard' ? 'text-primary-500' : 'text-gray-400'}`}
            >
              <Home size={24} strokeWidth={location.pathname === '/dashboard' ? 2.5 : 2} />
              <span className="text-[10px] font-medium">Home</span>
            </button>
            
            <button 
              onClick={() => navigate('/goals')}
              className={`flex flex-col items-center gap-1 w-16 ${location.pathname.includes('/goals') ? 'text-primary-500' : 'text-gray-400'}`}
            >
              <Target size={24} strokeWidth={location.pathname.includes('/goals') ? 2.5 : 2} />
              <span className="text-[10px] font-medium">Goals</span>
            </button>
            
            <button 
              onClick={() => navigate('/activity')}
              className={`flex flex-col items-center gap-1 w-16 ${location.pathname === '/activity' ? 'text-primary-500' : 'text-gray-400'}`}
            >
              <Wallet size={24} strokeWidth={location.pathname === '/activity' ? 2.5 : 2} />
              <span className="text-[10px] font-medium">Activity</span>
            </button>
            
            <button 
              onClick={() => navigate('/profile')}
              className={`flex flex-col items-center gap-1 w-16 ${location.pathname === '/profile' ? 'text-primary-500' : 'text-gray-400'}`}
            >
              <UserIcon size={24} strokeWidth={location.pathname === '/profile' ? 2.5 : 2} />
              <span className="text-[10px] font-medium">Profile</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}