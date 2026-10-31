export type Language = 'uz' | 'ru' | 'en';

export type ScreenType = 
  | 'price_board'
  | 'product_detail'
  | 'supplier_compare'
  | 'alerts'
  | 'group_order'
  | 'delivery_scan'
  | 'savings_result'
  | 'profile';

export type Market = "O'rikzor" | "Food City" | "Chorsu" | "All";

export interface TrendPoint {
  day: number;
  date: string;
  price: number;
}

export interface Product {
  id: string;
  nameUz: string;
  nameRu: string;
  nameEn: string;
  unit: string;
  icon: string;
  category: string;
  todayPrice: number; // in UZS
  previousPrice: number;
  fairMin: number;
  fairMax: number;
  poolPrice: number; // Tier 1 group buy price
  volumeMin: string;
  change7dPercent: number; // negative = cheaper (good for buyer), positive = more expensive
  markets: {
    [key in "O'rikzor" | "Food City" | "Chorsu"]?: number;
  };
  trend30d: TrendPoint[];
}

export interface Supplier {
  id: string;
  name: string;
  market: string;
  pricePerUnit: number;
  verified: boolean;
  rating: number;
  reviewCount: number;
  minOrderQty: number;
  unit: string;
  deliveryTime: string;
  badge?: string;
  phone: string;
}

export interface PoolParticipant {
  id: string;
  name: string;
  mahalla: string;
  item: string;
  qty: number;
  unit: string;
  joinedAt: string;
  isCurrentUser?: boolean;
}

export interface GroupPool {
  id: string;
  name: string;
  district: string;
  status: 'forming' | 'locked' | 'ordered' | 'delivered';
  targetParticipants: number;
  participants: PoolParticipant[];
  tiers: {
    minParticipants: number;
    pricePerKg: number;
    label: string;
  }[];
  currentTier: number;
  vanFeeTotal: number;
  vanFeePerShop: number;
  deadlineMinutesLeft: number;
}

export interface PriceAlert {
  id: string;
  productId: string;
  productName: string;
  targetPrice: number;
  currentPrice: number;
  market: string;
  isActive: boolean;
  isTriggeredToday?: boolean;
  triggeredMessage?: string;
}

export interface CartItem {
  id: string;
  productName: string;
  qty: number;
  unit: string;
  oldPrice: number;
  pooledPrice: number;
  oldTotal: number;
  pooledTotal: number;
}
