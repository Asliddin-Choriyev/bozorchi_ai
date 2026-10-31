import { Product, Supplier, GroupPool, PriceAlert, CartItem } from '../types';

// Generate 30 days of price trend for Sugar
const generateTrend = (): { day: number; date: string; price: number }[] => {
  const points = [];
  const basePrices = [
    12800, 12750, 12800, 12700, 12650, 12600, 12650, 12500, 12550, 12400,
    12450, 12350, 12300, 12350, 12200, 12250, 12150, 12100, 12050, 12000,
    12050, 12100, 11950, 11900, 11850, 11900, 11850, 11800, 11800, 11800
  ];
  
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}`;
    points.push({
      day: 30 - i,
      date: dateStr,
      price: basePrices[29 - i]
    });
  }
  return points;
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'sugar',
    nameUz: 'Shakar (Rossiya/Xorazm)',
    nameRu: 'Сахар белый (песок)',
    nameEn: 'White Granulated Sugar',
    unit: 'kg',
    icon: '🍚',
    category: 'staple',
    todayPrice: 11800,
    previousPrice: 12150,
    fairMin: 11400,
    fairMax: 12800,
    poolPrice: 11400,
    volumeMin: '50 kg qop',
    change7dPercent: -2.88, // dropped 2.9% -> green/cheaper
    markets: {
      "Chorsu": 11800,
      "O'rikzor": 11950,
      "Food City": 12100
    },
    trend30d: generateTrend()
  },
  {
    id: 'flour',
    nameUz: 'Un 1-nav (Qozoq 50 kg qop)',
    nameRu: 'Мука 1 сорт (Казахстан 50 кг)',
    nameEn: 'Wheat Flour 1st grade (50kg bag)',
    unit: 'bag',
    icon: '🌾',
    category: 'staple',
    todayPrice: 265000,
    previousPrice: 261000,
    fairMin: 255000,
    fairMax: 280000,
    poolPrice: 255000,
    volumeMin: '10 qop',
    change7dPercent: 1.53, // up 1.5% -> red/more expensive
    markets: {
      "Chorsu": 268000,
      "O'rikzor": 265000,
      "Food City": 262000
    },
    trend30d: []
  },
  {
    id: 'oil',
    nameUz: 'Pista yog\'i (O\'zbegim 5L)',
    nameRu: 'Масло подсолнечное (5 л)',
    nameEn: 'Sunflower Oil (5L bottle)',
    unit: 'bottle',
    icon: '🌻',
    category: 'staple',
    todayPrice: 74000,
    previousPrice: 76500,
    fairMin: 71500,
    fairMax: 78000,
    poolPrice: 71500,
    volumeMin: '20 dona',
    change7dPercent: -3.27, // dropped 3.3% -> green
    markets: {
      "Chorsu": 75000,
      "O'rikzor": 74000,
      "Food City": 73500
    },
    trend30d: []
  },
  {
    id: 'rice',
    nameUz: 'Guruch Alanga (Xorazm)',
    nameRu: 'Рис Аланга (Хорезм)',
    nameEn: 'Rice Alanga (Khorezm)',
    unit: 'kg',
    icon: '🌾',
    category: 'staple',
    todayPrice: 14600,
    previousPrice: 14900,
    fairMin: 14000,
    fairMax: 15500,
    poolPrice: 13900,
    volumeMin: '50 kg qop',
    change7dPercent: -2.01,
    markets: {
      "Chorsu": 14500,
      "O'rikzor": 14600,
      "Food City": 14750
    },
    trend30d: []
  },
  {
    id: 'onion',
    nameUz: 'Piyoz (Surxondaryo yangi)',
    nameRu: 'Лук репчатый (новый урожай)',
    nameEn: 'Yellow Onion (Fresh harvest)',
    unit: 'kg',
    icon: '🧅',
    category: 'vegetable',
    todayPrice: 3100,
    previousPrice: 3300,
    fairMin: 2600,
    fairMax: 3600,
    poolPrice: 2600,
    volumeMin: '100 kg to\'r',
    change7dPercent: -6.06,
    markets: {
      "Chorsu": 3200,
      "O'rikzor": 3100,
      "Food City": 3000
    },
    trend30d: []
  },
  {
    id: 'eggs',
    nameUz: 'Tuxum C-1 (30 talik yashik)',
    nameRu: 'Яйцо куриное С-1 (30 шт)',
    nameEn: 'Farm Fresh Eggs C-1 (30 pack)',
    unit: 'tray',
    icon: '🥚',
    category: 'dairy',
    todayPrice: 37500,
    previousPrice: 36800,
    fairMin: 35000,
    fairMax: 39500,
    poolPrice: 35000,
    volumeMin: '10 yashik',
    change7dPercent: 1.9,
    markets: {
      "Chorsu": 38000,
      "O'rikzor": 37500,
      "Food City": 37000
    },
    trend30d: []
  }
];

export const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    name: 'Chorsu Optom Trade',
    market: 'Chorsu bozori, 4-baza',
    pricePerUnit: 11800,
    verified: true,
    rating: 4.8,
    reviewCount: 142,
    minOrderQty: 100,
    unit: 'kg',
    deliveryTime: 'Ertaga 08:30 gacha',
    badge: 'Eng arzon yakka narx',
    phone: '+998 90 123 45 67'
  },
  {
    id: 'sup-2',
    name: "O'rikzor Baraka Opt",
    market: "O'rikzor ulgurji bozori",
    pricePerUnit: 11950,
    verified: true,
    rating: 4.7,
    reviewCount: 98,
    minOrderQty: 200,
    unit: 'kg',
    deliveryTime: 'Ertaga 10:00 gacha',
    phone: '+998 93 987 65 43'
  },
  {
    id: 'sup-3',
    name: 'Food City Agro Trans',
    market: 'Food City Tashkent, Sektor B',
    pricePerUnit: 12100,
    verified: true,
    rating: 4.6,
    reviewCount: 210,
    minOrderQty: 500,
    unit: 'kg',
    deliveryTime: 'Ertaga 09:00 gacha',
    badge: 'Katta zaxira',
    phone: '+998 97 555 44 33'
  },
  {
    id: 'sup-4',
    name: 'Sergeli Baza Logistika',
    market: 'Sergeli Sanoat zonasi',
    pricePerUnit: 12400,
    verified: true,
    rating: 4.4,
    reviewCount: 64,
    minOrderQty: 100,
    unit: 'kg',
    deliveryTime: 'Bugun 19:00 gacha tezkor',
    phone: '+998 99 888 77 66'
  },
  {
    id: 'sup-5',
    name: 'Yunusobod Ta\'minot',
    market: 'Yunusobod universal bazasi',
    pricePerUnit: 12800,
    verified: false,
    rating: 4.2,
    reviewCount: 33,
    minOrderQty: 50,
    unit: 'kg',
    deliveryTime: 'Ertaga 14:00 gacha',
    phone: '+998 91 321 00 11'
  }
];

export const MOCK_CHILONZOR_POOL: GroupPool = {
  id: 'pool-chilonzor-9',
  name: 'Chilonzor-9 Birgalikda Xarid Klasteri',
  district: 'Chilonzor tumani, 9-mavze',
  status: 'locked', // 5 shops reached Tier 1!
  targetParticipants: 5,
  deadlineMinutesLeft: 42,
  vanFeeTotal: 375000, // Labo fee total
  vanFeePerShop: 75000, // 375,000 / 5 = 75,000 UZS
  currentTier: 1,
  tiers: [
    { minParticipants: 5, pricePerKg: 11400, label: 'Tier 1 (Eng arzon) — 11 400 UZS/kg' },
    { minParticipants: 3, pricePerKg: 12100, label: 'Tier 2 (O\'rta hajm) — 12 100 UZS/kg' },
    { minParticipants: 1, pricePerKg: 12800, label: 'Yakka xarid — 12 800 UZS/kg' }
  ],
  participants: [
    {
      id: 'p1',
      name: 'Dilshod Baqqollik (Siz)',
      mahalla: 'Chilonzor 9-12',
      item: 'Shakar, Un, Yog\'',
      qty: 500,
      unit: 'kg',
      joinedAt: '10:14',
      isCurrentUser: true
    },
    {
      id: 'p2',
      name: 'Farhod Market',
      mahalla: 'Chilonzor 9-14',
      item: 'Shakar, Guruch',
      qty: 400,
      unit: 'kg',
      joinedAt: '09:40'
    },
    {
      id: 'p3',
      name: 'Navro\'z Savdo Do\'koni',
      mahalla: 'Chilonzor 9-22',
      item: 'Shakar, Un',
      qty: 600,
      unit: 'kg',
      joinedAt: '09:55'
    },
    {
      id: 'p4',
      name: 'Oqtepa Minimarket',
      mahalla: 'Chilonzor 9-5',
      item: 'Shakar, Pista yog\'i',
      qty: 350,
      unit: 'kg',
      joinedAt: '10:02'
    },
    {
      id: 'p5',
      name: 'Nurziyo Baqqoli',
      mahalla: 'Chilonzor 9-31',
      item: 'Shakar',
      qty: 250,
      unit: 'kg',
      joinedAt: '10:18'
    }
  ]
};

// Real numbers from pitch deck
export const REAL_DECK_NUMBERS = {
  // Old way (solo buying)
  oldWay: {
    sugar: { qty: 500, unit: 'kg', price: 12800, total: 6400000 },
    flour: { qty: 15, unit: 'qop', price: 280000, total: 4200000 },
    oil: { qty: 60, unit: 'dona', price: 78000, total: 4680000 },
    deliveryTruck: 450000,
    totalCost: 15730000,
    timeHours: 16
  },
  // Pooled way (Birgalikda Xarid)
  pooledWay: {
    sugar: { qty: 500, unit: 'kg', price: 11400, total: 5700000 },
    flour: { qty: 15, unit: 'qop', price: 255000, total: 3825000 },
    oil: { qty: 60, unit: 'dona', price: 71500, total: 4290000 },
    sharedVan: 75000,
    totalCost: 13890000,
    timeMinutes: 15
  },
  // Exact savings
  savings: {
    moneyUZS: 1840000,
    percent: 11.7,
    timeSavedHours: 15,
    timeSavedMinutes: 45,
    coinsEarned: 2500
  }
};

export const MOCK_ALERTS: PriceAlert[] = [
  {
    id: 'alert-1',
    productId: 'sugar',
    productName: 'Shakar (Rossiya/Xorazm)',
    targetPrice: 11800,
    currentPrice: 11800,
    market: 'Chorsu',
    isActive: true,
    isTriggeredToday: true,
    triggeredMessage: 'Bugun 07:15 da narx 11 800 UZS ga tushdi (-300 UZS)!'
  },
  {
    id: 'alert-2',
    productId: 'flour',
    productName: 'Un 1-nav (Qozoq 50 kg)',
    targetPrice: 260000,
    currentPrice: 265000,
    market: "O'rikzor",
    isActive: true,
    isTriggeredToday: false
  },
  {
    id: 'alert-3',
    productId: 'oil',
    productName: 'Pista yog\'i (5L)',
    targetPrice: 72000,
    currentPrice: 74000,
    market: 'Food City',
    isActive: true,
    isTriggeredToday: false
  }
];

export const MOCK_USER_PROFILE = {
  shopName: 'Dilshod Baqqollik',
  ownerName: 'Dilshod Rustamov',
  phone: '+998 90 980 12 34',
  address: 'Toshkent sh., Chilonzor tumani, 9-mavze, 12-uy',
  joinedPoolsCount: 14,
  totalSavedUZS: 8450000,
  bozorCoins: 12500,
  verifiedStatus: 'Do\'kon tasdiqlangan (STIR 308941203)'
};
