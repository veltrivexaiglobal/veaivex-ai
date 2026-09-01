import {
  NetworkInfo,
  DataPlan,
  DiscoProvider,
  CableProvider,
  EducationExam,
  PromoCode,
  UserProfile,
  Beneficiary,
  SavingsGoal,
  ReferralStat,
  Transaction,
  NotificationItem,
  SupportTicket,
} from '../types';

export const NETWORKS: Record<string, NetworkInfo> = {
  mtn: {
    id: 'mtn',
    name: 'MTN Nigeria',
    color: '#EAB308', // Yellow
    textColor: '#854D0E',
    bgLight: 'bg-yellow-50 border-yellow-300 text-yellow-800',
    borderColor: 'border-yellow-500',
    badge: 'MTN',
    discountRate: 0.02, // 2% airtime discount
    prefixes: ['0803', '0806', '0703', '0706', '0813', '0816', '0810', '0814', '0903', '0906', '0913', '0916'],
  },
  airtel: {
    id: 'airtel',
    name: 'Airtel Nigeria',
    color: '#EF4444', // Red
    textColor: '#991B1B',
    bgLight: 'bg-red-50 border-red-300 text-red-800',
    borderColor: 'border-red-500',
    badge: 'Airtel',
    discountRate: 0.025, // 2.5% discount
    prefixes: ['0802', '0808', '0708', '0812', '0701', '0902', '0901', '0904', '0907', '0912'],
  },
  glo: {
    id: 'glo',
    name: 'Glo (Globacom)',
    color: '#22C55E', // Green
    textColor: '#166534',
    bgLight: 'bg-emerald-50 border-emerald-300 text-emerald-800',
    borderColor: 'border-emerald-500',
    badge: 'Glo',
    discountRate: 0.03, // 3% discount
    prefixes: ['0805', '0807', '0705', '0815', '0811', '0905', '0915'],
  },
  '9mobile': {
    id: '9mobile',
    name: '9mobile',
    color: '#10B981', // Dark green / teal
    textColor: '#065F46',
    bgLight: 'bg-teal-50 border-teal-300 text-teal-800',
    borderColor: 'border-teal-500',
    badge: '9mobile',
    discountRate: 0.02, // 2% discount
    prefixes: ['0809', '0817', '0818', '0909', '0908'],
  },
};

