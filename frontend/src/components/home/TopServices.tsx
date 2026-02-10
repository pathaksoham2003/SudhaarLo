import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Wrench, Zap, Droplets, Paintbrush, Hammer, Bug, Truck, Laptop } from 'lucide-react';
import { Button } from '@/components/ui/button';

const services = [
  { icon: Wrench, name: 'Plumbing', description: 'Pipe repairs, leaks, installations', color: 'from-blue-500 to-blue-600' },
  { icon: Zap, name: 'Electrical', description: 'Wiring, fixtures, safety checks', color: 'from-yellow-500 to-orange-500' },
  { icon: Paintbrush, name: 'Painting', description: 'Interior & exterior painting', color: 'from-pink-500 to-rose-500' },
  { icon: Hammer, name: 'Carpentry', description: 'Furniture, repairs, woodwork', color: 'from-amber-600 to-amber-700' },
  { icon: Droplets, name: 'Cleaning', description: 'Deep cleaning, sanitization', color: 'from-cyan-500 to-teal-500' },
  { icon: Bug, name: 'Pest Control', description: 'Safe & effective treatments', color: 'from-green-500 to-emerald-600' },
  { icon: Truck, name: 'Shifting', description: 'Packing & moving services', color: 'from-purple-500 to-violet-600' },
  { icon: Laptop, name: 'IT Services', description: 'Computer & network repairs', color: 'from-slate-600 to-slate-700' },
];

const TopServices = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
            Our Services
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient-primary">Popular Services</span> We Offer
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From home repairs to professional installations, find verified experts for all your needs
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
          {services.map((service, index) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Link
                to={`/providers?service=${service.name.toLowerCase()}`}
                className="group block bg-card rounded-xl p-5 md:p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                  {service.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {service.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Link to="/services">
            <Button variant="outline" size="lg" className="gap-2 group border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              View All Services
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default TopServices;
