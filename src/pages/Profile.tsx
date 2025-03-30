
import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import { 
  Avatar, 
  AvatarFallback,
  AvatarImage 
} from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Clock, 
  User, 
  Settings,
  Trophy,
  Share2 
} from 'lucide-react';
import { updateUserPreferences } from '@/lib/mockData';
import { toast } from 'sonner';
import authService from '@/lib/authService';

interface UserPreferences {
  dietaryRestrictions: string[];
  defaultDrink: string;
  notifications: {
    dailyMenu: boolean;
    preOrderReminders: boolean;
    accountUpdates: boolean;
  };
  privacy: {
    shareMealHistory: boolean;
    showBadges: boolean;
  };
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState<UserPreferences>({
    dietaryRestrictions: [],
    defaultDrink: 'Water',
    notifications: {
      dailyMenu: true,
      preOrderReminders: true,
      accountUpdates: true
    },
    privacy: {
      shareMealHistory: true,
      showBadges: true
    }
  });
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const currentUser = await authService.getCurrentUser();
        
        if (currentUser) {
          // Get profile data from profiles table
          const { data: profileData } = await authService.getProfile(currentUser.id);
          
          setUser({
            id: currentUser.id,
            name: profileData?.name || currentUser.email?.split('@')[0] || 'User',
            email: currentUser.email,
            grade: profileData?.grade || '9th Grade',
            balance: profileData?.balance || 45.75,
            mealStreak: profileData?.meal_streak || 5,
            bestStreak: profileData?.best_streak || 15,
            badges: profileData?.badges || [
              { id: 'b1', name: 'First Login', icon: '🏅' },
              { id: 'b2', name: 'Early Adopter', icon: '🏆' }
            ]
          });
          
          // Load user preferences if they exist
          if (profileData?.preferences) {
            try {
              const userPrefs = typeof profileData.preferences === 'string' 
                ? JSON.parse(profileData.preferences) 
                : profileData.preferences;
              
              setPreferences(prev => ({
                ...prev,
                ...userPrefs
              }));
            } catch (e) {
              console.error("Error parsing preferences:", e);
            }
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);
  
  const toggleDietaryRestriction = (restriction: string) => {
    setPreferences(prev => {
      const newRestrictions = prev.dietaryRestrictions.includes(restriction)
        ? prev.dietaryRestrictions.filter(r => r !== restriction)
        : [...prev.dietaryRestrictions, restriction];
        
      return {
        ...prev,
        dietaryRestrictions: newRestrictions
      };
    });
  };
  
  const handleSavePreferences = async () => {
    try {
      if (!user) return;
      
      // Save to mock data for now (this will be replaced with actual API call)
      updateUserPreferences(preferences);
      
      // Update preferences in Supabase profile
      const { error } = await authService.updateProfile(user.id, {
        preferences: JSON.stringify(preferences)
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Preferences saved successfully!");
    } catch (error) {
      console.error("Error saving preferences:", error);
      toast.error("Failed to save preferences");
    }
  };
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return 'DU';
    return user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
  };
  
  // Calculate meal streak percentage
  const streakPercentage = user?.mealStreak && user?.bestStreak 
    ? (user.mealStreak / user.bestStreak) * 100
    : 0;
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-1">Your Profile</h1>
            <p className="text-gray-500 mb-6">Loading your profile data...</p>
            <div className="animate-pulse">
              {/* Loading skeleton */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-lg h-96"></div>
                <div className="lg:col-span-2 bg-white rounded-lg h-96"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Your Profile</h1>
          <p className="text-gray-500 mb-6">View and manage your account details</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - User info */}
            <div>
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center mb-4">
                    <Avatar className="h-24 w-24 mb-4 bg-cafeteria-secondary text-white">
                      <AvatarFallback className="text-3xl">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-medium mb-1">{user?.name || 'Demo User'}</h2>
                    <Badge className="mb-2">{user?.grade || '9th Grade'}</Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Email</div>
                      <div className="font-medium">{user?.email || 'demo@student.edu'}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Account Balance</div>
                      <div className="font-bold text-xl">${user?.balance?.toFixed(2) || '0.00'}</div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <div className="text-sm text-gray-500">Meal Streak</div>
                        <div className="text-sm font-medium">{user?.mealStreak || 0} days</div>
                      </div>
                      <Progress value={streakPercentage} className="h-2" />
                      <div className="text-xs text-gray-500 mt-1">Best: {user?.bestStreak || 0} days</div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Your Badges</div>
                      <div className="flex flex-wrap gap-2">
                        {user?.badges?.map((badge: any) => (
                          <div key={badge.id} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                            <span className="mr-1">{badge.icon}</span>
                            <span className="text-sm">{badge.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                <Settings size={16} />
                <span>Account Settings</span>
              </Button>
            </div>
            
            {/* Right column - Preferences */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-bold mb-6">Meal Preferences</h2>
                  
                  <div className="space-y-8">
                    {/* Dietary Restrictions */}
                    <div>
                      <h3 className="text-lg font-medium mb-3">Dietary Restrictions</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="vegetarian" 
                            checked={preferences.dietaryRestrictions.includes('Vegetarian')}
                            onCheckedChange={() => toggleDietaryRestriction('Vegetarian')}
                          />
                          <label htmlFor="vegetarian" className="text-sm cursor-pointer">Vegetarian</label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="vegan" 
                            checked={preferences.dietaryRestrictions.includes('Vegan')}
                            onCheckedChange={() => toggleDietaryRestriction('Vegan')}
                          />
                          <label htmlFor="vegan" className="text-sm cursor-pointer">Vegan</label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="gluten-free" 
                            checked={preferences.dietaryRestrictions.includes('Gluten-Free')}
                            onCheckedChange={() => toggleDietaryRestriction('Gluten-Free')}
                          />
                          <label htmlFor="gluten-free" className="text-sm cursor-pointer">Gluten-Free</label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="dairy-free" 
                            checked={preferences.dietaryRestrictions.includes('Dairy-Free')}
                            onCheckedChange={() => toggleDietaryRestriction('Dairy-Free')}
                          />
                          <label htmlFor="dairy-free" className="text-sm cursor-pointer">Dairy-Free</label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="nut-free" 
                            checked={preferences.dietaryRestrictions.includes('Nut-Free')}
                            onCheckedChange={() => toggleDietaryRestriction('Nut-Free')}
                          />
                          <label htmlFor="nut-free" className="text-sm cursor-pointer">Nut-Free</label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="halal" 
                            checked={preferences.dietaryRestrictions.includes('Halal')}
                            onCheckedChange={() => toggleDietaryRestriction('Halal')}
                          />
                          <label htmlFor="halal" className="text-sm cursor-pointer">Halal</label>
                        </div>
                      </div>
                    </div>
                    
                    {/* Default Drink */}
                    <div>
                      <h3 className="text-lg font-medium mb-3">Default Drink</h3>
                      <Select
                        value={preferences.defaultDrink}
                        onValueChange={(value) => 
                          setPreferences(prev => ({ ...prev, defaultDrink: value }))
                        }
                      >
                        <SelectTrigger className="w-full md:w-[300px]">
                          <SelectValue placeholder="Select drink" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Water">Water</SelectItem>
                          <SelectItem value="Milk">Milk</SelectItem>
                          <SelectItem value="Chocolate Milk">Chocolate Milk</SelectItem>
                          <SelectItem value="Apple Juice">Apple Juice</SelectItem>
                          <SelectItem value="Orange Juice">Orange Juice</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Notification Preferences */}
                    <div>
                      <h3 className="text-lg font-medium mb-3">Notification Preferences</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Bell size={18} />
                            <label htmlFor="daily-menu" className="text-sm">Daily menu notifications</label>
                          </div>
                          <Switch 
                            id="daily-menu" 
                            checked={preferences.notifications.dailyMenu}
                            onCheckedChange={(checked) => 
                              setPreferences(prev => ({
                                ...prev,
                                notifications: { ...prev.notifications, dailyMenu: checked }
                              }))
                            }
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Clock size={18} />
                            <label htmlFor="pre-order" className="text-sm">Pre-order reminders</label>
                          </div>
                          <Switch 
                            id="pre-order" 
                            checked={preferences.notifications.preOrderReminders}
                            onCheckedChange={(checked) => 
                              setPreferences(prev => ({
                                ...prev,
                                notifications: { ...prev.notifications, preOrderReminders: checked }
                              }))
                            }
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <User size={18} />
                            <label htmlFor="account-updates" className="text-sm">Account updates</label>
                          </div>
                          <Switch 
                            id="account-updates" 
                            checked={preferences.notifications.accountUpdates}
                            onCheckedChange={(checked) => 
                              setPreferences(prev => ({
                                ...prev,
                                notifications: { ...prev.notifications, accountUpdates: checked }
                              }))
                            }
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Privacy Settings */}
                    <div>
                      <h3 className="text-lg font-medium mb-3">Privacy Settings</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Share2 size={18} />
                            <label htmlFor="share-history" className="text-sm">Share meal history with parents</label>
                          </div>
                          <Switch 
                            id="share-history" 
                            checked={preferences.privacy.shareMealHistory}
                            onCheckedChange={(checked) => 
                              setPreferences(prev => ({
                                ...prev,
                                privacy: { ...prev.privacy, shareMealHistory: checked }
                              }))
                            }
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Trophy size={18} />
                            <label htmlFor="show-badges" className="text-sm">Show badges on profile</label>
                          </div>
                          <Switch 
                            id="show-badges" 
                            checked={preferences.privacy.showBadges}
                            onCheckedChange={(checked) => 
                              setPreferences(prev => ({
                                ...prev,
                                privacy: { ...prev.privacy, showBadges: checked }
                              }))
                            }
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleSavePreferences}
                      className="w-full md:w-auto bg-cafeteria-primary hover:bg-cafeteria-primary/90"
                    >
                      Save Preferences
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
