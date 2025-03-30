
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Calendar, Check, Download, Edit, MessageSquare, Package, PieChart, Users, Plus, X, Utensils } from 'lucide-react';
import { foodItems, mealHistory } from '@/lib/mockData';
import { toast } from 'sonner';
import { FoodItem } from '@/lib/mockData';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

declare global {
  interface Window {
    studentFeedback?: any[];
  }
}

if (typeof window !== 'undefined' && !window.studentFeedback) {
  window.studentFeedback = [
    { id: 1, name: 'Emily J.', feedback: 'The pasta was overcooked today.', date: '2 hours ago', resolved: false },
    { id: 2, name: 'Michael T.', feedback: 'Loved the new salad options!', date: '5 hours ago', resolved: true },
    { id: 3, name: 'Sophia L.', feedback: 'Can we have more vegetarian options?', date: '1 day ago', resolved: false },
    { id: 4, name: 'Robert K.', feedback: 'The pizza was cold when I got it.', date: '1 day ago', resolved: true },
    { id: 5, name: 'Jenna M.', feedback: 'The fruit cups are amazing - please keep them!', date: '2 days ago', resolved: true }
  ];
}

const AdminPortal: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState<Partial<FoodItem>>({
    name: '',
    description: '',
    type: 'entree',
    price: 0,
    calories: 0,
    tags: []
  });
  const [newItemTags, setNewItemTags] = useState('');
  
  const preOrderCounts: Record<string, number> = {
    'e1': 42,
    'e2': 18,
    'e3': 36,
    'e4': 12,
    'e5': 58,
    's1': 35,
    's2': 64,
    's3': 22,
    's4': 19,
    's5': 28,
    'd1': 54,
    'd2': 47,
    'd3': 23,
    'd4': 39,
    'd5': 18
  };
  
  const [studentFeedback, setStudentFeedback] = useState(
    typeof window !== 'undefined' && window.studentFeedback 
      ? window.studentFeedback 
      : []
  );
  
  const filteredFoodItems = foodItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleEditItem = (item: FoodItem) => {
    setEditingItem(item);
  };
  
  const handleSaveEdit = () => {
    setEditingItem(null);
    toast.success("Item updated successfully");
  };
  
  const handleCancelEdit = () => {
    setEditingItem(null);
  };
  
  const handleAddNewItem = () => {
    if (!newItem.name || !newItem.description) {
      toast.error("Name and description are required");
      return;
    }
    
    const tagsArray = newItemTags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    
    const itemId = `${newItem.type?.charAt(0)}${foodItems.filter(item => item.type === newItem.type).length + 1}`;
    
    const newFoodItem: FoodItem = {
      id: itemId,
      name: newItem.name,
      description: newItem.description,
      imageUrl: '',
      type: newItem.type as 'entree' | 'side' | 'drink',
      price: Number(newItem.price) || 0,
      calories: Number(newItem.calories) || 0,
      tags: tagsArray,
      popular: false,
      nutritionScore: 75,
      protein: 10,
      carbs: 20,
      fat: 5
    };
    
    foodItems.push(newFoodItem);
    
    toast.success("New item added successfully");
    setIsAddItemDialogOpen(false);
    
    setNewItem({
      name: '',
      description: '',
      type: 'entree',
      price: 0,
      calories: 0,
      tags: []
    });
    setNewItemTags('');
  };
  
  const markAsFeedbackResolved = (id: number) => {
    const updatedFeedback = studentFeedback.map(item => 
      item.id === id ? { ...item, resolved: true } : item
    );
    
    setStudentFeedback(updatedFeedback);
    
    if (typeof window !== 'undefined') {
      window.studentFeedback = updatedFeedback;
    }
    
    toast.success("Feedback marked as resolved");
  };
  
  const handleExportData = (dataType: string) => {
    toast.success(`${dataType} data exported successfully`);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">Admin Portal</h1>
              <p className="text-gray-500">Manage cafeteria operations and view analytics</p>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Users size={16} />
                <span>View Students</span>
              </Button>
              <Button className="flex items-center gap-2 bg-cafeteria-accent hover:bg-cafeteria-accent/90">
                <Calendar size={16} />
                <span>Plan Menu</span>
              </Button>
              <Button 
                variant="default" 
                className="flex items-center gap-2"
                asChild
              >
                <Link to="/admin/food-stock">
                  <Utensils size={16} />
                  <span>Food Stock</span>
                </Link>
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="orders">Pre-Order Statistics</TabsTrigger>
              <TabsTrigger value="menu">Menu Items</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
              <TabsTrigger value="export">Export Data</TabsTrigger>
            </TabsList>
            
            <TabsContent value="orders">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="col-span-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                      <Package size={18} />
                      Today's Pre-Orders
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm py-2">
                        <span className="font-medium">Total Pre-Orders</span>
                        <span className="font-bold">213</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-sm py-2">
                        <span className="font-medium">Complete Meals</span>
                        <span>158</span>
                      </div>
                      <div className="flex justify-between text-sm py-2">
                        <span className="font-medium">Entrees Only</span>
                        <span>35</span>
                      </div>
                      <div className="flex justify-between text-sm py-2">
                        <span className="font-medium">Sides Only</span>
                        <span>12</span>
                      </div>
                      <div className="flex justify-between text-sm py-2">
                        <span className="font-medium">Drinks Only</span>
                        <span>8</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-sm py-2">
                        <span className="font-medium">Confirmed "Yes"</span>
                        <span className="text-green-500">175</span>
                      </div>
                      <div className="flex justify-between text-sm py-2">
                        <span className="font-medium">Marked "Maybe"</span>
                        <span className="text-yellow-500">28</span>
                      </div>
                      <div className="flex justify-between text-sm py-2">
                        <span className="font-medium">Marked "No"</span>
                        <span className="text-red-500">10</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                      <PieChart size={18} />
                      Item Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-sm mb-2">Entrees</h3>
                        <div className="space-y-2">
                          {foodItems.filter(item => item.type === 'entree').map(item => (
                            <div key={item.id} className="flex items-center gap-3">
                              <div className="w-full max-w-md">
                                <div className="flex justify-between mb-1 text-sm">
                                  <span>{item.name}</span>
                                  <span>{preOrderCounts[item.id] || 0} orders</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-cafeteria-primary h-2 rounded-full"
                                    style={{ width: `${Math.min(100, (preOrderCounts[item.id] || 0) / 0.7)}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-sm mb-2">Sides</h3>
                        <div className="space-y-2">
                          {foodItems.filter(item => item.type === 'side').map(item => (
                            <div key={item.id} className="flex items-center gap-3">
                              <div className="w-full max-w-md">
                                <div className="flex justify-between mb-1 text-sm">
                                  <span>{item.name}</span>
                                  <span>{preOrderCounts[item.id] || 0} orders</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-cafeteria-secondary h-2 rounded-full"
                                    style={{ width: `${Math.min(100, (preOrderCounts[item.id] || 0) / 0.7)}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-sm mb-2">Drinks</h3>
                        <div className="space-y-2">
                          {foodItems.filter(item => item.type === 'drink').map(item => (
                            <div key={item.id} className="flex items-center gap-3">
                              <div className="w-full max-w-md">
                                <div className="flex justify-between mb-1 text-sm">
                                  <span>{item.name}</span>
                                  <span>{preOrderCounts[item.id] || 0} orders</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-cafeteria-accent h-2 rounded-full"
                                    style={{ width: `${Math.min(100, (preOrderCounts[item.id] || 0) / 0.6)}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="menu">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Input 
                    type="text" 
                    placeholder="Search menu items..." 
                    className="max-w-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2">
                        <Plus size={16} />
                        Add New Item
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Add New Menu Item</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium">Name</label>
                          <Input 
                            id="name"
                            value={newItem.name}
                            onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                            placeholder="Item name"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="description" className="text-sm font-medium">Description</label>
                          <Textarea 
                            id="description"
                            value={newItem.description}
                            onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                            placeholder="Item description"
                            className="min-h-[80px]"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="type" className="text-sm font-medium">Type</label>
                          <Select 
                            value={newItem.type as string}
                            onValueChange={(value: 'entree' | 'side' | 'drink') => setNewItem({...newItem, type: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="entree">Entree</SelectItem>
                              <SelectItem value="side">Side</SelectItem>
                              <SelectItem value="drink">Drink</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label htmlFor="price" className="text-sm font-medium">Price ($)</label>
                            <Input 
                              id="price"
                              type="number"
                              step="0.01"
                              value={newItem.price?.toString()}
                              onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value)})}
                              placeholder="0.00"
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="calories" className="text-sm font-medium">Calories</label>
                            <Input 
                              id="calories"
                              type="number"
                              value={newItem.calories?.toString()}
                              onChange={(e) => setNewItem({...newItem, calories: parseInt(e.target.value)})}
                              placeholder="0"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="tags" className="text-sm font-medium">Tags (comma-separated)</label>
                          <Input 
                            id="tags"
                            value={newItemTags}
                            onChange={(e) => setNewItemTags(e.target.value)}
                            placeholder="vegetarian, gluten-free, etc."
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddItemDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddNewItem}>Add Item</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Name</th>
                            <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Description</th>
                            <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Type</th>
                            <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Price</th>
                            <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Calories</th>
                            <th className="text-left py-3 px-2 text-sm font-medium text-gray-500">Tags</th>
                            <th className="text-right py-3 px-2 text-sm font-medium text-gray-500">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {filteredFoodItems.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50">
                              {editingItem?.id === item.id ? (
                                <>
                                  <td className="py-3 px-2">
                                    <Input 
                                      type="text" 
                                      defaultValue={item.name} 
                                      className="w-full"
                                    />
                                  </td>
                                  <td className="py-3 px-2">
                                    <Input 
                                      type="text" 
                                      defaultValue={item.description} 
                                      className="w-full"
                                    />
                                  </td>
                                  <td className="py-3 px-2">
                                    <select 
                                      defaultValue={item.type}
                                      className="w-full p-2 border rounded-md"
                                    >
                                      <option value="entree">Entree</option>
                                      <option value="side">Side</option>
                                      <option value="drink">Drink</option>
                                    </select>
                                  </td>
                                  <td className="py-3 px-2">
                                    <Input 
                                      type="number" 
                                      defaultValue={item.price.toString()} 
                                      className="w-full"
                                      step="0.01"
                                    />
                                  </td>
                                  <td className="py-3 px-2">
                                    <Input 
                                      type="number" 
                                      defaultValue={item.calories.toString()} 
                                      className="w-full"
                                    />
                                  </td>
                                  <td className="py-3 px-2">
                                    <Input 
                                      type="text" 
                                      defaultValue={item.tags.join(', ')} 
                                      className="w-full"
                                    />
                                  </td>
                                  <td className="py-3 px-2 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                      <Button 
                                        size="sm" 
                                        className="bg-green-500 hover:bg-green-600"
                                        onClick={handleSaveEdit}
                                      >
                                        Save
                                      </Button>
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={handleCancelEdit}
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td className="py-3 px-2">{item.name}</td>
                                  <td className="py-3 px-2 max-w-xs truncate">{item.description}</td>
                                  <td className="py-3 px-2 capitalize">{item.type}</td>
                                  <td className="py-3 px-2">${item.price.toFixed(2)}</td>
                                  <td className="py-3 px-2">{item.calories}</td>
                                  <td className="py-3 px-2">
                                    <div className="flex flex-wrap gap-1">
                                      {item.tags.map(tag => (
                                        <span 
                                          key={tag} 
                                          className="px-2 py-1 rounded-full bg-gray-100 text-xs"
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  </td>
                                  <td className="py-3 px-2 text-right">
                                    <Button 
                                      size="sm" 
                                      variant="ghost"
                                      onClick={() => handleEditItem(item)}
                                    >
                                      <Edit size={16} />
                                    </Button>
                                  </td>
                                </>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="feedback">
              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium flex items-center gap-2">
                      <MessageSquare size={18} />
                      Student Feedback
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {studentFeedback.map(feedback => (
                        <div 
                          key={feedback.id} 
                          className={`p-4 rounded-lg border ${
                            feedback.resolved ? 'bg-gray-50' : 'bg-cafeteria-primary/5 border-cafeteria-primary/20'
                          }`}
                        >
                          <div className="flex justify-between mb-2">
                            <h4 className="font-medium">{feedback.name}</h4>
                            <span className="text-sm text-gray-500">{feedback.date}</span>
                          </div>
                          <p className="text-gray-700 mb-3">{feedback.feedback}</p>
                          <div className="flex justify-between items-center">
                            {feedback.resolved ? (
                              <span className="text-sm text-green-500 flex items-center gap-1">
                                <Check size={14} />
                                Resolved
                              </span>
                            ) : (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => markAsFeedbackResolved(feedback.id)}
                              >
                                Mark as Resolved
                              </Button>
                            )}
                            <Button size="sm" variant="ghost">Reply</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="export">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Pre-Order Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 mb-4">Export pre-order data for reporting and analysis</p>
                    <div className="space-y-3">
                      <Button 
                        className="w-full flex items-center justify-center gap-2"
                        onClick={() => handleExportData('Pre-order')}
                      >
                        <Download size={16} />
                        Export All Pre-Orders
                      </Button>
                      <Button variant="outline" className="w-full">
                        Filter & Export
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Menu Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 mb-4">Export complete menu data with nutrition information</p>
                    <div className="space-y-3">
                      <Button 
                        className="w-full flex items-center justify-center gap-2"
                        onClick={() => handleExportData('Menu')}
                      >
                        <Download size={16} />
                        Export Menu Items
                      </Button>
                      <Button variant="outline" className="w-full">
                        Export with Analytics
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Feedback & Ratings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 mb-4">Export student feedback and meal ratings</p>
                    <div className="space-y-3">
                      <Button 
                        className="w-full flex items-center justify-center gap-2"
                        onClick={() => handleExportData('Feedback')}
                      >
                        <Download size={16} />
                        Export Feedback Data
                      </Button>
                      <Button variant="outline" className="w-full">
                        Export Ratings Only
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Waste Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 mb-4">Export food waste data and reduction metrics</p>
                    <div className="space-y-3">
                      <Button 
                        className="w-full flex items-center justify-center gap-2"
                        onClick={() => handleExportData('Waste')}
                      >
                        <Download size={16} />
                        Export Waste Data
                      </Button>
                      <Button variant="outline" className="w-full">
                        Monthly Summary
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Student Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 mb-4">Export anonymized student usage and preferences</p>
                    <div className="space-y-3">
                      <Button 
                        className="w-full flex items-center justify-center gap-2"
                        onClick={() => handleExportData('Student')}
                      >
                        <Download size={16} />
                        Export Student Data
                      </Button>
                      <Button variant="outline" className="w-full">
                        Dietary Preferences
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium">Financial Report</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 mb-4">Export sales and financial data</p>
                    <div className="space-y-3">
                      <Button 
                        className="w-full flex items-center justify-center gap-2"
                        onClick={() => handleExportData('Financial')}
                      >
                        <Download size={16} />
                        Export Financial Data
                      </Button>
                      <Button variant="outline" className="w-full">
                        Cost Analysis
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminPortal;
