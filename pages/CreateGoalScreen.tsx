import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, CreditCard, CheckCircle, Shield, Lock } from 'lucide-react';
import { useGoals } from '../context/GoalsContext';

export default function CreateGoalScreen() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { createGoal } = useGoals();

  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '50000',
    deadline: '2026-02-22',
    frequency: 'Daily',
    contribution: '200'
  });

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Submit
      await createGoal({
        name: formData.name,
        targetAmount: parseInt(formData.targetAmount),
        deadline: formData.deadline,
        frequency: formData.frequency.toLowerCase(),
        contributionPerPerson: parseInt(formData.contribution)
      });
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 pt-6 pb-2 flex items-center gap-4 bg-white sticky top-0 z-10">
        <button onClick={() => step > 1 ? setStep(step - 1) : navigate('/dashboard')} className="text-gray-600">
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1 text-center">
          <h1 className="text-lg font-bold text-gray-900">Create New Goal</h1>
        </div>
        <div className="w-6"></div>
      </div>

      {/* Progress Bar */}
      <div className="px-8 py-4">
        <div className="flex justify-between mb-2">
            <span className="text-xs font-medium text-primary-600">Step {step} of 3</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
                className="h-full bg-primary-500 transition-all duration-500 ease-out"
                style={{ width: `${(step / 3) * 100}%` }}
            />
        </div>
      </div>

      <div className="flex-1 px-6 pb-24 overflow-y-auto">
        {step === 1 && (
            <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Goal Name</label>
                    <input 
                        type="text" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        placeholder="e.g. Goa Vacation"
                        className="w-full bg-gray-50 border-gray-200 rounded-2xl p-4 font-medium text-gray-900 focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Target Amount (₹)</label>
                    <input 
                        type="number" 
                        value={formData.targetAmount}
                        onChange={e => setFormData({...formData, targetAmount: e.target.value})}
                        className="w-full bg-gray-50 border-gray-200 rounded-2xl p-4 font-medium text-gray-900 focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Deadline</label>
                        <div className="relative">
                            <input 
                                type="date"
                                value={formData.deadline}
                                onChange={e => setFormData({...formData, deadline: e.target.value})}
                                className="w-full bg-gray-50 border-gray-200 rounded-2xl p-4 font-medium text-gray-900 focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Frequency</label>
                        <select 
                            value={formData.frequency}
                            onChange={e => setFormData({...formData, frequency: e.target.value})}
                            className="w-full bg-gray-50 border-gray-200 rounded-2xl p-4 font-medium text-gray-900 focus:ring-2 focus:ring-primary-500 outline-none"
                        >
                            <option>Daily</option>
                            <option>Weekly</option>
                            <option>Monthly</option>
                        </select>
                    </div>
                </div>

                <div className="bg-primary-50 rounded-2xl p-6 text-center">
                    <p className="text-gray-500 text-sm mb-1">Contribution Per Person</p>
                    <p className="text-3xl font-bold text-primary-600">₹{formData.contribution}</p>
                    <div className="w-full h-px bg-primary-200 my-4"></div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Total Daily Savings</span>
                        <span className="font-bold text-gray-900">₹{parseInt(formData.contribution) * 2}</span>
                    </div>
                </div>
            </div>
        )}

        {step === 2 && (
             <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                <h2 className="text-2xl font-bold text-gray-900">Setup AutoPay Mandate</h2>
                
                <div className="flex justify-center py-4">
                    <div className="w-32 h-32 bg-primary-50 rounded-full flex items-center justify-center relative">
                        <span className="text-4xl">♾️</span>
                        <div className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md">
                            <Shield className="text-green-500" fill="currentColor" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center text-white font-bold text-xs">HDFC</div>
                    <div className="flex-1">
                        <p className="font-bold text-gray-900">HDFC Bank</p>
                        <p className="text-xs text-gray-500">Account ****1234</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-gray-900">₹{formData.contribution}</p>
                        <p className="text-[10px] text-gray-400">/day</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {['Authorize automatic debits', 'Both partners must approve', 'Can be paused anytime'].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <CheckCircle className="text-green-500" size={20} />
                            <span className="text-gray-700 font-medium">{item}</span>
                        </div>
                    ))}
                </div>

                <div className="bg-gray-50 rounded-xl p-4 flex justify-around text-center">
                    <div>
                        <Lock className="mx-auto mb-1 text-gray-400" size={20} />
                        <p className="text-[10px] text-gray-500">256-bit<br/>Encryption</p>
                    </div>
                    <div className="w-px bg-gray-200"></div>
                    <div>
                        <Shield className="mx-auto mb-1 text-gray-400" size={20} />
                        <p className="text-[10px] text-gray-500">RBI<br/>Approved</p>
                    </div>
                </div>
             </div>
        )}

        {step === 3 && (
            <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                 <h2 className="text-2xl font-bold text-gray-900">Review & Confirm</h2>
                 
                 <div className="bg-white border border-gray-100 shadow-lg rounded-3xl overflow-hidden">
                    <div className="p-6 bg-gradient-to-r from-primary-500 to-orange-500 text-white">
                        <h3 className="text-2xl font-bold mb-2">{formData.name} 🏖️</h3>
                        <div className="flex justify-between text-white/80 text-sm">
                            <span>Start: Today</span>
                            <span>Target: ₹{parseInt(formData.targetAmount).toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-gray-50">
                            <span className="text-gray-500">Your Share</span>
                            <span className="font-bold text-gray-900">₹{parseInt(formData.targetAmount)/2}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-50">
                            <span className="text-gray-500">Daily Debit</span>
                            <span className="font-bold text-gray-900">₹{formData.contribution}</span>
                        </div>
                         <div className="flex justify-between items-center py-2 border-b border-gray-50">
                            <span className="text-gray-500">Duration</span>
                            <span className="font-bold text-gray-900">~125 days</span>
                        </div>
                        
                        <div className="bg-yellow-50 rounded-xl p-4 mt-4">
                            <label className="flex gap-3 items-start cursor-pointer">
                                <input type="checkbox" className="mt-1 rounded text-primary-500 focus:ring-primary-500" defaultChecked />
                                <span className="text-sm text-gray-600">I agree that funds can only be withdrawn upon mutual approval from both partners.</span>
                            </label>
                        </div>
                    </div>
                 </div>
            </div>
        )}

      </div>

      {/* Footer Actions */}
      <div className="p-6 bg-white border-t border-gray-100">
        <button 
            onClick={handleNext}
            className="w-full bg-primary-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary-500/30 active:scale-[0.98] transition-all"
        >
            {step === 2 ? 'Authorize AutoPay' : step === 3 ? 'Create Goal ✨' : 'Next Step'}
        </button>
      </div>
    </div>
  );
}
