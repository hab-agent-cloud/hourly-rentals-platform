import ManagerListingsSection from '@/components/manager/ManagerListingsSection';
import ManagerCashSection from '@/components/manager/ManagerCashSection';
import ManagerTasksList from '@/components/manager/ManagerTasksList';
import ManagerReviewsSection from '@/components/manager/ManagerReviewsSection';
import ManageLimitsDialog from '@/components/om/ManageLimitsDialog';
import TeamAnalytics from '@/components/om/TeamAnalytics';
import { motion } from 'framer-motion';

interface ManagerData {
  role: string;
  balance?: number;
  pending_withdrawals?: number;
  total_earned?: number;
}

interface PaymentHistory {
  payments?: Array<Record<string, unknown>>;
}

interface ManagerDashboardContentProps {
  activeTab: string;
  managerData: ManagerData;
  adminId: number;
  paymentHistory: PaymentHistory | null;
  onFreezeListing: (listingId: number) => void;
  onUnfreezeListing: (listingId: number) => void;
  onRefresh: () => void;
  onWithdraw: (
    amount: string,
    method: 'sbp' | 'card' | 'salary',
    data: { phone: string; cardNumber: string; recipientName: string; bankName: string }
  ) => void;
}

export default function ManagerDashboardContent({
  activeTab,
  managerData,
  adminId,
  paymentHistory,
  onFreezeListing,
  onUnfreezeListing,
  onRefresh,
  onWithdraw,
}: ManagerDashboardContentProps) {
  const isOM = managerData.role === 'om';
  const isUM = managerData.role === 'um';

  return (
    <motion.div
      key={activeTab}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {activeTab === 'listings' && (
        <ManagerListingsSection
          managerData={managerData}
          adminId={adminId}
          onFreezeListing={onFreezeListing}
          onUnfreezeListing={onUnfreezeListing}
          onRefresh={onRefresh}
        />
      )}

      {activeTab === 'finance' && (
        <ManagerCashSection
          balance={managerData.balance}
          pendingWithdrawals={managerData.pending_withdrawals}
          totalEarned={managerData.total_earned}
          onWithdraw={onWithdraw}
          paymentHistory={paymentHistory}
        />
      )}

      {activeTab === 'tasks' && (
        <ManagerTasksList managerId={adminId} />
      )}

      {activeTab === 'reviews' && (
        <ManagerReviewsSection 
          adminId={adminId} 
          role={managerData.role || 'employee'}
        />
      )}

      {activeTab === 'team' && (isOM || isUM) && (
        <div className="space-y-4">
          <ManageLimitsDialog />
          <TeamAnalytics />
        </div>
      )}
    </motion.div>
  );
}