export const INITIAL_DATA_PLANS: DataPlan[] = [
  // MTN PLANS
  { id: 'mtn-sme-1', network: 'mtn', category: 'SME', name: 'MTN SME 1GB', size: '1.0 GB', validity: '30 Days', price: 285, costPrice: 260, isAvailable: true, isPopular: true, code: 'MTN_SME_1GB' },
  { id: 'mtn-sme-2', network: 'mtn', category: 'SME', name: 'MTN SME 2GB', size: '2.0 GB', validity: '30 Days', price: 570, costPrice: 520, isAvailable: true, isBestValue: true, code: 'MTN_SME_2GB' },
  { id: 'mtn-sme-3', network: 'mtn', category: 'SME', name: 'MTN SME 3GB', size: '3.0 GB', validity: '30 Days', price: 855, costPrice: 780, isAvailable: true, code: 'MTN_SME_3GB' },
  { id: 'mtn-sme-5', network: 'mtn', category: 'SME', name: 'MTN SME 5GB', size: '5.0 GB', validity: '30 Days', price: 1425, costPrice: 1300, isAvailable: true, isPopular: true, code: 'MTN_SME_5GB' },
  { id: 'mtn-sme-10', network: 'mtn', category: 'SME', name: 'MTN SME 10GB', size: '10.0 GB', validity: '30 Days', price: 2850, costPrice: 2600, isAvailable: true, isBestValue: true, code: 'MTN_SME_10GB' },
  { id: 'mtn-cg-1', network: 'mtn', category: 'Corporate', name: 'MTN Corporate 1GB', size: '1.0 GB', validity: '30 Days', price: 310, costPrice: 280, isAvailable: true, code: 'MTN_CG_1GB' },
  { id: 'mtn-cg-3', network: 'mtn', category: 'Corporate', name: 'MTN Corporate 3GB', size: '3.0 GB', validity: '30 Days', price: 930, costPrice: 840, isAvailable: true, code: 'MTN_CG_3GB' },
  { id: 'mtn-dir-2', network: 'mtn', category: 'Direct', name: 'MTN Direct 2.5GB', size: '2.5 GB', validity: '2 Days', price: 500, costPrice: 470, isAvailable: true, code: 'MTN_DIR_2.5GB' },
  { id: 'mtn-dir-20', network: 'mtn', category: 'Direct', name: 'MTN Monthly 20GB', size: '20.0 GB', validity: '30 Days', price: 5500, costPrice: 5100, isAvailable: true, code: 'MTN_DIR_20GB' },

  // AIRTEL PLANS
  { id: 'air-cg-1', network: 'airtel', category: 'Corporate', name: 'Airtel CG 1GB', size: '1.0 GB', validity: '30 Days', price: 290, costPrice: 265, isAvailable: true, isPopular: true, code: 'AIR_CG_1GB' },
  { id: 'air-cg-2', network: 'airtel', category: 'Corporate', name: 'Airtel CG 2GB', size: '2.0 GB', validity: '30 Days', price: 580, costPrice: 530, isAvailable: true, isBestValue: true, code: 'AIR_CG_2GB' },
  { id: 'air-cg-5', network: 'airtel', category: 'Corporate', name: 'Airtel CG 5GB', size: '5.0 GB', validity: '30 Days', price: 1450, costPrice: 1325, isAvailable: true, code: 'AIR_CG_5GB' },
  { id: 'air-cg-10', network: 'airtel', category: 'Corporate', name: 'Airtel CG 10GB', size: '10.0 GB', validity: '30 Days', price: 2900, costPrice: 2650, isAvailable: true, code: 'AIR_CG_10GB' },
  { id: 'air-gift-1.5', network: 'airtel', category: 'Gifting', name: 'Airtel Gifting 1.5GB', size: '1.5 GB', validity: '30 Days', price: 1000, costPrice: 940, isAvailable: true, code: 'AIR_GIFT_1.5GB' },
  { id: 'air-gift-4.5', network: 'airtel', category: 'Gifting', name: 'Airtel Gifting 4.5GB', size: '4.5 GB', validity: '30 Days', price: 2000, costPrice: 1880, isAvailable: true, isBestValue: true, code: 'AIR_GIFT_4.5GB' },

  // GLO PLANS
  { id: 'glo-cg-1', network: 'glo', category: 'Corporate', name: 'Glo CG 1GB', size: '1.0 GB', validity: '30 Days', price: 260, costPrice: 235, isAvailable: true, isPopular: true, code: 'GLO_CG_1GB' },
  { id: 'glo-cg-2', network: 'glo', category: 'Corporate', name: 'Glo CG 2GB', size: '2.0 GB', validity: '30 Days', price: 520, costPrice: 470, isAvailable: true, isBestValue: true, code: 'GLO_CG_2GB' },
  { id: 'glo-cg-3', network: 'glo', category: 'Corporate', name: 'Glo CG 3GB', size: '3.0 GB', validity: '30 Days', price: 780, costPrice: 705, isAvailable: true, code: 'GLO_CG_3GB' },
  { id: 'glo-cg-5', network: 'glo', category: 'Corporate', name: 'Glo CG 5GB', size: '5.0 GB', validity: '30 Days', price: 1300, costPrice: 1175, isAvailable: true, code: 'GLO_CG_5GB' },
  { id: 'glo-gift-7.7', network: 'glo', category: 'Gifting', name: 'Glo Special 7.7GB', size: '7.7 GB', validity: '30 Days', price: 2500, costPrice: 2300, isAvailable: true, code: 'GLO_GIFT_7.7GB' },

  // 9MOBILE PLANS
  { id: '9mob-sme-1', network: '9mobile', category: 'SME', name: '9mobile SME 1GB', size: '1.0 GB', validity: '30 Days', price: 420, costPrice: 380, isAvailable: true, code: '9MOB_SME_1GB' },
  { id: '9mob-sme-2', network: '9mobile', category: 'SME', name: '9mobile SME 2GB', size: '2.0 GB', validity: '30 Days', price: 840, costPrice: 760, isAvailable: true, isPopular: true, code: '9MOB_SME_2GB' },
  { id: '9mob-sme-5', network: '9mobile', category: 'SME', name: '9mobile SME 5GB', size: '5.0 GB', validity: '30 Days', price: 2100, costPrice: 1900, isAvailable: true, isBestValue: true, code: '9MOB_SME_5GB' },
  { id: '9mob-gift-4.5', network: '9mobile', category: 'Gifting', name: '9mobile Gifting 4.5GB', size: '4.5 GB', validity: '30 Days', price: 2000, costPrice: 1850, isAvailable: true, code: '9MOB_GIFT_4.5GB' },
];

