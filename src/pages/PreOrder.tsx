import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Search, ShoppingCart, Heart, Clock, Utensils, Activity, PieChart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { foodItems, calculateMealStats, updateMealHistory, updateUserBalance, currentUser } from '@/lib/mockData';
import { toast } from 'sonner';
import { FoodItem } from '@/lib/mockData';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { useNavigate } from 'react-router-dom';
import authService from '@/lib/authService';

interface SelectedItems {
  entree: FoodItem | null;
  side: FoodItem | null;
  drink: FoodItem | null;
}

const PreOrder: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({
    entree: null,
    side: null,
    drink: null
  });
  const [favorites, setFavorites] = useState<string[]>([]);
  const [mealStats, setMealStats] = useState({
    calories: 0,
    nutritionScore: 0,
    price: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [userDietaryRestrictions, setUserDietaryRestrictions] = useState<string[]>([]);
  const [defaultDrink, setDefaultDrink] = useState<string>('Water');
  
  useEffect(() => {
    const fetchUserPreferences = async () => {
      try {
        const currentAuthUser = await authService.getCurrentUser();
        
        if (currentAuthUser) {
          const { data: profileData } = await authService.getProfile(currentAuthUser.id);
          
          if (profileData?.preferences) {
            try {
              const userPrefs = typeof profileData.preferences === 'string' 
                ? JSON.parse(profileData.preferences) 
                : profileData.preferences;
              
              // Set dietary restrictions from profile
              if (userPrefs.dietaryRestrictions && userPrefs.dietaryRestrictions.length > 0) {
                setUserDietaryRestrictions(userPrefs.dietaryRestrictions);
              }
              
              // Set default drink from profile
              if (userPrefs.defaultDrink) {
                setDefaultDrink(userPrefs.defaultDrink);
                
                // Find the default drink in the food items
                const defaultDrinkItem = foodItems.find(
                  item => item.type === 'drink' && item.name === userPrefs.defaultDrink
                );
                
                if (defaultDrinkItem) {
                  setSelectedItems(prev => ({
                    ...prev,
                    drink: defaultDrinkItem
                  }));
                }
              }
            } catch (e) {
              console.error("Error parsing preferences:", e);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user preferences:", error);
      }
    };
    
    fetchUserPreferences();
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    const stats = calculateMealStats(selectedItems);
    setMealStats(stats);
  }, [selectedItems]);
  
  const allTags = Array.from(
    new Set(foodItems.flatMap(item => item.tags))
  ).sort();
  
  const getFilteredFoodItems = (items: FoodItem[]) => {
    if (userDietaryRestrictions.length === 0) {
      return items;
    }
    
    return items.filter(item => {
      return userDietaryRestrictions.some(restriction => 
        item.tags.includes(restriction)
      );
    });
  };
  
  const filteredFoodItems = getFilteredFoodItems(foodItems);
  
  const getFilteredItems = (type: 'entree' | 'side' | 'drink') => {
    return filteredFoodItems.filter(item => {
      const matchesType = item.type === type;
      const matchesSearch = searchTerm === '' || 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilters = activeFilters.length === 0 || 
        activeFilters.some(filter => item.tags.includes(filter));
      
      return matchesType && matchesSearch && matchesFilters;
    });
  };
  
  const entrees = getFilteredItems('entree');
  const sides = getFilteredItems('side');
  const drinks = getFilteredItems('drink');
  
  const handleFilterClick = (tag: string) => {
    setActiveFilters(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };
  
  const handleSelectItem = (item: FoodItem) => {
    setSelectedItems(prev => ({
      ...prev,
      [item.type]: item
    }));
    
    toast.success(`Added ${item.name} to your order`);
  };
  
  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id) 
        : [...prev, id]
    );
    
    const item = foodItems.find(item => item.id === id);
    if (item) {
      toast.success(
        favorites.includes(id) 
          ? `Removed ${item.name} from favorites` 
          : `Added ${item.name} to favorites`
      );
    }
  };
  
  const handleCompleteOrder = () => {
    if (!selectedItems.entree && !selectedItems.side && !selectedItems.drink) {
      toast.error("Please select at least one item");
      return;
    }
    
    const itemNames = [
      selectedItems.entree?.name,
      selectedItems.side?.name,
      selectedItems.drink?.name
    ].filter(Boolean).join(', ');
    
    const now = new Date();
    const formattedDate = `${now.toLocaleString('default', { month: 'short' })} ${now.getDate()}`;
    
    const wasteFactor = 0.3;
    
    const newMeal = {
      id: `m-${Date.now()}`,
      date: formattedDate,
      name: itemNames,
      imageUrl: selectedItems.entree?.imageUrl || selectedItems.side?.imageUrl || '',
      calories: mealStats.calories,
      wasteFactor: wasteFactor,
      price: mealStats.price,
      tags: [...new Set([
        ...(selectedItems.entree?.tags || []),
        ...(selectedItems.side?.tags || []),
        ...(selectedItems.drink?.tags || [])
      ])],
      nutritionScore: mealStats.nutritionScore
    };
    
    updateMealHistory(newMeal);
    updateUserBalance(mealStats.price);
    
    toast.success("Order submitted successfully!");
    
    setSelectedItems({
      entree: null,
      side: null,
      drink: null
    });
    
    setTimeout(() => {
      navigate('/order-management');
    }, 1500);
  };
  
  const popularItems = filteredFoodItems.filter(item => item.popular);
  
  const placeholderImages = [
    "https://source.unsplash.com/random/300x200/?food",
    "https://source.unsplash.com/random/300x200/?meal",
    "https://source.unsplash.com/random/300x200/?lunch"
  ];
  
  const getItemImage = (item: FoodItem) => {
    if (item.imageUrl) return item.imageUrl;
    
    const index = item.id.charCodeAt(0) % placeholderImages.length;
    return placeholderImages[index];
  };
  
  const getNutritionScoreColor = (score: number) => {
    if (score >= 85) return 'bg-green-100 text-green-700';
    if (score >= 70) return 'bg-blue-100 text-blue-700';
    if (score >= 50) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };
  
  const FoodItemCard = ({ item }: { item: FoodItem }) => {
    const isFavorite = favorites.includes(item.id);
    const isSelected = selectedItems[item.type]?.id === item.id;
    
    return (
      <div 
        className={`rounded-lg border overflow-hidden transition-all hover:shadow-md ${
          isSelected ? 'border-cafeteria-primary ring-1 ring-cafeteria-primary' : 'border-gray-200'
        }`}
      >
        <div className="relative h-32 bg-gray-100">
          <img 
            src={getItemImage(item)} 
            alt={item.name} 
            className="w-full h-full object-cover"
          />
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(item.id);
            }}
            className={`absolute top-2 right-2 p-1.5 rounded-full ${
              isFavorite 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 text-gray-600 hover:bg-white'
            }`}
          >
            <Heart size={18} fill={isFavorite ? "white" : "none"} />
          </button>
          {item.popular && (
            <Badge className="absolute top-2 left-2 bg-cafeteria-secondary">
              Popular
            </Badge>
          )}
        </div>
        
        <div 
          className="p-3 cursor-pointer"
          onClick={() => handleSelectItem(item)}
        >
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-medium">{item.name}</h4>
            {isSelected && (
              <Check size={16} className="text-cafeteria-primary" />
            )}
          </div>
          
          <p className="text-xs text-gray-500 mb-2 line-clamp-2">{item.description}</p>
          
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">${item.price.toFixed(2)}</span>
            <span className="text-xs text-gray-500">{item.calories} cal</span>
          </div>
          
          <div className="flex items-center justify-between mt-1">
            <Badge variant="secondary" className={`text-xs ${getNutritionScoreColor(item.nutritionScore)}`}>
              Score: {item.nutritionScore}
            </Badge>
            
            <div className="flex text-xs text-gray-500">
              <span className="mr-2">P: {item.protein}g</span>
              <span className="mr-2">C: {item.carbs}g</span>
              <span>F: {item.fat}g</span>
            </div>
          </div>
          
          <div className="mt-2 flex flex-wrap gap-1">
            {item.tags.slice(0, 2).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs py-0">
                {tag}
              </Badge>
            ))}
            {item.tags.length > 2 && (
              <Popover>
                <PopoverTrigger asChild>
                  <Badge variant="outline" className="text-xs py-0 cursor-pointer">
                    +{item.tags.length - 2} more
                  </Badge>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2">
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(2).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  const LoadingCard = () => (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      <div className="h-32 bg-gray-200 animate-pulse" />
      <div className="p-3">
        <div className="h-5 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-3 bg-gray-200 rounded animate-pulse mb-1" />
        <div className="h-3 bg-gray-200 rounded animate-pulse mb-2 w-3/4" />
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-12" />
        </div>
      </div>
    </div>
  );
  
  const hasDietaryRestrictions = userDietaryRestrictions.length > 0;
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Pre-Order Your Meal</h1>
          <p className="text-gray-500 mb-6">Select your meal items for tomorrow</p>
          
          {hasDietaryRestrictions && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-1">Dietary Preferences Applied</h3>
              <p className="text-sm text-blue-600">
                Showing items that match your dietary preferences: {userDietaryRestrictions.join(', ')}
              </p>
            </div>
          )}
          
          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                type="text" 
                placeholder="Search menu items..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <Badge 
                  key={tag}
                  variant={activeFilters.includes(tag) ? "default" : "outline"}
                  className={`cursor-pointer ${
                    activeFilters.includes(tag) 
                      ? 'bg-cafeteria-primary hover:bg-cafeteria-primary/90'
                      : ''
                  }`}
                  onClick={() => handleFilterClick(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Tabs defaultValue="menu" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="menu">Menu Selection</TabsTrigger>
                  <TabsTrigger value="popular">Popular Items</TabsTrigger>
                </TabsList>
                
                <TabsContent value="menu">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-lg mb-3">Entrees</h3>
                        {isLoading ? (
                          <div className="space-y-4">
                            {[1, 2, 3].map(i => <LoadingCard key={`entree-loading-${i}`} />)}
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {entrees.length === 0 ? (
                              <p className="text-gray-500 text-sm">No entrees match your filters</p>
                            ) : (
                              entrees.map(item => <FoodItemCard key={item.id} item={item} />)
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-lg mb-3">Sides</h3>
                        {isLoading ? (
                          <div className="space-y-4">
                            {[1, 2, 3].map(i => <LoadingCard key={`side-loading-${i}`} />)}
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {sides.length === 0 ? (
                              <p className="text-gray-500 text-sm">No sides match your filters</p>
                            ) : (
                              sides.map(item => <FoodItemCard key={item.id} item={item} />)
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-bold text-lg mb-3">Drinks</h3>
                        {isLoading ? (
                          <div className="space-y-4">
                            {[1, 2, 3].map(i => <LoadingCard key={`drink-loading-${i}`} />)}
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {drinks.length === 0 ? (
                              <p className="text-gray-500 text-sm">No drinks match your filters</p>
                            ) : (
                              drinks.map(item => <FoodItemCard key={item.id} item={item} />)
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="popular">
                  <Carousel className="w-full">
                    <CarouselContent>
                      {isLoading ? (
                        [1, 2, 3, 4].map(i => (
                          <CarouselItem key={`popular-loading-${i}`} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                            <LoadingCard />
                          </CarouselItem>
                        ))
                      ) : (
                        popularItems.map(item => (
                          <CarouselItem key={item.id} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                            <FoodItemCard item={item} />
                          </CarouselItem>
                        ))
                      )}
                    </CarouselContent>
                    <div className="flex justify-end gap-2 mt-4">
                      <CarouselPrevious className="static transform-none" />
                      <CarouselNext className="static transform-none" />
                    </div>
                  </Carousel>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                    <h3 className="col-span-full font-bold text-lg mb-0">Staff Picks</h3>
                    {isLoading ? (
                      [1, 2, 3, 4].map(i => <LoadingCard key={`staff-pick-${i}`} />)
                    ) : (
                      popularItems.slice(0, 4).map(item => <FoodItemCard key={`staff-${item.id}`} item={item} />)
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <div>
              <Card className="sticky top-4">
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <ShoppingCart size={18} />
                    Your Order
                  </h3>
                  
                  <div className="space-y-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Entree</h4>
                      {selectedItems.entree ? (
                        <div className="flex justify-between p-3 bg-gray-50 rounded border border-gray-100">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded bg-gray-200 overflow-hidden">
                              <img 
                                src={getItemImage(selectedItems.entree)} 
                                alt={selectedItems.entree.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span>{selectedItems.entree.name}</span>
                          </div>
                          <span>${selectedItems.entree.price.toFixed(2)}</span>
                        </div>
                      ) : (
                        <div className="p-3 bg-gray-50 rounded text-gray-400 text-sm border border-gray-100 border-dashed">
                          No entree selected
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Side</h4>
                      {selectedItems.side ? (
                        <div className="flex justify-between p-3 bg-gray-50 rounded border border-gray-100">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded bg-gray-200 overflow-hidden">
                              <img 
                                src={getItemImage(selectedItems.side)} 
                                alt={selectedItems.side.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span>{selectedItems.side.name}</span>
                          </div>
                          <span>${selectedItems.side.price.toFixed(2)}</span>
                        </div>
                      ) : (
                        <div className="p-3 bg-gray-50 rounded text-gray-400 text-sm border border-gray-100 border-dashed">
                          No side selected
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-2">Drink</h4>
                      {selectedItems.drink ? (
                        <div className="flex justify-between p-3 bg-gray-50 rounded border border-gray-100">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded bg-gray-200 overflow-hidden">
                              <img 
                                src={getItemImage(selectedItems.drink)} 
                                alt={selectedItems.drink.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <span>{selectedItems.drink.name}</span>
                          </div>
                          <span>${selectedItems.drink.price.toFixed(2)}</span>
                        </div>
                      ) : (
                        <div className="p-3 bg-gray-50 rounded text-gray-400 text-sm border border-gray-100 border-dashed">
                          No drink selected
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-4 p-3 bg-gray-50 rounded border border-gray-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Nutrition Summary</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Utensils size={16} className="text-gray-500" />
                          <span className="text-sm">Calories:</span>
                        </div>
                        <span className="font-medium">{mealStats.calories}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Activity size={16} className="text-gray-500" />
                          <span className="text-sm">Nutrition Score:</span>
                        </div>
                        <Badge className={`${getNutritionScoreColor(mealStats.nutritionScore)}`}>
                          {mealStats.nutritionScore}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold mb-4">
                      <span>Total</span>
                      <span>${mealStats.price.toFixed(2)}</span>
                    </div>
                    
                    <Button 
                      className="w-full bg-cafeteria-primary hover:bg-cafeteria-primary/90"
                      disabled={!selectedItems.entree && !selectedItems.side && !selectedItems.drink}
                      onClick={handleCompleteOrder}
                    >
                      Complete Order
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

export default PreOrder;
