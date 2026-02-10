import { motion } from 'framer-motion';
import { Check, Crown, Zap, Star, AlertCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 499,
    duration: '1 Month',
    icon: Zap,
    features: [
      'List up to 3 services',
      'Appear in search results',
      'Basic profile badge',
      'Email support',
    ],
    popular: false,
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 999,
    duration: '3 Months',
    icon: Star,
    features: [
      'List up to 10 services',
      'Priority in search results',
      'Verified Pro badge',
      'Featured in top providers',
      'Priority support',
      'Analytics dashboard',
    ],
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 1999,
    duration: '6 Months',
    icon: Crown,
    features: [
      'Unlimited services',
      'Top search placement',
      'Premium verified badge',
      'Featured on homepage',
      '24/7 priority support',
      'Advanced analytics',
      'Promotional banners',
      'Custom profile URL',
    ],
    popular: false,
  },
];

const SubscriptionPage = () => {
  const { toast } = useToast();
  const currentPlan = 'pro';
  const daysLeft = 15;

  const handleSubscribe = (planId: string) => {
    toast({
      title: "Redirecting to Payment",
      description: "You'll be redirected to the payment gateway.",
    });
  };

  return (
    <Layout>
      <div className="bg-muted/30 min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-dark text-primary-foreground py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-2">Subscription Plans</h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              Choose a plan that works best for your business and grow with SudharLo
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Current Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-secondary/10 to-secondary/5 border-secondary/20">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                      <Star className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Current Plan</p>
                      <p className="font-heading text-xl font-bold">Professional</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-secondary">{daysLeft}</p>
                      <p className="text-sm text-muted-foreground">Days Left</p>
                    </div>
                    {daysLeft <= 7 && (
                      <Badge className="bg-warning/20 text-warning border-warning/30 gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Expiring Soon
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`h-full relative ${
                  plan.popular ? 'border-secondary shadow-card-hover' : ''
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-secondary text-secondary-foreground">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <div className={`w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center ${
                        plan.popular 
                          ? 'bg-gradient-accent' 
                          : 'bg-primary/10'
                      }`}>
                        <plan.icon className={`w-7 h-7 ${
                          plan.popular ? 'text-white' : 'text-primary'
                        }`} />
                      </div>
                      <h3 className="font-heading text-xl font-bold mb-1">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground">{plan.duration}</p>
                    </div>

                    <div className="text-center mb-6">
                      <span className="text-4xl font-bold">₹{plan.price}</span>
                      <span className="text-muted-foreground">/{plan.duration.toLowerCase()}</span>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-gradient-accent hover:opacity-90' 
                          : ''
                      }`}
                      variant={plan.popular ? 'default' : 'outline'}
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={plan.id === currentPlan}
                    >
                      {plan.id === currentPlan ? 'Current Plan' : 'Subscribe Now'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <h2 className="font-heading text-2xl font-bold text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="max-w-2xl mx-auto space-y-4">
              {[
                {
                  q: 'Can I upgrade my plan anytime?',
                  a: 'Yes, you can upgrade your plan at any time. The remaining balance from your current plan will be adjusted.',
                },
                {
                  q: 'What happens when my subscription expires?',
                  a: 'Your profile will be hidden from search results. Existing customers can still reach you, but new visibility will be paused.',
                },
                {
                  q: 'Is there a refund policy?',
                  a: 'We offer a 7-day money-back guarantee if you are not satisfied with our service.',
                },
              ].map((faq) => (
                <Card key={faq.q}>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">{faq.q}</h4>
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default SubscriptionPage;