export const DISCO_PROVIDERS: DiscoProvider[] = [
  { id: 'ikedc', name: 'Ikeja Electric (IKEDC)', shortName: 'IKEDC', state: 'Lagos State (Ikeja, Ikorodu, Alimosho)', minAmount: 1000, maxAmount: 100000, prepaidAvailable: true, postpaidAvailable: true },
  { id: 'ekedc', name: 'Eko Electric (EKEDC)', shortName: 'EKEDC', state: 'Lagos State (Island, Lekki, Apapa, Festac)', minAmount: 1000, maxAmount: 100000, prepaidAvailable: true, postpaidAvailable: true },
  { id: 'aedc', name: 'Abuja Electricity (AEDC)', shortName: 'AEDC', state: 'FCT Abuja, Kogi, Niger, Nasarawa', minAmount: 1000, maxAmount: 150000, prepaidAvailable: true, postpaidAvailable: true },
  { id: 'ibedc', name: 'Ibadan Electricity (IBEDC)', shortName: 'IBEDC', state: 'Oyo, Ogun, Osun, Kwara', minAmount: 1000, maxAmount: 100000, prepaidAvailable: true, postpaidAvailable: true },
  { id: 'eedc', name: 'Enugu Electricity (EEDC)', shortName: 'EEDC', state: 'Enugu, Abia, Imo, Anambra, Ebonyi', minAmount: 1000, maxAmount: 100000, prepaidAvailable: true, postpaidAvailable: true },
  { id: 'phed', name: 'Port Harcourt Electric (PHED)', shortName: 'PHED', state: 'Rivers, Bayelsa, Cross River, Akwa Ibom', minAmount: 1000, maxAmount: 100000, prepaidAvailable: true, postpaidAvailable: true },
  { id: 'kedco', name: 'Kano Electricity (KEDCO)', shortName: 'KEDCO', state: 'Kano, Katsina, Jigawa', minAmount: 1000, maxAmount: 100000, prepaidAvailable: true, postpaidAvailable: true },
  { id: 'jed', name: 'Jos Electricity (JED)', shortName: 'JED', state: 'Plateau, Bauchi, Benue, Gombe', minAmount: 1000, maxAmount: 100000, prepaidAvailable: true, postpaidAvailable: true },
  { id: 'kaedco', name: 'Kaduna Electric (KAEDCO)', shortName: 'KAEDCO', state: 'Kaduna, Kebbi, Sokoto, Zamfara', minAmount: 1000, maxAmount: 100000, prepaidAvailable: true, postpaidAvailable: true },
];

