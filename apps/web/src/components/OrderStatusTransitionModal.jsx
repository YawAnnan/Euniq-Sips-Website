import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import apiServerClient from '@/lib/apiServerClient';
import OrderStatusBadge from './OrderStatusBadge.jsx';

const OrderStatusTransitionModal = ({ isOpen, onClose, currentStatus, orderId, onStatusUpdate }) => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statusFlow = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['packaging', 'cancelled'],
    packaging: ['dispatched', 'cancelled'],
    dispatched: ['delivered', 'cancelled'],
    delivered: [],
    cancelled: []
  };

  const getAvailableStatuses = () => {
    const normalizedStatus = currentStatus?.toLowerCase() || 'pending';
    return statusFlow[normalizedStatus] || [];
  };

  const handleStatusUpdate = async () => {
    if (!selectedStatus) {
      toast.error('Please select a new status');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiServerClient.fetch(`/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: selectedStatus })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update order status');
      }

      toast.success(`Order status updated to ${selectedStatus}`);
      onStatusUpdate(selectedStatus);
      onClose();
      setSelectedStatus('');
    } catch (error) {
      toast.error(error.message || 'Failed to update order status');
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableStatuses = getAvailableStatuses();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground border-border">
        <DialogHeader>
          <DialogTitle className="font-sans">Update Order Status</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Change the status of order <span className="font-mono text-foreground">{orderId}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div>
            <label className="text-sm font-medium mb-2 block text-foreground">Current Status</label>
            <div className="flex items-center">
              <OrderStatusBadge status={currentStatus} />
            </div>
          </div>

          {availableStatuses.length > 0 ? (
            <div>
              <label className="text-sm font-medium mb-2 block text-foreground">New Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent className="bg-card text-card-foreground border-border">
                  {availableStatuses.map(status => (
                    <SelectItem key={status} value={status}>
                      <div className="flex items-center gap-2">
                        <OrderStatusBadge status={status} />
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="bg-muted/30 p-4 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground">
                {currentStatus === 'delivered' 
                  ? 'This order has been delivered. No further status changes are available.'
                  : 'This order has been cancelled. No further status changes are available.'}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={isSubmitting}
            className="transition-all duration-200"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleStatusUpdate} 
            disabled={isSubmitting || !selectedStatus || availableStatuses.length === 0}
            className="transition-all duration-200 active:scale-95"
          >
            {isSubmitting ? 'Updating...' : 'Update Status'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderStatusTransitionModal;