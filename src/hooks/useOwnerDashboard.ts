import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

interface Owner {
  id: number;
  email: string;
  full_name: string;
  balance: number;
  bonus_balance: number;
  phone?: string;
}

interface Listing {
  id: number;
  title: string;
  city: string;
  auction: number;
  type: string;
  image_url: string;
  district: string;
  subscription_expires_at: string | null;
  is_archived: boolean;
  moderation_status?: string;
  moderation_comment?: string;
  price?: number;
  square_meters?: number;
  logo_url?: string;
  features?: string[];
  metro?: string;
  metro_walk?: number;
  has_parking?: boolean;
  min_hours?: number;
  lat?: number;
  lng?: number;
}

interface SubscriptionInfo {
  days_left: number | null;
  price_per_month: number;
  prices: {
    '30_days': number;
    '90_days': number;
  };
}

interface PromotionPackage {
  id: number;
  listing_id: number | null;
  listing_title: string | null;
  owner_id: number | null;
  package_type: 'bronze' | 'silver' | 'gold';
  price_paid: number;
  start_date: string | null;
  end_date: string | null;
  current_position: number;
}

interface PromotionInfo {
  packages: PromotionPackage[];
  pricing: {
    bronze: { price: number; range: string; description: string };
    silver: { price: number; range: string; description: string };
    gold: { price: number; range: string; description: string };
  };
  city: string;
}

interface Transaction {
  id: number;
  amount: number;
  type: string;
  description: string;
  balance_after: number;
  created_at: string;
  related_bid_id: number | null;
}

export function useOwnerDashboard() {
  const [owner, setOwner] = useState<Owner | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [promotionInfo, setPromotionInfo] = useState<PromotionInfo | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showCashbackAnimation, setShowCashbackAnimation] = useState(false);
  const [cashbackAmount, setCashbackAmount] = useState(0);
  const [subscriptionInfo, setSubscriptionInfo] = useState<Map<number, SubscriptionInfo>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [isTopupLoading, setIsTopupLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'promotion' | 'expert'>('overview');
  const [editingListing, setEditingListing] = useState<any | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const token = localStorage.getItem('ownerToken');
  const ownerId = localStorage.getItem('ownerId');

  useEffect(() => {
    console.log('Dashboard loaded. Token:', token ? 'exists' : 'missing', 'OwnerId:', ownerId);
    
    if (!token || !ownerId) {
      console.log('Missing credentials, redirecting to login');
      navigate('/owner/login');
      return;
    }

    const ownerData = localStorage.getItem('ownerData');
    if (ownerData) {
      setOwner(JSON.parse(ownerData));
    }

    loadOwnerListings();
    loadTransactions();
  }, [token, ownerId, navigate]);

  const loadOwnerListings = async () => {
    try {
      console.log('Loading listings for owner:', ownerId);
      const ownerListings = await api.getOwnerListings(token!, parseInt(ownerId!));
      console.log('Received listings:', ownerListings);
      console.log('Listings length:', ownerListings?.length);
      setListings(ownerListings);

      const subMap = new Map<number, SubscriptionInfo>();
      for (const listing of ownerListings) {
        try {
          const subInfo = await api.getSubscriptionInfo(listing.id);
          subMap.set(listing.id, subInfo);
        } catch (error) {
          console.error(`Failed to load subscription for listing ${listing.id}:`, error);
        }
      }
      setSubscriptionInfo(subMap);

      if (ownerListings.length > 0) {
        console.log('First listing city:', ownerListings[0].city);
        setSelectedListing(ownerListings[0]);
        loadPromotionInfo(ownerListings[0].city);
      }
    } catch (error) {
      console.error('Failed to load listings:', error);
    }
  };

  const loadPromotionInfo = async (city: string) => {
    try {
      console.log('Loading promotion info for city:', city, 'owner:', ownerId);
      if (!city || city.trim() === '') {
        console.error('City is empty, skipping promotion info load');
        return;
      }
      const info = await api.getPromotionInfo(city, parseInt(ownerId!));
      console.log('Promotion info loaded:', info);
      setPromotionInfo(info);
    } catch (error) {
      console.error('Failed to load promotion info:', error);
    }
  };

  const loadTransactions = async () => {
    try {
      const response = await api.getOwnerTransactions(token!, parseInt(ownerId!), 50);
      setTransactions(response.transactions || []);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    }
  };

  const handleListingSelect = (listing: Listing) => {
    setSelectedListing(listing);
    loadPromotionInfo(listing.city);
  };

  const handlePurchasePackage = async (listingId: number, city: string, packageType: 'bronze' | 'silver' | 'gold') => {
    const packagePrices = { bronze: 3000, silver: 5000, gold: 7000 };
    const price = packagePrices[packageType];
    const totalBalance = (owner?.balance || 0) + (owner?.bonus_balance || 0);

    if (price > totalBalance) {
      toast({
        title: 'Недостаточно средств',
        description: `Нужно ${price} ₽, у вас ${totalBalance} ₽`,
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.purchasePromotionPackage(
        token!,
        listingId,
        packageType
      );

      if (response.error) {
        throw new Error(response.error);
      }

      toast({
        title: 'Успешно!',
        description: response.message,
      });

      const updatedOwnerData = {
        ...owner!,
        balance: Math.max(0, owner!.balance - (price - Math.min(owner!.bonus_balance, price))),
        bonus_balance: Math.max(0, owner!.bonus_balance - Math.min(owner!.bonus_balance, price))
      };
      setOwner(updatedOwnerData);
      localStorage.setItem('ownerData', JSON.stringify(updatedOwnerData));

      loadOwnerListings();
      if (selectedListing) {
        loadPromotionInfo(selectedListing.city);
      }
      loadTransactions();
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось купить пакет',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTopup = async (amount: string) => {
    const amountNum = parseInt(amount);
    if (!amountNum || amountNum < 100) {
      toast({
        title: 'Ошибка',
        description: 'Минимальная сумма пополнения: 100 ₽',
        variant: 'destructive',
      });
      return;
    }

    setIsTopupLoading(true);

    try {
      const cashback = Math.floor(amountNum * 0.1);
      setCashbackAmount(cashback);
      setShowCashbackAnimation(true);
      
      setTimeout(() => {
        setShowCashbackAnimation(false);
      }, 3000);

      const response = await api.createPayment(parseInt(ownerId!), amountNum);

      if (response.error) {
        throw new Error(response.error);
      }

      window.location.href = response.confirmation_url;
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось создать платёж',
        variant: 'destructive',
      });
      setIsTopupLoading(false);
      setShowCashbackAnimation(false);
    }
  };

  const handleExtendSubscription = async (listingId: number, days: number) => {
    setIsLoading(true);
    try {
      const response = await api.extendSubscription(token!, parseInt(ownerId!), listingId, days);
      
      if (response.error) {
        throw new Error(response.error);
      }

      toast({
        title: 'Успешно!',
        description: response.message,
      });

      await loadOwnerListings();
      await loadTransactions();
      
      const ownerData = localStorage.getItem('ownerData');
      if (ownerData) {
        const updatedOwner = JSON.parse(ownerData);
        setOwner(updatedOwner);
      }
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось продлить подписку',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditListing = (listing: any) => {
    setEditingListing(listing);
  };

  const handleEditSuccess = async () => {
    await loadOwnerListings();
    toast({
      title: 'Изменения отправлены',
      description: 'Объект будет проверен администратором',
    });
  };

  const handleUnarchiveListing = async (listingId: number) => {
    setIsLoading(true);
    try {
      const response = await api.unarchiveListing(token!, listingId);
      if (response.error) {
        throw new Error(response.error);
      }

      toast({
        title: 'Успешно!',
        description: 'Объект восстановлен из архива',
      });

      await loadOwnerListings();
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось восстановить объект',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ownerToken');
    localStorage.removeItem('ownerId');
    localStorage.removeItem('ownerData');
    navigate('/owner/login');
  };

  return {
    owner,
    listings,
    selectedListing,
    promotionInfo,
    transactions,
    showCashbackAnimation,
    cashbackAmount,
    subscriptionInfo,
    isLoading,
    isTopupLoading,
    activeTab,
    editingListing,
    token,
    setActiveTab,
    setEditingListing,
    handleListingSelect,
    handlePurchasePackage,
    handleTopup,
    handleExtendSubscription,
    handleEditListing,
    handleEditSuccess,
    handleUnarchiveListing,
    handleLogout,
  };
}