import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, ChevronRight, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const mockBookings = [
  {
    id: 1,
    service: 'Pipe Fitting',
    provider: 'Rajesh Kumar',
    date: '2025-02-15',
    time: '10:00 AM',
    status: 'completed',
    address: '123, Marine Drive, Mumbai',
    amount: 1500,
    reviewed: true,
  },
  {
    id: 2,
    service: 'Electrical Wiring',
    provider: 'Vikram Singh',
    date: '2025-02-18',
    time: '2:00 PM',
    status: 'upcoming',
    address: '456, MG Road, Bangalore',
    amount: 2000,
    reviewed: false,
  },
  {
    id: 3,
    service: 'Deep Cleaning',
    provider: 'Sanjay Gupta',
    date: '2025-02-10',
    time: '9:00 AM',
    status: 'completed',
    address: '789, Park Street, Kolkata',
    amount: 1200,
    reviewed: false,
  },
  {
    id: 4,
    service: 'AC Repair',
    provider: 'Manoj Verma',
    date: '2025-02-20',
    time: '11:00 AM',
    status: 'upcoming',
    address: '321, Anna Nagar, Chennai',
    amount: 800,
    reviewed: false,
  },
];

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

const CustomerBookingsPage = () => {
  const [activeTab, setActiveTab] = useState('all');

  const filteredBookings = mockBookings.filter((booking) => {
    if (activeTab === 'all') return true;
    return booking.status === activeTab;
  });

  return (
    <Layout>
      <div className="bg-muted/30 min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-dark text-primary-foreground py-8">
          <div className="container mx-auto px-4">
            <h1 className="font-heading text-2xl md:text-3xl font-bold mb-2">My Bookings</h1>
            <p className="text-primary-foreground/80">Track and manage all your service bookings</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-card shadow-sm">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <div className="space-y-4">
                {filteredBookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link to={`/customer/booking/${booking.id}`}>
                      <div className="bg-card rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          {/* Service Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-lg">{booking.service}</h3>
                              <Badge className={getStatusColor(booking.status)}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground text-sm mb-3">
                              by {booking.provider}
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                {new Date(booking.date).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                {booking.time}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4" />
                                {booking.address}
                              </div>
                            </div>
                          </div>

                          {/* Amount & Arrow */}
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="font-semibold text-lg">₹{booking.amount}</p>
                              {booking.status === 'completed' && !booking.reviewed && (
                                <p className="text-xs text-secondary">Add review</p>
                              )}
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}

                {filteredBookings.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold mb-2">No bookings found</h3>
                    <p className="text-muted-foreground mb-4">You don't have any {activeTab} bookings yet</p>
                    <Link to="/providers">
                      <Button>Find Services</Button>
                    </Link>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default CustomerBookingsPage;
