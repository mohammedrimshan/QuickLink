import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Shield, SendHorizonal, Timer } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import otpValidationSchema from "@/validation/otpValidationSchema";
import { useVerifyOTP, useResendOTP } from "@/hooks/auth/useAuth";
import type { IVerifyOtpRequest } from "@/types/UserTypes";
import { toast } from "sonner";

interface OTPVerificationProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: () => void;
  userId: string | null;
  email: string;
}

interface FormData {
  otp: string;
}

const OTPVerification = ({
  isOpen,
  onClose,
  onVerify,
  userId,
  email,
}: OTPVerificationProps) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const verifyOTPMutation = useVerifyOTP();
  const resendOTPMutation = useResendOTP();
  const [_, setIsLoading] = useState(false);

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(otpValidationSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    const otpValue = newOtp.join("");
    setValue("otp", otpValue);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");

    if (pastedData.length <= 6) {
      const newOtp = ["", "", "", "", "", ""];
      pastedData.split("").forEach((char, idx) => {
        if (idx < 6) newOtp[idx] = char;
      });
      setOtp(newOtp);
      setValue("otp", newOtp.join(""));
      inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!userId) {
      toast.error("User ID is missing. Please try registering again.");
      return;
    }
    try {
      await verifyOTPMutation.mutateAsync({
        userId,
        otp: data.otp,
      } as IVerifyOtpRequest);
      toast.success("OTP verified successfully!");
      onVerify();
      onClose();
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("OTP verification failed. Please try again.");
      }
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setIsLoading(true);
    try {
      const response = await resendOTPMutation.mutateAsync({ email });
      if (response?.message) {
        toast.success(response.message);
      } else {
        toast.success("OTP resent successfully!");
      }
      setCountdown(60);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      setValue("otp", "");
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Resend OTP failed. Please try again.");
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <TooltipProvider>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-sm border-0 shadow-xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold text-foreground flex items-center space-x-3">
                <div className="bg-gradient-green/10 p-3  rounded-full">
                  <Shield className="h-6 w-6 text-gradient-green" />
                </div>
                <span>Verify Your Phone</span>
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-6 w-6 rounded-full hover:bg-accent"
              ></Button>
            </div>
            <p className="text-sm text-muted-foreground text-left mt-2">
              We've sent a 6-digit verification code to your phone number
            </p>
          </DialogHeader>

          <div className="space-y-6 pt-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-medium text-foreground text-center block">
                  Enter 6-Digit Code
                </Label>
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className={`w-12 h-12 text-center text-xl font-bold border-border focus:border-primary focus:ring-primary ${
                        errors.otp ? "border-red-500" : ""
                      }`}
                      autoComplete="one-time-code"
                    />
                  ))}
                </div>
                {errors.otp && (
                  <p className="text-red-500 text-xs text-center mt-1">
                    {errors.otp.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={verifyOTPMutation.isPending}
                className="w-full h-12 bg-gradient-green hover:bg-gradient-green-hover text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {verifyOTPMutation.isPending ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  "Verify OTP"
                )}
              </Button>

              <div className="text-sm text-center flex items-center justify-center space-x-1">
                <span className="text-muted-foreground">
                  Didn't receive the code?
                </span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={!canResend || resendOTPMutation.isPending}
                      className={`text-green-600 font-medium disabled:opacity-50 flex items-center transition-all duration-200 ${
                        canResend ? "hover:text-green-700" : ""
                      }`}
                    >
                      Resend
                      <SendHorizonal className="h-4 w-4 ml-1" />
                    </button>
                  </TooltipTrigger>

                  <TooltipContent
                    className="bg-green-100 text-green-800 border-green-200"
                    side="bottom"
                  >
                    {canResend ? (
                      "Click to resend OTP"
                    ) : (
                      <div className="flex items-center">
                        <Timer className="h-4 w-4 mr-1 animate-pulse" />
                        Resend in {formatTime(countdown)}
                      </div>
                    )}
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  The verification code will expire in 10 minutes
                </p>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
};

export default OTPVerification;
