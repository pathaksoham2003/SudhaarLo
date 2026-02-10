import { motion } from 'framer-motion';
import { 
  Calendar, Clock, TrendingUp, Users, Star, 
  IndianRupee, AlertCircle, CheckCircle2, XCircle 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const stats = [
  { label: 'Total Bookings', value: '156', icon: Calendar, change: '+12%', color: 'from-primary to-primary-dark' },
  { label: 'This Month', value: '24', icon: TrendingUp, change: '+8%', color: 'from-success to-green-600' },
  { label: 'Total Revenue', value: '₹45,200', icon: IndianRupee, change: '+15%', color: 'from-secondary to-secondary-dark' },
  { label: 'Avg Rating', value: '4.9', icon: Star, change: '+0.1', color: 'from-yellow-500 to-orange-500' },
];

const recentRequests = [
  { id: 1, customer: 'Rahul Sharma', service: 'Pipe Fitting', date: 'Today, 2:00 PM', status: 'pending', amount: 500 },
  { id: 2, customer: 'Priya Patel', service: 'Leak Repair', date: 'Tomorrow, 10:00 AM', status: 'pending', amount: 400 },
  { id: 3, customer: 'Amit Kumar', service: 'Bathroom Fitting', date: 'Feb 20, 3:00 PM', status: 'approved', amount: 600 },
];

const ProviderDashboard = () => {
  const subscriptionDaysLeft = 15;

  return (
    <Layout>
      <div className="bg-muted/30 min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-dark text-primary-foreground py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="font-heading text-2xl md:text-3xl font-bold mb-1">Welcome back, Rajesh!</h1>
                <p className="text-primary-foreground/80">Here's what's happening with your business</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-success/20 text-success border-success/30">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Aadhar Verified
                </Badge>
                {subscriptionDaysLeft <= 30 && (
                  <Badge className="bg-warning/20 text-warning border-warning/30">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {subscriptionDaysLeft} days left
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                        <p className="font-heading text-2xl font-bold">{stat.value}</p>
                        <p className="text-xs text-success mt-1">{stat.change} this month</p>
                      </div>
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Requests */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-heading text-lg font-semibold">Recent Booking Requests</h2>
                    <Link to="/provider/bookings">
                      <Button variant="ghost" size="sm">View All</Button>
                    </Link>
                  </div>

                  <div className="space-y-4">
                    {recentRequests.map((request, index) => (
                      <motion.div
                        key={request.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                            {request.customer[0]}
                          </div>
                          <div>
                            <p className="font-medium">{request.customer}</p>
                            <p className="text-sm text-muted-foreground">
                              {request.service} • {request.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold">₹{request.amount}</span>
                          {request.status === 'pending' ? (
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                                <XCircle className="w-4 h-4 text-destructive" />
                              </Button>
                              <Button size="sm" className="h-8 w-8 p-0 bg-success hover:bg-success/90">
                                <CheckCircle2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <Badge className="bg-success/10 text-success">Approved</Badge>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              {/* Subscription Card */}
              <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
                <CardContent className="p-6">
                  <h3 className="font-heading font-semibold mb-2">Subscription Status</h3>
                  <div className="flex items-end gap-2 mb-4">
                    <span className="text-3xl font-bold">{subscriptionDaysLeft}</span>
                    <span className="text-muted-foreground mb-1">days remaining</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden mb-4">
                    <div 
                      className="h-full bg-secondary rounded-full"
                      style={{ width: `${(subscriptionDaysLeft / 30) * 100}%` }}
                    />
                  </div>
                  <Link to="/provider/subscription">
                    <Button className="w-full bg-gradient-accent">Renew Subscription</Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-heading font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <Link to="/provider/services">
                      <Button variant="outline" className="w-full justify-start">
                        Manage Services
                      </Button>
                    </Link>
                    <Link to="/provider/bookings">
                      <Button variant="outline" className="w-full justify-start">
                        View Bookings
                      </Button>
                    </Link>
                    <Link to="/provider/profile">
                      <Button variant="outline" className="w-full justify-start">
                        Edit Profile
                      </Button>
                    </Link>
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

export default ProviderDashboard;
