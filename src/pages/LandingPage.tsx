
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { ArrowRight } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-cafeteria-light to-white">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex items-center justify-between">
        <Logo className="w-auto" />
        <Button 
          variant="outline" 
          className="border-cafeteria-primary text-cafeteria-primary hover:bg-cafeteria-primary hover:text-white transition-all"
          onClick={() => navigate('/login')}
        >
          Login
        </Button>
      </nav>
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-24 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Welcome to <span className="text-cafeteria-primary">SchoolBites</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            The smart way to manage school meals, reduce waste, and make healthier choices.
          </p>
          <div className="space-x-4">
            <Button 
              className="bg-cafeteria-primary hover:bg-cafeteria-primary/90 text-white px-8 py-6 h-auto"
              onClick={() => navigate('/login')}
            >
              Get Started <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
        <div className="md:w-1/2">
          <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
            <img 
              src="https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80" 
              alt="Student Cafeteria" 
              className="w-full h-auto rounded-lg" 
            />
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">What SchoolBites Offers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            title="Pre-Order Meals" 
            description="Skip the long lines by pre-ordering your favorite meals directly from your device."
            icon="🍽️"
          />
          <FeatureCard 
            title="Vote on Future Meals" 
            description="Have a say in what appears on your cafeteria menu by voting for your favorite options."
            icon="🗳️"
          />
          <FeatureCard 
            title="Reduce Food Waste" 
            description="Help the environment by allowing our cafeteria to prepare the right amount of food."
            icon="🌱"
          />
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StepCard 
              number="1" 
              title="Create an Account" 
              description="Sign up with your school email to get started."
            />
            <StepCard 
              number="2" 
              title="Browse the Menu" 
              description="Explore today's and upcoming meal options."
            />
            <StepCard 
              number="3" 
              title="Pre-Order Meals" 
              description="Select your meals in advance to save time."
            />
            <StepCard 
              number="4" 
              title="Track & Improve" 
              description="Monitor your habits and earn rewards for reducing waste."
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Ready to Get Started?</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join your fellow students in making your cafeteria experience better and more sustainable.
        </p>
        <Button 
          className="bg-cafeteria-primary hover:bg-cafeteria-primary/90 text-white px-8 py-6 h-auto"
          onClick={() => navigate('/login')}
        >
          Sign Up Today <ArrowRight className="ml-2" />
        </Button>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Logo className="mb-4 md:mb-0" />
            <div className="text-center md:text-right">
              <p>© {new Date().getFullYear()} SchoolBites. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Feature Card Component
interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

// Step Card Component
interface StepCardProps {
  number: string;
  title: string;
  description: string;
}

const StepCard: React.FC<StepCardProps> = ({ number, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md relative">
      <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-cafeteria-primary text-white flex items-center justify-center text-xl font-bold">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2 mt-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default LandingPage;
