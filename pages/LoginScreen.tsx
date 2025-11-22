import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center px-8 bg-white">
      <div className="mb-12">
        <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-6">
          <span className="text-2xl">👋</span>
        </div>
        <h1 className="text-4xl font-bold font-display text-gray-900 mb-2">Welcome Back!</h1>
        <p className="text-gray-500">Log in to continue saving together.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 ml-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              placeholder="john@example.com"
              required
            />
          </div>
          <p className="text-xs text-gray-500 ml-1 mt-1">
            Demo: Use <span className="font-semibold text-primary-600">priya@test.com</span> or <span className="font-semibold text-primary-600">demo@test.com</span>
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 ml-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="password"
              defaultValue="password123"
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button type="button" className="text-sm font-semibold text-primary-600">
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary-500 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : (
            <>
              Log In
              <ArrowRight size={20} />
            </>
          )}
        </button>
      </form>

      <div className="mt-auto mb-8 text-center">
        <p className="text-gray-500">
          Don't have an account?{' '}
          <button className="font-bold text-gray-900">Sign Up</button>
        </p>
      </div>
    </div>
  );
}
