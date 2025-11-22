import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Plus, Share2, Copy, Check, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGoals } from '../context/GoalsContext';
import { mockAPI } from '../utils/mockAPI';
import { PieChart, Pie, Cell } from 'recharts';

export default function DashboardScreen() {
    const { user, updateUser, refreshUser } = useAuth();
    const { activeGoal, isLoading: goalsLoading } = useGoals();
    const navigate = useNavigate();

    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [invitationStatus, setInvitationStatus] = useState<'none' | 'pending' | 'accepted'>('none');
    const [isInviteLoading, setIsInviteLoading] = useState(false);

    useEffect(() => {
        const checkInvite = async () => {
            const inv = await mockAPI.partner.checkStatus();
            if (inv) {
                setInvitationStatus(inv.status);
                if (inv.status === 'accepted' && !user?.partnerId) {
                    refreshUser();
                }
            }
        };
        const interval = setInterval(checkInvite, 2000);
        return () => clearInterval(interval);
    }, [user, refreshUser]);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsInviteLoading(true);
        try {
            await mockAPI.partner.invite(inviteEmail);
            setInvitationStatus('pending');
            setShowInviteModal(false);
        } finally {
            setIsInviteLoading(false);
        }
    };

    if (!user) return null;

    // State 1: No Partner Linked
    if (!user.partnerId && invitationStatus !== 'accepted') {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex flex-col">
                <header className="flex justify-between items-center mb-8 pt-4">
                    <div className="flex items-center gap-3">
                        <img src={user.avatarUrl} alt="Profile" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                        <h1 className="text-xl font-bold text-gray-900">Hi, {user.fullName.split(' ')[0]}! 👋</h1>
                    </div>
                    <button className="p-2 bg-white rounded-full shadow-sm text-gray-600">
                        <Bell size={20} />
                    </button>
                </header>

                <div className="flex-1 flex flex-col items-center justify-center text-center">
                    {invitationStatus === 'pending' ? (
                        <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-sm">
                            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Loader2 className="animate-spin text-yellow-600" size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Invitation Sent!</h2>
                            <p className="text-gray-500 mb-6">Waiting for your partner to accept...</p>
                            <div className="bg-gray-50 p-4 rounded-xl flex items-center justify-between mb-4">
                                <span className="text-sm font-medium text-gray-600 truncate mr-2">{inviteEmail}</span>
                                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Pending</span>
                            </div>
                            <p className="text-xs text-gray-400">We'll notify you once they join.</p>
                        </div>
                    ) : (
                        <>
                            <div className="w-64 h-64 bg-primary-50 rounded-full flex items-center justify-center mb-8 relative">
                                <div className="absolute inset-0 bg-primary-100 rounded-full animate-ping opacity-20"></div>
                                <Share2 size={64} className="text-primary-500 relative z-10" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">Find Your Savings Partner</h2>
                            <p className="text-gray-500 mb-8 max-w-xs">Invite your partner to start saving together for your shared dreams.</p>
                            <button
                                onClick={() => setShowInviteModal(true)}
                                className="w-full bg-primary-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                <Plus size={20} />
                                Invite Partner
                            </button>
                        </>
                    )}
                </div>

                {/* Invite Modal */}
                {showInviteModal && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4 backdrop-blur-sm">
                        <div className="bg-white w-full max-w-md rounded-3xl p-6 animate-[slideUp_0.3s_ease-out]">
                            <h3 className="text-xl font-bold mb-2">Invite Partner</h3>
                            <p className="text-gray-500 mb-6 text-sm">Enter their email to send an invite link.</p>
                            <form onSubmit={handleInvite}>
                                <input
                                    type="email"
                                    placeholder="partner@email.com"
                                    className="w-full bg-gray-50 border-gray-200 rounded-xl p-4 mb-4 focus:ring-2 focus:ring-primary-500 outline-none"
                                    value={inviteEmail}
                                    onChange={e => setInviteEmail(e.target.value)}
                                    required
                                />
                                <p className="text-xs text-gray-500 ml-1 mt-1">
                                    Demo: Use <span className="font-semibold text-primary-600">priya@test.com</span> or <span className="font-semibold text-primary-600">demo@test.com</span>
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowInviteModal(false)}
                                        className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isInviteLoading}
                                        className="flex-1 py-3 bg-primary-500 text-white font-bold rounded-xl flex justify-center items-center"
                                    >
                                        {isInviteLoading ? <Loader2 className="animate-spin" /> : 'Send'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // State 2: Partner Connected, No Goals
    if (!activeGoal) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex flex-col">
                <header className="flex justify-between items-center mb-8 pt-4">
                    <div className="flex items-center gap-3">
                        <img src={user.avatarUrl} alt="Profile" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                        <h1 className="text-xl font-bold text-gray-900">Hi, {user.fullName.split(' ')[0]}! 👋</h1>
                    </div>
                    <button className="p-2 bg-white rounded-full shadow-sm text-gray-600 relative">
                        <Bell size={20} />
                        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                </header>

                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="bg-white p-6 rounded-3xl shadow-sm w-full text-center mb-6">
                        <div className="flex justify-center items-center -space-x-4 mb-4">
                            <img src={user.avatarUrl} className="w-16 h-16 rounded-full border-4 border-white" />
                            <img src="https://i.pravatar.cc/150?u=priya" className="w-16 h-16 rounded-full border-4 border-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">You're Connected! 🎉</h2>
                        <p className="text-gray-500 text-sm">Ready to start your first savings goal together?</p>
                    </div>

                    <button
                        onClick={() => navigate('/goals/create')}
                        className="w-full bg-gradient-to-r from-primary-500 to-orange-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        <Plus size={24} />
                        Create First Goal
                    </button>
                </div>
            </div>
        );
    }

    // State 3: Active Goal Dashboard
    const percentage = Math.min(100, Math.round((activeGoal.currentAmount / activeGoal.targetAmount) * 100));
    const data = [
        { name: 'Saved', value: activeGoal.currentAmount },
        { name: 'Remaining', value: activeGoal.targetAmount - activeGoal.currentAmount },
    ];
    const COLORS = ['#F44725', '#F3F4F6'];

    return (
        <div className="min-h-screen bg-gray-50 p-6 pb-24">
            <header className="flex justify-between items-center mb-6 pt-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                        <span className="material-symbols-outlined">savings</span>
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                </div>
                <button className="p-2 bg-white rounded-full shadow-sm text-gray-600 relative">
                    <Bell size={20} />
                    <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
            </header>

            {/* Main Goal Card */}
            <div className="bg-white rounded-3xl p-6 shadow-lg shadow-gray-100 mb-6 relative overflow-hidden" onClick={() => navigate(`/goals/${activeGoal.id}`)}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full -mr-10 -mt-10 opacity-50"></div>

                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{activeGoal.name}</h2>
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            Active • Daily Savings
                        </p>
                    </div>
                    <div className="bg-primary-50 text-primary-700 font-bold py-1 px-3 rounded-full text-sm">
                        {percentage}%
                    </div>
                </div>

                <div className="flex flex-col items-center mb-6 relative">
                    <div className="w-48 h-48 relative">
                        <PieChart width={192} height={192}>
                            <Pie
                                data={data}
                                cx={90}
                                cy={90}
                                innerRadius={65}
                                outerRadius={80}
                                startAngle={90}
                                endAngle={-270}
                                paddingAngle={0}
                                dataKey="value"
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                        <div className="absolute inset-0 flex flex-col items-center justify-center mt-[-10px] ml-[-10px]">
                            <span className="text-3xl font-bold text-gray-900">₹{activeGoal.currentAmount.toLocaleString()}</span>
                            <span className="text-xs text-gray-400">of ₹{activeGoal.targetAmount.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center bg-gray-50 rounded-2xl p-4">
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Daily Contribution</p>
                        <p className="font-bold text-gray-900">₹{activeGoal.contributionPerPerson * 2}</p>
                    </div>
                    <div className="flex -space-x-2">
                        <img src={user.avatarUrl} className="w-8 h-8 rounded-full border-2 border-white" />
                        <img src="https://i.pravatar.cc/150?u=priya" className="w-8 h-8 rounded-full border-2 border-white" />
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white p-4 rounded-2xl shadow-sm">
                    <p className="text-xs text-gray-500 mb-1">Saved Together</p>
                    <p className="text-xl font-bold text-gray-900">₹{activeGoal.currentAmount.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow-sm">
                    <p className="text-xs text-gray-500 mb-1">Days Remaining</p>
                    <p className="text-xl font-bold text-gray-900">102</p>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="mb-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900">Recent Activity</h3>
                    <button className="text-primary-600 text-sm font-semibold">See All</button>
                </div>
                <div className="space-y-3">
                    <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                                <Check size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-sm">Daily Contribution</p>
                                <p className="text-xs text-gray-400">Today, 9:00 AM</p>
                            </div>
                        </div>
                        <span className="font-bold text-green-600">+₹400</span>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between opacity-70">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                                <Check size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 text-sm">Daily Contribution</p>
                                <p className="text-xs text-gray-400">Yesterday, 9:00 AM</p>
                            </div>
                        </div>
                        <span className="font-bold text-green-600">+₹400</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
