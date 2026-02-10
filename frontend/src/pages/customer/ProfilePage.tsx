import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail, MapPin, Edit2, Camera, LogOut } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const CustomerProfilePage = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Amit Singh',
    phone: '+91 98765 43210',
    email: 'amit.singh@email.com',
    address: '123, Marine Drive, Mumbai, Maharashtra - 400001',
  });

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
          <div className="container mx-auto px-4 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-full bg-card flex items-center justify-center text-primary font-bold text-3xl shadow-lg">
                AS
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground shadow-md">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h1 className="font-heading text-2xl font-bold">{profile.name}</h1>
            <p className="text-primary-foreground/80">Customer Account</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
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

                <div className="space-y-4">
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
                    <p className="text-xs text-muted-foreground mt-1">Phone number cannot be changed</p>
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
                      Address
                    </label>
                    {isEditing ? (
                      <Input
                        value={profile.address}
                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                      />
                    ) : (
                      <p className="text-muted-foreground">{profile.address}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6">
              <Button variant="outline" className="w-full text-destructive hover:text-destructive gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default CustomerProfilePage;
