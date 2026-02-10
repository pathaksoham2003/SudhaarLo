import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Phone, Mail, MapPin, Shield, Edit2, 
  Camera, LogOut, Star, Calendar, CheckCircle2 
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const ProviderProfilePage = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    email: 'rajesh.kumar@email.com',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    about: 'With over 12 years of experience in plumbing, I specialize in residential and commercial plumbing solutions. Committed to providing quality service with guaranteed satisfaction.',
  });

  const stats = {
    rating: 4.9,
    reviews: 156,
    jobs: 520,
    experience: '12 years',
  };

  const isVerified = true;

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your changes have been saved.",
    });
  };

  return (
    <Layout>
      <div className="bg-muted/30 min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-dark text-primary-foreground py-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-28 h-28 rounded-full bg-card flex items-center justify-center text-primary font-bold text-4xl shadow-lg">
                  RK
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground shadow-md">
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              <div className="text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                  <h1 className="font-heading text-2xl md:text-3xl font-bold">{profile.name}</h1>
                  {isVerified && (
                    <Badge className="bg-success/20 text-success border-success/30 gap-1">
                      <Shield className="w-3 h-3" />
                      Aadhar Verified
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-primary-foreground/80">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-secondary fill-secondary" />
                    <span className="font-semibold">{stats.rating}</span>
                    <span>({stats.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    {stats.jobs}+ jobs
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {stats.experience}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Personal Information */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-xl font-semibold">Personal Information</h2>
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    size="sm"
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className={isEditing ? 'bg-gradient-accent' : ''}
                  >
                    {isEditing ? 'Save Changes' : (
                      <>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </>
                    )}
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      Full Name
                    </label>
                    {isEditing ? (
                      <Input
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      />
                    ) : (
                      <p className="text-muted-foreground">{profile.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      Phone Number
                    </label>
                    <p className="text-muted-foreground">{profile.phone}</p>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      Email Address
                    </label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      />
                    ) : (
                      <p className="text-muted-foreground">{profile.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      City
                    </label>
                    {isEditing ? (
                      <Input
                        value={profile.city}
                        onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                      />
                    ) : (
                      <p className="text-muted-foreground">{profile.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">State</label>
                    {isEditing ? (
                      <Input
                        value={profile.state}
                        onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                      />
                    ) : (
                      <p className="text-muted-foreground">{profile.state}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Pincode</label>
                    {isEditing ? (
                      <Input
                        value={profile.pincode}
                        onChange={(e) => setProfile({ ...profile, pincode: e.target.value })}
                      />
                    ) : (
                      <p className="text-muted-foreground">{profile.pincode}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About */}
            <Card>
              <CardContent className="p-6">
                <h2 className="font-heading text-xl font-semibold mb-4">About</h2>
                {isEditing ? (
                  <Textarea
                    value={profile.about}
                    onChange={(e) => setProfile({ ...profile, about: e.target.value })}
                    rows={4}
                  />
                ) : (
                  <p className="text-muted-foreground">{profile.about}</p>
                )}
              </CardContent>
            </Card>

            {/* Verification Status */}
            <Card>
              <CardContent className="p-6">
                <h2 className="font-heading text-xl font-semibold mb-4">Verification Status</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Shield className={`w-5 h-5 ${isVerified ? 'text-success' : 'text-warning'}`} />
                      <span className="font-medium">Aadhar Verification</span>
                    </div>
                    <Badge className={isVerified 
                      ? 'bg-success/10 text-success border-success/30' 
                      : 'bg-warning/10 text-warning border-warning/30'
                    }>
                      {isVerified ? 'Verified' : 'Pending'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Logout */}
            <Button variant="outline" className="w-full text-destructive hover:text-destructive gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default ProviderProfilePage;
