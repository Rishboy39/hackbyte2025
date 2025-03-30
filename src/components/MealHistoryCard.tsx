import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { Info, Utensils, Activity, PieChart } from 'lucide-react';
import Shimmer from '@/components/Shimmer';

interface Meal {
  id: string;
  date: string;
  name: string;
  imageUrl: string;
  calories: number;
  wasteFactor: number; // 0-1 scale, 0 = no waste, 1 = all wasted
  nutritionScore?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  tags?: string[];
}

interface MealHistoryCardProps {
  meals: Meal[];
  className?: string;
  loading?: boolean; // Added loading prop
}

const MealHistoryCard: React.FC<MealHistoryCardProps> = ({ 
  meals, 
  className,
  loading = false // Default to false
}) => {
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  
  const getNutritionScoreColor = (score?: number) => {
    if (!score) return 'bg-gray-200 text-gray-700';
    if (score >= 85) return 'bg-green-100 text-green-700';
    if (score >= 70) return 'bg-blue-100 text-blue-700';
    if (score >= 50) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const handleMealClick = (meal: Meal) => {
    setSelectedMeal(meal);
  };

  return (
    <>
      <Card className={cn('', className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Meal History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-2">
                  <Shimmer className="w-12 h-12 rounded-lg" />
                  <div className="flex-grow">
                    <Shimmer className="w-3/4 h-4 mb-2" />
                    <Shimmer className="w-1/2 h-3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {meals.map((meal) => (
                <div 
                  key={meal.id} 
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => handleMealClick(meal)}
                >
                  <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                    {meal.imageUrl ? (
                      <img src={meal.imageUrl} alt={meal.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-cafeteria-primary/20 flex items-center justify-center text-cafeteria-primary">
                        <span className="text-xs">No img</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <h4 className="font-medium text-sm">{meal.name}</h4>
                      <span className="text-xs text-gray-500">{meal.date}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-gray-500">{meal.calories} cal</span>
                        {meal.nutritionScore && (
                          <Badge variant="secondary" className={`text-xs ${getNutritionScoreColor(meal.nutritionScore)}`}>
                            Score: {meal.nutritionScore}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              meal.wasteFactor <= 0.3 
                                ? 'bg-green-500' 
                                : meal.wasteFactor <= 0.7 
                                  ? 'bg-yellow-500' 
                                  : 'bg-red-500'
                            }`}
                            style={{ width: `${(1 - meal.wasteFactor) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {Math.round((1 - meal.wasteFactor) * 100)}% eaten
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Meal Detail Dialog */}
      <Dialog open={!!selectedMeal} onOpenChange={(open) => !open && setSelectedMeal(null)}>
        <DialogContent className="max-w-md">
          {selectedMeal && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedMeal.name}</DialogTitle>
                <DialogDescription>Consumed on {selectedMeal.date}</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Meal Image */}
                <div className="w-full h-48 rounded-lg bg-gray-200 overflow-hidden">
                  {selectedMeal.imageUrl ? (
                    <img 
                      src={selectedMeal.imageUrl} 
                      alt={selectedMeal.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-cafeteria-primary/20 flex items-center justify-center text-cafeteria-primary">
                      <span>No image available</span>
                    </div>
                  )}
                </div>
                
                {/* Nutrition Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-gray-50 rounded-lg flex flex-col items-center">
                    <Utensils size={18} className="mb-1 text-gray-600" />
                    <div className="text-sm text-gray-600">Calories</div>
                    <div className="font-semibold">{selectedMeal.calories}</div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg flex flex-col items-center">
                    <Activity size={18} className="mb-1 text-gray-600" />
                    <div className="text-sm text-gray-600">Score</div>
                    <div className="font-semibold">{selectedMeal.nutritionScore || 'N/A'}</div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg flex flex-col items-center">
                    <PieChart size={18} className="mb-1 text-gray-600" />
                    <div className="text-sm text-gray-600">Eaten</div>
                    <div className="font-semibold">{Math.round((1 - selectedMeal.wasteFactor) * 100)}%</div>
                  </div>
                </div>
                
                {/* Macros */}
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Macronutrients</h4>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-sm text-gray-600">Protein</div>
                      <div className="font-semibold">{selectedMeal.protein || '?'}g</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Carbs</div>
                      <div className="font-semibold">{selectedMeal.carbs || '?'}g</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Fat</div>
                      <div className="font-semibold">{selectedMeal.fat || '?'}g</div>
                    </div>
                  </div>
                </div>
                
                {/* Tags */}
                {selectedMeal.tags && selectedMeal.tags.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedMeal.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MealHistoryCard;
