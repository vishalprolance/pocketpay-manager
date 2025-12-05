import { useState } from "react";
import { CreditCard, Lock, ArrowRight, Wallet, Shield, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { appConfig } from "@/config/appConfig";
import PaymentScreen from "@/components/PaymentScreen";
import PinSetupScreen from "@/components/PinSetupScreen";
import { cn } from "@/lib/utils";

type Screen = "home" | "payment" | "pin";

const Index = () => {
  const [activeScreen, setActiveScreen] = useState<Screen>("home");

  if (activeScreen === "payment") {
    return <PaymentScreen onBack={() => setActiveScreen("home")} />;
  }

  if (activeScreen === "pin") {
    return <PinSetupScreen onBack={() => setActiveScreen("home")} />;
  }

  const { currency, maxAmount, dailyLimit } = appConfig.transaction;
  const { length: pinLength } = appConfig.pin;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-hero p-6 pb-24 rounded-b-[3rem]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-primary-foreground/80 text-sm">Welcome back</p>
            <h1 className="text-2xl font-display font-bold text-primary-foreground">PaySecure</h1>
          </div>
          <Button variant="ghost" size="icon" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 rounded-full">
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        {/* Balance Card */}
        <div className="bg-card/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Available Balance</p>
                <p className="text-2xl font-display font-bold text-foreground">{currency}25,000</p>
              </div>
            </div>
            <Shield className="w-8 h-8 text-success" />
          </div>
          
          {/* Config Info Pills */}
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-accent rounded-full text-xs font-medium text-accent-foreground">
              Limit: {currency}{maxAmount.toLocaleString()}/txn
            </span>
            <span className="px-3 py-1 bg-accent rounded-full text-xs font-medium text-accent-foreground">
              Daily: {currency}{dailyLimit.toLocaleString()}
            </span>
            <span className="px-3 py-1 bg-accent rounded-full text-xs font-medium text-accent-foreground">
              PIN: {pinLength}-digit
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 -mt-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <ActionCard
            icon={<CreditCard className="w-6 h-6" />}
            title="Send Money"
            description="Fast & secure transfers"
            onClick={() => setActiveScreen("payment")}
            delay={0}
          />
          <ActionCard
            icon={<Lock className="w-6 h-6" />}
            title="Set ATM PIN"
            description={`${pinLength}-digit secure PIN`}
            onClick={() => setActiveScreen("pin")}
            delay={100}
          />
        </div>

        {/* Config Information Card */}
        <div className="bg-card rounded-2xl p-5 shadow-md animate-fade-in">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Settings className="w-4 h-4 text-primary" />
            Current Configuration
          </h3>
          
          <div className="space-y-3">
            <ConfigItem 
              label="Transaction Limit" 
              value={`${currency}${maxAmount.toLocaleString()}`}
              hint="Per transaction"
            />
            <ConfigItem 
              label="Daily Limit" 
              value={`${currency}${dailyLimit.toLocaleString()}`}
              hint="Per day"
            />
            <ConfigItem 
              label="PIN Length" 
              value={`${pinLength} digits`}
              hint="ATM PIN format"
            />
            <ConfigItem 
              label="Currency" 
              value={appConfig.transaction.currencyCode}
              hint="Transaction currency"
            />
          </div>

          <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
            * Configuration can be updated from <code className="bg-accent px-1.5 py-0.5 rounded text-xs">src/config/appConfig.ts</code>
          </p>
        </div>
      </main>
    </div>
  );
};

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  delay?: number;
}

const ActionCard = ({ icon, title, description, onClick, delay = 0 }: ActionCardProps) => (
  <button
    onClick={onClick}
    className={cn(
      "bg-card rounded-2xl p-5 shadow-md text-left transition-all duration-200",
      "hover:shadow-lg hover:-translate-y-1 active:scale-[0.98]",
      "animate-slide-up group"
    )}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-3 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
      {icon}
    </div>
    <h3 className="font-semibold text-foreground mb-1">{title}</h3>
    <div className="flex items-center justify-between">
      <p className="text-xs text-muted-foreground">{description}</p>
      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
    </div>
  </button>
);

interface ConfigItemProps {
  label: string;
  value: string;
  hint: string;
}

const ConfigItem = ({ label, value, hint }: ConfigItemProps) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm text-foreground">{label}</p>
      <p className="text-xs text-muted-foreground">{hint}</p>
    </div>
    <span className="font-semibold text-primary">{value}</span>
  </div>
);

export default Index;
