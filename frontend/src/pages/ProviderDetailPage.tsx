import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, Shield, MapPin, Phone, Clock, Calendar, 
  ChevronLeft, Share2, Heart, Camera, MessageSquare 
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

const mockProvider = {
  id: 1,
  name: 'Rajesh Kumar',
  rating: 4.9,
  reviews: 156,
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400001',
  phone: '+91 98765 43210',
  verified: true,
  experience: '12 years',
  completedJobs: 520,
  responseTime: '< 1 hour',
  services: [
    { name: 'Pipe Fitting', price: 500, unit: 'per hour', description: 'Installation and fitting of new pipes' },
    { name: 'Leak Repair', price: 400, unit: 'per visit', description: 'Detection and fixing of pipe leaks' },
    { name: 'Bathroom Fittings', price: 600, unit: 'per hour', description: 'Complete bathroom fixture installation' },
    { name: 'Water Heater Installation', price: 800, unit: 'flat rate', description: 'Installation of geyser and water heaters' },
  ],
  photos: [
    '/api/placeholder/400/300',
    '/api/placeholder/400/300',
    '/api/placeholder/400/300',
    '/api/placeholder/400/300',
  ],
  about: 'With over 12 years of experience in plumbing, I specialize in residential and commercial plumbing solutions. I am Aadhar verified and committed to providing quality service with guaranteed satisfaction.',
};

const mockReviews = [
  { id: 1, name: 'Amit Singh', rating: 5, date: '2 weeks ago', comment: 'Excellent work! Fixed our leaking pipe within an hour. Very professional and clean work.', avatar: null },
  { id: 2, name: 'Priya Sharma', rating: 5, date: '1 month ago', comment: 'Very punctual and skilled. Installed our new bathroom fittings perfectly.', avatar: null },
  { id: 3, name: 'Rahul Mehta', rating: 4, date: '1 month ago', comment: 'Good service. Could have been a bit faster but overall satisfied.', avatar: null },
  { id: 4, name: 'Sunita Devi', rating: 5, date: '2 months ago', comment: 'Best plumber in the area! Highly recommended.', avatar: null },
];

const ProviderDetailPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('info');

  return (
    <Layout>
      <div className="bg-muted/30 min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-dark text-primary-foreground">
          <div className="container mx-auto px-4 py-6">
            <Link to="/providers" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-4">
              <ChevronLeft className="w-4 h-4" />
              Back to Providers
            </Link>

            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-card flex items-center justify-center text-primary font-bold text-3xl shrink-0 shadow-lg">
                {mockProvider.name.split(' ').map(n => n[0]).join('')}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="font-heading text-2xl md:text-3xl font-bold">{mockProvider.name}</h1>
                  {mockProvider.verified && (
                    <Badge className="bg-success/20 text-success border-success/30 gap-1">
                      <Shield className="w-3 h-3" />
                      Aadhar Verified
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-primary-foreground/80 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-secondary fill-secondary" />
                    <span className="font-semibold text-primary-foreground">{mockProvider.rating}</span>
                    <span>({mockProvider.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {mockProvider.city}, {mockProvider.state}
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {mockProvider.phone}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className="bg-primary-foreground/10 rounded-lg px-4 py-2">
                    <p className="text-xs text-primary-foreground/70">Experience</p>
                    <p className="font-semibold">{mockProvider.experience}</p>
                  </div>
                  <div className="bg-primary-foreground/10 rounded-lg px-4 py-2">
                    <p className="text-xs text-primary-foreground/70">Jobs Done</p>
                    <p className="font-semibold">{mockProvider.completedJobs}+</p>
                  </div>
                  <div className="bg-primary-foreground/10 rounded-lg px-4 py-2">
                    <p className="text-xs text-primary-foreground/70">Response</p>
                    <p className="font-semibold">{mockProvider.responseTime}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button variant="outline" size="icon" className="bg-transparent border-primary-foreground/30 hover:bg-primary-foreground/10">
                  <Heart className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="icon" className="bg-transparent border-primary-foreground/30 hover:bg-primary-foreground/10">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-card shadow-sm w-full justify-start overflow-x-auto">
              <TabsTrigger value="info" className="gap-2">
                <MessageSquare className="w-4 h-4" />
                About
              </TabsTrigger>
              <TabsTrigger value="services" className="gap-2">
                <Clock className="w-4 h-4" />
                Services
              </TabsTrigger>
              <TabsTrigger value="photos" className="gap-2">
                <Camera className="w-4 h-4" />
                Photos
              </TabsTrigger>
              <TabsTrigger value="reviews" className="gap-2">
                <Star className="w-4 h-4" />
                Reviews
              </TabsTrigger>
            </TabsList>

            {/* About Tab */}
            <TabsContent value="info">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-heading text-lg font-semibold mb-4">About {mockProvider.name}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">{mockProvider.about}</p>
                  
                  <h4 className="font-semibold mb-3">Contact Information</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{mockProvider.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium">{mockProvider.city}, {mockProvider.state} - {mockProvider.pincode}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Services Tab */}
            <TabsContent value="services">
              <div className="grid sm:grid-cols-2 gap-4">
                {mockProvider.services.map((service, index) => (
                  <motion.div
                    key={service.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-card-hover transition-shadow">
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-semibold">{service.name}</h4>
                          <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                            ₹{service.price} {service.unit}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Photos Tab */}
            <TabsContent value="photos">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {mockProvider.photos.map((photo, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="aspect-video bg-muted rounded-xl overflow-hidden"
                  >
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <Camera className="w-8 h-8 text-muted-foreground" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews">
              <div className="space-y-4">
                {mockReviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-5">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold shrink-0">
                            {review.name[0]}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold">{review.name}</h4>
                              <span className="text-sm text-muted-foreground">{review.date}</span>
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < review.rating ? 'text-secondary fill-secondary' : 'text-muted'}`}
                                />
                              ))}
                            </div>
                            <p className="text-muted-foreground">{review.comment}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default ProviderDetailPage;
