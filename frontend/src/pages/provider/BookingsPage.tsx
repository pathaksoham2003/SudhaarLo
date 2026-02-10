import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, Clock, MapPin, Phone, CheckCircle2, 
  XCircle, User, Filter 
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const mockBookings = [
  {
    id: 1,
    customer: 'Rahul Sharma',
    phone: '+91 98765 43210',
    service: 'Pipe Fitting',
    date: '2025-02-18',
    time: '2:00 PM',
    address: '123, Marine Drive, Mumbai',
    amount: 500,
    status: 'pending',
  },
  {
    id: 2,
    customer: 'Priya Patel',
    phone: '+91 87654 32109',
    service: 'Leak Repair',
    date: '2025-02-19',
    time: '10:00 AM',
    address: '456, Andheri West, Mumbai',
    amount: 400,
    status: 'pending',
  },
  {
    id: 3,
    customer: 'Amit Kumar',
    phone: '+91 76543 21098',
    service: 'Bathroom Fitting',
    date: '2025-02-20',
    time: '3:00 PM',
    address: '789, Bandra East, Mumbai',
    amount: 600,
    status: 'approved',
  },
  {
    id: 4,
    customer: 'Sunita Devi',
    phone: '+91 65432 10987',
    service: 'Water Heater Installation',
    date: '2025-02-15',
    time: '11:00 AM',
    address: '321, Colaba, Mumbai',
    amount: 800,
    status: 'completed',
  },
  {
    id: 5,
    customer: 'Deepak Singh',
    phone: '+91 54321 09876',
    service: 'Pipe Fitting',
    date: '2025-02-14',
    time: '4:00 PM',
    address: '654, Juhu, Mumbai',
    amount: 500,
    status: 'cancelled',
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-warning/10 text-warning border-warning/30';
    case 'approved':
      return 'bg-primary/10 text-primary border-primary/30';
    case 'completed':
      return 'bg-success/10 text-success border-success/30';
    case 'cancelled':
      return 'bg-destructive/10 text-destructive border-destructive/30';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const ProviderBookingsPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [bookings, setBookings] = useState(mockBookings);

  const handleApprove = (id: number) => {
    setBookings(bookings.map(b => 
      b.id === id ? { ...b, status: 'approved' } : b
    ));
    toast({
      title: "Booking Approved",
      description: "The customer has been notified.",
    });
  };

  const handleReject = (id: number) => {
    setBookings(bookings.map(b => 
      b.id === id ? { ...b, status: 'cancelled' } : b
    ));
    toast({
      title: "Booking Cancelled",
      description: "The customer has been notified.",
    });
  };

  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'requests') return booking.status === 'pending';
    return booking.status === activeTab;
  });

  return (
    <Layout>
      <div className="bg-muted/30 min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-dark text-primary-foreground py-8">
          <div className="container mx-auto px-4">
            <h1 className="font-heading text-2xl md:text-3xl font-bold mb-1">Booking Requests</h1>
            <p className="text-primary-foreground/80">Manage your incoming and existing bookings</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-card shadow-sm">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="requests">
                Requests
                {bookings.filter(b => b.status === 'pending').length > 0 && (
                  <Badge className="ml-2 bg-secondary text-secondary-foreground h-5 w-5 p-0 justify-center">
                    {bookings.filter(b => b.status === 'pending').length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
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
                    <Card>
                      <CardContent className="p-5">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                          {/* Customer Info */}
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold shrink-0">
                              {booking.customer.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold">{booking.customer}</h3>
                                <Badge className={getStatusColor(booking.status)}>
                                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{booking.service}</p>
                            </div>
                          </div>

                          {/* Booking Details */}
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground lg:justify-end">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" />
                              {new Date(booking.date).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                              })}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4" />
                              {booking.time}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Phone className="w-4 h-4" />
                              {booking.phone}
                            </div>
                          </div>

                          {/* Amount & Actions */}
                          <div className="flex items-center gap-4">
                            <span className="font-semibold text-lg">₹{booking.amount}</span>
                            
                            {booking.status === 'pending' && (
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => handleReject(booking.id)}
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Reject
                                </Button>
                                <Button 
                                  size="sm"
                                  className="bg-success hover:bg-success/90"
                                  onClick={() => handleApprove(booking.id)}
                                >
                                  <CheckCircle2 className="w-4 h-4 mr-1" />
                                  Approve
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Address */}
                        <div className="mt-4 pt-4 border-t flex items-start gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                          {booking.address}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}

                {filteredBookings.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold mb-2">No bookings found</h3>
                    <p className="text-muted-foreground">You don't have any {activeTab} bookings</p>
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

export default ProviderBookingsPage;
