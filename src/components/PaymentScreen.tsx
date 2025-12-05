import { useState, useCallback } from "react";
import { ArrowLeft, User, AlertCircle, CheckCircle2, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { appConfig } from "@/config/appConfig";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface PaymentScreenProps {
  onBack?: () => void;
}

const PaymentScreen = ({ onBack }: PaymentScreenProps) => {
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  const { currency, maxAmount, minAmount, dailyLimit } = appConfig.transaction;

  const numericAmount = parseFloat(amount) || 0;
  const isOverLimit = numericAmount > maxAmount;
  const isValidAmount = numericAmount >= minAmount && numericAmount <= maxAmount;

  const handleNumpadPress = useCallback((value: string) => {
    if (value === "clear") {
      setAmount("");
      return;
    }
    if (value === "backspace") {
      setAmount((prev) => prev.slice(0, -1));
      return;
    }
    if (value === "." && amount.includes(".")) return;
    if (amount.length >= 10) return;
    
    setAmount((prev) => prev + value);
  }, [amount]);

  const handlePay = async () => {
    if (!isValidAmount) {
      toast({
        title: "Invalid Amount",
        description: `Amount must be between ${currency}${minAmount} and ${currency}${maxAmount.toLocaleString()}`,
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
      setAmount("");
    }, 3000);
  };

  const quickAmounts = [100, 500, 1000, 2000, 5000];

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="animate-bounce-in">
          <div className="w-24 h-24 rounded-full bg-success flex items-center justify-center mb-6 shadow-lg">
            <CheckCircle2 className="w-12 h-12 text-success-foreground" />
          </div>
        </div>
        <h2 className="text-2xl font-display font-bold text-foreground mb-2 animate-fade-in">
          Payment Successful!
        </h2>
        <p className="text-muted-foreground animate-fade-in">
          {currency}{numericAmount.toLocaleString()} sent successfully
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold text-foreground">Send Money</h1>
      </header>

      {/* Recipient Card */}
      <div className="px-6 mb-6 animate-slide-up">
        <div className="bg-card rounded-2xl p-4 shadow-md flex items-center gap-4">
          <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
            <User className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-foreground">John Doe</p>
            <p className="text-sm text-muted-foreground">+91 98765 43210</p>
          </div>
        </div>
      </div>

      {/* Amount Display */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 animate-fade-in">
        <div className="text-center mb-4">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-3xl font-semibold text-muted-foreground">{currency}</span>
            <span className={cn(
              "text-6xl font-display font-bold transition-colors",
              isOverLimit ? "text-destructive animate-shake" : "text-foreground"
            )}>
              {amount || "0"}
            </span>
          </div>
          
          {/* Transaction Limit Info */}
          <div className={cn(
            "mt-4 flex items-center justify-center gap-2 text-sm transition-colors",
            isOverLimit ? "text-destructive" : "text-muted-foreground"
          )}>
            {isOverLimit ? (
              <>
                <AlertCircle className="w-4 h-4" />
                <span>Exceeds limit of {currency}{maxAmount.toLocaleString()}</span>
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4" />
                <span>Max: {currency}{maxAmount.toLocaleString()} per transaction</span>
              </>
            )}
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <div className="flex gap-2 flex-wrap justify-center mb-8">
          {quickAmounts.map((quickAmount) => (
            <Button
              key={quickAmount}
              variant="secondary"
              size="sm"
              onClick={() => setAmount(quickAmount.toString())}
              className="rounded-full px-4"
            >
              {currency}{quickAmount.toLocaleString()}
            </Button>
          ))}
        </div>
      </div>

      {/* Numpad */}
      <div className="bg-card rounded-t-3xl shadow-xl p-6 animate-slide-up">
        <div className="grid grid-cols-3 gap-3 mb-4">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "backspace"].map((key) => (
            <Button
              key={key}
              variant="numpad"
              size="numpad"
              onClick={() => handleNumpadPress(key)}
              className="mx-auto"
            >
              {key === "backspace" ? "⌫" : key}
            </Button>
          ))}
        </div>

        {/* Pay Button */}
        <Button
          variant="pay"
          size="xl"
          className="w-full relative overflow-hidden"
          onClick={handlePay}
          disabled={!isValidAmount || isProcessing}
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            `Pay ${currency}${numericAmount.toLocaleString() || "0"}`
          )}
        </Button>
      </div>
    </div>
  );
};

export default PaymentScreen;
