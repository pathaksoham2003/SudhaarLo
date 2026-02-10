import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, MapPin, Clock, Phone, Star, 
  ChevronLeft, Shield, CheckCircle2, MessageSquare 
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const mockBooking = {
  id: 1,
  service: 'Pipe Fitting',
  provider: {
    id: 1,
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    verified: true,
    rating: 4.9,
  },
  date: '2025-02-15',
  time: '10:00 AM',
  status: 'completed',
  address: '123, Marine Drive, Mumbai, Maharashtra - 400001',
  visitType: 'Home Visit',
  amount: 1500,
  reviewed: false,
  existingReview: null,
};

const BookingDetailPage = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmitReview = () => {
    toast({
      title: "Review Submitted!",
      description: "Thank you for your feedback.",
    });
    setIsDialogOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success/10 text-success border-success/30';
      case 'upcoming':
        return 'bg-primary/10 text-primary border-primary/30';
      case 'cancelled':
        return 'bg-destructive/10 text-destructive border-destructive/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Layout>
      <div className="bg-muted/30 min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-dark text-primary-foreground py-8">
          <div className="container mx-auto px-4">
            <Link to="/customer/bookings" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-4">
              <ChevronLeft className="w-4 h-4" />
              Back to Bookings
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="font-heading text-2xl md:text-3xl font-bold">{mockBooking.service}</h1>
              <Badge className={getStatusColor(mockBooking.status)}>
                {mockBooking.status.charAt(0).toUpperCase() + mockBooking.status.slice(1)}
              </Badge>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Booking Details */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-heading font-semibold text-lg mb-4">Booking Details</h3>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-medium">
                          {new Date(mockBooking.date).toLocaleDateString('en-IN', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Time</p>
                        <p className="font-medium">{mockBooking.time}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 sm:col-span-2">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{mockBooking.visitType}</p>
                        <p className="font-medium">{mockBooking.address}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Status Timeline */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-heading font-semibold text-lg mb-4">Booking Status</h3>
                  
                  <div className="space-y-4">
                    {[
                      { label: 'Booking Confirmed', completed: true, time: 'Feb 14, 2025 - 3:00 PM' },
                      { label: 'Provider Assigned', completed: true, time: 'Feb 14, 2025 - 3:05 PM' },
                      { label: 'Service Started', completed: true, time: 'Feb 15, 2025 - 10:00 AM' },
                      { label: 'Service Completed', completed: mockBooking.status === 'completed', time: mockBooking.status === 'completed' ? 'Feb 15, 2025 - 12:30 PM' : 'Pending' },
                    ].map((step, index) => (
                      <div key={step.label} className="flex items-start gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          step.completed ? 'bg-success text-success-foreground' : 'bg-muted'
                        }`}>
                          {step.completed ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${step.completed ? '' : 'text-muted-foreground'}`}>
                            {step.label}
                          </p>
                          <p className="text-sm text-muted-foreground">{step.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Review Section */}
              {mockBooking.status === 'completed' && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-heading font-semibold text-lg mb-4">Your Review</h3>
                    
                    {mockBooking.existingReview ? (
                      <div>
                        {/* Show existing review */}
                        <p>Your existing review here...</p>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground mb-4">Share your experience with this service</p>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                          <DialogTrigger asChild>
                            <Button className="bg-gradient-accent">Add Review</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Write a Review</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 mt-4">
                              <div>
                                <label className="block text-sm font-medium mb-2">Rating</label>
                                <div className="flex gap-2">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      onClick={() => setRating(star)}
                                      className="p-1"
                                    >
                                      <Star
                                        className={`w-8 h-8 ${
                                          star <= rating
                                            ? 'text-secondary fill-secondary'
                                            : 'text-muted'
                                        }`}
                                      />
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-2">Your Review</label>
                                <Textarea
                                  value={reviewText}
                                  onChange={(e) => setReviewText(e.target.value)}
                                  placeholder="Share your experience..."
                                  rows={4}
                                />
                              </div>
                              <Button 
                                className="w-full bg-gradient-accent"
                                onClick={handleSubmitReview}
                                disabled={rating === 0 || !reviewText}
                              >
                                Submit Review
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Provider Card */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-heading font-semibold text-lg mb-4">Service Provider</h3>
                  
                  <Link to={`/provider/${mockBooking.provider.id}`}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-primary-foreground font-bold text-lg">
                        {mockBooking.provider.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{mockBooking.provider.name}</h4>
                          {mockBooking.provider.verified && (
                            <Shield className="w-4 h-4 text-success" />
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="w-4 h-4 text-secondary fill-secondary" />
                          {mockBooking.provider.rating}
                        </div>
                      </div>
                    </div>
                  </Link>

                  <Button variant="outline" className="w-full gap-2">
                    <Phone className="w-4 h-4" />
                    Call Provider
                  </Button>
                </CardContent>
              </Card>

              {/* Payment Summary */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-heading font-semibold text-lg mb-4">Payment Summary</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service Charge</span>
                      <span>₹{mockBooking.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Convenience Fee</span>
                      <span>₹0</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-primary">₹{mockBooking.amount}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookingDetailPage;
