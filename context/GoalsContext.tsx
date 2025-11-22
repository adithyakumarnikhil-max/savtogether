import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Goal, Transaction } from '../types';
import { mockAPI } from '../utils/mockAPI';
import { useAuth } from './AuthContext';

interface GoalsContextType {
  goals: Goal[];
  activeGoal: Goal | null;
  isLoading: boolean;
  createGoal: (data: any) => Promise<void>;
  refreshGoals: () => Promise<void>;
  transactions: Transaction[];
  fetchTransactions: (goalId: string) => Promise<void>;
}

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

export const GoalsProvider = ({ children }: { children?: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const refreshGoals = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const data = await mockAPI.goals.list();
      setGoals(data);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshGoals();
  }, [refreshGoals]);

  // Simulate real-time updates
  useEffect(() => {
    if (!goals.length) return;
    
    const interval = setInterval(() => {
      // Randomly trigger a debit for demo purposes on active goals
      const active = goals.find(g => g.status === 'active');
      if (active && Math.random() > 0.7) {
        mockAPI.transactions.simulateDebit(active.id, active.contributionPerPerson);
        refreshGoals();
        if (transactions.length > 0) {
             fetchTransactions(active.id);
        }
      }
    }, 8000); // Check every 8 seconds

    return () => clearInterval(interval);
  }, [goals, refreshGoals]);

  const createGoal = async (data: any) => {
    setIsLoading(true);
    try {
      await mockAPI.goals.create(data);
      await refreshGoals();
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTransactions = async (goalId: string) => {
    const txns = await mockAPI.transactions.list(goalId);
    setTransactions(txns);
  };

  const activeGoal = goals.find(g => g.status === 'active') || null;

  return (
    <GoalsContext.Provider value={{ goals, activeGoal, isLoading, createGoal, refreshGoals, transactions, fetchTransactions }}>
      {children}
    </GoalsContext.Provider>
  );
};

export const useGoals = () => {
  const context = useContext(GoalsContext);
  if (!context) throw new Error('useGoals must be used within a GoalsProvider');
  return context;
};