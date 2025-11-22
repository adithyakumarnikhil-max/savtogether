import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Settings, Bell, Shield, CircleHelp, LogOut, 
  ChevronRight, CreditCard, Link2, Link2Off
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGoals } from '../context/GoalsContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { goals } = useGoals();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const completedGoals = goals.filter(g => g.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-500 to-orange-500 pt-12 pb-24 px-6 rounded-b-[2.5rem] shadow-lg text-white text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full border-4 border-white/30 p-1 mb-3">
            <img 
              src={user.avatarUrl} 
              alt="Profile" 
              className="w-full h-full rounded-full object-cover border-2 border-white" 
            />
          </div>
          <h1 className="text-2xl font-bold">{user.fullName}</h1>
          <p className="text-primary-100 text-sm">Member since Nov 2024</p>
          
          <button className="mt-4 px-6 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-sm font-bold transition-colors border border-white/40">
            Edit Profile
          </button>
        </div>
      </div>

      <div className="px-6 -mt-16 relative z-20 space-y-6">
        {/* Partner Card */}
        <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-900">Savings Partner</h3>
            {user.partnerId ? (
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div> Connected
              </span>
            ) : (
              <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2 py-1 rounded-full">
                Not Connected
              </span>
            )}
          </div>
          
          {user.partnerId ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="https://i.pravatar.cc/150?u=priya" alt="Partner" className="w-12 h-12 rounded-full border-2 border-gray-100" />
                <div>
                  <p className="font-bold text-gray-900">Priya</p>
                  <p className="text-xs text-gray-500">linked since Dec 2024</p>
                </div>
              </div>
              <button className="text-red-500 p-2 hover:bg-red-50 rounded-full">
                <Link2Off size={20} />
              </button>
            </div>
          ) : (
            <div className="text-center py-2">
              <p className="text-sm text-gray-500 mb-3">Save together with your partner</p>
              <button 
                onClick={() => navigate('/dashboard')}
                className="w-full py-2 border border-dashed border-primary-300 text-primary-600 rounded-xl font-bold text-sm hover:bg-primary-50 transition-colors"
              >
                Link Partner
              </button>
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-xs mb-1">Total Saved</p>
            <p className="text-xl font-bold text-gray-900">₹{totalSaved.toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-xs mb-1">Goals Completed</p>
            <p className="text-xl font-bold text-gray-900">{completedGoals}</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <MenuItem icon={<User size={20} />} label="Account Settings" />
          <MenuItem icon={<CreditCard size={20} />} label="Bank Accounts" subLabel="2 linked" />
          <MenuItem icon={<Bell size={20} />} label="Notifications" toggle />
          <MenuItem icon={<Shield size={20} />} label="Security & Privacy" />
          <MenuItem icon={<CircleHelp size={20} />} label="Help & Support" />
        </div>

        <button 
          onClick={handleLogout}
          className="w-full bg-white p-4 rounded-2xl shadow-sm border border-red-100 text-red-600 font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          Log Out
        </button>
        
        <div className="text-center text-xs text-gray-400 pb-4">
          Version 1.0.0 • SavTogether
        </div>
      </div>
    </div>
  );
}

function MenuItem({ icon, label, subLabel, toggle }: { icon: React.ReactNode, label: string, subLabel?: string, toggle?: boolean }) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer">
      <div className="flex items-center gap-3 text-gray-600">
        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
          {icon}
        </div>
        <span className="font-medium text-sm text-gray-900">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {subLabel && <span className="text-xs text-gray-400">{subLabel}</span>}
        {toggle ? (
          <div className="w-10 h-6 bg-primary-500 rounded-full relative">
            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
          </div>
        ) : (
          <ChevronRight size={18} className="text-gray-300" />
        )}
      </div>
    </div>
  );
}