import { motion } from 'framer-motion';
import { Star, Shield, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const categories = [
  {
    title: 'Plumbing',
    providers: [
      { id: 1, name: 'Rajesh Kumar', rating: 4.9, reviews: 156, city: 'Mumbai', verified: true, speciality: 'Pipe Fitting Expert', price: '₹500/hr' },
      { id: 2, name: 'Suresh Patel', rating: 4.8, reviews: 134, city: 'Pune', verified: true, speciality: 'Leak Detection', price: '₹450/hr' },
      { id: 3, name: 'Anil Sharma', rating: 4.7, reviews: 98, city: 'Delhi', verified: true, speciality: 'Emergency Repairs', price: '₹550/hr' },
    ],
  },
  {
    title: 'Electrical',
    providers: [
      { id: 4, name: 'Vikram Singh', rating: 4.9, reviews: 203, city: 'Bangalore', verified: true, speciality: 'Wiring Expert', price: '₹600/hr' },
      { id: 5, name: 'Manoj Verma', rating: 4.8, reviews: 178, city: 'Chennai', verified: true, speciality: 'Smart Home Setup', price: '₹700/hr' },
      { id: 6, name: 'Pradeep Rao', rating: 4.7, reviews: 145, city: 'Hyderabad', verified: true, speciality: 'Industrial Work', price: '₹650/hr' },
    ],
  },
  {
    title: 'Carpentry',
    providers: [
      { id: 7, name: 'Gopal Das', rating: 4.9, reviews: 187, city: 'Kolkata', verified: true, speciality: 'Custom Furniture', price: '₹800/hr' },
      { id: 8, name: 'Ramesh Yadav', rating: 4.8, reviews: 156, city: 'Ahmedabad', verified: true, speciality: 'Kitchen Cabinets', price: '₹750/hr' },
      { id: 9, name: 'Harish Joshi', rating: 4.7, reviews: 123, city: 'Jaipur', verified: true, speciality: 'Wood Restoration', price: '₹700/hr' },
    ],
  },
];

const TopProviders = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Top Rated
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Best Reviewed <span className="text-gradient-accent">Service Providers</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Trusted professionals with exceptional ratings from thousands of satisfied customers
          </p>
        </motion.div>

        {/* Categories */}
        <div className="space-y-12">
          {categories.map((category, categoryIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading text-xl md:text-2xl font-semibold">{category.title}</h3>
                <Link to={`/providers?category=${category.title.toLowerCase()}`}>
                  <Button variant="ghost" size="sm" className="text-primary">
                    View All
                  </Button>
                </Link>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {category.providers.map((provider, index) => (
                  <motion.div
                    key={provider.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Link
                      to={`/provider/${provider.id}`}
                      className="group block bg-card rounded-xl p-5 shadow-card hover:shadow-card-hover transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
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
                            <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                              {provider.price}
                            </Badge>
                            <span className="verified-badge">
                              <Shield className="w-3 h-3" />
                              Verified
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopProviders;
