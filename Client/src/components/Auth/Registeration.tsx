import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  Camera,
  Upload,
  X,
  Image as ImageIcon,
  Link as LinkIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import registerValidationSchema from "@/validation/registerValidationSchema";
import OTPVerification from "../Modal/OtpVerification";
import { useRegister } from "@/hooks/auth/useAuth";
import type { IRegisterRequest } from "@/types/UserTypes";
import { toast } from "sonner";

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
  const [registeredEmail, setRegisteredEmail] = useState<string>("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | undefined>(undefined);
  const [dragActive, setDragActive] = useState(false);

  // Add custom CSS for animation delays
  const animationStyles = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .animate-fadeInUp {
      animation: fadeInUp 0.3s ease-out;
    }
    
    .animation-delay-300 {
      animation-delay: 300ms;
    }
    
    .animate-pulse-slow {
      animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
  `;

  const navigate = useNavigate();
  const registerMutation = useRegister();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(registerValidationSchema),
    mode: "onChange",
  });

  const handlePhotoChange = (file: File) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handlePhotoChange(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePhotoChange(e.dataTransfer.files[0]);
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoBase64(undefined);
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const registerData: IRegisterRequest = {
        name: data.name,
        email: data.email,
        phoneNumber: data.phone,
        password: data.password,
        photoBase64,
      };
      const response = await registerMutation.mutateAsync(registerData);
      setIsLoading(false);

      toast.success(
        response.message ||
          "Registration successful! Please verify OTP sent to your email."
      );

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
        toast.error("Registration failed. Please try again.");
      }
    }
  };

  const handleOTPVerification = () => {
    navigate("/");
  };

  const handleCloseOTPModal = () => {
    setShowOTPModal(false);
  };

  return (
    <>
      <style>{animationStyles}</style>
      <div className="min-h-screen bg-gradient-green-light flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-6xl">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 group">
              <div className="bg-gradient-green p-3 rounded-lg group-hover:scale-105 transition-transform">
                <LinkIcon className="h-8 w-8 text-white" />
              </div>
              <span className="text-3xl font-bold text-gradient-green">
                QuickLink
              </span>
            </Link>
            <p className="text-muted-foreground mt-2">
              Create your account to get started
            </p>
          </div>

          {/* Main Card with Side-by-Side Layout */}
          <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur-sm animate-fadeInUp overflow-hidden">
            <div className="grid lg:grid-cols-2 min-h-[600px]">
              {/* Left Side - Form */}
              <div className="p-8 lg:p-12">
                <CardHeader className="text-center pb-6 px-0">
                  <CardTitle className="text-3xl font-bold text-foreground">
                    Create Account
                  </CardTitle>
                  <p className="text-muted-foreground mt-2">Fill in your details below</p>
                </CardHeader>
                <CardContent className="px-0">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Name Field */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="name"
                        className="text-sm font-medium text-foreground"
                      >
                        Full Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          {...formRegister("name")}
                          className={`pl-10 h-12 border-border focus:border-primary focus:ring-primary ${
                            errors.name ? "border-red-500" : ""
                          }`}
                        />
                        {errors.name && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.name.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-sm font-medium text-foreground"
                      >
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          {...formRegister("email")}
                          className={`pl-10 h-12 border-border focus:border-primary focus:ring-primary ${
                            errors.email ? "border-red-500" : ""
                          }`}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Phone Field */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="text-sm font-medium text-foreground"
                      >
                        Phone Number
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          {...formRegister("phone")}
                          className={`pl-10 h-12 border-border focus:border-primary focus:ring-primary ${
                            errors.phone ? "border-red-500" : ""
                          }`}
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.phone.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Password Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Password Field */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="password"
                          className="text-sm font-medium text-foreground"
                        >
                          Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create password"
                            {...formRegister("password")}
                            className={`pl-10 pr-10 h-12 border-border focus:border-primary focus:ring-primary ${
                              errors.password ? "border-red-500" : ""
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.password.message}
                          </p>
                        )}
                      </div>

                      {/* Confirm Password Field */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="confirmPassword"
                          className="text-sm font-medium text-foreground"
                        >
                          Confirm Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm password"
                            {...formRegister("confirmPassword")}
                            className={`pl-10 pr-10 h-12 border-border focus:border-primary focus:ring-primary ${
                              errors.confirmPassword ? "border-red-500" : ""
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.confirmPassword.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Register Button */}
                    <Button
                      type="submit"
                      disabled={isLoading || registerMutation.isPending}
                      className="w-full h-12 bg-gradient-green hover:bg-gradient-green-hover text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 mt-8"
                    >
                      {isLoading || registerMutation.isPending ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Creating Account...
                        </div>
                      ) : (
                        "Create Account"
                      )}
                    </Button>

                    {/* Login Link */}
                    <div className="text-center pt-4">
                      <span className="text-sm text-muted-foreground">
                        Already have an account?{" "}
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
              </div>

              {/* Right Side - Image Upload */}
              <div className="bg-gradient-green-light p-8 lg:p-12 flex flex-col justify-center">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      Profile Photo
                    </h3>
                    <p className="text-muted-foreground">
                      Upload your profile picture to personalize your account
                    </p>
                  </div>

                  {/* Profile Photo Upload Section */}
                  <div className="relative">
                    {!photoBase64 ? (
                      <div
                        className={`group relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer bg-gradient-to-br from-slate-50/50 to-white/50 hover:from-primary/5 hover:to-primary/10 ${
                          dragActive
                            ? "border-primary bg-gradient-to-br from-primary/10 to-primary/5 scale-[1.02] shadow-lg"
                            : "border-slate-300 hover:border-primary/60"
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() =>
                          document.getElementById("photo-upload")?.click()
                        }
                      >
                        {/* Animated Background Pattern */}
                        <div className="absolute inset-0 opacity-5">
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] animate-pulse"></div>
                        </div>

                        <div className="relative p-12 text-center">
                          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center">
                            <div
                              className={`relative rounded-full p-5 transition-all duration-300 group-hover:scale-110 ${
                                dragActive
                                  ? "bg-primary text-white shadow-lg"
                                  : "bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 group-hover:from-primary/20 group-hover:to-primary/30 group-hover:text-primary"
                              }`}
                            >
                              <Upload
                                className={`h-8 w-8 transition-all duration-300 ${
                                  dragActive ? "animate-bounce" : ""
                                }`}
                              />
                              {/* Floating animation dots */}
                              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary animate-ping opacity-75"></div>
                              <div className="absolute -bottom-1 -left-1 h-2 w-2 rounded-full bg-primary/60 animate-ping animation-delay-300"></div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <p className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                              {dragActive ? "Drop it right here!" : "Upload your photo"}
                            </p>
                            <p className="text-muted-foreground">
                              Drag & drop or{" "}
                              <span className="font-medium text-primary underline decoration-2 underline-offset-2">
                                click to browse
                              </span>
                            </p>
                            <div className="flex items-center justify-center gap-6 pt-3">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <ImageIcon className="h-4 w-4" />
                                PNG, JPG, JPEG
                              </div>
                              <div className="h-1 w-1 rounded-full bg-muted-foreground/30"></div>
                              <div className="text-sm text-muted-foreground">Max 5MB</div>
                            </div>
                          </div>
                        </div>

                        <input
                          id="photo-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleFileInputChange}
                          className="hidden"
                        />
                      </div>
                    ) : (
                      <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
                        {/* Preview Container */}
                        <div className="p-8">
                          <div className="flex flex-col items-center space-y-6">
                            {/* Image Preview */}
                            <div className="relative">
                              <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-xl ring-4 ring-slate-100 transition-all duration-300 group-hover:ring-primary/20 group-hover:scale-105">
                                <img
                                  src={photoBase64}
                                  alt="Profile preview"
                                  className="h-full w-full object-cover transition-all duration-300 group-hover:scale-110"
                                />
                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/20"></div>
                              </div>

                              {/* Success checkmark */}
                              <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white shadow-lg">
                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                            </div>

                            {/* File Info */}
                            <div className="text-center space-y-2">
                              <p className="text-lg font-semibold text-foreground truncate max-w-[250px]">
                                {photoFile?.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {photoFile &&
                                  (photoFile.size / 1024 / 1024).toFixed(2)}{" "}
                                MB • Ready to upload
                              </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                  document.getElementById("photo-upload-change")?.click()
                                }
                                className="px-6 py-2 text-sm font-medium transition-all duration-200 hover:bg-primary hover:text-white hover:border-primary"
                              >
                                <Camera className="h-4 w-4 mr-2" />
                                Change
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={removePhoto}
                                className="px-6 py-2 text-sm font-medium text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
                              >
                                <X className="h-4 w-4 mr-2" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Hidden file input for change */}
                        <input
                          id="photo-upload-change"
                          type="file"
                          accept="image/*"
                          onChange={handleFileInputChange}
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>

                  {/* Optional: Additional info */}
                  <div className="text-center text-sm text-muted-foreground bg-white/50 rounded-lg p-4">
                    <p className="font-medium mb-1">Tips for a great profile photo:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Use a clear, well-lit photo</li>
                      <li>• Face should be clearly visible</li>
                      <li>• Square format works best</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <Link
              to="/"
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
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
          email={registeredEmail}
        />
      </div>
    </>
  );
};

export default Register;