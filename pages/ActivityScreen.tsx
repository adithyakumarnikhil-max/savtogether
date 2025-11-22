import React, { useEffect, useState } from 'react';
import { Filter, ArrowDownLeft, ArrowUpRight, Download } from 'lucide-react';
import { mockAPI } from '../utils/mockAPI';
import { Transaction } from '../types';

export default function ActivityScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'debit' | 'credit'>('all');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await mockAPI.transactions.listAll();
        setTransactions(data);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredTransactions = transactions.filter(t => 
    filter === 'all' ? true : t.type === filter
  );

  // Group transactions by date
  const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
    const date = new Date(transaction.timestamp).toLocaleDateString(undefined, {
      month: 'short', day: 'numeric', year: 'numeric'
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-white pt-6 pb-4 px-6 sticky top-0 z-10 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 font-display">Activity</h1>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <Download size={20} />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {['all', 'debit', 'credit'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                filter === f 
                  ? 'bg-gray-900 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f === 'all' ? 'All Transactions' : f === 'debit' ? 'Savings (Debit)' : 'Withdrawals (Credit)'}
            </button>
          ))}
        </div>
      </header>

      <div className="p-6 space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
          </div>
        ) : Object.keys(groupedTransactions).length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p>No transactions found.</p>
          </div>
        ) : (
          Object.keys(groupedTransactions).map(date => (
            <div key={date}>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">{date}</h3>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {groupedTransactions[date].map((txn, idx) => (
                  <div 
                    key={txn.id} 
                    className={`p-4 flex items-center justify-between ${
                      idx !== groupedTransactions[date].length - 1 ? 'border-b border-gray-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        txn.type === 'debit' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {txn.type === 'debit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{txn.userName}</p>
                        <p className="text-xs text-gray-500">
                          {txn.type === 'debit' ? 'Contribution' : 'Withdrawal'} • {new Date(txn.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>
                    <span className={`font-bold ${
                      txn.type === 'debit' ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      {txn.type === 'debit' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}