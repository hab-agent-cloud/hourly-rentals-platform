import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import AddListingsDialog from './AddListingsDialog';
import AddOwnerDialog from './AddOwnerDialog';
import ListingsBaseDialog from './ListingsBaseDialog';
import { motion } from 'framer-motion';

interface ManagerListingsSectionProps {
  managerData: any;
  adminId: number;
  onFreezeListing: (listingId: number) => void;
  onUnfreezeListing: (listingId: number) => void;
  onDeactivateListing: (listingId: number) => void;
  onRefresh: () => void;
}

export default function ManagerListingsSection({ 
  managerData,
  adminId, 
  onFreezeListing, 
  onUnfreezeListing,
  onDeactivateListing,
  onRefresh
}: ManagerListingsSectionProps) {
  const [showBaseDialog, setShowBaseDialog] = useState(false);

  const criticalCount = managerData?.listings?.filter((l: any) => l.urgency === 'critical').length || 0;
  const warningCount = managerData?.listings?.filter((l: any) => l.urgency === 'warning').length || 0;
  const noPaymentsCount = managerData?.listings?.filter((l: any) => l.no_payments).length || 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-lg border-2 border-purple-200 bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl" />
          <CardHeader className="relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <CardTitle className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Icon name="Building2" size={24} className="text-purple-600" />
                </motion.div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Мои объекты ({managerData.listings?.length || 0})
                </span>
              </CardTitle>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <AddOwnerDialog
                adminId={adminId}
                managedListings={managerData.listings || []}
                onSuccess={onRefresh}
              />
              <AddListingsDialog
                adminId={adminId}
                currentCount={managerData.objects_count || 0}
                objectLimit={managerData.object_limit || 200}
                onSuccess={onRefresh}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                className="h-28 w-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 hover:from-purple-100 hover:to-purple-200 hover:border-purple-400 shadow-lg transition-all"
                onClick={() => setShowBaseDialog(true)}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Icon name="Database" size={36} className="text-purple-600" />
                </motion.div>
                <div className="text-center">
                  <div className="font-bold text-lg text-purple-900">База объектов</div>
                  <div className="text-sm font-semibold text-purple-700">
                    {managerData.listings?.length || 0} объектов
                  </div>
                </div>
              </Button>
            </motion.div>

            {criticalCount > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="h-28 flex flex-col items-center justify-center gap-2 border-2 border-red-400 bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 shadow-lg"
              >
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  <Icon name="AlertCircle" size={36} className="text-red-600" />
                </motion.div>
                <div className="text-center">
                  <div className="font-bold text-lg text-red-700">⚠️ Критично</div>
                  <div className="text-sm font-semibold text-red-600">
                    {criticalCount} {criticalCount === 1 ? 'объект' : 'объектов'}
                  </div>
                </div>
              </motion.div>
            )}

            {warningCount > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="h-28 flex flex-col items-center justify-center gap-2 border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 shadow-lg"
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Icon name="AlertTriangle" size={36} className="text-yellow-600" />
                </motion.div>
                <div className="text-center">
                  <div className="font-bold text-lg text-yellow-700">⏰ Скоро истечёт</div>
                  <div className="text-sm font-semibold text-yellow-600">
                    {warningCount} {warningCount === 1 ? 'объект' : 'объектов'}
                  </div>
                </div>
              </motion.div>
            )}

            {noPaymentsCount > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="h-28 flex flex-col items-center justify-center gap-2 border-2 border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 shadow-lg"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Icon name="Info" size={36} className="text-blue-600" />
                </motion.div>
                <div className="text-center">
                  <div className="font-bold text-lg text-blue-700">💳 Нет пополнений</div>
                  <div className="text-sm font-semibold text-blue-600">
                    {noPaymentsCount} {noPaymentsCount === 1 ? 'объект' : 'объектов'}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </CardContent>
        </Card>
      </motion.div>

      <ListingsBaseDialog
        show={showBaseDialog}
        onClose={() => setShowBaseDialog(false)}
        listings={managerData?.listings || []}
        adminId={adminId}
        onFreezeListing={onFreezeListing}
        onUnfreezeListing={onUnfreezeListing}
        onDeactivateListing={onDeactivateListing}
      />
      
      {managerData.tasks && managerData.tasks.length > 0 && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="CheckSquare" size={20} />
              Задачи от ОМ ({managerData.tasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {managerData.tasks.map((task: any) => (
                <div key={task.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 border rounded-lg shadow-sm bg-white">
                  <div className="flex-1">
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                    {task.deadline && (
                      <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                        <Icon name="Clock" size={12} />
                        До: {new Date(task.deadline).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <Button size="sm" className="w-full sm:w-auto">
                    <Icon name="Check" size={16} className="mr-1" />
                    Выполнено
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}