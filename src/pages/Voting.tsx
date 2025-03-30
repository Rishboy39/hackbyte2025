import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  ThumbsUp, 
  ThumbsDown, 
  AlertTriangle,
  Info
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import authService from '@/lib/authService';

interface VotingOption {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  upvotes: number;
  downvotes: number;
  userVote: 'up' | 'down' | null;
}

const monthlyOptions: VotingOption[] = [
  {
    id: 'meal-1',
    name: 'Pizza Day',
    description: 'Classic cheese and pepperoni pizza with a side salad',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    upvotes: 145,
    downvotes: 21,
    userVote: null
  },
  {
    id: 'meal-2',
    name: 'Taco Tuesday',
    description: 'Build-your-own tacos with various toppings',
    imageUrl: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    upvotes: 132,
    downvotes: 15,
    userVote: null
  },
  {
    id: 'meal-3',
    name: 'Pasta Bar',
    description: 'Choose your pasta, sauce, and toppings',
    imageUrl: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    upvotes: 98,
    downvotes: 32,
    userVote: null
  },
  {
    id: 'meal-4',
    name: 'Asian Stir-Fry',
    description: 'Rice or noodles with vegetables and choice of protein',
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1472&q=80',
    upvotes: 87,
    downvotes: 42,
    userVote: null
  },
  {
    id: 'meal-5',
    name: 'Burger Day',
    description: 'Beef, turkey, or veggie burger with fries',
    imageUrl: 'https://images.unsplash.com/photo-1586816001966-79b736744398?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    upvotes: 127,
    downvotes: 18,
    userVote: null
  },
  {
    id: 'meal-6',
    name: 'Mediterranean Bowl',
    description: 'Falafel, hummus, pita, and Greek salad',
    imageUrl: 'https://images.unsplash.com/photo-1644704170910-a0cdf183649b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    upvotes: 94,
    downvotes: 27,
    userVote: null
  },
  {
    id: 'meal-7',
    name: 'BBQ Day',
    description: 'Pulled pork, chicken, or jackfruit with sides',
    imageUrl: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    upvotes: 108,
    downvotes: 34,
    userVote: null
  },
  {
    id: 'meal-8',
    name: 'Soup & Sandwich',
    description: 'Choice of soup with a sandwich',
    imageUrl: 'https://www.pressandjournal.co.uk/wp-content/uploads/sites/54/2021/10/shutterstock_608382740.jpg',
    upvotes: 65,
    downvotes: 39,
    userVote: null
  },
  {
    id: 'meal-9',
    name: 'Salad Bar Extravaganza',
    description: 'Build your own with premium toppings and proteins',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    upvotes: 76,
    downvotes: 57,
    userVote: null
  }
];

const annualOptions: VotingOption[] = [
  {
    id: 'annual-1',
    name: 'International Food Week',
    description: 'A week featuring cuisine from a different country each day',
    imageUrl: 'https://images.unsplash.com/photo-1532465614-6cc8d45f647f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    upvotes: 189,
    downvotes: 14,
    userVote: null
  },
  {
    id: 'annual-2',
    name: 'Sustainable Seafood Festival',
    description: 'A week of responsibly sourced seafood dishes',
    imageUrl: 'https://images.unsplash.com/photo-1579631542720-3a87824ecb0a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    upvotes: 126,
    downvotes: 53,
    userVote: null
  },
  {
    id: 'annual-3',
    name: 'Farm to Table Week',
    description: 'Featuring locally sourced ingredients from nearby farms',
    imageUrl: 'https://images.unsplash.com/photo-1533703910735-57ea8cdf1d94?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    upvotes: 153,
    downvotes: 19,
    userVote: null
  },
  {
    id: 'annual-4',
    name: 'Plant-Based Innovation Week',
    description: 'Creative vegetarian and vegan options for all',
    imageUrl: 'https://images.unsplash.com/photo-1576366637962-62083eb916e6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    upvotes: 135,
    downvotes: 48,
    userVote: null
  },
  {
    id: 'annual-5',
    name: 'Food Truck Festival',
    description: 'Bringing local food trucks to campus for a week',
    imageUrl: 'https://images.unsplash.com/photo-1568286193613-6e93c47410c8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    upvotes: 191,
    downvotes: 21,
    userVote: null
  }
];

