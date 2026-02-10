import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ArrowRight, Phone, Shield, FileText, 
  Upload, Check, User, Building, Camera, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import logoFull from '@/assets/logo-full.png';

const steps = [
  { id: 1, title: 'User Type', icon: User },
  { id: 2, title: 'Phone Verification', icon: Phone },
  { id: 3, title: 'Identity Details', icon: Shield },
  { id: 4, title: 'Document Upload', icon: Upload },
  { id: 5, title: 'Terms & Conditions', icon: FileText },
];

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProvider, setIsProvider] = useState<boolean | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [aadharNumber, setAadharNumber] = useState('');
  const [aadharName, setAadharName] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleSendOtp = () => {
    setOtpSent(true);
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
    else navigate('/login');
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="font-heading text-2xl font-bold mb-2">Welcome to SudharLo!</h2>
              <p className="text-muted-foreground">How would you like to use our platform?</p>
            </div>

            <div className="grid gap-4">
              <button
                onClick={() => setIsProvider(false)}
                className={`p-6 rounded-xl border-2 text-left transition-all ${
                  isProvider === false 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isProvider === false ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">I'm looking for services</h3>
                    <p className="text-sm text-muted-foreground">
                      Find and book verified service providers for your needs
                    </p>
                  </div>
                  {isProvider === false && (
                    <Check className="w-6 h-6 text-primary ml-auto" />
                  )}
                </div>
              </button>

              <button
                onClick={() => setIsProvider(true)}
                className={`p-6 rounded-xl border-2 text-left transition-all ${
                  isProvider === true 
                    ? 'border-secondary bg-secondary/5' 
                    : 'border-border hover:border-secondary/50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isProvider === true ? 'bg-secondary text-secondary-foreground' : 'bg-muted'
                  }`}>
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">I'm a service provider</h3>
                    <p className="text-sm text-muted-foreground">
                      List your services and grow your business with us
                    </p>
                  </div>
                  {isProvider === true && (
                    <Check className="w-6 h-6 text-secondary ml-auto" />
                  )}
                </div>
              </button>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="font-heading text-2xl font-bold mb-2">Verify Your Phone</h2>
              <p className="text-muted-foreground">We'll send you a one-time password</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <div className="flex gap-2">
                  <div className="w-20 flex items-center justify-center bg-muted rounded-lg text-sm font-medium">
                    +91
                  </div>
                  <Input
                    type="tel"
                    placeholder="Enter your phone number"
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
                </Button>
              ) : (
                <div className="space-y-4">
                  <label className="block text-sm font-medium">Enter OTP</label>
                  <div className="flex justify-center gap-2">
                    {otp.map((digit, index) => (
                      <Input
                        key={index}
                        id={`otp-${index}`}
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
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="font-heading text-2xl font-bold mb-2">Identity Verification</h2>
              <p className="text-muted-foreground">Enter your Aadhar and PAN details</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name (as per Aadhar)</label>
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  value={aadharName}
                  onChange={(e) => setAadharName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Aadhar Number</label>
                <Input
                  type="text"
                  placeholder="XXXX XXXX XXXX"
                  value={aadharNumber}
                  onChange={(e) => setAadharNumber(e.target.value)}
                  maxLength={14}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">PAN Number</label>
                <Input
                  type="text"
                  placeholder="ABCDE1234F"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  maxLength={10}
                />
              </div>

              <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                <p className="text-sm text-warning-foreground">
                  The name entered must exactly match the name on your Aadhar card for successful verification.
                </p>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="font-heading text-2xl font-bold mb-2">Upload Documents</h2>
              <p className="text-muted-foreground">Upload clear scans of your documents</p>
            </div>

            <div className="space-y-4">
              {/* Aadhar Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Aadhar Card (Front & Back)</label>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Camera className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-medium mb-1">Click to upload</p>
                  <p className="text-sm text-muted-foreground">PNG, JPG up to 5MB</p>
                </div>
              </div>

              {/* PAN Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">PAN Card</label>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Camera className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-medium mb-1">Click to upload</p>
                  <p className="text-sm text-muted-foreground">PNG, JPG up to 5MB</p>
                </div>
              </div>

              {/* Instructions */}
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2">Scanning Tips:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Ensure the entire document is visible</li>
                    <li>• Use good lighting to avoid shadows</li>
                    <li>• Make sure text is clearly readable</li>
                    <li>• Avoid glare or reflections</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="font-heading text-2xl font-bold mb-2">Terms & Conditions</h2>
              <p className="text-muted-foreground">Please review and accept our terms</p>
            </div>

            <div className="bg-muted/50 rounded-xl p-4 h-64 overflow-y-auto text-sm text-muted-foreground">
              <h4 className="font-semibold text-foreground mb-2">Terms of Service</h4>
              <p className="mb-4">
                Welcome to SudharLo! These terms and conditions outline the rules and regulations 
                for the use of SudharLo's platform.
              </p>
              <p className="mb-4">
                By accessing this platform, we assume you accept these terms and conditions. 
                Do not continue to use SudharLo if you do not agree to all of the terms and 
                conditions stated on this page.
              </p>
              <h4 className="font-semibold text-foreground mb-2">Privacy Policy</h4>
              <p className="mb-4">
                Your privacy is important to us. We collect and use your personal information 
                only to provide and improve our services. We will not share your information 
                with third parties without your consent.
              </p>
              <h4 className="font-semibold text-foreground mb-2">Service Provider Agreement</h4>
              <p>
                As a service provider, you agree to provide accurate information about your 
                services, maintain professional conduct with customers, and comply with all 
                applicable laws and regulations.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              />
              <label htmlFor="terms" className="text-sm cursor-pointer">
                I have read and agree to the <span className="text-primary font-medium">Terms of Service</span> and{' '}
                <span className="text-primary font-medium">Privacy Policy</span>
              </label>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return isProvider !== null;
      case 2: return otp.every(d => d !== '');
      case 3: return aadharName && aadharNumber && panNumber;
      case 4: return true;
      case 5: return termsAccepted;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      {/* Header */}
      <header className="p-4">
        <img src={logoFull} alt="SudharLo" className="h-10" />
      </header>

      {/* Progress Bar */}
      <div className="px-4 mb-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-muted rounded-full">
              <div 
                className="h-full bg-gradient-accent rounded-full transition-all duration-300"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              />
            </div>
            {steps.map((step) => (
              <div key={step.id} className="relative z-10 flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  step.id <= currentStep 
                    ? 'bg-gradient-accent text-white' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {step.id < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span className={`hidden sm:block text-xs mt-2 font-medium ${
                  step.id <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 pb-8">
        <Card className="w-full max-w-md shadow-card-hover">
          <CardContent className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex gap-3 mt-8">
              {currentStep > 1 && (
                <Button variant="outline" onClick={prevStep} className="flex-1 gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              )}
              <Button 
                onClick={nextStep} 
                disabled={!canProceed()}
                className="flex-1 bg-gradient-accent gap-2"
              >
                {currentStep === 5 ? 'Complete' : 'Continue'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingPage;
