
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, ArrowLeft, Edit, Plus, RefreshCw, Save, Search, Utensils } from 'lucide-react';
import { foodItems } from '@/lib/mockData';
import { toast } from 'sonner';

type StockItem = {
  id: string;
  name: string;
  prepared: number;
  remaining: number;
  unit: string;
  type: 'entree' | 'side' | 'drink';
  lastUpdated: string;
};

const FoodStock: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{prepared: number, remaining: number}>({
    prepared: 0,
    remaining: 0
  });
  
  // Initialize stock items from food items
  useEffect(() => {
    // Convert food items to stock items
    const initialStockItems = foodItems.map(item => ({
      id: item.id,
      name: item.name,
      prepared: Math.floor(Math.random() * 50) + 10, // Random initial values
      remaining: Math.floor(Math.random() * 40) + 5, // Random initial values
      unit: item.type === 'drink' ? 'bottles' : 'servings',
      type: item.type,
      lastUpdated: new Date().toLocaleTimeString()
    }));
    
    setStockItems(initialStockItems);
  }, []);
  
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  
  const filteredItems = stockItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const startEditing = (item: StockItem) => {
    setEditingId(item.id);
    setEditValues({
      prepared: item.prepared,
      remaining: item.remaining
    });
  };
  
  const cancelEditing = () => {
    setEditingId(null);
  };
  
  const saveEditing = (id: string) => {
    setStockItems(prevItems => 
      prevItems.map(item => 
        item.id === id 
          ? {
              ...item, 
              prepared: editValues.prepared,
              remaining: editValues.remaining,
              lastUpdated: new Date().toLocaleTimeString()
            } 
          : item
      )
    );
    
    setEditingId(null);
    toast.success("Stock updated successfully");
  };
  
  const handleInputChange = (field: 'prepared' | 'remaining', value: string) => {
    const numValue = parseInt(value) || 0;
    setEditValues(prev => ({
      ...prev,
      [field]: numValue
    }));
  };
  
  const getTotalExcess = () => {
    return stockItems.reduce((total, item) => total + (item.remaining), 0);
  };
  
  const getExcessPercentage = () => {
    const totalPrepared = stockItems.reduce((total, item) => total + item.prepared, 0);
    const totalRemaining = stockItems.reduce((total, item) => total + item.remaining, 0);
    
    if (totalPrepared === 0) return 0;
    return Math.round((totalRemaining / totalPrepared) * 100);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/admin')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">Food Stock Management</h1>
              <p className="text-gray-500">Track and update food inventory levels</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Total Excess Food</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold">{getTotalExcess()}</p>
                    <p className="text-sm text-gray-500">servings remaining</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-medium">{getExcessPercentage()}%</p>
                    <p className="text-sm text-gray-500">of prepared food</p>
                  </div>
                </div>
                
                {getExcessPercentage() > 20 && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <p className="text-sm text-yellow-700">
                      High excess food detected. Consider donating to a food bank.
                    </p>
                  </div>
                )}
                
                <div className="mt-6">
                  <Button 
                    className="w-full" 
                    onClick={() => navigate('/admin/food-banks')}
                    disabled={getExcessPercentage() < 5}
                  >
                    <Utensils className="mr-2 h-4 w-4" />
                    Donate Excess Food
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Stock Updates Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm py-2 border-b">
                    <span className="font-medium">Morning stock setup</span>
                    <span>8:15 AM</span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b">
                    <span className="font-medium">Lunch period 1 adjustment</span>
                    <span>11:45 AM</span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b">
                    <span className="font-medium">Lunch period 2 adjustment</span>
                    <span>12:30 PM</span>
                  </div>
                  <div className="flex justify-between text-sm py-2">
                    <span className="font-medium">End of day inventory</span>
                    <span>2:15 PM</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Food Inventory</CardTitle>
                <div className="flex items-center gap-3">
                  <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search items..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Item Name</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Type</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Prepared</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">Remaining</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">% Remaining</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Last Updated</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredItems.map(item => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">{item.name}</td>
                        <td className="py-3 px-4 capitalize">{item.type}</td>
                        <td className="py-3 px-4 text-center">
                          {editingId === item.id ? (
                            <Input 
                              type="number" 
                              value={editValues.prepared}
                              onChange={(e) => handleInputChange('prepared', e.target.value)}
                              className="w-20 mx-auto text-center"
                              min="0"
                            />
                          ) : (
                            <span>{item.prepared} {item.unit}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {editingId === item.id ? (
                            <Input 
                              type="number" 
                              value={editValues.remaining}
                              onChange={(e) => handleInputChange('remaining', e.target.value)}
                              className="w-20 mx-auto text-center"
                              min="0"
                              max={editValues.prepared}
                            />
                          ) : (
                            <span>{item.remaining} {item.unit}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center">
                            <span className={`
                              ${item.remaining / item.prepared > 0.5 ? 'text-green-600' : 
                                item.remaining / item.prepared > 0.2 ? 'text-yellow-600' : 'text-red-600'}
                            `}>
                              {Math.round((item.remaining / item.prepared) * 100)}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">{item.lastUpdated}</td>
                        <td className="py-3 px-4 text-right">
                          {editingId === item.id ? (
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                onClick={() => saveEditing(item.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={cancelEditing}
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => startEditing(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default FoodStock;
