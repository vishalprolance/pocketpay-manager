// Configuration file - Update these values to change app behavior
export const appConfig = {
  // Transaction Settings
  transaction: {
    minAmount: 1,
    maxAmount: 100000, // Maximum transaction limit in currency units
    dailyLimit: 500000, // Daily transaction limit
    currency: "₹",
    currencyCode: "INR",
  },
  
  // PIN Settings
  pin: {
    length: 4, // Change to 6 for 6-digit PIN
    maxAttempts: 3,
  },
  
  // UI Settings
  ui: {
    showTransactionHistory: true,
    enableBiometric: false,
  },
};

export type AppConfig = typeof appConfig;