export const CABLE_PROVIDERS: CableProvider[] = [
  {
    id: 'dstv',
    name: 'DStv Nigeria',
    shortName: 'DStv',
    bouquets: [
      { id: 'dstv-padi', name: 'DStv Padi', price: 3600, description: '45+ Channels (News, Kids, Local entertainment)' },
      { id: 'dstv-yanga', name: 'DStv Yanga', price: 5100, description: '85+ Channels (Movies, Nollywood, Series)' },
      { id: 'dstv-confam', name: 'DStv Confam', price: 9300, description: '105+ Channels (Football, Documentaries, Family)' },
      { id: 'dstv-compact', name: 'DStv Compact', price: 15700, description: '130+ Channels (Premier League, WWE, International Movies)' },
      { id: 'dstv-compact-plus', name: 'DStv Compact Plus', price: 25000, description: '145+ Channels (Champions League, European football)' },
      { id: 'dstv-premium', name: 'DStv Premium', price: 37000, description: '160+ All HD sports, M-Net blockbusters, Showmax free' },
    ],
  },
  {
    id: 'gotv',
    name: 'GOtv Nigeria',
    shortName: 'GOtv',
    bouquets: [
      { id: 'gotv-smallie', name: 'GOtv Smallie (Monthly)', price: 1575, description: '35+ Local channels & News' },
      { id: 'gotv-jinja', name: 'GOtv Jinja', price: 3300, description: '45+ Channels (Africa Magic, Kids, Movies)' },
      { id: 'gotv-jolli', name: 'GOtv Jolli', price: 4850, description: '65+ Channels (WWE, Series, TeleNovelas)' },
      { id: 'gotv-max', name: 'GOtv Max', price: 7200, description: '75+ Channels (La Liga, Serie A, Select Premier League)' },
      { id: 'gotv-supa', name: 'GOtv Supa', price: 9600, description: '80+ Channels (Expanded Kids, Lifestyle & Premier League)' },
      { id: 'gotv-supa-plus', name: 'GOtv Supa Plus', price: 15700, description: 'All Premier League matches & Top Tier Entertainment' },
    ],
  },
  {
    id: 'startimes',
    name: 'StarTimes',
    shortName: 'StarTimes',
    bouquets: [
      { id: 'st-nova', name: 'Nova Bouquet', price: 1700, description: 'Basic digital clarity & local news' },
      { id: 'st-basic', name: 'Basic Bouquet', price: 3300, description: 'General entertainment, Kids & Bollywood' },
      { id: 'st-smart', name: 'Smart Bouquet', price: 4200, description: 'Top sports & movies' },
      { id: 'st-classic', name: 'Classic Bouquet', price: 5000, description: 'Full German Bundesliga & premium movies' },
      { id: 'st-super', name: 'Super Bouquet', price: 8200, description: 'Complete StarTimes HD experience' },
    ],
  },
  {
    id: 'showmax',
    name: 'Showmax',
    shortName: 'Showmax',
    bouquets: [
      { id: 'showmax-ent-mobile', name: 'Showmax Entertainment (Mobile)', price: 1600, description: 'Stream local & HBO hit series on 1 mobile screen' },
      { id: 'showmax-pl-mobile', name: 'Showmax Premier League (Mobile)', price: 3200, description: 'Stream every live EPL match on mobile' },
      { id: 'showmax-all-mobile', name: 'Showmax Ent + Premier League (Mobile)', price: 4000, description: 'Complete entertainment and football mobile pass' },
    ],
  },
];

