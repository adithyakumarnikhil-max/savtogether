import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { GoalsProvider } from './context/GoalsContext';
import Layout from './components/Layout';
import SplashScreen from './pages/SplashScreen';
import OnboardingScreen from './pages/OnboardingScreen';
import LoginScreen from './pages/LoginScreen';
import DashboardScreen from './pages/DashboardScreen';
import CreateGoalScreen from './pages/CreateGoalScreen';
import GoalDetailScreen from './pages/GoalDetailScreen';
import GoalsScreen from './pages/GoalsScreen';
import ActivityScreen from './pages/ActivityScreen';
import ProfileScreen from './pages/ProfileScreen';

export default function App() {
  return (
    <AuthProvider>
      <GoalsProvider>
        <HashRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<SplashScreen />} />
              <Route path="/onboarding" element={<OnboardingScreen />} />
              <Route path="/login" element={<LoginScreen />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={<DashboardScreen />} />
              <Route path="/goals" element={<GoalsScreen />} />
              <Route path="/goals/create" element={<CreateGoalScreen />} />
              <Route path="/goals/:id" element={<GoalDetailScreen />} />
              <Route path="/activity" element={<ActivityScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
            </Routes>
          </Layout>
        </HashRouter>
      </GoalsProvider>
    </AuthProvider>
  );
}