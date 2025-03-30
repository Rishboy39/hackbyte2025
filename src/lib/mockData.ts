import { Badge } from '@/components/BadgeDisplay';

export interface User {
  id: string;
  name: string;
  email: string;
  grade: string;
  balance: number;
  mealStreak: number;
  bestStreak: number;
  avatarUrl: string | null;
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
  };
  badges: {
    id: string;
    name: string;
    icon: string;
  }[];
}

export interface Meal {
  id: string;
  date: string;
  name: string;
  imageUrl: string;
  calories: number;
  wasteFactor: number;
  price: number;
  tags: string[];
  nutritionScore?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  calories: number;
  tags: string[];
  type: 'entree' | 'side' | 'drink';
  popular: boolean;
  nutritionScore: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface VotingOption {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  votes: number;
}

export interface UserPreferences {
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

export interface Order {
  id: string;
  date: string;
  name: string;
  imageUrl: string;
  status: 'pending' | 'ready' | 'completed' | 'cancelled' | 'active';
  orderTime: string;
  price: number;
  calories: number;
  protein: number;
  carbs: number;
  fat?: number;
  nutritionScore: number;
  wasteFactor: number;
  modifiable: boolean;
}

export const mockOrders: Order[] = [
  {
    id: 'order-1',
    date: new Date().toISOString(), // Today
    name: 'Grilled Chicken Sandwich',
    imageUrl: 'https://images.unsplash.com/photo-1525184438-37cce0a5a7d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    status: 'active',
    orderTime: '12:30 PM',
    price: 6.99,
    calories: 480,
    protein: 35,
    carbs: 42,
    fat: 15,
    nutritionScore: 78,
    wasteFactor: 0.1,
    modifiable: true
  },
  {
    id: 'order-2',
    date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), // Tomorrow
    name: 'Pasta Primavera',
    imageUrl: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    status: 'pending',
    orderTime: '11:15 AM',
    price: 5.99,
    calories: 520,
    protein: 12,
    carbs: 85,
    fat: 16,
    nutritionScore: 75,
    wasteFactor: 0.2,
    modifiable: true
  },
  {
    id: 'order-3',
    date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), // Yesterday
    name: 'Bean & Cheese Burrito',
    imageUrl: 'https://images.unsplash.com/photo-1584208632869-05c6c6727080?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    status: 'ready',
    orderTime: '12:00 PM',
    price: 6.50,
    calories: 550,
    protein: 18,
    carbs: 75,
    fat: 20,
    nutritionScore: 72,
    wasteFactor: 0.15,
    modifiable: false
  },
  {
    id: 'order-4',
    date: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(), // 3 days ago
    name: 'Turkey Chili',
    imageUrl: 'https://images.unsplash.com/photo-1547308283-d9386d22df2b?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    status: 'completed',
    orderTime: '11:30 AM',
    price: 5.75,
    calories: 420,
    protein: 28,
    carbs: 45,
    fat: 10,
    nutritionScore: 86,
    wasteFactor: 0.05,
    modifiable: false
  },
  {
    id: 'order-5',
    date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), // 2 days ago
    name: 'Pepperoni Pizza',
    imageUrl: 'https://images.unsplash.com/photo-1593504049359-74330189a345?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    status: 'cancelled',
    orderTime: '12:15 PM',
    price: 4.99,
    calories: 580,
    protein: 22,
    carbs: 65,
    fat: 25,
    nutritionScore: 62,
    wasteFactor: 0.3,
    modifiable: false
  }
];

export const currentUser = {
  id: 'user-1',
  name: 'Demo User',
  email: 'demo@student.edu',
  grade: '9th Grade',
  balance: 45.75,
  mealStreak: 5,
  bestStreak: 15,
  avatarUrl: null,
  preferences: {
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
  },
  badges: [
    { id: 'badge-1', name: 'First Login', icon: '🏅' },
    { id: 'badge-2', name: 'Early Adopter', icon: '🏆' }
  ]
};