export const EDUCATION_EXAMS: EducationExam[] = [
  { id: 'waec-card', name: 'WAEC Result Checker PIN', provider: 'West African Examinations Council', unitPrice: 3500, description: 'Direct PIN + Serial Number to check WASSCE school / private results on waecdirect.org', validity: '5 Times Result Access' },
  { id: 'neco-token', name: 'NECO Result Token', provider: 'National Examinations Council', unitPrice: 1300, description: 'Official 12-digit token for SSCE Internal, External & BECE results on result.neco.gov.ng', validity: '5 Usages per Token' },
  { id: 'jamb-utme-nomock', name: 'JAMB UTME e-PIN (Without Mock)', provider: 'Joint Admissions and Matriculation Board', unitPrice: 6200, description: 'Candidate registration profile e-PIN for UTME exams across accredited CBT centres', validity: 'Current Session' },
  { id: 'jamb-utme-mock', name: 'JAMB UTME e-PIN (With Mock)', provider: 'Joint Admissions and Matriculation Board', unitPrice: 7700, description: 'UTME Registration PIN inclusive of optional CBT Mock Practice Exam fee', validity: 'Current Session' },
  { id: 'jamb-de', name: 'JAMB Direct Entry (DE) e-PIN', provider: 'Joint Admissions and Matriculation Board', unitPrice: 6200, description: 'Direct Entry candidate profile e-PIN for diploma / NCE / degree holders', validity: 'Current Session' },
  { id: 'nabteb-pin', name: 'NABTEB Result Checker Card', provider: 'National Business and Technical Examinations Board', unitPrice: 1500, description: 'Serial & PIN for Nov/Dec and May/June NABTEB technical results', validity: '5 Usages' },
];

export const INITIAL_PROMO_CODES: PromoCode[] = [
  { code: 'VELTRIPAY50', description: '50% off fees or ₦100 instant cashback on your next data order', discountType: 'fixed', discountValue: 100, minSpend: 500, maxDiscount: 100, applicableServices: ['data', 'airtime'], expiresAt: '2026-12-31', isActive: true, usedCount: 142, maxUsage: 1000 },
  { code: 'NAIJA2026', description: '5% bonus data discount on any MTN or Airtel bundle above ₦1,000', discountType: 'percentage', discountValue: 5, minSpend: 1000, maxDiscount: 250, applicableServices: ['data'], expiresAt: '2026-12-31', isActive: true, usedCount: 88, maxUsage: 500 },
  { code: 'POWERUP', description: 'Zero service fee + ₦150 cashback on Electricity DISCO bills', discountType: 'fixed', discountValue: 150, minSpend: 2500, maxDiscount: 150, applicableServices: ['electricity'], expiresAt: '2026-12-31', isActive: true, usedCount: 65, maxUsage: 300 },
];

export const PROMO_CODES = INITIAL_PROMO_CODES;

export const INITIAL_USER: UserProfile = {
  id: 'usr-928341',
  fullName: 'Tunde Adeleke',
  email: 'nauratecs@gmail.com',
  phone: '08034567890',
  role: 'user',
  walletBalance: 18450,
  commissionBalance: 1250,
  virtualAccount: {
    bankName: 'Wema Bank (VeltriPay Monify)',
    accountNumber: '7829104523',
    accountName: 'VeltriPay / DEMO USER',
    bankCode: '035',
    currency: 'NGN',
  },
  hasPin: true,
  biometricsEnabled: true,
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  referralCode: 'FLEX-TUNDE7',
  loyaltyPoints: 480,
  loyaltyTier: 'Silver',
  monthlySpendingLimit: 60000,
  currentMonthlySpend: 23800,
  isVerified: true,
  status: 'active',
  createdAt: '2026-01-15T10:30:00Z',
};

export const INITIAL_BENEFICIARIES: Beneficiary[] = [
  { id: 'ben-1', name: 'My MTN SIM (Primary)', phone: '08034567890', network: 'mtn', category: 'family', lastUsed: '2026-08-30T14:20:00Z' },
  { id: 'ben-2', name: 'Mum (Airtel Router)', phone: '08023456781', network: 'airtel', category: 'family', lastUsed: '2026-08-28T09:15:00Z' },
  { id: 'ben-3', name: 'Chinedu (Work)', phone: '08051234567', network: 'glo', category: 'work', lastUsed: '2026-08-25T11:45:00Z' },
  { id: 'ben-4', name: 'Bimbo (Sister)', phone: '08098765432', network: '9mobile', category: 'family', lastUsed: '2026-08-20T16:00:00Z' },
];

