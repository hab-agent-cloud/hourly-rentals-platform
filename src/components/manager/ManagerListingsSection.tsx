import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import AddListingsDialog from './AddListingsDialog';
import AddOwnerDialog from './AddOwnerDialog';
import ListingsBaseDialog from './ListingsBaseDialog';

interface ManagerListingsSectionProps {
  managerData: any;
  adminId: number;
  onFreezeListing: (listingId: number) => void;
  onUnfreezeListing: (listingId: number) => void;
  onRefresh: () => void;
}

export default function ManagerListingsSection({ 
  managerData,
  adminId, 
  onFreezeListing, 
  onUnfreezeListing,
  onRefresh
}: ManagerListingsSectionProps) {
  const [showBaseDialog, setShowBaseDialog] = useState(false);

  const criticalCount = managerData?.listings?.filter((l: any) => l.urgency === 'critical').length || 0;
  const warningCount = managerData?.listings?.filter((l: any) => l.urgency === 'warning').length || 0;
  const noPaymentsCount = managerData?.listings?.filter((l: any) => l.no_payments).length || 0;

  return (
    <>
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <CardTitle className="flex items-center gap-2">
              <Icon name="Building2" size={20} />
              Мои объекты ({managerData.listings?.length || 0})
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
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-purple-50 hover:border-purple-300"
              onClick={() => setShowBaseDialog(true)}
            >
              <Icon name="Database" size={32} className="text-purple-600" />
              <div className="text-center">
                <div className="font-semibold text-lg">База объектов</div>
                <div className="text-sm text-muted-foreground">
                  {managerData.listings?.length || 0} объектов
                </div>
              </div>
            </Button>

            {criticalCount > 0 && (
              <div className="h-24 flex flex-col items-center justify-center gap-2 border border-red-300 bg-red-50 rounded-lg p-4">
                <Icon name="AlertCircle" size={32} className="text-red-600" />
                <div className="text-center">
                  <div className="font-semibold text-lg text-red-700">Критично</div>
                  <div className="text-sm text-red-600">
                    {criticalCount} {criticalCount === 1 ? 'объект' : 'объектов'}
                  </div>
                </div>
              </div>
            )}

            {warningCount > 0 && (
              <div className="h-24 flex flex-col items-center justify-center gap-2 border border-yellow-300 bg-yellow-50 rounded-lg p-4">
                <Icon name="AlertTriangle" size={32} className="text-yellow-600" />
                <div className="text-center">
                  <div className="font-semibold text-lg text-yellow-700">Скоро истечёт</div>
                  <div className="text-sm text-yellow-600">
                    {warningCount} {warningCount === 1 ? 'объект' : 'объектов'}
                  </div>
                </div>
              </div>
            )}

            {noPaymentsCount > 0 && (
              <div className="h-24 flex flex-col items-center justify-center gap-2 border border-blue-300 bg-blue-50 rounded-lg p-4">
                <Icon name="Info" size={32} className="text-blue-600" />
                <div className="text-center">
                  <div className="font-semibold text-lg text-blue-700">Нет пополнений</div>
                  <div className="text-sm text-blue-600">
                    {noPaymentsCount} {noPaymentsCount === 1 ? 'объект' : 'объектов'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <ListingsBaseDialog
        show={showBaseDialog}
        onClose={() => setShowBaseDialog(false)}
        listings={managerData?.listings || []}
        onFreezeListing={onFreezeListing}
        onUnfreezeListing={onUnfreezeListing}
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