
import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, ThumbsUp, TrendingUp, Utensils, Leaf, PieChart } from 'lucide-react';
import MiniLineChart from '@/components/MiniLineChart';
import MiniBarChart from '@/components/MiniBarChart';
import StatCard from '@/components/StatCard';
import MealHistoryCard from '@/components/MealHistoryCard';
import BadgeDisplay from '@/components/BadgeDisplay';
import authService from '@/lib/authService';
import { useNavigate } from 'react-router-dom';
import { mealHistory, statsData } from '@/lib/mockData';
import Shimmer from '@/components/Shimmer';
import StudentFeedback from '@/components/StudentFeedback';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const navigate = useNavigate();
  
  const badges = [
    {
      id: 'b1',
      name: 'Perfect Attendance',
      description: 'Ordered lunch every day for a week',
      icon: '🏆',
      color: 'bg-yellow-100',
      earned: true
    },
    {
      id: 'b2',
      name: 'Nutrition Champion',
      description: 'Maintained a high nutrition score for 2 weeks',
      icon: '🥗',
      color: 'bg-green-100',
      earned: true
    },
    {
      id: 'b3',
      name: 'Zero Waste',
      description: 'Finished your meal completely for 5 days',
      icon: '♻️',
      color: 'bg-blue-100',
      earned: false
    }
  ];

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          const { data: profileData } = await authService.getProfile(user.id);
          setUserData({
            id: user.id,
            name: profileData?.name || user.email?.split('@')[0] || 'User',
            email: user.email,
            grade: profileData?.grade || '',
            avatar: null
          });
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      <main className="flex-1 p-4 md:p-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">
                {loading ? (
                  <Shimmer className="h-8 w-40" />
                ) : (
                  <>Dashboard</>
                )}
              </h1>
              <p className="text-gray-500">Track your meals and impact</p>
            </div>
            
            <div className="mt-3 md:mt-0 flex space-x-3">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => navigate('/order-management')}
              >
                <Clock size={16} />
                <span>My Orders</span>
              </Button>
              <Button 
                className="flex items-center gap-2"
                onClick={() => navigate('/pre-order')}
              >
                <Utensils size={16} />
                <span>Pre-order Meal</span>
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <StatCard
              title="Average Calories"
              value="482 / day"
              icon={<Utensils className="h-4 w-4 text-orange-500" />}
              trend={{
                value: 5,
                isPositive: true
              }}
            >
              <MiniBarChart data={statsData.caloriesPerDay} color="#FF9F43" />
            </StatCard>
            
            <StatCard
              title="Waste Reduction"
              value="1.9 lbs saved"
              icon={<Leaf className="h-4 w-4 text-green-500" />}
              trend={{
                value: 12,
                isPositive: true
              }}
            >
              <MiniLineChart data={statsData.wasteReduction} color="#28C76F" />
            </StatCard>
            
            <StatCard
              title="Nutrition Score"
              value="80/100"
              icon={<ThumbsUp className="h-4 w-4 text-blue-500" />}
              trend={{
                value: 8,
                isPositive: true
              }}
            >
              <MiniLineChart data={statsData.nutritionScore} color="#4C51BF" />
            </StatCard>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <StatCard
              title="Most Popular"
              value="Pizza & Salad"
              icon={<TrendingUp className="h-4 w-4 text-red-500" />}
              trend={null}
            >
              <div className="flex justify-between items-center mt-2">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-16 bg-red-500 rounded-sm"></div>
                  <span className="text-xs mt-1">Pizza</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-6 h-12 bg-red-400 rounded-sm"></div>
                  <span className="text-xs mt-1">Salad</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-6 h-10 bg-red-400 rounded-sm"></div>
                  <span className="text-xs mt-1">Burger</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-6 h-8 bg-red-400 rounded-sm"></div>
                  <span className="text-xs mt-1">Pasta</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 bg-red-400 rounded-sm"></div>
                  <span className="text-xs mt-1">Tacos</span>
                </div>
              </div>
            </StatCard>
            
            <StatCard
              title="Meal Check-ins"
              value="18/20 days"
              icon={<Clock className="h-4 w-4 text-orange-500" />}
              trend={{
                value: 2,
                isPositive: false
              }}
            >
              <div className="mt-2 text-sm text-gray-500">
                You've checked in for 18 out of 20 school days this month
              </div>
            </StatCard>
            
            <StatCard
              title="Food Waste"
              value="15% average"
              icon={<PieChart className="h-4 w-4 text-blue-500" />}
              trend={{
                value: 7,
                isPositive: false
              }}
            >
              <div className="flex justify-between items-end mt-2">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-10 bg-blue-400 rounded-sm"></div>
                  <span className="text-xs mt-1">Pizza</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-6 h-14 bg-blue-400 rounded-sm"></div>
                  <span className="text-xs mt-1">Veggies</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-6 h-8 bg-blue-400 rounded-sm"></div>
                  <span className="text-xs mt-1">Grains</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 bg-blue-400 rounded-sm"></div>
                  <span className="text-xs mt-1">Fruit</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-6 h-4 bg-blue-400 rounded-sm"></div>
                  <span className="text-xs mt-1">Dairy</span>
                </div>
              </div>
            </StatCard>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <MealHistoryCard meals={mealHistory} loading={loading} />
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Account Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Current Balance</span>
                      <span className="text-xl font-bold">$45.75</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Average Meal Price</span>
                      <span>$5.99</span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" className="flex-1">Add Funds</Button>
                      <Button variant="outline" className="flex-1">View History</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <BadgeDisplay badges={badges} loading={loading} />
              
              <Card>
                <CardContent className="pt-6">
                  <Button className="w-full">
                    Invite Parent
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
