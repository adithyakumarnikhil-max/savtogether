import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trophy, Target, ArrowRight } from 'lucide-react';
import { useGoals } from '../context/GoalsContext';

export default function GoalsScreen() {
  const { goals } = useGoals();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  const filteredGoals = goals.filter(g => 
    activeTab === 'active' ? g.status === 'active' || g.status === 'paused' : g.status === 'completed'
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-white pt-6 pb-4 px-6 sticky top-0 z-10 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900 font-display">Your Goals</h1>
          <button 
            onClick={() => navigate('/goals/create')}
            className="w-10 h-10 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center hover:bg-primary-100 transition-colors"
          >
            <Plus size={24} />
          </button>
        </div>

        <div className="flex gap-6 border-b border-gray-100">
          <button 
            onClick={() => setActiveTab('active')}
            className={`pb-3 text-sm font-bold transition-colors relative ${
              activeTab === 'active' ? 'text-primary-600' : 'text-gray-400'
            }`}
          >
            Active Goals
            {activeTab === 'active' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-t-full"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('completed')}
            className={`pb-3 text-sm font-bold transition-colors relative ${
              activeTab === 'completed' ? 'text-primary-600' : 'text-gray-400'
            }`}
          >
            Completed
            {activeTab === 'completed' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-t-full"></div>}
          </button>
        </div>
      </header>

      <div className="p-6 space-y-4">
        {filteredGoals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-300">
              <Target size={40} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {activeTab === 'active' ? 'No active goals' : 'No completed goals yet'}
            </h3>
            <p className="text-gray-500 max-w-xs">
              {activeTab === 'active' 
                ? 'Start saving for your dream vacation or big purchase today.' 
                : 'Keep saving! Your completed achievements will appear here.'}
            </p>
            {activeTab === 'active' && (
              <button 
                onClick={() => navigate('/goals/create')}
                className="mt-6 px-6 py-3 bg-primary-500 text-white font-bold rounded-xl shadow-lg shadow-primary-500/20 active:scale-95 transition-all"
              >
                Create Goal
              </button>
            )}
          </div>
        ) : (
          filteredGoals.map(goal => {
            const percentage = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
            return (
              <div 
                key={goal.id}
                onClick={() => navigate(`/goals/${goal.id}`)}
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 active:scale-[0.99] transition-transform cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{goal.name}</h3>
                    <p className="text-xs text-gray-500">Target: ₹{goal.targetAmount.toLocaleString()}</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    percentage >= 100 ? 'bg-green-100 text-green-700' : 'bg-primary-50 text-primary-700'
                  }`}>
                    {percentage}%
                  </span>
                </div>

                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden mb-3">
                  <div 
                    className={`h-full rounded-full ${percentage >= 100 ? 'bg-green-500' : 'bg-primary-500'}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-gray-900">₹{goal.currentAmount.toLocaleString()}</span>
                  <div className="flex items-center gap-1 text-primary-600 text-xs font-bold">
                    View Details <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}