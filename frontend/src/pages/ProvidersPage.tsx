import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Star, Shield, ArrowUpDown, X, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

const allServices = ['All', 'Plumbing', 'Electrical', 'Painting', 'Carpentry', 'Cleaning', 'Pest Control', 'Shifting', 'IT Services'];
const cities = ['All Cities', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata'];

const mockProviders = [
  { id: 1, name: 'Rajesh Kumar', rating: 4.9, reviews: 156, city: 'Mumbai', pincode: '400001', verified: true, service: 'Plumbing', speciality: 'Pipe Fitting Expert', price: 500, image: null },
  { id: 2, name: 'Vikram Singh', rating: 4.9, reviews: 203, city: 'Bangalore', pincode: '560001', verified: true, service: 'Electrical', speciality: 'Wiring Expert', price: 600, image: null },
  { id: 3, name: 'Suresh Patel', rating: 4.8, reviews: 134, city: 'Pune', pincode: '411001', verified: true, service: 'Plumbing', speciality: 'Leak Detection', price: 450, image: null },
  { id: 4, name: 'Manoj Verma', rating: 4.8, reviews: 178, city: 'Chennai', pincode: '600001', verified: true, service: 'Electrical', speciality: 'Smart Home Setup', price: 700, image: null },
  { id: 5, name: 'Gopal Das', rating: 4.9, reviews: 187, city: 'Kolkata', pincode: '700001', verified: true, service: 'Carpentry', speciality: 'Custom Furniture', price: 800, image: null },
  { id: 6, name: 'Anil Sharma', rating: 4.7, reviews: 98, city: 'Delhi', pincode: '110001', verified: true, service: 'Plumbing', speciality: 'Emergency Repairs', price: 550, image: null },
  { id: 7, name: 'Pradeep Rao', rating: 4.7, reviews: 145, city: 'Hyderabad', pincode: '500001', verified: true, service: 'Electrical', speciality: 'Industrial Work', price: 650, image: null },
  { id: 8, name: 'Ramesh Yadav', rating: 4.8, reviews: 156, city: 'Ahmedabad', pincode: '380001', verified: true, service: 'Carpentry', speciality: 'Kitchen Cabinets', price: 750, image: null },
  { id: 9, name: 'Sanjay Gupta', rating: 4.6, reviews: 89, city: 'Mumbai', pincode: '400050', verified: true, service: 'Painting', speciality: 'Interior Designer', price: 400, image: null },
  { id: 10, name: 'Deepak Kumar', rating: 4.5, reviews: 67, city: 'Delhi', pincode: '110020', verified: false, service: 'Cleaning', speciality: 'Deep Cleaning', price: 350, image: null },
];

const ProvidersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [pincode, setPincode] = useState('');
  const [budgetRange, setBudgetRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('popularity');
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);

  const filteredProviders = mockProviders.filter((provider) => {
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.speciality.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesService = selectedService === 'All' || provider.service === selectedService;
    const matchesCity = selectedCity === 'All Cities' || provider.city === selectedCity;
    const matchesPincode = !pincode || provider.pincode.includes(pincode);
    const matchesBudget = provider.price >= budgetRange[0] && provider.price <= budgetRange[1];
    const matchesVerified = !showVerifiedOnly || provider.verified;

    return matchesSearch && matchesService && matchesCity && matchesPincode && matchesBudget && matchesVerified;
  });

  const sortedProviders = [...filteredProviders].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'popularity':
      default:
        return b.reviews - a.reviews;
    }
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedService('All');
    setSelectedCity('All Cities');
    setPincode('');
    setBudgetRange([0, 1000]);
    setShowVerifiedOnly(false);
  };

  const activeFiltersCount = [
    selectedService !== 'All',
    selectedCity !== 'All Cities',
    pincode,
    budgetRange[0] > 0 || budgetRange[1] < 1000,
    showVerifiedOnly,
  ].filter(Boolean).length;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Service Filter */}
      <div>
        <label className="block text-sm font-medium mb-2">Service Type</label>
        <Select value={selectedService} onValueChange={setSelectedService}>
          <SelectTrigger>
            <SelectValue placeholder="Select service" />
          </SelectTrigger>
          <SelectContent>
            {allServices.map((service) => (
              <SelectItem key={service} value={service}>{service}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* City Filter */}
      <div>
        <label className="block text-sm font-medium mb-2">City</label>
        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger>
            <SelectValue placeholder="Select city" />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>{city}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Pincode Filter */}
      <div>
        <label className="block text-sm font-medium mb-2">Pincode</label>
        <Input
          type="text"
          placeholder="Enter pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
        />
      </div>

      {/* Budget Range */}
      <div>
        <label className="block text-sm font-medium mb-4">
          Budget Range: ₹{budgetRange[0]} - ₹{budgetRange[1]}/hr
        </label>
        <Slider
          value={budgetRange}
          onValueChange={setBudgetRange}
          min={0}
          max={1000}
          step={50}
          className="w-full"
        />
      </div>

      {/* Verified Only */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="verified"
          checked={showVerifiedOnly}
          onCheckedChange={(checked) => setShowVerifiedOnly(checked as boolean)}
        />
        <label htmlFor="verified" className="text-sm font-medium cursor-pointer">
          Show verified providers only
        </label>
      </div>

      {/* Clear Filters */}
      <Button variant="outline" className="w-full" onClick={clearFilters}>
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <Layout>
      <div className="bg-muted/30 min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-dark text-primary-foreground py-12">
          <div className="container mx-auto px-4">
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">Find Service Providers</h1>
            <p className="text-primary-foreground/80 max-w-2xl">
              Browse through our verified professionals and find the perfect match for your needs
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name or speciality..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-card"
              />
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 h-12 bg-card">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden h-12 gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge className="ml-1 bg-secondary text-secondary-foreground">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Filter Providers</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Desktop Sidebar Filters */}
            <aside className="hidden lg:block">
              <div className="bg-card rounded-xl p-6 shadow-card sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-heading font-semibold text-lg">Filters</h3>
                  {activeFiltersCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
                      Clear
                    </Button>
                  )}
                </div>
                <FilterContent />
              </div>
            </aside>

            {/* Results */}
            <div className="lg:col-span-3">
              {/* Results Count */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{sortedProviders.length}</span> providers
                </p>
                {activeFiltersCount > 0 && (
                  <div className="hidden md:flex gap-2 flex-wrap">
                    {selectedService !== 'All' && (
                      <Badge variant="secondary" className="gap-1">
                        {selectedService}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedService('All')} />
                      </Badge>
                    )}
                    {selectedCity !== 'All Cities' && (
                      <Badge variant="secondary" className="gap-1">
                        {selectedCity}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCity('All Cities')} />
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Provider Cards */}
              <div className="grid sm:grid-cols-2 gap-4">
                {sortedProviders.map((provider, index) => (
                  <motion.div
                    key={provider.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Link
                      to={`/provider/${provider.id}`}
                      className="group block bg-card rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0">
                          {provider.name.split(' ').map(n => n[0]).join('')}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold truncate group-hover:text-primary transition-colors">
                              {provider.name}
                            </h4>
                            {provider.verified && (
                              <Shield className="w-4 h-4 text-success shrink-0" />
                            )}
                          </div>

                          <p className="text-sm text-muted-foreground mb-2">{provider.speciality}</p>

                          <Badge variant="outline" className="mb-3">{provider.service}</Badge>

                          <div className="flex items-center gap-3 mb-3">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-secondary fill-secondary" />
                              <span className="font-semibold text-sm">{provider.rating}</span>
                              <span className="text-muted-foreground text-xs">({provider.reviews})</span>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground text-sm">
                              <MapPin className="w-3 h-3" />
                              {provider.city}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-primary">₹{provider.price}/hr</span>
                            {provider.verified && (
                              <span className="verified-badge">
                                <Shield className="w-3 h-3" />
                                Verified
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {sortedProviders.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold mb-2">No providers found</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your filters or search query</p>
                  <Button onClick={clearFilters}>Clear Filters</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProvidersPage;