export const mealHistory: Meal[] = [
  {
    id: '1',
    date: 'May 15',
    name: 'Chicken Caesar Salad',
    imageUrl: 'https://th.bing.com/th/id/OIP.ijHtZjtaEifUMqC4mE4-AQHaLI?rs=1&pid=ImgDetMain',
    calories: 450,
    wasteFactor: 0.1,
    price: 5.99,
    tags: ['Protein', 'Salad'],
    nutritionScore: 82,
    protein: 32,
    carbs: 18,
    fat: 12
  },
  {
    id: '2',
    date: 'May 14',
    name: 'Spaghetti with Meatballs',
    imageUrl: 'https://th.bing.com/th/id/R.ef67b9729545c9f617d33b30b4b98850?rik=rz%2faTdDvwTzrSg&pid=ImgRaw&r=0',
    calories: 680,
    wasteFactor: 0.25,
    price: 6.50,
    tags: ['Pasta', 'Meat'],
    nutritionScore: 68,
    protein: 25,
    carbs: 80,
    fat: 18
  },
  {
    id: '3',
    date: 'May 13',
    name: 'Veggie Burrito Bowl',
    imageUrl: 'https://th.bing.com/th/id/R.af1ca789efea92e43d8b54fac0e84a05?rik=XrJcvBFoyJTwIA&pid=ImgRaw&r=0',
    calories: 520,
    wasteFactor: 0.05,
    price: 7.25,
    tags: ['Vegetarian', 'Bowl'],
    nutritionScore: 85,
    protein: 15,
    carbs: 70,
    fat: 12
  },
  {
    id: '4',
    date: 'May 12',
    name: 'Turkey Sandwich',
    imageUrl: 'https://th.bing.com/th/id/R.671041abaf9a09844202fd2951a3c498?rik=%2b5u%2fzdK0CLr9OA&pid=ImgRaw&r=0',
    calories: 440,
    wasteFactor: 0.3,
    price: 5.75,
    tags: ['Sandwich', 'Meat'],
    nutritionScore: 75,
    protein: 28,
    carbs: 45,
    fat: 10
  },
  {
    id: '5',
    date: 'May 11',
    name: 'Garden Salad',
    imageUrl: 'https://neighborfoodblog.com/wp-content/uploads/2020/03/garden-salad-2.jpg',
    calories: 320,
    wasteFactor: 0.45,
    price: 4.99,
    tags: ['Vegetarian', 'Salad'],
    nutritionScore: 90,
    protein: 5,
    carbs: 25,
    fat: 5
  },
  {
    id: '6',
    date: 'May 10',
    name: 'Cheese Pizza',
    imageUrl: 'https://th.bing.com/th/id/OIP.j3bvaglGwvu2Tb8zZ7ZHFQHaE8?rs=1&pid=ImgDetMain',
    calories: 580,
    wasteFactor: 0.15,
    price: 5.50,
    tags: ['Vegetarian', 'Pizza'],
    nutritionScore: 65,
    protein: 18,
    carbs: 75,
    fat: 22
  },
  {
    id: '7',
    date: 'May 9',
    name: 'Chicken Tenders',
    imageUrl: 'https://th.bing.com/th/id/OIP.Pqgp0YhwbPnAIK7_TIX1KQHaLH?rs=1&pid=ImgDetMain',
    calories: 620,
    wasteFactor: 0.2,
    price: 6.75,
    tags: ['Meat', 'Fried'],
    nutritionScore: 60,
    protein: 30,
    carbs: 40,
    fat: 28
  }
];

