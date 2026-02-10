import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, ArrowRight, User, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import logoFull from '@/assets/logo-full.png';
import logoIcon from '@/assets/logo-icon.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'customer' | 'provider' | null>(null);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        const nextInput = document.getElementById(`login-otp-${index + 1}`);
        nextInput?.focus();
      }
      if (newOtp.every(d => d !== '')) {
        setOtpVerified(true);
      }
    }
  };

  const handleSendOtp = () => {
    setOtpSent(true);
  };

  const handleLogin = () => {
    if (selectedRole === 'customer') {
      navigate('/customer/bookings');
    } else {
      navigate('/provider/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex">
      {/* Left Side - Branding (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary-dark p-12 flex-col justify-between text-primary-foreground">
        <img src={logoFull} alt="SudharLo" className="h-12 brightness-0 invert" />
        
        <div className="space-y-8">
          <div>
            <h1 className="font-heading text-4xl xl:text-5xl font-bold leading-tight mb-4">
              An Expert for <span className="text-secondary">Every Fix!</span>
            </h1>
            <p className="text-primary-foreground/80 text-lg">
              Connect with verified professionals for all your home and business needs.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '10K+', label: 'Happy Customers' },
              { value: '5K+', label: 'Verified Providers' },
              { value: '50+', label: 'Service Categories' },
              { value: '4.8', label: 'Average Rating' },
            ].map((stat) => (
              <div key={stat.label} className="bg-primary-foreground/10 rounded-xl p-4">
                <p className="font-heading text-2xl font-bold text-secondary">{stat.value}</p>
                <p className="text-sm text-primary-foreground/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-primary-foreground/60 text-sm">
          © 2025 SudharLo. All rights reserved.
        </p>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <img src={logoFull} alt="SudharLo" className="h-10 mx-auto" />
          </div>

          <Card className="shadow-card-hover">
            <CardContent className="p-6 md:p-8">
              {!otpVerified ? (
                <>
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Phone className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="font-heading text-2xl font-bold mb-2">Welcome Back!</h2>
                    <p className="text-muted-foreground">Enter your phone number to login</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number</label>
                      <div className="flex gap-2">
                        <div className="w-16 flex items-center justify-center bg-muted rounded-lg text-sm font-medium">
                          +91
                        </div>
                        <Input
                          type="tel"
                          placeholder="Enter phone number"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="flex-1"
                          maxLength={10}
                        />
                      </div>
                    </div>

                    {!otpSent ? (
                      <Button 
                        className="w-full bg-gradient-accent" 
                        onClick={handleSendOtp}
                        disabled={phoneNumber.length !== 10}
                      >
                        Send OTP
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <div className="space-y-4">
                        <label className="block text-sm font-medium">Enter OTP</label>
                        <div className="flex justify-center gap-2">
                          {otp.map((digit, index) => (
                            <Input
                              key={index}
                              id={`login-otp-${index}`}
                              type="text"
                              value={digit}
                              onChange={(e) => handleOtpChange(index, e.target.value)}
                              className="w-12 h-12 text-center text-lg font-bold"
                              maxLength={1}
                            />
                          ))}
                        </div>
                        <p className="text-center text-sm text-muted-foreground">
                          Didn't receive? <button className="text-primary font-medium">Resend OTP</button>
                        </p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                      <img src={logoIcon} alt="" className="w-10 h-10" />
                    </div>
                    <h2 className="font-heading text-2xl font-bold mb-2">Select Your Role</h2>
                    <p className="text-muted-foreground">How would you like to continue?</p>
                  </div>

                  <div className="grid gap-4 mb-6">
                    <button
                      onClick={() => setSelectedRole('customer')}
                      className={`p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${
                        selectedRole === 'customer'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        selectedRole === 'customer' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Customer</h3>
                        <p className="text-sm text-muted-foreground">Book services</p>
                      </div>
                    </button>

                    <button
                      onClick={() => setSelectedRole('provider')}
                      className={`p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${
                        selectedRole === 'provider'
                          ? 'border-secondary bg-secondary/5'
                          : 'border-border hover:border-secondary/50'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        selectedRole === 'provider' ? 'bg-secondary text-secondary-foreground' : 'bg-muted'
                      }`}>
                        <Building className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Service Provider</h3>
                        <p className="text-sm text-muted-foreground">Manage services</p>
                      </div>
                    </button>
                  </div>

                  <Button 
                    className="w-full bg-gradient-accent" 
                    onClick={handleLogin}
                    disabled={!selectedRole}
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </>
              )}

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link to="/onboarding" className="text-primary font-medium hover:underline">
                    Register now
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
