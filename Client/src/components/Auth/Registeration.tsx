import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Link as LinkIcon, Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import registerValidationSchema from '@/validation/registerValidationSchema';
import OTPVerification from '../Modal/OtpVerification';
import { useRegister } from '@/hooks/auth/useAuth';
import type { IRegisterRequest } from '@/types/UserTypes';
import { toast } from 'sonner';


interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [userId, setUserId] = useState<string | null>(null); 
  const [registeredEmail, setRegisteredEmail] = useState<string>('');
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(registerValidationSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const registerData: IRegisterRequest = {
        name: data.name,
        email: data.email,
        phoneNumber: data.phone,
        password: data.password,
      };
      const response = await registerMutation.mutateAsync(registerData);
      setIsLoading(false);
      
      toast.success(response.message || 'Registration successful! Please verify OTP sent to your email.');

      setUserId(response?.userId ?? null);
      setRegisteredEmail(data.email); 
      setShowOTPModal(true);
    } catch (error: any) {
      setIsLoading(false);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Registration failed. Please try again.');
      }
    }
  };

  const handleOTPVerification = () => {
    navigate('/');
  };

  const handleCloseOTPModal = () => {
    setShowOTPModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-green-light flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Logo Section */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center space-x-2 group">
            <div className="bg-gradient-green p-3 rounded-lg group-hover:scale-105 transition-transform">
              <LinkIcon className="h-8 w-8 text-white" />
            </div>
            <span className="text-3xl font-bold text-gradient-green">QuickLink</span>
          </Link>
          <p className="text-muted-foreground mt-2">Create your account to get started</p>
        </div>

        {/* Register Card */}
        <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-foreground">Create Account</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Field */}
              <div className="space-y-1">
                <Label htmlFor="name" className="text-sm font-medium text-foreground">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    {...formRegister('name')}
                    className={`pl-10 h-11 border-border focus:border-primary focus:ring-primary ${
                      errors.name ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-1">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...formRegister('email')}
                    className={`pl-10 h-11 border-border focus:border-primary focus:ring-primary ${
                      errors.email ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>

              {/* Phone Field */}
              <div className="space-y-1">
                <Label htmlFor="phone" className="text-sm font-medium text-foreground">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    {...formRegister('phone')}
                    className={`pl-10 h-11 border-border focus:border-primary focus:ring-primary ${
                      errors.phone ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
              </div>

              {/* Password Fields - Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Password Field */}
                <div className="space-y-1">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create password"
                      {...formRegister('password')}
                      className={`pl-10 pr-10 h-11 border-border focus:border-primary focus:ring-primary ${
                        errors.password ? 'border-red-500' : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-1">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      {...formRegister('confirmPassword')}
                      className={`pl-10 pr-10 h-11 border-border focus:border-primary focus:ring-primary ${
                        errors.confirmPassword ? 'border-red-500' : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
                </div>
              </div>

              {/* Register Button */}
              <Button
                type="submit"
                disabled={isLoading || registerMutation.isPending}
                className="w-full h-11 bg-gradient-green hover:bg-gradient-green-hover text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 mt-6"
              >
                {isLoading || registerMutation.isPending ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </Button>

              {/* Login Link */}
              <div className="text-center pt-2">
                <span className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-primary hover:text-primary/80 transition-colors font-medium"
                  >
                    Sign In
                  </Link>
                </span>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-4">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* OTP Verification Modal */}
      <OTPVerification
        isOpen={showOTPModal}
        onClose={handleCloseOTPModal}
        onVerify={handleOTPVerification}
        userId={userId}
        email={registeredEmail} // Pass email from register mutation data
      />
    </div>
  );
};

export default Register;