export const foodItems: FoodItem[] = [
  {
    id: 'e1',
    name: 'Grilled Chicken Sandwich',
    description: 'Grilled chicken breast with lettuce, tomato, and mayo on a whole grain bun',
    imageUrl: 'https://images.unsplash.com/photo-1550507992-eb63ffee0847?auto=format&fit=crop&w=400&q=80',
    price: 6.99,
    calories: 480,
    tags: ['Protein', 'Sandwich', 'Healthy'],
    type: 'entree',
    popular: true,
    nutritionScore: 78,
    protein: 35,
    carbs: 42,
    fat: 15
  },
  {
    id: 'e2',
    name: 'Pasta Primavera',
    description: 'Pasta with seasonal vegetables in a light cream sauce',
    imageUrl: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=400&q=80',
    price: 5.99,
    calories: 520,
    tags: ['Vegetarian', 'Pasta'],
    type: 'entree',
    popular: false,
    nutritionScore: 75,
    protein: 12,
    carbs: 85,
    fat: 16
  },
  {
    id: 'e3',
    name: 'Bean & Cheese Burrito',
    description: 'Flour tortilla filled with beans, cheese, rice, and pico de gallo',
    imageUrl: 'https://www.apinchofhealthy.com/wp-content/uploads/2021/09/Close-up-side-shot-of-styled-sandwich-2.jpg',
    price: 6.50,
    calories: 550,
    tags: ['Vegetarian', 'Mexican'],
    type: 'entree',
    popular: true,
    nutritionScore: 72,
    protein: 18,
    carbs: 75,
    fat: 20
  },
  {
    id: 'e4',
    name: 'Turkey Chili',
    description: 'Hearty turkey chili with beans and vegetables',
    imageUrl: 'https://th.bing.com/th/id/OIP.kA0jzzAM42PoHE3aUBqt4QHaLH?rs=1&pid=ImgDetMain',
    price: 5.75,
    calories: 420,
    tags: ['Protein', 'Soup', 'Healthy'],
    type: 'entree',
    popular: false,
    nutritionScore: 86,
    protein: 28,
    carbs: 45,
    fat: 10
  },
  {
    id: 'e5',
    name: 'Pepperoni Pizza',
    description: 'Slice of pizza with pepperoni and cheese',
    imageUrl: 'https://images.unsplash.com/photo-1593504049359-74330189a345?auto=format&fit=crop&w=400&q=80',
    price: 4.99,
    calories: 580,
    tags: ['Pizza', 'Popular'],
    type: 'entree',
    popular: true,
    nutritionScore: 62,
    protein: 22,
    carbs: 65,
    fat: 25
  },
  
  {
    id: 's1',
    name: 'Garden Salad',
    description: 'Mixed greens with cucumbers, tomatoes, and carrots',
    imageUrl: 'https://th.bing.com/th/id/OIP.uUXAgAGjnopQCEhIh4Ik6AHaKX?rs=1&pid=ImgDetMain',
    price: 3.50,
    calories: 120,
    tags: ['Vegetarian', 'Salad', 'Healthy'],
    type: 'side',
    popular: true,
    nutritionScore: 92,
    protein: 3,
    carbs: 10,
    fat: 4
  },
  {
    id: 's2',
    name: 'French Fries',
    description: 'Crispy golden french fries',
    imageUrl: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=400&q=80',
    price: 2.99,
    calories: 380,
    tags: ['Fried', 'Popular'],
    type: 'side',
    popular: true,
    nutritionScore: 55,
    protein: 4,
    carbs: 45,
    fat: 18
  },
  {
    id: 's3',
    name: 'Apple Slices',
    description: 'Fresh apple slices',
    imageUrl: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=400&q=80',
    price: 1.75,
    calories: 80,
    tags: ['Fruit', 'Healthy'],
    type: 'side',
    popular: false,
    nutritionScore: 95,
    protein: 0,
    carbs: 20,
    fat: 0
  },
  {
    id: 's4',
    name: 'Yogurt Parfait',
    description: 'Vanilla yogurt with granola and mixed berries',
    imageUrl: 'https://feelgoodfoodie.net/wp-content/uploads/2021/05/fruit-and-yogurt-parfait-08.jpg',
    price: 3.25,
    calories: 240,
    tags: ['Vegetarian', 'Breakfast', 'Healthy'],
    type: 'side',
    popular: false,
    nutritionScore: 85,
    protein: 8,
    carbs: 35,
    fat: 8
  },
  {
    id: 's5',
    name: 'Mashed Potatoes',
    description: 'Creamy mashed potatoes with gravy',
    imageUrl: 'https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2019/12/Mashed-Potatoes-4.jpg',
    price: 2.75,
    calories: 220,
    tags: ['Vegetarian', 'Comfort Food'],
    type: 'side',
    popular: true,
    nutritionScore: 70,
    protein: 4,
    carbs: 30,
    fat: 10
  },
  
  {
    id: 'd1',
    name: 'Water Bottle',
    description: '16oz bottled water',
    imageUrl: 'https://assets.finbold.com/uploads/2025/03/Saratoga-Spring-Water-stock-soars-after-going-viral.jpg',
    price: 1.50,
    calories: 0,
    tags: ['Beverage', 'Healthy'],
    type: 'drink',
    popular: true,
    nutritionScore: 100,
    protein: 0,
    carbs: 0,
    fat: 0
  },
  {
    id: 'd2',
    name: 'Chocolate Milk',
    description: '8oz carton of chocolate milk',
    imageUrl: 'https://th.bing.com/th/id/OIP.A7MRKXqWnHXsK5ujtn9jtAHaHa?rs=1&pid=ImgDetMain',
    price: 1.99,
    calories: 150,
    tags: ['Beverage', 'Dairy'],
    type: 'drink',
    popular: true,
    nutritionScore: 65,
    protein: 8,
    carbs: 25,
    fat: 5
  },
  {
    id: 'd3',
    name: 'Apple Juice',
    description: '10oz bottle of apple juice',
    imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=400&q=80',
    price: 1.75,
    calories: 120,
    tags: ['Beverage', 'Juice'],
    type: 'drink',
    popular: false,
    nutritionScore: 75,
    protein: 0,
    carbs: 30,
    fat: 0
  },
  {
    id: 'd4',
    name: 'Lemonade',
    description: '12oz cup of lemonade',
    imageUrl: 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9e?auto=format&fit=crop&w=400&q=80',
    price: 1.99,
    calories: 160,
    tags: ['Beverage', 'Sweet'],
    type: 'drink',
    popular: true,
    nutritionScore: 60,
    protein: 0,
    carbs: 40,
    fat: 0
  },
  {
    id: 'd5',
    name: 'Iced Tea',
    description: '12oz cup of unsweetened iced tea',
    imageUrl: 'https://th.bing.com/th/id/R.065e9aa3e35a3038d605f9cf60a026f5?rik=y9SQ2nscNpz0Rw&pid=ImgRaw&r=0',
    price: 1.75,
    calories: 5,
    tags: ['Beverage', 'Healthy'],
    type: 'drink',
    popular: false,
    nutritionScore: 95,
    protein: 0,
    carbs: 1,
    fat: 0
  }
];