export const INITIAL_SAVINGS_GOALS: SavingsGoal[] = [
  {
    id: 'goal-1',
    title: 'September Data & Hotspot Budget',
    targetAmount: 12000,
    currentAmount: 8500,
    category: 'data',
    deadline: '2026-09-30',
    autoSaveEnabled: true,
    autoSaveAmount: 1000,
    autoSaveFrequency: 'weekly',
    status: 'active',
    createdAt: '2026-08-01T08:00:00Z',
  },
  {
    id: 'goal-2',
    title: 'Estate Electricity Top-up Vault',
    targetAmount: 25000,
    currentAmount: 15000,
    category: 'bills',
    deadline: '2026-10-05',
    autoSaveEnabled: false,
    status: 'active',
    createdAt: '2026-08-10T12:00:00Z',
  },
];

export const INITIAL_REFERRAL_STAT: ReferralStat = {
  referralCode: 'FLEX-TUNDE7',
  referralLink: 'https://veltrivexaiglobal.com/r/FLEX-TUNDE7',
  totalReferred: 8,
  activeReferees: 6,
  totalEarned: 3500,
  pendingReward: 400,
  referees: [
    { id: 'ref-1', name: 'Amina Bello', phone: '0814****291', date: '2026-08-29', rewardEarned: 500, status: 'completed' },
    { id: 'ref-2', name: 'Emeka Eze', phone: '0708****102', date: '2026-08-27', rewardEarned: 500, status: 'completed' },
    { id: 'ref-3', name: 'David Oladele', phone: '0805****678', date: '2026-08-24', rewardEarned: 500, status: 'completed' },
    { id: 'ref-4', name: 'Zainab Musa', phone: '0903****455', date: '2026-08-20', rewardEarned: 500, status: 'completed' },
    { id: 'ref-5', name: 'Segun Adebayo', phone: '0809****990', date: '2026-08-15', rewardEarned: 500, status: 'completed' },
    { id: 'ref-6', name: 'Blessing Okon', phone: '0812****334', date: '2026-08-10', rewardEarned: 500, status: 'completed' },
    { id: 'ref-7', name: 'Victor Nwosu', phone: '0705****882', date: '2026-08-31', rewardEarned: 200, status: 'pending' },
    { id: 'ref-8', name: 'Kafayat Salami', phone: '0913****119', date: '2026-08-31', rewardEarned: 200, status: 'pending' },
  ],
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-001',
    reference: 'PFX-20260901-789214',
    type: 'data',
    status: 'successful',
    amount: 1425,
    fee: 0,
    discount: 50,
    finalAmount: 1375,
    paymentMethod: 'wallet',
    balanceBefore: 19825,
    balanceAfter: 18450,
    timestamp: '2026-09-01T08:14:22Z',
    channel: 'mobile_app',
    metadata: {
      network: 'mtn',
      recipientPhone: '08034567890',
      planName: 'MTN SME 5GB',
      planSize: '5.0 GB',
      planValidity: '30 Days',
      cashbackEarned: 15,
      loyaltyPointsEarned: 25,
    },
  },
  {
    id: 'tx-002',
    reference: 'PFX-20260831-419820',
    type: 'wallet_fund',
    status: 'successful',
    amount: 10000,
    fee: 0,
    discount: 0,
    finalAmount: 10000,
    paymentMethod: 'bank_transfer',
    balanceBefore: 9825,
    balanceAfter: 19825,
    timestamp: '2026-08-31T19:40:10Z',
    channel: 'web',
    metadata: {
      fundingMethod: 'virtual_account',
      senderBank: 'Guaranty Trust Bank (GTBank)',
    },
  },
  {
    id: 'tx-003',
    reference: 'PFX-20260830-662198',
    type: 'airtime',
    status: 'successful',
    amount: 2000,
    fee: 0,
    discount: 40,
    finalAmount: 1960,
    paymentMethod: 'wallet',
    balanceBefore: 11785,
    balanceAfter: 9825,
    timestamp: '2026-08-30T14:15:33Z',
    channel: 'mobile_app',
    metadata: {
      network: 'airtel',
      recipientPhone: '08023456781',
      discountAmount: 40,
      loyaltyPointsEarned: 10,
    },
  },
  {
    id: 'tx-004',
    reference: 'PFX-20260828-991204',
    type: 'electricity',
    status: 'successful',
    amount: 5000,
    fee: 100,
    discount: 150,
    finalAmount: 4950,
    paymentMethod: 'wallet',
    balanceBefore: 16735,
    balanceAfter: 11785,
    timestamp: '2026-08-28T11:05:44Z',
    channel: 'web',
    metadata: {
      disco: 'Ikeja Electric (IKEDC)',
      meterNumber: '14235678901',
      meterType: 'prepaid',
      customerName: 'CHIEF BABATUNDE ADELEKE',
      customerAddress: '14 Allen Avenue, Ikeja GRA, Lagos',
      token: '4820 1934 8102 7741 0921',
      units: '78.4 kWh',
      promoCodeApplied: 'POWERUP',
      loyaltyPointsEarned: 40,
    },
  },
  {
    id: 'tx-005',
    reference: 'PFX-20260825-102948',
    type: 'cable',
    status: 'successful',
    amount: 7200,
    fee: 50,
    discount: 0,
    finalAmount: 7250,
    paymentMethod: 'wallet',
    balanceBefore: 23985,
    balanceAfter: 16735,
    timestamp: '2026-08-25T16:30:12Z',
    channel: 'mobile_app',
    metadata: {
      cableProvider: 'GOtv Nigeria',
      smartCardNo: '7023491823',
      bouquetName: 'GOtv Max',
      customerName: 'TUNDE ADELEKE',
    },
  },
  {
    id: 'tx-006',
    reference: 'PFX-20260822-384910',
    type: 'education',
    status: 'successful',
    amount: 3500,
    fee: 0,
    discount: 0,
    finalAmount: 3500,
    paymentMethod: 'wallet',
    balanceBefore: 27485,
    balanceAfter: 23985,
    timestamp: '2026-08-22T09:12:00Z',
    channel: 'web',
    metadata: {
      examType: 'WAEC Result Checker PIN',
      examQuantity: 1,
      generatedPins: ['PIN: 918237461928 | SERIAL: WRCN202699102'],
    },
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Data Delivered Instantly ⚡',
    message: 'Your MTN 5GB SME bundle was successfully credited to 08034567890. Ref: PFX-20260901-789214.',
    type: 'transaction',
    read: false,
    createdAt: '2026-09-01T08:14:25Z',
    linkTab: 'transactions',
  },
  {
    id: 'notif-2',
    title: 'Wallet Funded ₦10,000.00',
    message: 'Inflow received via Wema virtual account from GTBank. Your wallet balance is now ₦19,825.00.',
    type: 'transaction',
    read: false,
    createdAt: '2026-08-31T19:40:15Z',
    linkTab: 'wallet',
  },
  {
    id: 'notif-3',
    title: 'Referral Bonus Received 🎁',
    message: 'Amina Bello completed her first data transaction. ₦500 bonus has been credited to your commission balance.',
    type: 'promo',
    read: true,
    createdAt: '2026-08-29T17:00:00Z',
    linkTab: 'rewards',
  },
  {
    id: 'notif-4',
    title: 'Security Alert: Biometrics Active',
    message: 'Biometric authorization was enabled for 1-tap PIN purchases on your Android device.',
    type: 'security',
    read: true,
    createdAt: '2026-08-20T10:00:00Z',
    linkTab: 'account',
  },
];

