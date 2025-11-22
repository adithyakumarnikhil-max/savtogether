import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Heart, PiggyBank, TrendingUp } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: "Set Goals Together",
    description: "Create shared savings goals for your dream vacation, wedding, or new home.",
    icon: <Heart size={64} className="text-primary-500" />,
    color: "bg-red-50"
  },
  {
    id: 2,
    title: "Automatic Savings",
    description: "Link accounts and let us handle the rest. Equal contributions, debited automatically.",
    icon: <PiggyBank size={64} className="text-primary-500" />,
    color: "bg-orange-50"
  },
  {
    id: 3,
    title: "Grow Faster",
    description: "Track progress in real-time and celebrate milestones as a team.",
    icon: <TrendingUp size={64} className="text-primary-500" />,
    color: "bg-green-50"
  }
];

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white p-6">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className={`w-64 h-64 rounded-full ${slides[currentSlide].color} flex items-center justify-center mb-12 transition-colors duration-500`}>
          <div className="transform transition-all duration-500 hover:scale-110">
            {slides[currentSlide].icon}
          </div>
        </div>

        <div className="text-center space-y-4 max-w-xs mx-auto">
          <h2 className="text-3xl font-bold font-display text-gray-900 transition-all duration-300">
            {slides[currentSlide].title}
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed transition-all duration-300">
            {slides[currentSlide].description}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-8 mb-8">
        <div className="flex justify-center gap-2">
          {slides.map((_, index) => (
            <div 
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === index ? 'w-8 bg-primary-500' : 'w-2 bg-gray-200'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="w-full bg-primary-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
