import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Transaction,
  DataPlan,
  Beneficiary,
  SavingsGoal,
  ReferralStat,
  PromoCode,
  NotificationItem,
  SupportTicket,
  NetworkId,
  AdminSystemStats,
  TransactionType,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_TRANSACTIONS,
  INITIAL_DATA_PLANS,
  INITIAL_BENEFICIARIES,
  INITIAL_SAVINGS_GOALS,
  INITIAL_REFERRAL_STAT,
  INITIAL_PROMO_CODES,
  INITIAL_NOTIFICATIONS,
  INITIAL_SUPPORT_TICKETS,
  NETWORKS,
  DISCO_PROVIDERS,
  CABLE_PROVIDERS,
  EDUCATION_EXAMS,
} from '../data/mockData';
import { generateReference } from '../utils';

interface AppContextType {
  user: UserProfile;
  transactions: Transaction[];
  dataPlans: DataPlan[];
  beneficiaries: Beneficiary[];
  savingsGoals: SavingsGoal[];
  referralStat: ReferralStat;
  promoCodes: PromoCode[];
  notifications: NotificationItem[];
  supportTickets: SupportTicket[];
  adminStats: AdminSystemStats;
  isAdminMode: boolean;
  selectedReceiptTx: Transaction | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setIsAdminMode: (mode: boolean) => void;
  setSelectedReceiptTx: (tx: Transaction | null) => void;
  
  // Actions
  buyData: (params: {
    network: NetworkId;
    phone: string;
    plan: DataPlan;
    promoCode?: string;
    saveBeneficiary?: boolean;
    beneficiaryName?: string;
  }) => Promise<{ success: boolean; transaction?: Transaction; message?: string }>;

  buyAirtime: (params: {
    network: NetworkId;
    phone: string;
    amount: number;
    promoCode?: string;
    saveBeneficiary?: boolean;
    beneficiaryName?: string;
  }) => Promise<{ success: boolean; transaction?: Transaction; message?: string }>;

  batchBuyData: (params: {
    recipients: Array<{ phone: string; network: NetworkId; plan: DataPlan; name: string }>;
  }) => Promise<{ success: boolean; transaction?: Transaction; message?: string }>;

  payElectricity: (params: {
    discoId: string;
    meterNumber: string;
    meterType: 'prepaid' | 'postpaid';
    amount: number;
    customerName: string;
    customerAddress?: string;
    promoCode?: string;
  }) => Promise<{ success: boolean; transaction?: Transaction; message?: string }>;

  payCable: (params: {
    providerId: string;
    smartCardNo: string;
    bouquetId: string;
    customerName: string;
    promoCode?: string;
  }) => Promise<{ success: boolean; transaction?: Transaction; message?: string }>;

  buyEducation: (params: {
    examId: string;
    quantity: number;
  }) => Promise<{ success: boolean; transaction?: Transaction; message?: string }>;

  fundWallet: (params: {
    amount: number;
    method: 'virtual_account' | 'card' | 'bank_transfer' | 'ussd';
    senderBank?: string;
  }) => Promise<{ success: boolean; transaction?: Transaction; message?: string }>;

  transferWallet: (params: {
    recipientTag: string;
    amount: number;
    note?: string;
  }) => Promise<{ success: boolean; message?: string }>;

  requestRefund: (transactionId: string, reason: string) => Promise<{ success: boolean; message: string }>;

  createSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'currentAmount' | 'createdAt' | 'status'>) => void;
  topUpSavingsGoal: (goalId: string, amount: number) => Promise<{ success: boolean; message: string }>;

  addBeneficiary: (ben: Omit<Beneficiary, 'id' | 'lastUsed'>) => void;
  deleteBeneficiary: (id: string) => void;

  validatePromoCode: (code: string, service: TransactionType, amount: number) => { valid: boolean; discount: number; message: string };

  redeemLoyaltyPoints: (pointsToRedeem: number) => Promise<{ success: boolean; message: string }>;

  createSupportTicket: (ticket: {
    subject: string;
    category: SupportTicket['category'];
    transactionRef?: string;
    message: string;
  }) => Promise<{ success: boolean; ticketNo: string }>;

  replySupportTicket: (ticketId: string, message: string) => void;

  updateUserPin: (newPin: string) => boolean;
  toggleBiometrics: (enabled: boolean) => void;
  updateUserProfile: (data: Partial<UserProfile>) => void;
  markNotificationsAsRead: () => void;

  // Admin Actions
  adminUpdateDataPlan: (plan: DataPlan) => void;
  adminToggleService: (key: string, status: boolean) => void;
  adminProcessRefund: (transactionId: string, approve: boolean) => void;
  adminConfigureProvider: (vtu: string, gateway: string) => void;
  adminCreatePromoCode: (promo: PromoCode) => void;
  adminTogglePromoCode: (code: string) => void;
  adminAdjustUserBalance: (userId: string, amount: number, isCredit: boolean, reason: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('veltrivex_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('veltrivex_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [dataPlans, setDataPlans] = useState<DataPlan[]>(() => {
    const saved = localStorage.getItem('veltrivex_dataplans');
    return saved ? JSON.parse(saved) : INITIAL_DATA_PLANS;
  });

  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(() => {
    const saved = localStorage.getItem('veltrivex_beneficiaries');
    return saved ? JSON.parse(saved) : INITIAL_BENEFICIARIES;
  });

  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() => {
    const saved = localStorage.getItem('veltrivex_savings');
    return saved ? JSON.parse(saved) : INITIAL_SAVINGS_GOALS;
  });

  const [referralStat, setReferralStat] = useState<ReferralStat>(() => {
    const saved = localStorage.getItem('veltrivex_referrals');
    return saved ? JSON.parse(saved) : INITIAL_REFERRAL_STAT;
  });

  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(() => {
    const saved = localStorage.getItem('veltrivex_promos');
    return saved ? JSON.parse(saved) : INITIAL_PROMO_CODES;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('veltrivex_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('veltrivex_tickets');
    return saved ? JSON.parse(saved) : INITIAL_SUPPORT_TICKETS;
  });

  const [adminStats, setAdminStats] = useState<AdminSystemStats>({
    totalRevenue: 2845000,
    totalVolume: 14205000,
    totalUsers: 1450,
    activeUsersToday: 382,
    successfulTransactions: 12490,
    pendingTransactions: 4,
    failedTransactions: 28,
    totalWalletBalance: 4890000,
    totalDiscountsGiven: 148500,
    systemUptime: '99.98%',
    activeVTUProvider: 'Sandbox High-Speed Gateway',
    activePaymentGateway: 'Paystack / Monnify Virtual NUBAN',
    servicesStatus: {
      mtn: true,
      airtel: true,
      glo: true,
      '9mobile': true,
      electricity: true,
      cable: true,
      education: true,
      internet: true,
    },
  });

  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [selectedReceiptTx, setSelectedReceiptTx] = useState<Transaction | null>(null);
  const [activeTab, setActiveTab] = useState<string>('home');

  // Persistence to local storage
  useEffect(() => {
    localStorage.setItem('veltrivex_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('veltrivex_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('veltrivex_dataplans', JSON.stringify(dataPlans));
  }, [dataPlans]);

  useEffect(() => {
    localStorage.setItem('veltrivex_beneficiaries', JSON.stringify(beneficiaries));
  }, [beneficiaries]);

  useEffect(() => {
    localStorage.setItem('veltrivex_savings', JSON.stringify(savingsGoals));
  }, [savingsGoals]);

  useEffect(() => {
    localStorage.setItem('veltrivex_promos', JSON.stringify(promoCodes));
  }, [promoCodes]);

  useEffect(() => {
    localStorage.setItem('veltrivex_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('veltrivex_tickets', JSON.stringify(supportTickets));
  }, [supportTickets]);

  // Validate Promo Code Helper
  const validatePromoCode = (code: string, service: TransactionType, amount: number) => {
    const promo = promoCodes.find((p) => p.code.toUpperCase() === code.trim().toUpperCase());
    if (!promo) {
      return { valid: false, discount: 0, message: 'Invalid promo code' };
    }
    if (!promo.isActive) {
      return { valid: false, discount: 0, message: 'This promo code is no longer active' };
    }
    if (new Date(promo.expiresAt) < new Date()) {
      return { valid: false, discount: 0, message: 'Promo code has expired' };
    }
    if (!promo.applicableServices.includes(service)) {
      return { valid: false, discount: 0, message: `Code not valid for ${service} service` };
    }
    if (amount < promo.minSpend) {
      return { valid: false, discount: 0, message: `Minimum order amount of ₦${promo.minSpend.toLocaleString()} required` };
    }

    let discount = 0;
    if (promo.discountType === 'fixed') {
      discount = promo.discountValue;
    } else {
      discount = Math.min((amount * promo.discountValue) / 100, promo.maxDiscount);
    }

    return { valid: true, discount, message: `Promo applied: ₦${discount.toFixed(0)} discount!` };
  };

  // 1. Buy Data Action
  const buyData = async ({
    network,
    phone,
    plan,
    promoCode,
    saveBeneficiary,
    beneficiaryName,
  }: {
    network: NetworkId;
    phone: string;
    plan: DataPlan;
    promoCode?: string;
    saveBeneficiary?: boolean;
    beneficiaryName?: string;
  }) => {
    let discount = 0;
    let promoApplied = '';
    if (promoCode) {
      const promoCheck = validatePromoCode(promoCode, 'data', plan.price);
      if (promoCheck.valid) {
        discount = promoCheck.discount;
        promoApplied = promoCode.toUpperCase();
      }
    }

    const finalAmount = Math.max(plan.price - discount, 0);

    if (user.walletBalance < finalAmount) {
      return {
        success: false,
        message: `Insufficient wallet balance. You need ₦${finalAmount.toLocaleString()}, but your balance is ₦${user.walletBalance.toLocaleString()}. Please fund your wallet.`,
      };
    }

    // Process delivery with backend API
    const ref = generateReference('PFX-DATA');
    const pointsEarned = Math.floor(finalAmount / 50); // 1 point per ₦50
    const cashback = Math.floor(finalAmount * 0.01); // 1% cashback

    try {
      const response = await fetch('/api/vtu/process-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'data',
          network,
          recipient: phone,
          amount: finalAmount,
          reference: ref,
          planId: plan.id,
          planName: plan.name,
          service_id: plan.serviceId || network,
          plan_code: plan.code,
        }),
      });
      const gatewayResult = await response.json().catch(() => ({}));
      const gatewayOk = response.ok && (gatewayResult?.status === true || gatewayResult?.success === true || gatewayResult?.status === 'successful' || gatewayResult?.status === 'success');
      if (!gatewayOk) {
        return { success: false, message: gatewayResult?.message || 'Data purchase was not confirmed by VTUGATE.' };
      }
    } catch (e: any) {
      return { success: false, message: e?.message || 'Unable to reach the VTUGATE gateway.' };
    }

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      reference: ref,
      type: 'data',
      status: 'successful',
      amount: plan.price,
      fee: 0,
      discount,
      finalAmount,
      paymentMethod: 'wallet',
      balanceBefore: user.walletBalance,
      balanceAfter: user.walletBalance - finalAmount,
      timestamp: new Date().toISOString(),
      channel: 'mobile_app',
      metadata: {
        network,
        recipientPhone: phone,
        planName: plan.name,
        planSize: plan.size,
        planValidity: plan.validity,
        promoCodeApplied: promoApplied || undefined,
        discountAmount: discount,
        cashbackEarned: cashback,
        loyaltyPointsEarned: pointsEarned,
      },
    };

    // Update User Wallet & Points
    setUser((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance - finalAmount,
      loyaltyPoints: prev.loyaltyPoints + pointsEarned,
      currentMonthlySpend: prev.currentMonthlySpend + finalAmount,
    }));

    // Update Transactions
    setTransactions((prev) => [newTx, ...prev]);

    // Save Beneficiary if requested
    if (saveBeneficiary && phone) {
      const exists = beneficiaries.some((b) => b.phone === phone);
      if (!exists) {
        setBeneficiaries((prev) => [
          {
            id: `ben-${Date.now()}`,
            name: beneficiaryName || `${NETWORKS[network].badge} Contact`,
            phone,
            network,
            category: 'family',
            lastUsed: new Date().toISOString(),
          },
          ...prev,
        ]);
      }
    }

    // Add Notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `${plan.size} Data Delivered ⚡`,
        message: `Successfully credited ${plan.name} to ${phone}. Ref: ${ref}`,
        type: 'transaction',
        read: false,
        createdAt: new Date().toISOString(),
        linkTab: 'transactions',
      },
      ...prev,
    ]);

    return { success: true, transaction: newTx };
  };

  // 2. Buy Airtime Action
  const buyAirtime = async ({
    network,
    phone,
    amount,
    promoCode,
    saveBeneficiary,
    beneficiaryName,
  }: {
    network: NetworkId;
    phone: string;
    amount: number;
    promoCode?: string;
    saveBeneficiary?: boolean;
    beneficiaryName?: string;
  }) => {
    // 2% telco instant discount
    const standardDiscount = Math.floor(amount * (NETWORKS[network]?.discountRate || 0.02));
    let extraDiscount = 0;
    let promoApplied = '';

    if (promoCode) {
      const promoCheck = validatePromoCode(promoCode, 'airtime', amount);
      if (promoCheck.valid) {
        extraDiscount = promoCheck.discount;
        promoApplied = promoCode.toUpperCase();
      }
    }

    const totalDiscount = standardDiscount + extraDiscount;
    const finalAmount = Math.max(amount - totalDiscount, 10);

    if (user.walletBalance < finalAmount) {
      return {
        success: false,
        message: `Insufficient wallet balance. You need ₦${finalAmount.toLocaleString()}, but your balance is ₦${user.walletBalance.toLocaleString()}.`,
      };
    }

    const ref = generateReference('PFX-AIR');
    const pointsEarned = Math.floor(finalAmount / 100);

    try {
      const response = await fetch('/api/vtu/process-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'airtime',
          network,
          recipient: phone,
          amount: finalAmount,
          reference: ref,
        }),
      });
      const gatewayResult = await response.json().catch(() => ({}));
      const gatewayOk = response.ok && (gatewayResult?.status === true || gatewayResult?.success === true || gatewayResult?.status === 'successful' || gatewayResult?.status === 'success');
      if (!gatewayOk) {
        return { success: false, message: gatewayResult?.message || 'Airtime purchase was not confirmed by VTUGATE.' };
      }
    } catch (e: any) {
      return { success: false, message: e?.message || 'Unable to reach the VTUGATE gateway.' };
    }

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      reference: ref,
      type: 'airtime',
      status: 'successful',
      amount,
      fee: 0,
      discount: totalDiscount,
      finalAmount,
      paymentMethod: 'wallet',
      balanceBefore: user.walletBalance,
      balanceAfter: user.walletBalance - finalAmount,
      timestamp: new Date().toISOString(),
      channel: 'mobile_app',
      metadata: {
        network,
        recipientPhone: phone,
        promoCodeApplied: promoApplied || undefined,
        discountAmount: totalDiscount,
        loyaltyPointsEarned: pointsEarned,
      },
    };

    setUser((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance - finalAmount,
      loyaltyPoints: prev.loyaltyPoints + pointsEarned,
      currentMonthlySpend: prev.currentMonthlySpend + finalAmount,
    }));

    setTransactions((prev) => [newTx, ...prev]);

    if (saveBeneficiary && phone) {
      const exists = beneficiaries.some((b) => b.phone === phone);
      if (!exists) {
        setBeneficiaries((prev) => [
          {
            id: `ben-${Date.now()}`,
            name: beneficiaryName || `${NETWORKS[network].badge} Line`,
            phone,
            network,
            category: 'family',
            lastUsed: new Date().toISOString(),
          },
          ...prev,
        ]);
      }
    }

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `₦${amount.toLocaleString()} Airtime Sent ⚡`,
        message: `Instant ${NETWORKS[network].badge} airtime delivered to ${phone}. Ref: ${ref}`,
        type: 'transaction',
        read: false,
        createdAt: new Date().toISOString(),
        linkTab: 'transactions',
      },
      ...prev,
    ]);

    return { success: true, transaction: newTx };
  };

  // 3. Batch Buy Data for Family/Group
  const batchBuyData = async ({
    recipients,
  }: {
    recipients: Array<{ phone: string; network: NetworkId; plan: DataPlan; name: string }>;
  }) => {
    const totalAmount = recipients.reduce((sum, r) => sum + r.plan.price, 0);

    if (user.walletBalance < totalAmount) {
      return {
        success: false,
        message: `Insufficient wallet balance. Total bundle cost is ₦${totalAmount.toLocaleString()}, but your balance is ₦${user.walletBalance.toLocaleString()}.`,
      };
    }

    const ref = generateReference('PFX-GRP');
    const pointsEarned = Math.floor(totalAmount / 40);

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      reference: ref,
      type: 'data',
      status: 'successful',
      amount: totalAmount,
      fee: 0,
      discount: 0,
      finalAmount: totalAmount,
      paymentMethod: 'wallet',
      balanceBefore: user.walletBalance,
      balanceAfter: user.walletBalance - totalAmount,
      timestamp: new Date().toISOString(),
      channel: 'mobile_app',
      metadata: {
        batchRecipients: recipients.map((r) => ({
          phone: r.phone,
          network: r.network,
          planName: r.plan.name,
          price: r.plan.price,
        })),
        loyaltyPointsEarned: pointsEarned,
      },
    };

    setUser((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance - totalAmount,
      loyaltyPoints: prev.loyaltyPoints + pointsEarned,
      currentMonthlySpend: prev.currentMonthlySpend + totalAmount,
    }));

    setTransactions((prev) => [newTx, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `Family Group Data Delivered (${recipients.length} Lines) 👨‍👩‍👧‍👦`,
        message: `Batch data dispatch completed for ${recipients.length} saved contacts. Ref: ${ref}`,
        type: 'transaction',
        read: false,
        createdAt: new Date().toISOString(),
        linkTab: 'transactions',
      },
      ...prev,
    ]);

    return { success: true, transaction: newTx };
  };

  // 4. Pay Electricity
  const payElectricity = async ({
    discoId,
    meterNumber,
    meterType,
    amount,
    customerName,
    customerAddress,
    promoCode,
  }: {
    discoId: string;
    meterNumber: string;
    meterType: 'prepaid' | 'postpaid';
    amount: number;
    customerName: string;
    customerAddress?: string;
    promoCode?: string;
  }) => {
    const disco = DISCO_PROVIDERS.find((d) => d.id === discoId);
    let discount = 0;
    let promoApplied = '';

    if (promoCode) {
      const promoCheck = validatePromoCode(promoCode, 'electricity', amount);
      if (promoCheck.valid) {
        discount = promoCheck.discount;
        promoApplied = promoCode.toUpperCase();
      }
    }

    const fee = 100; // Standard ₦100 convenience fee
    const finalAmount = Math.max(amount + fee - discount, 100);

    if (user.walletBalance < finalAmount) {
      return {
        success: false,
        message: `Insufficient wallet balance. Total charge is ₦${finalAmount.toLocaleString()}, but your balance is ₦${user.walletBalance.toLocaleString()}.`,
      };
    }

    const ref = generateReference('PFX-ELEC');
    // Generate realistic 20-digit token for prepaid
    const tokenPart = () => Math.floor(1000 + Math.random() * 9000);
    const token = meterType === 'prepaid' ? `${tokenPart()} ${tokenPart()} ${tokenPart()} ${tokenPart()} ${tokenPart()}` : undefined;
    const units = meterType === 'prepaid' ? `${(amount / 68.5).toFixed(1)} kWh` : undefined;

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      reference: ref,
      type: 'electricity',
      status: 'successful',
      amount,
      fee,
      discount,
      finalAmount,
      paymentMethod: 'wallet',
      balanceBefore: user.walletBalance,
      balanceAfter: user.walletBalance - finalAmount,
      timestamp: new Date().toISOString(),
      channel: 'web',
      metadata: {
        disco: disco?.name || discoId.toUpperCase(),
        meterNumber,
        meterType,
        customerName: customerName.toUpperCase(),
        customerAddress: customerAddress || 'Lagos Resident',
        token,
        units,
        promoCodeApplied: promoApplied || undefined,
        discountAmount: discount,
        loyaltyPointsEarned: Math.floor(amount / 100),
      },
    };

    setUser((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance - finalAmount,
      loyaltyPoints: prev.loyaltyPoints + Math.floor(amount / 100),
      currentMonthlySpend: prev.currentMonthlySpend + finalAmount,
    }));

    setTransactions((prev) => [newTx, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `Electricity Token Generated 💡`,
        message: `${disco?.shortName} recharge of ₦${amount.toLocaleString()} successful. Token: ${token || 'Credited to Postpaid'}`,
        type: 'transaction',
        read: false,
        createdAt: new Date().toISOString(),
        linkTab: 'transactions',
      },
      ...prev,
    ]);

    return { success: true, transaction: newTx };
  };

  // 5. Pay Cable TV
  const payCable = async ({
    providerId,
    smartCardNo,
    bouquetId,
    customerName,
    promoCode,
  }: {
    providerId: string;
    smartCardNo: string;
    bouquetId: string;
    customerName: string;
    promoCode?: string;
  }) => {
    const provider = CABLE_PROVIDERS.find((c) => c.id === providerId);
    const bouquet = provider?.bouquets.find((b) => b.id === bouquetId);

    if (!bouquet) {
      return { success: false, message: 'Selected bouquet not found' };
    }

    let discount = 0;
    if (promoCode) {
      const promoCheck = validatePromoCode(promoCode, 'cable', bouquet.price);
      if (promoCheck.valid) discount = promoCheck.discount;
    }

    const fee = 50;
    const finalAmount = Math.max(bouquet.price + fee - discount, 0);

    if (user.walletBalance < finalAmount) {
      return {
        success: false,
        message: `Insufficient wallet balance. Total amount is ₦${finalAmount.toLocaleString()}, but your balance is ₦${user.walletBalance.toLocaleString()}.`,
      };
    }

    const ref = generateReference('PFX-CAB');
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      reference: ref,
      type: 'cable',
      status: 'successful',
      amount: bouquet.price,
      fee,
      discount,
      finalAmount,
      paymentMethod: 'wallet',
      balanceBefore: user.walletBalance,
      balanceAfter: user.walletBalance - finalAmount,
      timestamp: new Date().toISOString(),
      channel: 'mobile_app',
      metadata: {
        cableProvider: provider?.name,
        smartCardNo,
        bouquetName: bouquet.name,
        customerName: customerName || 'SUBSCRIBER',
        loyaltyPointsEarned: Math.floor(bouquet.price / 100),
      },
    };

    setUser((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance - finalAmount,
      loyaltyPoints: prev.loyaltyPoints + Math.floor(bouquet.price / 100),
      currentMonthlySpend: prev.currentMonthlySpend + finalAmount,
    }));

    setTransactions((prev) => [newTx, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `${provider?.shortName} Renewed 📺`,
        message: `${bouquet.name} renewed for IUC: ${smartCardNo}.`,
        type: 'transaction',
        read: false,
        createdAt: new Date().toISOString(),
        linkTab: 'transactions',
      },
      ...prev,
    ]);

    return { success: true, transaction: newTx };
  };

  // 6. Buy Education Exam PIN
  const buyEducation = async ({ examId, quantity }: { examId: string; quantity: number }) => {
    const exam = EDUCATION_EXAMS.find((e) => e.id === examId);
    if (!exam) return { success: false, message: 'Invalid exam selected' };

    const totalAmount = exam.unitPrice * quantity;
    if (user.walletBalance < totalAmount) {
      return {
        success: false,
        message: `Insufficient wallet balance. Total cost is ₦${totalAmount.toLocaleString()}, balance is ₦${user.walletBalance.toLocaleString()}.`,
      };
    }

    const generatedPins: string[] = [];
    for (let i = 0; i < quantity; i++) {
      const pin = Math.floor(100000000000 + Math.random() * 900000000000);
      const serial = `WRC-${Math.floor(100000 + Math.random() * 900000)}`;
      generatedPins.push(`PIN: ${pin} | SERIAL: ${serial}`);
    }

    const ref = generateReference('PFX-EDU');
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      reference: ref,
      type: 'education',
      status: 'successful',
      amount: totalAmount,
      fee: 0,
      discount: 0,
      finalAmount: totalAmount,
      paymentMethod: 'wallet',
      balanceBefore: user.walletBalance,
      balanceAfter: user.walletBalance - totalAmount,
      timestamp: new Date().toISOString(),
      channel: 'web',
      metadata: {
        examType: exam.name,
        examQuantity: quantity,
        generatedPins,
        loyaltyPointsEarned: Math.floor(totalAmount / 100),
      },
    };

    setUser((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance - totalAmount,
      loyaltyPoints: prev.loyaltyPoints + Math.floor(totalAmount / 100),
      currentMonthlySpend: prev.currentMonthlySpend + totalAmount,
    }));

    setTransactions((prev) => [newTx, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `${exam.name} Issued 🎓`,
        message: `${quantity} e-PIN token(s) generated. View receipt to copy codes. Ref: ${ref}`,
        type: 'transaction',
        read: false,
        createdAt: new Date().toISOString(),
        linkTab: 'transactions',
      },
      ...prev,
    ]);

    return { success: true, transaction: newTx };
  };

  // 7. Fund Wallet Action
  const fundWallet = async ({
    amount,
    method,
    senderBank,
  }: {
    amount: number;
    method: 'virtual_account' | 'card' | 'bank_transfer' | 'ussd';
    senderBank?: string;
  }) => {
    if (amount < 100) {
      return { success: false, message: 'Minimum wallet funding amount is ₦100.00' };
    }

    const ref = generateReference('PFX-WLT');

    try {
      const response = await fetch('/api/wallet/fund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, method, senderBank, reference: ref }),
      });
      const fundingResult = await response.json().catch(() => ({}));
      if (!response.ok || fundingResult?.success !== true) {
        return { success: false, message: fundingResult?.message || 'Wallet funding was not verified. No money was added.' };
      }
    } catch (e: any) {
      return { success: false, message: e?.message || 'Unable to verify wallet funding.' };
    }
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      reference: ref,
      type: 'wallet_fund',
      status: 'successful',
      amount,
      fee: 0,
      discount: 0,
      finalAmount: amount,
      paymentMethod: 'bank_transfer',
      balanceBefore: user.walletBalance,
      balanceAfter: user.walletBalance + amount,
      timestamp: new Date().toISOString(),
      channel: 'web',
      metadata: {
        fundingMethod: method,
        senderBank: senderBank || 'Commercial Bank Inflow',
      },
    };

    setUser((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance + amount,
    }));

    setTransactions((prev) => [newTx, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `Wallet Credited ₦${amount.toLocaleString()} 💰`,
        message: `Inflow confirmed via ${method.replace('_', ' ')}. Your new balance is ₦${(user.walletBalance + amount).toLocaleString()}.`,
        type: 'transaction',
        read: false,
        createdAt: new Date().toISOString(),
        linkTab: 'wallet',
      },
      ...prev,
    ]);

    return { success: true, transaction: newTx };
  };

  // 8. Transfer Wallet to another user
  const transferWallet = async ({ recipientTag, amount, note }: { recipientTag: string; amount: number; note?: string }) => {
    if (amount <= 0 || user.walletBalance < amount) {
      return { success: false, message: 'Insufficient balance or invalid amount' };
    }

    const ref = generateReference('PFX-TRF');
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      reference: ref,
      type: 'wallet_transfer',
      status: 'successful',
      amount,
      fee: 0,
      discount: 0,
      finalAmount: amount,
      paymentMethod: 'wallet',
      balanceBefore: user.walletBalance,
      balanceAfter: user.walletBalance - amount,
      timestamp: new Date().toISOString(),
      channel: 'mobile_app',
      metadata: {
        customerName: recipientTag,
        customerAddress: note || 'Peer transfer',
      },
    };

    setUser((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance - amount,
    }));

    setTransactions((prev) => [newTx, ...prev]);

    return { success: true, message: `₦${amount.toLocaleString()} transferred to ${recipientTag}` };
  };

  // 9. Request Refund
  const requestRefund = async (transactionId: string, reason: string) => {
    const tx = transactions.find((t) => t.id === transactionId);
    if (!tx) return { success: false, message: 'Transaction not found' };

    // Create a support ticket for this refund request
    const ticketNo = `REF-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: SupportTicket = {
      id: `tkt-${Date.now()}`,
      ticketNo,
      transactionRef: tx.reference,
      subject: `Refund Request for ${tx.reference}`,
      category: 'airtime_data',
      status: 'open',
      priority: 'high',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'user',
          senderName: user.fullName,
          message: `User requested refund for ₦${tx.finalAmount.toLocaleString()}. Reason: ${reason}`,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    setSupportTickets((prev) => [newTicket, ...prev]);

    return {
      success: true,
      message: `Refund ticket ${ticketNo} opened. Support team is reviewing with upstream provider.`,
    };
  };

  // 10. Savings Goals
  const createSavingsGoal = (goal: Omit<SavingsGoal, 'id' | 'currentAmount' | 'createdAt' | 'status'>) => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: `goal-${Date.now()}`,
      currentAmount: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    setSavingsGoals((prev) => [newGoal, ...prev]);
  };

  const topUpSavingsGoal = async (goalId: string, amount: number) => {
    if (user.walletBalance < amount) {
      return { success: false, message: 'Insufficient wallet balance' };
    }

    const goal = savingsGoals.find((g) => g.id === goalId);
    if (!goal) return { success: false, message: 'Goal not found' };

    setUser((prev) => ({
      ...prev,
      walletBalance: prev.walletBalance - amount,
    }));

    setSavingsGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g))
    );

    const ref = generateReference('PFX-SAV');
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      reference: ref,
      type: 'savings_deposit',
      status: 'successful',
      amount,
      fee: 0,
      discount: 0,
      finalAmount: amount,
      paymentMethod: 'wallet',
      balanceBefore: user.walletBalance,
      balanceAfter: user.walletBalance - amount,
      timestamp: new Date().toISOString(),
      channel: 'mobile_app',
      metadata: {
        customerName: goal.title,
      },
    };

    setTransactions((prev) => [newTx, ...prev]);

    return { success: true, message: `₦${amount.toLocaleString()} locked into "${goal.title}" target vault!` };
  };

  // 11. Beneficiaries
  const addBeneficiary = (ben: Omit<Beneficiary, 'id' | 'lastUsed'>) => {
    const newBen: Beneficiary = {
      ...ben,
      id: `ben-${Date.now()}`,
      lastUsed: new Date().toISOString(),
    };
    setBeneficiaries((prev) => [newBen, ...prev]);
  };

  const deleteBeneficiary = (id: string) => {
    setBeneficiaries((prev) => prev.filter((b) => b.id !== id));
  };

  // 12. Loyalty Points Redemption
  const redeemLoyaltyPoints = async (pointsToRedeem: number) => {
    if (user.loyaltyPoints < pointsToRedeem) {
      return { success: false, message: 'Insufficient loyalty points' };
    }
    const nairaCredit = pointsToRedeem; // 1 Point = ₦1.00 credit

    setUser((prev) => ({
      ...prev,
      loyaltyPoints: prev.loyaltyPoints - pointsToRedeem,
      walletBalance: prev.walletBalance + nairaCredit,
    }));

    const ref = generateReference('PFX-REW');
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      reference: ref,
      type: 'points_redemption',
      status: 'successful',
      amount: nairaCredit,
      fee: 0,
      discount: 0,
      finalAmount: nairaCredit,
      paymentMethod: 'wallet',
      balanceBefore: user.walletBalance,
      balanceAfter: user.walletBalance + nairaCredit,
      timestamp: new Date().toISOString(),
      channel: 'mobile_app',
      metadata: {
        loyaltyPointsEarned: -pointsToRedeem,
      },
    };

    setTransactions((prev) => [newTx, ...prev]);

    return { success: true, message: `Redeemed ${pointsToRedeem} points! ₦${nairaCredit.toLocaleString()} added to your wallet.` };
  };

  // 13. Support Tickets
  const createSupportTicket = async ({
    subject,
    category,
    transactionRef,
    message,
  }: {
    subject: string;
    category: SupportTicket['category'];
    transactionRef?: string;
    message: string;
  }) => {
    const ticketNo = `TKT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: SupportTicket = {
      id: `tkt-${Date.now()}`,
      ticketNo,
      transactionRef,
      subject,
      category,
      status: 'open',
      priority: 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: 'user',
          senderName: user.fullName,
          message,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    setSupportTickets((prev) => [newTicket, ...prev]);

    return { success: true, ticketNo };
  };

  const replySupportTicket = (ticketId: string, message: string) => {
    setSupportTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            updatedAt: new Date().toISOString(),
            messages: [
              ...t.messages,
              {
                id: `msg-${Date.now()}`,
                sender: isAdminMode ? 'support' : 'user',
                senderName: isAdminMode ? 'VeltriPay Support Agent' : user.fullName,
                message,
                timestamp: new Date().toISOString(),
              },
            ],
          };
        }
        return t;
      })
    );
  };

  // 14. Profile & Security
  const updateUserPin = (newPin: string) => {
    if (newPin.length === 4) {
      setUser((prev) => ({ ...prev, hasPin: true }));
      return true;
    }
    return false;
  };

  const toggleBiometrics = (enabled: boolean) => {
    setUser((prev) => ({ ...prev, biometricsEnabled: enabled }));
  };

  const updateUserProfile = (data: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...data }));
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // 15. Admin Operations
  const adminUpdateDataPlan = (updatedPlan: DataPlan) => {
    setDataPlans((prev) => prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p)));
  };

  const adminToggleService = (key: string, status: boolean) => {
    setAdminStats((prev) => ({
      ...prev,
      servicesStatus: {
        ...prev.servicesStatus,
        [key]: status,
      },
    }));
  };

  const adminProcessRefund = (transactionId: string, approve: boolean) => {
    const tx = transactions.find((t) => t.id === transactionId);
    if (!tx) return;

    if (approve && tx.status !== 'reversed') {
      // Credit user wallet back
      setUser((prev) => ({
        ...prev,
        walletBalance: prev.walletBalance + tx.finalAmount,
      }));

      // Update tx status
      setTransactions((prev) =>
        prev.map((t) => (t.id === transactionId ? { ...t, status: 'reversed' } : t))
      );

      // Add Notification
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          title: `Refund Processed ₦${tx.finalAmount.toLocaleString()} 🔄`,
          message: `Your transaction ${tx.reference} was reversed and credited back to your wallet.`,
          type: 'transaction',
          read: false,
          createdAt: new Date().toISOString(),
          linkTab: 'wallet',
        },
        ...prev,
      ]);
    }
  };

  const adminConfigureProvider = (vtu: string, gateway: string) => {
    setAdminStats((prev) => ({
      ...prev,
      activeVTUProvider: vtu,
      activePaymentGateway: gateway,
    }));
  };

  const adminCreatePromoCode = (promo: PromoCode) => {
    setPromoCodes((prev) => [promo, ...prev]);
  };

  const adminTogglePromoCode = (code: string) => {
    setPromoCodes((prev) =>
      prev.map((p) => (p.code === code ? { ...p, isActive: !p.isActive } : p))
    );
  };

  const adminAdjustUserBalance = (userId: string, amount: number, isCredit: boolean, reason: string) => {
    setUser((prev) => {
      const newBal = isCredit ? prev.walletBalance + amount : Math.max(prev.walletBalance - amount, 0);
      return { ...prev, walletBalance: newBal };
    });

    const ref = generateReference(isCredit ? 'ADM-CR' : 'ADM-DR');
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      reference: ref,
      type: isCredit ? 'wallet_fund' : 'wallet_transfer',
      status: 'successful',
      amount,
      fee: 0,
      discount: 0,
      finalAmount: amount,
      paymentMethod: 'wallet',
      balanceBefore: user.walletBalance,
      balanceAfter: isCredit ? user.walletBalance + amount : user.walletBalance - amount,
      timestamp: new Date().toISOString(),
      channel: 'api',
      metadata: {
        customerName: `ADMIN ADJUSTMENT: ${reason}`,
      },
    };

    setTransactions((prev) => [newTx, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        transactions,
        dataPlans,
        beneficiaries,
        savingsGoals,
        referralStat,
        promoCodes,
        notifications,
        supportTickets,
        adminStats,
        isAdminMode,
        selectedReceiptTx,
        activeTab,
        setActiveTab,
        setIsAdminMode,
        setSelectedReceiptTx,
        buyData,
        buyAirtime,
        batchBuyData,
        payElectricity,
        payCable,
        buyEducation,
        fundWallet,
        transferWallet,
        requestRefund,
        createSavingsGoal,
        topUpSavingsGoal,
        addBeneficiary,
        deleteBeneficiary,
        validatePromoCode,
        redeemLoyaltyPoints,
        createSupportTicket,
        replySupportTicket,
        updateUserPin,
        toggleBiometrics,
        updateUserProfile,
        markNotificationsAsRead,
        adminUpdateDataPlan,
        adminToggleService,
        adminProcessRefund,
        adminConfigureProvider,
        adminCreatePromoCode,
        adminTogglePromoCode,
        adminAdjustUserBalance,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
