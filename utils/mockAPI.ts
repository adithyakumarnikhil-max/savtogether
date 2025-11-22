import { User, Goal, Transaction, Invitation } from '../types';

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

// Helper to simulate network delay
const delay = (ms = 800) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAPI = {
  auth: {
    login: async (email: string): Promise<{ user: User; token: string }> => {
      await delay();
      // Simulate looking up user or creating a demo user
      const storedUser = localStorage.getItem('sav_user');
      if (storedUser) {
        return { user: JSON.parse(storedUser), token: 'mock-jwt-token' };
      }
      
      // Default demo user
      const user: User = {
        id: 'user_1',
        fullName: email.split('@')[0] || 'Ravi Sharma',
        email: email,
        avatarUrl: 'https://i.pravatar.cc/150?u=user_1',
        partnerId: null, // Initially no partner
      };
      localStorage.setItem('sav_user', JSON.stringify(user));
      return { user, token: 'mock-jwt-token' };
    },
    
    signup: async (data: { fullName: string; email: string }): Promise<{ user: User; token: string }> => {
      await delay();
      const user: User = {
        id: 'user_' + generateId(),
        fullName: data.fullName,
        email: data.email,
        avatarUrl: `https://i.pravatar.cc/150?u=${data.email}`,
        partnerId: null,
      };
      localStorage.setItem('sav_user', JSON.stringify(user));
      return { user, token: 'mock-jwt-token' };
    },

    updateUser: async (updates: Partial<User>): Promise<User> => {
      await delay(500);
      const storedUser = JSON.parse(localStorage.getItem('sav_user') || '{}');
      const updatedUser = { ...storedUser, ...updates };
      localStorage.setItem('sav_user', JSON.stringify(updatedUser));
      return updatedUser;
    }
  },

  partner: {
    invite: async (email: string): Promise<Invitation> => {
      await delay();
      const invitation: Invitation = {
        id: generateId(),
        senderId: 'user_1',
        invitedEmail: email,
        status: 'pending',
        sentAt: Date.now(),
      };
      localStorage.setItem('sav_invitation', JSON.stringify(invitation));
      
      // DEMO MODE: Auto-accept ANY invitation after 4 seconds
      // This simulates the partner receiving the email and clicking "Join"
      setTimeout(() => {
          console.log("Simulating Partner Acceptance...");
          const inv = JSON.parse(localStorage.getItem('sav_invitation') || '{}');
          inv.status = 'accepted';
          localStorage.setItem('sav_invitation', JSON.stringify(inv));
          
          // Also update the current user to link them to a mock partner
          const user = JSON.parse(localStorage.getItem('sav_user') || '{}');
          user.partnerId = 'partner_1'; // Mock Partner ID linked
          localStorage.setItem('sav_user', JSON.stringify(user));
      }, 4000); 
      
      return invitation;
    },

    checkStatus: async (): Promise<Invitation | null> => {
      await delay(300);
      const inv = localStorage.getItem('sav_invitation');
      return inv ? JSON.parse(inv) : null;
    }
  },

  goals: {
    create: async (data: Omit<Goal, 'id' | 'currentAmount' | 'status' | 'createdAt' | 'partnerId'>): Promise<Goal> => {
      await delay();
      const newGoal: Goal = {
        id: generateId(),
        ...data,
        currentAmount: 0,
        status: 'active',
        createdAt: Date.now(),
        partnerId: 'partner_1', // Mock partner ID
      };
      
      const goals = JSON.parse(localStorage.getItem('sav_goals') || '[]');
      goals.push(newGoal);
      localStorage.setItem('sav_goals', JSON.stringify(goals));
      
      return newGoal;
    },

    list: async (): Promise<Goal[]> => {
      await delay(500);
      return JSON.parse(localStorage.getItem('sav_goals') || '[]');
    },
    
    get: async (id: string): Promise<Goal | undefined> => {
      await delay(300);
      const goals: Goal[] = JSON.parse(localStorage.getItem('sav_goals') || '[]');
      return goals.find(g => g.id === id);
    }
  },

  transactions: {
    list: async (goalId: string): Promise<Transaction[]> => {
      await delay(500);
      const allTxns: Transaction[] = JSON.parse(localStorage.getItem('sav_transactions') || '[]');
      return allTxns.filter(t => t.goalId === goalId).sort((a, b) => b.timestamp - a.timestamp);
    },

    listAll: async (): Promise<Transaction[]> => {
      await delay(500);
      const allTxns: Transaction[] = JSON.parse(localStorage.getItem('sav_transactions') || '[]');
      return allTxns.sort((a, b) => b.timestamp - a.timestamp);
    },

    // Simulate background auto-debit
    simulateDebit: (goalId: string, amount: number) => {
      const txns: Transaction[] = JSON.parse(localStorage.getItem('sav_transactions') || '[]');
      const newTxn1: Transaction = {
        id: generateId(),
        goalId,
        userId: 'user_1',
        userName: 'You',
        amount: amount,
        type: 'debit',
        status: 'success',
        timestamp: Date.now(),
        reference: `TXN_${Date.now()}_1`
      };
      const newTxn2: Transaction = {
        id: generateId(),
        goalId,
        userId: 'partner_1',
        userName: 'Partner', // Generic name since we don't have real partner data yet
        amount: amount,
        type: 'debit',
        status: 'success',
        timestamp: Date.now(),
        reference: `TXN_${Date.now()}_2`
      };
      
      txns.push(newTxn1, newTxn2);
      localStorage.setItem('sav_transactions', JSON.stringify(txns));

      // Update goal total
      const goals: Goal[] = JSON.parse(localStorage.getItem('sav_goals') || '[]');
      const goalIdx = goals.findIndex(g => g.id === goalId);
      if (goalIdx > -1) {
        goals[goalIdx].currentAmount += (amount * 2);
        localStorage.setItem('sav_goals', JSON.stringify(goals));
      }
    }
  }
};