import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, IndianRupee, Clock, AlertCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const serviceCategories = ['Plumbing', 'Electrical', 'Painting', 'Carpentry', 'Cleaning', 'Pest Control'];

const mockServices = [
  { id: 1, name: 'Pipe Fitting', category: 'Plumbing', price: 500, unit: 'per hour', description: 'Installation and fitting of new pipes' },
  { id: 2, name: 'Leak Repair', category: 'Plumbing', price: 400, unit: 'per visit', description: 'Detection and fixing of pipe leaks' },
  { id: 3, name: 'Bathroom Fittings', category: 'Plumbing', price: 600, unit: 'per hour', description: 'Complete bathroom fixture installation' },
  { id: 4, name: 'Water Heater Installation', category: 'Plumbing', price: 800, unit: 'flat rate', description: 'Installation of geyser and water heaters' },
];

const ProviderServicesPage = () => {
  const { toast } = useToast();
  const [services, setServices] = useState(mockServices);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    category: '',
    price: '',
    unit: 'per hour',
    description: '',
  });

  const isVerified = true; // This would come from auth context

  const handleAddService = () => {
    if (!isVerified) {
      toast({
        title: "Verification Required",
        description: "You need to be verified to add services.",
        variant: "destructive",
      });
      return;
    }

    const service = {
      id: services.length + 1,
      name: newService.name,
      category: newService.category,
      price: parseInt(newService.price),
      unit: newService.unit,
      description: newService.description,
    };

    setServices([...services, service]);
    setNewService({ name: '', category: '', price: '', unit: 'per hour', description: '' });
    setIsDialogOpen(false);
    toast({
      title: "Service Added",
      description: "Your new service has been added successfully.",
    });
  };

  const handleDeleteService = (id: number) => {
    setServices(services.filter(s => s.id !== id));
    toast({
      title: "Service Deleted",
      description: "The service has been removed.",
    });
  };

  return (
    <Layout>
      <div className="bg-muted/30 min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-dark text-primary-foreground py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="font-heading text-2xl md:text-3xl font-bold mb-1">My Services</h1>
                <p className="text-primary-foreground/80">Manage your service offerings</p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-secondary hover:bg-secondary-dark gap-2">
                    <Plus className="w-4 h-4" />
                    Add Service
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Service</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Service Name</label>
                      <Input
                        value={newService.name}
                        onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                        placeholder="e.g., Pipe Fitting"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <Select
                        value={newService.category}
                        onValueChange={(value) => setNewService({ ...newService, category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceCategories.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Price (₹)</label>
                        <Input
                          type="number"
                          value={newService.price}
                          onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                          placeholder="500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Unit</label>
                        <Select
                          value={newService.unit}
                          onValueChange={(value) => setNewService({ ...newService, unit: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="per hour">Per Hour</SelectItem>
                            <SelectItem value="per visit">Per Visit</SelectItem>
                            <SelectItem value="flat rate">Flat Rate</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <Textarea
                        value={newService.description}
                        onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                        placeholder="Describe your service..."
                        rows={3}
                      />
                    </div>
                    <Button
                      className="w-full bg-gradient-accent"
                      onClick={handleAddService}
                      disabled={!newService.name || !newService.category || !newService.price}
                    >
                      Add Service
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {!isVerified && (
            <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 flex gap-3 mb-6">
              <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-warning-foreground">Verification Pending</p>
                <p className="text-sm text-muted-foreground">
                  You cannot add services until your Aadhar verification is complete.
                </p>
              </div>
            </div>
          )}

          {/* Services Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full hover:shadow-card-hover transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="outline">{service.category}</Badge>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteService(service.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{service.description}</p>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-1 text-primary font-semibold">
                        <IndianRupee className="w-4 h-4" />
                        {service.price}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {service.unit}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Add Service Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: services.length * 0.05 }}
            >
              <Card 
                className="h-full border-dashed cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => setIsDialogOpen(true)}
              >
                <CardContent className="p-5 flex flex-col items-center justify-center min-h-[200px]">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Plus className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-medium">Add New Service</p>
                  <p className="text-sm text-muted-foreground">Click to add</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProviderServicesPage;