const Voting: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [monthlyVotingOptions, setMonthlyVotingOptions] = useState<VotingOption[]>(monthlyOptions);
  const [annualVotingOptions, setAnnualVotingOptions] = useState<VotingOption[]>(annualOptions);
  const [recentlyVoted, setRecentlyVoted] = useState<string | null>(null);
  const [recentVoteType, setRecentVoteType] = useState<'up' | 'down' | null>(null);
  
  const currentDate = new Date();
  const isMonthlyVotingOpen = currentDate.getDate() <= 25; // Extended voting period
  const isAnnualVotingOpen = currentDate.getMonth() === 5 && currentDate.getDate() >= 15; // June 15th onwards
  
  // Calculate days remaining for monthly voting
  const daysRemainingMonthly = isMonthlyVotingOpen ? 25 - currentDate.getDate() : 0;
  
  // Calculate days remaining for annual voting
  const lastDayOfJune = new Date(currentDate.getFullYear(), 5, 30); // June 30th
  const daysRemainingAnnual = isAnnualVotingOpen 
    ? Math.ceil((lastDayOfJune.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)) 
    : 0;
  
  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);
  
  const getApprovalPercentage = (upvotes: number, downvotes: number) => {
    const total = upvotes + downvotes;
    if (total === 0) return 0;
    return Math.round((upvotes / total) * 100);
  };
  
  const handleVote = (id: string, voteType: 'up' | 'down', voteCategory: 'monthly' | 'annual') => {
    // Determine which options array to update
    const options = voteCategory === 'monthly' ? monthlyVotingOptions : annualVotingOptions;
    const setOptions = voteCategory === 'monthly' ? setMonthlyVotingOptions : setAnnualVotingOptions;
    
    // Find the option being voted on
    const option = options.find(opt => opt.id === id);
    if (!option) return;
    
    // Create updated options
    const updatedOptions = options.map(opt => {
      if (opt.id !== id) return opt;
      
      // Handle different voting scenarios
      if (opt.userVote === null) {
        // First vote
        return {
          ...opt,
          upvotes: voteType === 'up' ? opt.upvotes + 1 : opt.upvotes,
          downvotes: voteType === 'down' ? opt.downvotes + 1 : opt.downvotes,
          userVote: voteType
        };
      } else if (opt.userVote === voteType) {
        // Removing existing vote
        return {
          ...opt,
          upvotes: voteType === 'up' ? opt.upvotes - 1 : opt.upvotes,
          downvotes: voteType === 'down' ? opt.downvotes - 1 : opt.downvotes,
          userVote: null
        };
      } else {
        // Changing vote (up -> down or down -> up)
        return {
          ...opt,
          upvotes: voteType === 'up' ? opt.upvotes + 1 : opt.upvotes - 1,
          downvotes: voteType === 'down' ? opt.downvotes + 1 : opt.downvotes - 1,
          userVote: voteType
        };
      }
    });
    
    // Update state
    setOptions(updatedOptions);
    
    // Show notification
    const optionName = option.name;
    let message = '';
    
    if (option.userVote === null) {
      message = `You ${voteType === 'up' ? 'upvoted' : 'downvoted'} ${optionName}`;
    } else if (option.userVote === voteType) {
      message = `Removed your vote from ${optionName}`;
    } else {
      message = `Changed your vote to ${voteType === 'up' ? 'upvote' : 'downvote'} for ${optionName}`;
    }
    
    toast.success(message);
    
    // Set recently voted option for notification
    setRecentlyVoted(id);
    setRecentVoteType(option.userVote === voteType ? null : voteType);
    
    // Clear notification after 3 seconds
    setTimeout(() => {
      setRecentlyVoted(null);
      setRecentVoteType(null);
    }, 3000);
  };
  
  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-blue-500";
    if (percentage >= 40) return "bg-amber-500";
    return "bg-red-500";
  };
  
  const VotingCard = ({ option, voteCategory }: { option: VotingOption, voteCategory: 'monthly' | 'annual' }) => {
    const approvalPercentage = getApprovalPercentage(option.upvotes, option.downvotes);
    const totalVotes = option.upvotes + option.downvotes;
    
    return (
      <Card className="overflow-hidden">
        <div className="h-48 relative">
          <img 
            src={option.imageUrl} 
            alt={option.name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-bold text-lg">{option.name}</h3>
          <p className="text-gray-600 mb-3">{option.description}</p>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{option.upvotes} upvotes / {option.downvotes} downvotes</span>
              <span>{approvalPercentage}% approval</span>
            </div>
            <Progress 
              value={approvalPercentage} 
              className="h-2"
              indicatorClassName={getProgressColor(approvalPercentage)}
            />
            
            <div className="grid grid-cols-2 gap-2 mt-4">
              <Button
                variant={option.userVote === 'up' ? "default" : "outline"}
                className={`flex items-center gap-2 ${
                  option.userVote === 'up' 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => handleVote(option.id, 'up', voteCategory)}
              >
                <ThumbsUp size={16} />
                <span>{option.upvotes}</span>
              </Button>
              
              <Button
                variant={option.userVote === 'down' ? "default" : "outline"}
                className={`flex items-center gap-2 ${
                  option.userVote === 'down' 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => handleVote(option.id, 'down', voteCategory)}
              >
                <ThumbsDown size={16} />
                <span>{option.downvotes}</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  const LoadingCard = () => (
    <Card className="overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200"></div>
      <CardContent className="p-4">
        <div className="h-6 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-1"></div>
        <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="h-2 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Meal Voting</h1>
          <p className="text-gray-500 mb-6">Vote for upcoming meals and share your ideas</p>
          
          <Tabs defaultValue="monthly" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="monthly">Monthly Special</TabsTrigger>
              <TabsTrigger value="annual">Annual Event</TabsTrigger>
            </TabsList>
            
            <TabsContent value="monthly">
              <div className="space-y-6">
                {/* Countdown Box */}
                <Card className="bg-gradient-to-r from-cafeteria-accent/10 to-cafeteria-primary/10">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-full shadow-sm">
                        <Clock size={24} className="text-cafeteria-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">Vote for Next Month's Special</h3>
                        <p className="text-gray-600">
                          The winning meal will be featured every Wednesday next month
                        </p>
                        {isMonthlyVotingOpen ? (
                          <p className="text-gray-600 mt-1">
                            Voting closes in {daysRemainingMonthly} day{daysRemainingMonthly !== 1 ? 's' : ''}. Don't miss your chance!
                          </p>
                        ) : (
                          <p className="text-gray-600 mt-1">
                            Voting is closed for this month. Results are now available.
                          </p>
                        )}
                      </div>
                      
                      <div className="ml-auto">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Info size={18} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Vote for your favorite meals for next month.<br />
                              The option with the most votes will be served every Wednesday.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Notification for recently voted */}
                {recentlyVoted && (
                  <div className={`p-4 border rounded-lg ${
                    recentVoteType === 'down' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      {recentVoteType === 'down' ? (
                        <ThumbsDown size={16} className="text-red-500" />
                      ) : (
                        <ThumbsUp size={16} className="text-green-500" />
                      )}
                      <span>
                        {recentVoteType === null
                          ? "You've removed your vote from "
                          : recentVoteType === 'down'
                            ? "Downvoted! You've downvoted "
                            : "Upvoted! You've upvoted "}
                        {monthlyVotingOptions.find(o => o.id === recentlyVoted)?.name || 
                          annualVotingOptions.find(o => o.id === recentlyVoted)?.name}
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Monthly Voting Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {isLoading ? (
                    Array.from({ length: 6 }).map((_, index) => (
                      <LoadingCard key={`loading-monthly-${index}`} />
                    ))
                  ) : (
                    monthlyVotingOptions.map(option => (
                      <VotingCard key={option.id} option={option} voteCategory="monthly" />
                    ))
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="annual">
              <div className="space-y-6">
                {/* Countdown Box */}
                <Card className="bg-gradient-to-r from-cafeteria-secondary/10 to-cafeteria-secondary/5">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-full shadow-sm">
                        <Calendar size={24} className="text-cafeteria-secondary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">Annual Special Event</h3>
                        <p className="text-gray-600">
                          Vote for a week-long special event to be held next semester
                        </p>
                        {isAnnualVotingOpen ? (
                          <p className="text-gray-600 mt-1">
                            Submit and vote on ideas! {daysRemainingAnnual} day{daysRemainingAnnual !== 1 ? 's' : ''} left.
                          </p>
                        ) : (
                          <p className="text-gray-600 mt-1">
                            Annual voting opens after finals week in June. You can still browse existing ideas.
                          </p>
                        )}
                      </div>
                      
                      <div className="ml-auto">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline">
                              Submit New Idea
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Submit Your Meal Idea</DialogTitle>
                              <DialogDescription>
                                Share your idea for a special week-long food event. The most popular ideas will be considered by cafeteria management.
                              </DialogDescription>
                            </DialogHeader>
                            <form className="space-y-4 pt-4">
                              <div className="space-y-2">
                                <label htmlFor="meal-name" className="text-sm font-medium">
                                  Event Name
                                </label>
                                <input
                                  id="meal-name"
                                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-cafeteria-secondary"
                                  placeholder="E.g., 'Asian Fusion Week'"
                                  disabled={!isAnnualVotingOpen}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <label htmlFor="meal-description" className="text-sm font-medium">
                                  Description
                                </label>
                                <textarea
                                  id="meal-description"
                                  rows={3}
                                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-cafeteria-secondary"
                                  placeholder="Describe what would be served each day..."
                                  disabled={!isAnnualVotingOpen}
                                ></textarea>
                              </div>
                              
                              <div className="flex justify-end">
                                <Button 
                                  type="button" 
                                  className="bg-cafeteria-secondary hover:bg-cafeteria-secondary/90"
                                  onClick={() => {
                                    toast.success("Your idea has been submitted!");
                                  }}
                                  disabled={!isAnnualVotingOpen}
                                >
                                  Submit Idea
                                </Button>
                              </div>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Annual Voting Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                      <LoadingCard key={`loading-annual-${index}`} />
                    ))
                  ) : (
                    annualVotingOptions.map(option => (
                      <VotingCard key={option.id} option={option} voteCategory="annual" />
                    ))
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Voting;
