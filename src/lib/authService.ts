import { supabase } from "@/integrations/supabase/client";
import { User, Session } from '@supabase/supabase-js';
import { Meal, FoodItem } from '@/lib/mockData';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  grade: string;
  role: 'student' | 'teacher' | 'admin' | 'staff';
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}

export interface ProfileData {
  id: string;
  created_at: string | null;
  updated_at: string | null;
  name: string | null;
  email: string | null;
  grade: string | null;
  role: 'student' | 'teacher' | 'admin' | 'staff' | null;
  balance: number | null;
  meal_streak: number | null;
  best_streak: number | null;
  badges: any[] | null;
  preferences: {
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
  } | null;
}

export interface FeedbackData {
  userId: string;
  feedback: string;
  resolved: boolean;
}

const authService = {
  login: async (credentials: LoginCredentials): Promise<{ success: boolean, message?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      
      if (error) {
        return { success: false, message: error.message };
      }
      
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "An unexpected error occurred" };
    }
  },
  
  signup: async (data: SignupData): Promise<{ success: boolean, message?: string }> => {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            grade: data.grade,
            role: data.role
          }
        }
      });
      
      if (error) {
        return { success: false, message: error.message };
      }
      
      return { success: true };
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, message: "An unexpected error occurred" };
    }
  },
  
  logout: async (): Promise<void> => {
    await supabase.auth.signOut();
  },
  
  isLoggedIn: async (): Promise<boolean> => {
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  },

  getCurrentSession: async (): Promise<Session | null> => {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  getCurrentUser: async (): Promise<User | null> => {
    const { data } = await supabase.auth.getUser();
    return data.user;
  },

  getProfile: async (userId: string) => {
    return supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
  },

  updateProfile: async (userId: string, updates: any) => {
    return supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);
  },

  onAuthStateChange: (callback: (session: Session | null, user: User | null) => void) => {
    return supabase.auth.onAuthStateChange((_, session) => {
      callback(session, session?.user || null);
    });
  },
  
  getUserRole: async (userId: string): Promise<'student' | 'teacher' | 'admin' | 'staff' | null> => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData || !userData.user) {
        return null;
      }
      
      const role = userData.user.user_metadata?.role as 'student' | 'teacher' | 'admin' | 'staff';
      
      if (!role) {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .single();
          
        if (error || !profileData) {
          console.error("Error getting user role from profile:", error);
          return null;
        }
        
        return profileData.role as 'student' | 'teacher' | 'admin' | 'staff' || 'student';
      }
      
      return role;
    } catch (error) {
      console.error("Error getting user role:", error);
      return null;
    }
  },

  saveOrder: async (mealData: {
    userId: string;
    items: { 
      entreeId?: string;
      sideId?: string;
      drinkId?: string;
    };
    totalCalories: number;
    nutritionScore: number;
    totalPrice: number;
    wasteFactor: number;
    mealIntention: string;
  }): Promise<{ success: boolean, message?: string }> => {
    try {
      console.log("Saving order to database:", mealData);
      
      return { success: true };
    } catch (error) {
      console.error("Order save error:", error);
      return { success: false, message: "Failed to save order" };
    }
  },
  
  getUserMealHistory: async (userId: string): Promise<Meal[]> => {
    try {
      console.log("Fetching meal history for user:", userId);
      
      return [];
    } catch (error) {
      console.error("Meal history fetch error:", error);
      return [];
    }
  },
  
  getUserNutritionStats: async (userId: string): Promise<{
    avgCalories: number;
    avgNutritionScore: number;
    wasteSaved: number;
  }> => {
    try {
      console.log("Fetching nutrition stats for user:", userId);
      
      return {
        avgCalories: 0,
        avgNutritionScore: 0,
        wasteSaved: 0
      };
    } catch (error) {
      console.error("Nutrition stats fetch error:", error);
      return {
        avgCalories: 0,
        avgNutritionScore: 0,
        wasteSaved: 0
      };
    }
  },
  
  updateUserBalance: async (userId: string, newBalance: number): Promise<boolean> => {
    try {
      console.log("Updating balance for user:", userId, "to", newBalance);
      
      return true;
    } catch (error) {
      console.error("Balance update error:", error);
      return false;
    }
  },
  
  getFoodItems: async (): Promise<FoodItem[]> => {
    try {
      console.log("Fetching food items from database");
      
      return [];
    } catch (error) {
      console.error("Food items fetch error:", error);
      return [];
    }
  },

  saveFeedback: async (feedbackData: FeedbackData): Promise<{ success: boolean, message?: string }> => {
    try {
      console.log("Saving feedback to database:", feedbackData);
      
      const mockFeedbackData = [
        { id: 5, name: 'Current User', feedback: feedbackData.feedback, date: 'Just now', resolved: false }
      ];
      
      if (typeof window !== 'undefined' && window.studentFeedback) {
        window.studentFeedback = [
          ...mockFeedbackData,
          ...window.studentFeedback
        ];
      }
      
      return { success: true };
    } catch (error) {
      console.error("Feedback save error:", error);
      return { success: false, message: "Failed to save feedback" };
    }
  }
};

export default authService;