export const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-101',
    ticketNo: 'TKT-2026-0841',
    transactionRef: 'PFX-20260828-991204',
    subject: 'Token verification on Prepaid meter',
    category: 'bills_payment',
    status: 'resolved',
    priority: 'medium',
    createdAt: '2026-08-28T11:20:00Z',
    updatedAt: '2026-08-28T11:45:00Z',
    messages: [
      {
        id: 'msg-1',
        sender: 'user',
        senderName: 'Tunde Adeleke',
        message: 'Hello, I bought ₦5,000 IKEDC prepaid token. How do I key it into my MOJEC meter if it displays Error 02?',
        timestamp: '2026-08-28T11:20:00Z',
      },
      {
        id: 'msg-2',
        sender: 'support',
        senderName: 'VeltriPay Support Agent (Zubair)',
        message: 'Hello Chief Tunde, please first enter 0000# to reset communication with the CIU keypad, then key in the 20-digit token (4820-1934-8102-7741-0921) followed by Enter. Let us know if you need further assistance!',
        timestamp: '2026-08-28T11:45:00Z',
      },
    ],
  },
];

export const FAQS = [
  {
    id: 'faq-1',
    question: 'How fast is Data & Airtime delivery on VeltriPay?',
    answer: 'Data and Airtime top-ups are automated and delivered within 2 to 10 seconds directly to the recipient SIM line through direct Nigerian telco API gateways.',
    q: 'How fast is Data & Airtime delivery on VeltriPay?',
    a: 'Data and Airtime top-ups are automated and delivered within 2 to 10 seconds directly to the recipient SIM line through direct Nigerian telco API gateways.',
  },
  {
    id: 'faq-2',
    question: 'How do I fund my wallet?',
    answer: 'You can fund your wallet by transferring funds from any Nigerian bank app to your dedicated VeltriPay Virtual Account (Wema Bank/Monnify). The wallet reflects instantly 24/7 without manual confirmation.',
    q: 'How do I fund my wallet?',
    a: 'You can fund your wallet by transferring funds from any Nigerian bank app to your dedicated VeltriPay Virtual Account (Wema Bank/Monnify). The wallet reflects instantly 24/7 without manual confirmation.',
  },
  {
    id: 'faq-3',
    question: 'What is the difference between SME, Gifting, and Corporate Data?',
    answer: 'SME data is subsidized small-business data with 30-day validity. Corporate Gifting is premium corporate pooled data that works on all SIMs (including post-paid and roaming). Direct bundles are standard telco network bundles.',
    q: 'What is the difference between SME, Gifting, and Corporate Data?',
    a: 'SME data is subsidized small-business data with 30-day validity. Corporate Gifting is premium corporate pooled data that works on all SIMs (including post-paid and roaming). Direct bundles are standard telco network bundles.',
  },
  {
    id: 'faq-4',
    question: 'How do I check my remaining data balance on my SIM?',
    answer: 'For MTN SME: Send 461 to 131 or dial *461*4#. For Airtel: Dial *140#. For Glo: Dial *127*0#. For 9mobile: Dial *228#.',
    q: 'How do I check my remaining data balance on my SIM?',
    a: 'For MTN SME: Send 461 to 131 or dial *461*4#. For Airtel: Dial *140#. For Glo: Dial *127*0#. For 9mobile: Dial *228#.',
  },
  {
    id: 'faq-5',
    question: 'What happens if a transaction fails?',
    answer: 'If a telco network is temporarily down, our system reverses the funds automatically back to your VeltriPay wallet balance within seconds. You can also request an instant refund from the transaction details screen.',
    q: 'What happens if a transaction fails?',
    a: 'If a telco network is temporarily down, our system reverses the funds automatically back to your VeltriPay wallet balance within seconds. You can also request an instant refund from the transaction details screen.',
  },
  {
    id: 'faq-6',
    question: 'How do I earn with the referral program?',
    answer: 'Share your unique referral link or code. When your friend registers and makes their first data or bill payment, you earn up to ₦500 instant cash directly to your commission wallet.',
    q: 'How do I earn with the referral program?',
    a: 'Share your unique referral link or code. When your friend registers and makes their first data or bill payment, you earn up to ₦500 instant cash directly to your commission wallet.',
  },
];
