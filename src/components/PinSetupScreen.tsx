import { useState, useCallback, useEffect } from "react";
import { ArrowLeft, Lock, CheckCircle2, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { appConfig } from "@/config/appConfig";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface PinSetupScreenProps {
  onBack?: () => void;
}

type SetupStep = "enter" | "confirm" | "success";

const PinSetupScreen = ({ onBack }: PinSetupScreenProps) => {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [step, setStep] = useState<SetupStep>("enter");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const { length: pinLength } = appConfig.pin;

  const currentPin = step === "enter" ? pin : confirmPin;
  const setCurrentPin = step === "enter" ? setPin : setConfirmPin;

  useEffect(() => {
    if (step === "enter" && pin.length === pinLength) {
      setTimeout(() => {
        setStep("confirm");
      }, 300);
    }
    
    if (step === "confirm" && confirmPin.length === pinLength) {
      setTimeout(() => {
        if (confirmPin === pin) {
          setStep("success");
          toast({
            title: "PIN Set Successfully",
            description: "Your ATM PIN has been updated",
          });
        } else {
          setError("PINs don't match. Try again.");
          setConfirmPin("");
          setTimeout(() => setError(""), 2000);
        }
      }, 300);
    }
  }, [pin, confirmPin, pinLength, step, toast]);

  const handleNumpadPress = useCallback((value: string) => {
    if (step === "success") return;
    
    if (value === "clear") {
      setCurrentPin("");
      setError("");
      return;
    }
    if (value === "backspace") {
      setCurrentPin((prev) => prev.slice(0, -1));
      setError("");
      return;
    }
    if (currentPin.length >= pinLength) return;
    
    setCurrentPin((prev) => prev + value);
  }, [currentPin.length, pinLength, setCurrentPin, step]);

  const handleReset = () => {
    setPin("");
    setConfirmPin("");
    setStep("enter");
    setError("");
  };

  if (step === "success") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="animate-bounce-in">
          <div className="w-24 h-24 rounded-full bg-success flex items-center justify-center mb-6 shadow-lg">
            <ShieldCheck className="w-12 h-12 text-success-foreground" />
          </div>
        </div>
        <h2 className="text-2xl font-display font-bold text-foreground mb-2 animate-fade-in">
          PIN Set Successfully!
        </h2>
        <p className="text-muted-foreground animate-fade-in text-center mb-8">
          Your {pinLength}-digit ATM PIN is now active
        </p>
        <Button variant="pay" size="lg" onClick={onBack} className="animate-fade-in">
          Done
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={step === "confirm" ? handleReset : onBack} 
          className="rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold text-foreground">Set ATM PIN</h1>
      </header>

      {/* Progress Indicator */}
      <div className="px-6 mb-8">
        <div className="flex items-center justify-center gap-2">
          <div className={cn(
            "w-3 h-3 rounded-full transition-colors",
            step === "enter" ? "bg-primary" : "bg-primary/30"
          )} />
          <div className={cn(
            "w-12 h-0.5 transition-colors",
            step === "confirm" ? "bg-primary" : "bg-border"
          )} />
          <div className={cn(
            "w-3 h-3 rounded-full transition-colors",
            step === "confirm" ? "bg-primary" : "bg-border"
          )} />
        </div>
      </div>

      {/* Lock Icon & Title */}
      <div className="flex-1 flex flex-col items-center px-6 animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mb-6 shadow-md">
          <Lock className="w-10 h-10 text-primary" />
        </div>
        
        <h2 className="text-2xl font-display font-bold text-foreground mb-2 text-center">
          {step === "enter" ? "Create Your PIN" : "Confirm Your PIN"}
        </h2>
        <p className="text-muted-foreground text-center mb-8">
          {step === "enter" 
            ? `Enter a ${pinLength}-digit PIN for your ATM transactions`
            : "Re-enter your PIN to confirm"
          }
        </p>

        {/* PIN Dots */}
        <div className="flex gap-4 mb-4">
          {Array.from({ length: pinLength }).map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-4 h-4 rounded-full transition-all duration-200",
                index < currentPin.length
                  ? "bg-primary scale-110"
                  : "bg-border",
                error && "animate-shake bg-destructive"
              )}
            />
          ))}
        </div>

        {/* Show/Hide PIN Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowPin(!showPin)}
          className="text-muted-foreground mb-4"
        >
          {showPin ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
          {showPin ? "Hide" : "Show"} PIN
        </Button>

        {/* Visible PIN Display */}
        {showPin && currentPin && (
          <div className="text-2xl font-mono font-bold text-foreground mb-4 tracking-widest">
            {currentPin}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <p className="text-destructive text-sm font-medium animate-fade-in">
            {error}
          </p>
        )}

        {/* PIN Length Info */}
        <div className="mt-auto mb-6 text-center">
          <p className="text-xs text-muted-foreground">
            PIN Length: {pinLength} digits (configurable)
          </p>
        </div>
      </div>

      {/* Numpad */}
      <div className="bg-card rounded-t-3xl shadow-xl p-6 animate-slide-up">
        <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "clear", "0", "backspace"].map((key) => (
            <Button
              key={key}
              variant="pin"
              size="pin"
              onClick={() => handleNumpadPress(key)}
              className="mx-auto"
            >
              {key === "backspace" ? "⌫" : key === "clear" ? "C" : key}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PinSetupScreen;
