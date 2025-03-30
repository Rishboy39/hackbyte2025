
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import authService from '@/lib/authService';

const StudentFeedback: React.FC = () => {
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedback.trim()) {
      toast.error('Please enter your feedback');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) {
        toast.error('You must be logged in to submit feedback');
        setIsSubmitting(false);
        return;
      }
      
      // In a real app, this would save to Supabase database
      // For now, let's simulate a successful save
      const { success } = await authService.saveFeedback({
        userId: currentUser.id,
        feedback,
        resolved: false
      });
      
      if (success) {
        toast.success('Feedback submitted successfully');
        setFeedback('');
      } else {
        toast.error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
      toast.error('An error occurred while submitting feedback');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <MessageSquare size={18} />
          Provide Feedback
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Textarea
                placeholder="Share your thoughts on the food or cafeteria service..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
            <Button 
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StudentFeedback;