export const monthlyVotingOptions: VotingOption[] = [
  {
    id: 'mv1',
    name: 'Taco Tuesday',
    description: 'A variety of tacos with different fillings and toppings',
    imageUrl: '',
    votes: 87
  },
  {
    id: 'mv2',
    name: 'Pasta Bar',
    description: 'Choose your pasta, sauce, and toppings',
    imageUrl: '',
    votes: 124
  },
  {
    id: 'mv3',
    name: 'International Food Day',
    description: 'A rotation of dishes from around the world',
    imageUrl: '',
    votes: 56
  },
  {
    id: 'mv4',
    name: 'Breakfast for Lunch',
    description: 'Pancakes, waffles, eggs, and breakfast meats',
    imageUrl: '',
    votes: 92
  }
];

export const annualVotingOptions: VotingOption[] = [
  {
    id: 'av1',
    name: 'Local Farm to Table',
    description: 'Meals made with ingredients from local farms',
    imageUrl: '',
    votes: 67
  },
  {
    id: 'av2',
    name: 'Student Chef Competition',
    description: 'Winning student recipes featured in the cafeteria',
    imageUrl: '',
    votes: 115
  },
  {
    id: 'av3',
    name: 'Cultural Heritage Month',
    description: 'Meals celebrating different cultural backgrounds of students',
    imageUrl: '',
    votes: 89
  },
  {
    id: 'av4',
    name: 'Sustainable Seafood',
    description: 'More sustainable seafood options in rotation',
    imageUrl: '',
    votes: 42
  }
];

