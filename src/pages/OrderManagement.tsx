import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, Search, ChevronRight, AlertTriangle, Clock, Check, X, Timer } from 'lucide-react';
import { toast } from 'sonner';

const OrderManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock order data
  const upcomingOrders = [
    { id: 'ORD-1234', date: 'Today, 12:30 PM', status: 'ready', items: ['Chicken Sandwich', 'Apple Slices', 'Milk'] },
    { id: 'ORD-2345', date: 'Today, 12:30 PM', status: 'processing', items: ['Pizza Slice', 'Side Salad', 'Water'] },
    { id: 'ORD-3456', date: 'Today, 12:30 PM', status: 'ready', items: ['Veggie Wrap', 'Fruit Cup', 'Orange Juice'] },
    { id: 'ORD-4567', date: 'Tomorrow, 12:30 PM', status: 'confirmed', items: ['Pasta Bowl', 'Garlic Bread', 'Lemonade'] },
    { id: 'ORD-5678', date: 'Tomorrow, 12:30 PM', status: 'confirmed', items: ['Turkey Sandwich', 'Chips', 'Chocolate Milk'] }
  ];
  
  const pastOrders = [
    { id: 'ORD-0123', date: 'Yesterday, 12:30 PM', status: 'completed', items: ['Burger', 'Fries', 'Soda'], rating: 4 },
    { id: 'ORD-9876', date: '2 days ago, 12:30 PM', status: 'completed', items: ['Salad Bowl', 'Cookie', 'Water'], rating: 5 },
    { id: 'ORD-8765', date: '3 days ago, 12:30 PM', status: 'completed', items: ['Mac & Cheese', 'Apple', 'Milk'], rating: 3 },
    { id: 'ORD-7654', date: '1 week ago, 12:30 PM', status: 'completed', items: ['Chicken Tenders', 'Mashed Potatoes', 'Juice'], rating: 4 },
    { id: 'ORD-6543', date: '1 week ago, 12:30 PM', status: 'completed', items: ['Pizza Slice', 'Breadstick', 'Water'], rating: 5 }
  ];
  
  const filteredUpcomingOrders = upcomingOrders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.items.some(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const filteredPastOrders = pastOrders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.items.some(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const handlePickupOrder = (orderId: string) => {
    toast.success(`Order ${orderId} picked up successfully`);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge className="bg-green-500 hover:bg-green-600 flex items-center gap-1"><Check size={12} /> Ready</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500 hover:bg-blue-600 flex items-center gap-1"><Timer size={12} /> Processing</Badge>;
      case 'confirmed':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600 flex items-center gap-1"><Clock size={12} /> Confirmed</Badge>;
      case 'completed':
        return <Badge className="bg-gray-500 hover:bg-gray-600 flex items-center gap-1"><Check size={12} /> Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  const getRatingStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">Order Management</h1>
              <p className="text-gray-500">View and manage your meal orders</p>
            </div>
            
            <div>
              <Button className="flex items-center gap-2">
                <Calendar size={16} />
                <span>Pre-Order</span>
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
          
          {/* Notification for ready orders */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <Check className="text-green-600" size={20} />
              </div>
              <div>
                <h3 className="font-medium text-green-800">Order ORD-1234 is ready for pickup!</h3>
                <p className="text-green-600 text-sm">Please collect your order from the cafeteria counter.</p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="border-green-300 text-green-700" onClick={() => handlePickupOrder('ORD-1234')}>
              Confirm Pickup
            </Button>
          </div>
          
          {/* Additional notification for ready order */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <Check className="text-green-600" size={20} />
              </div>
              <div>
                <h3 className="font-medium text-green-800">Order ORD-3456 is ready for pickup!</h3>
                <p className="text-green-600 text-sm">Your Veggie Wrap, Fruit Cup, and Orange Juice are ready at the cafeteria counter.</p>
              </div>
            </div>
            <Button size="sm" variant="outline" className="border-green-300 text-green-700" onClick={() => handlePickupOrder('ORD-3456')}>
              Confirm Pickup
            </Button>
          </div>
          
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                type="text" 
                placeholder="Search orders by ID or item..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="upcoming">Upcoming Orders</TabsTrigger>
              <TabsTrigger value="past">Past Orders</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Upcoming Orders</CardTitle>
                  <CardDescription>View and manage your upcoming meal orders</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {filteredUpcomingOrders.length === 0 ? (
                      <div className="text-gray-500">No upcoming orders found.</div>
                    ) : (
                      filteredUpcomingOrders.map(order => (
                        <div key={order.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{order.id}</h4>
                            {getStatusBadge(order.status)}
                          </div>
                          <p className="text-sm text-gray-500 mb-3">{order.date}</p>
                          <ul className="list-disc list-inside text-sm">
                            {order.items.map(item => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                          <div className="text-right mt-4">
                            <Button size="sm" onClick={() => handlePickupOrder(order.id)}>
                              {order.status === 'ready' ? 'Confirm Pickup' : 'View Details'}
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="past">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Past Orders</CardTitle>
                  <CardDescription>Review your past meal orders and ratings</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {filteredPastOrders.length === 0 ? (
                      <div className="text-gray-500">No past orders found.</div>
                    ) : (
                      filteredPastOrders.map(order => (
                        <div key={order.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{order.id}</h4>
                            {getStatusBadge(order.status)}
                          </div>
                          <p className="text-sm text-gray-500 mb-3">{order.date}</p>
                          <ul className="list-disc list-inside text-sm">
                            {order.items.map(item => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                          <div className="flex items-center justify-between mt-4">
                            <div>
                              <span className="text-sm text-gray-500">Rating:</span>
                              <span className="text-yellow-500 ml-1">{getRatingStars(order.rating || 0)}</span>
                            </div>
                            <Button size="sm">View Details</Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default OrderManagement;
