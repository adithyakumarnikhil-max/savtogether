import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, MoreVertical, Calendar, Flame, Trophy, Hourglass, Share2 } from 'lucide-react';
import { useGoals } from '../context/GoalsContext';
import { mockAPI } from '../utils/mockAPI';
import { Transaction } from '../types';

export default function GoalDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { goals, transactions, fetchTransactions } = useGoals();
  
  const goal = goals.find(g => g.id === id);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
        fetchTransactions(id).then(() => setIsLoading(false));
    }
  }, [id, fetchTransactions]);

  if (!goal) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
        {/* Header */}
      <div className="bg-white sticky top-0 z-10 px-4 py-3 flex justify-between items-center border-b border-gray-100">
         <button onClick={() => navigate('/dashboard')} className="p-2 text-gray-600"><ArrowLeft size={24} /></button>
         <h1 className="font-bold text-gray-900">{goal.name}</h1>
         <button className="p-2 text-gray-600"><MoreVertical size={24} /></button>
      </div>

      <div className="p-6 bg-white mb-4">
         <div className="text-center mb-6">
            <p className="text-sm text-gray-500 mb-1">Ends on {new Date(goal.deadline).toLocaleDateString()}</p>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">₹{goal.currentAmount.toLocaleString()} <span className="text-xl text-gray-400 font-normal">saved</span></h2>
            
            {/* Progress Bar */}
            <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden mb-2">
                <div 
                    className="h-full bg-primary-500 rounded-full transition-all duration-1000"
                    style={{ width: `${(goal.currentAmount / goal.targetAmount) * 100}%` }}
                ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
                <span>Target: ₹{goal.targetAmount.toLocaleString()}</span>
                <span>₹{(goal.targetAmount - goal.currentAmount).toLocaleString()} remaining</span>
            </div>
         </div>

         {/* Stats Grid */}
         <div className="grid grid-cols-2 gap-4">
             <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <Calendar className="text-primary-500 mb-2" size={20} />
                <p className="font-bold text-gray-900">₹{goal.contributionPerPerson * 2}</p>
                <p className="text-xs text-gray-500">Daily Contribution</p>
             </div>
             <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <Flame className="text-orange-500 mb-2" size={20} />
                <p className="font-bold text-gray-900">12 Days</p>
                <p className="text-xs text-gray-500">Current Streak</p>
             </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <Trophy className="text-yellow-500 mb-2" size={20} />
                <p className="font-bold text-gray-900">100%</p>
                <p className="text-xs text-gray-500">Success Rate</p>
             </div>
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <Hourglass className="text-blue-500 mb-2" size={20} />
                <p className="font-bold text-gray-900">102</p>
                <p className="text-xs text-gray-500">Days Left</p>
             </div>
         </div>
      </div>

      {/* Transactions */}
      <div className="px-6">
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-900 text-lg">Transaction History</h3>
        </div>
        
        <div className="space-y-3">
            {transactions.length === 0 ? (
                <p className="text-center text-gray-400 py-8">No transactions yet.</p>
            ) : (
                transactions.map(txn => (
                    <div key={txn.id} className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-2">
                                <img src="https://i.pravatar.cc/150?u=user_1" className="w-8 h-8 rounded-full border-2 border-white" />
                                <img src="https://i.pravatar.cc/150?u=priya" className="w-8 h-8 rounded-full border-2 border-white" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-sm">
                                    {new Date(txn.timestamp).toLocaleDateString()}
                                </p>
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Success</span>
                            </div>
                        </div>
                        <span className="font-bold text-gray-900">+₹{txn.amount * 2}</span>
                    </div>
                ))
            )}
        </div>
      </div>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 flex gap-4 max-w-md mx-auto">
        <button className="flex-1 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl">Pause Savings</button>
        <button className="flex-1 py-3 bg-gray-100 text-gray-400 font-bold rounded-xl cursor-not-allowed">Withdraw</button>
      </div>
      
      <button className="fixed bottom-24 right-6 w-14 h-14 bg-primary-500 rounded-full shadow-lg shadow-primary-500/40 flex items-center justify-center text-white">
        <Share2 size={24} />
      </button>
    </div>
  );
}