export const statsData = {
  caloriesPerDay: [
    { name: 'Mon', value: 650 },
    { name: 'Tue', value: 520 },
    { name: 'Wed', value: 710 },
    { name: 'Thu', value: 580 },
    { name: 'Fri', value: 490 }
  ],
  proteinIntake: [
    { name: 'Mon', value: 25 },
    { name: 'Tue', value: 18 },
    { name: 'Wed', value: 30 },
    { name: 'Thu', value: 22 },
    { name: 'Fri', value: 28 }
  ],
  wasteReduction: [
    { name: 'Week 1', value: 30 },
    { name: 'Week 2', value: 20 },
    { name: 'Week 3', value: 10 },
    { name: 'Week 4', value: 8 }
  ],
  nutritionScore: [
    { name: 'Mon', value: 72 },
    { name: 'Tue', value: 68 },
    { name: 'Wed', value: 82 },
    { name: 'Thu', value: 76 },
    { name: 'Fri', value: 85 }
  ],
  mealPopularity: [
    { name: 'Pizza', value: 85 },
    { name: 'Salad', value: 45 },
    { name: 'Burger', value: 65 },
    { name: 'Pasta', value: 70 },
    { name: 'Tacos', value: 60 }
  ],
  averageWastage: [
    { name: 'Fruits', value: 15 },
    { name: 'Veggies', value: 25 },
    { name: 'Grains', value: 10 },
    { name: 'Protein', value: 5 },
    { name: 'Dairy', value: 20 }
  ]
};

export const updateMealHistory = (orders: any) => {
  console.log('Updating meal history:', orders);
  return true;
};

export const updateStatsData = () => {
  const recentMeals = mealHistory.slice(0, 5);
  
  const totalCalories = recentMeals.reduce((sum, meal) => sum + meal.calories, 0);
  const avgCalories = recentMeals.length > 0 ? Math.round(totalCalories / recentMeals.length) : 0;
  
  const totalNutritionScore = recentMeals.reduce((sum, meal) => 
    sum + (meal.nutritionScore || 0), 0);
  const avgNutritionScore = recentMeals.length > 0 ? 
    Math.round(totalNutritionScore / recentMeals.length) : 0;
  
  if (recentMeals.length > 0) {
    statsData.caloriesPerDay = recentMeals.map((meal, index) => ({
      name: meal.date.split(' ')[0],
      value: meal.calories
    })).reverse();
  }
  
  if (recentMeals.length > 0) {
    statsData.nutritionScore = recentMeals.map((meal, index) => ({
      name: meal.date.split(' ')[0],
      value: meal.nutritionScore || 0
    })).reverse();
  }
  
  const wasteFactors = recentMeals.map(meal => meal.wasteFactor);
  const avgWasteFactor = wasteFactors.length > 0 ? 
    wasteFactors.reduce((sum, factor) => sum + factor, 0) / wasteFactors.length : 0;
  
  const wastePounds = Math.round((1 - avgWasteFactor) * 0.5 * recentMeals.length * 10) / 10;
  
  return {
    avgCalories,
    avgNutritionScore,
    wastePounds
  };
};

export const calculateMealStats = (selectedItems: {
  entree: FoodItem | null;
  side: FoodItem | null;
  drink: FoodItem | null;
}) => {
  let totalCalories = 0;
  let totalNutritionScore = 0;
  let totalItems = 0;
  let totalPrice = 0;
  
  if (selectedItems.entree) {
    totalCalories += selectedItems.entree.calories;
    totalNutritionScore += selectedItems.entree.nutritionScore;
    totalItems++;
    totalPrice += selectedItems.entree.price;
  }
  
  if (selectedItems.side) {
    totalCalories += selectedItems.side.calories;
    totalNutritionScore += selectedItems.side.nutritionScore;
    totalItems++;
    totalPrice += selectedItems.side.price;
  }
  
  if (selectedItems.drink) {
    totalCalories += selectedItems.drink.calories;
    totalNutritionScore += selectedItems.drink.nutritionScore;
    totalItems++;
    totalPrice += selectedItems.drink.price;
  }
  
  const avgNutritionScore = totalItems > 0 ? Math.round(totalNutritionScore / totalItems) : 0;
  
  return {
    calories: totalCalories,
    nutritionScore: avgNutritionScore,
    price: totalPrice
  };
};

export const updateUserBalance = (amount: number) => {
  currentUser.balance -= amount;
  return currentUser.balance;
};

export const updateUserPreferences = (preferences: UserPreferences) => {
  currentUser.preferences = preferences;
  return currentUser;
};

export const getFilteredFoodItems = (items = foodItems) => {
  if (!currentUser.preferences?.dietaryRestrictions?.length) {
    return items;
  }
  
  return items.filter(item => {
    return !currentUser.preferences.dietaryRestrictions.some(restriction => {
      return !item.tags.includes(restriction);
    });
  });
};