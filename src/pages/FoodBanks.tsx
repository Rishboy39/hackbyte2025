
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  Building, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Phone, 
  Search, 
  Send, 
  Truck, 
  Utensils 
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

// Mock food bank data
const foodBanks = [
  {
    id: 1,
    name: "Community Food Share",
    address: "123 Main Street, Springfield",
    distance: "1.2 miles",
    contactName: "Sarah Johnson",
    phone: "555-123-4567",
    availablePickup: true,
    acceptsFresh: true,
    rating: 4.8,
    image: "https://th.bing.com/th/id/OIP.axFvlWPICFwM0OiAj4ST6AHaE8?rs=1&pid=ImgDetMain"
  },
  {
    id: 2,
    name: "Hope Pantry",
    address: "456 Oak Avenue, Springfield",
    distance: "2.3 miles",
    contactName: "Michael Davis",
    phone: "555-987-6543",
    availablePickup: true,
    acceptsFresh: true,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "Feeding Families Foundation",
    address: "789 Pine Road, Springfield",
    distance: "3.5 miles",
    contactName: "Jennifer Martinez",
    phone: "555-456-7890",
    availablePickup: false,
    acceptsFresh: true,
    rating: 4.9,
    image: "https://th.bing.com/th/id/OIP.pGS8VtNvlDDyAu2xVy6ESQHaE7?rs=1&pid=ImgDetMain"
  },
  {
    id: 4,
    name: "Neighborhood Nutrition Network",
    address: "321 Elm Street, Springfield",
    distance: "4.1 miles",
    contactName: "Robert Williams",
    phone: "555-789-0123",
    availablePickup: true,
    acceptsFresh: false,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
  }
];

const FoodBanks: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFoodBank, setSelectedFoodBank] = useState<(typeof foodBanks)[0] | null>(null);
  const [showDonationDialog, setShowDonationDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState<{bankName: string, pickupTime: string} | null>(null);
  const [donationDetails, setDonationDetails] = useState({
    items: '',
    quantity: '',
    notes: ''
  });
  
  const filteredFoodBanks = foodBanks.filter(bank => 
    bank.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    bank.address.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleDonate = (foodBank: (typeof foodBanks)[0]) => {
    setSelectedFoodBank(foodBank);
    setShowDonationDialog(true);
  };
  
  const handleConfirmDonation = () => {
    setShowDonationDialog(false);
    
    // Random pickup time between 30 minutes and 2 hours
    const pickupMinutes = Math.floor(Math.random() * 90) + 30;
    const hours = Math.floor(pickupMinutes / 60);
    const minutes = pickupMinutes % 60;
    const pickupTime = `${hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''}` : ''} ${minutes > 0 ? `${minutes} minutes` : ''}`.trim();
    
    setSuccessMessage({
      bankName: selectedFoodBank!.name,
      pickupTime: pickupTime
    });
    
    toast.success(`Donation confirmed to ${selectedFoodBank!.name}`);
    
    // Reset donation details
    setDonationDetails({
      items: '',
      quantity: '',
      notes: ''
    });
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
              onClick={() => navigate('/admin/food-stock')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">Food Banks</h1>
              <p className="text-gray-500">Donate excess food to local food banks</p>
            </div>
          </div>
          
          {successMessage ? (
            <Card className="mb-8 bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center p-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-green-800 mb-2">Donation Confirmed!</h2>
                  <p className="text-green-700 mb-4">
                    Thank you for donating to {successMessage.bankName}. A representative will arrive for pickup in approximately {successMessage.pickupTime}.
                  </p>
                  <div className="flex items-center justify-center gap-2 bg-white p-3 rounded-lg border border-green-200 mb-4">
                    <Clock className="h-5 w-5 text-green-600" />
                    <span className="text-green-700 font-medium">Estimated pickup: {successMessage.pickupTime}</span>
                  </div>
                  <Button onClick={() => setSuccessMessage(null)} className="mt-2">
                    Make Another Donation
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                  <span className="font-medium">{filteredFoodBanks.length}</span> food banks found in your area
                </p>
                <div className="relative w-72">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search by name or location..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFoodBanks.map(foodBank => (
                  <Card key={foodBank.id} className="overflow-hidden">
                    <div className="h-40 overflow-hidden">
                      <img 
                        src={foodBank.image} 
                        alt={foodBank.name} 
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle>{foodBank.name}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                        {foodBank.address} ({foodBank.distance})
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="space-y-3">
                        <div className="flex items-center text-sm">
                          <Building className="h-4 w-4 mr-2 text-gray-500" />
                          <span>Contact: {foodBank.contactName}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{foodBank.phone}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {foodBank.availablePickup && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                              <Truck className="h-3 w-3 inline mr-1" />
                              Offers Pickup
                            </span>
                          )}
                          {foodBank.acceptsFresh && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                              <Utensils className="h-3 w-3 inline mr-1" />
                              Accepts Fresh Food
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button 
                        className="w-full" 
                        onClick={() => handleDonate(foodBank)}
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Donate
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          )}
          
          {/* Donation Dialog */}
          <Dialog open={showDonationDialog} onOpenChange={setShowDonationDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Donate to {selectedFoodBank?.name}</DialogTitle>
                <DialogDescription>
                  Fill out the details below to arrange a food donation pickup.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="items">Food Items</Label>
                  <Input 
                    id="items" 
                    placeholder="Pasta, Salad, Sandwiches, etc."
                    value={donationDetails.items}
                    onChange={(e) => setDonationDetails({...donationDetails, items: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quantity">Approximate Quantity</Label>
                  <Input 
                    id="quantity" 
                    placeholder="e.g., 25 servings, 4 trays"
                    value={donationDetails.quantity}
                    onChange={(e) => setDonationDetails({...donationDetails, quantity: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Any special instructions or information about the food..."
                    className="min-h-20"
                    value={donationDetails.notes}
                    onChange={(e) => setDonationDetails({...donationDetails, notes: e.target.value})}
                  />
                </div>
                
                <div className="bg-blue-50 p-3 rounded text-sm text-blue-800 flex items-start gap-2">
                  <Clock className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <p>
                    {selectedFoodBank?.name} typically responds within 30 minutes to arrange pickup.
                    You'll be notified once they confirm the donation.
                  </p>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDonationDialog(false)}>Cancel</Button>
                <Button onClick={handleConfirmDonation}>Confirm Donation</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
};

export default FoodBanks;
