export interface User {
  id: string;
  fullName: string;
  email: string;
  partnerId?: string | null;
  avatarUrl?: string;
}

export interface Invitation {
  id: string;
  senderId: string;
  invitedEmail: string;
  status: 'pending' | 'accepted' | 'rejected';
  sentAt: number;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  contributionPerPerson: number; // Daily amount
  frequency: 'daily' | 'weekly' | 'monthly';
  status: 'active' | 'paused' | 'completed';
  createdAt: number;
  partnerId: string; // The ID of the relationship/partner
}

export interface Transaction {
  id: string;
  goalId: string;
  userId: string;
  userName: string;
  amount: number;
  type: 'debit' | 'credit';
  status: 'success' | 'failed' | 'pending';
  timestamp: number;
  reference: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
