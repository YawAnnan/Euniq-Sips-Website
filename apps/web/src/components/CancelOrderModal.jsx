import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import apiServerClient from '@/lib/apiServerClient';

const CancelOrderModal = ({ isOpen, onClose, orderId, onCancelSuccess }) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleCancel = async () => {
    if (!reason) {
      toast({
        variant: "destructive",
        title: "Reason required",
        description: "Please select a reason for cancellation.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiServerClient.fetch(`/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cancellationReason: reason })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel order');
      }

      toast({
        title: "Order Cancelled",
        description: "Your order has been successfully cancelled.",
      });
      onCancelSuccess();
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Cancellation Failed",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cancel Order</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel order {orderId}? This action cannot be undone. 
            Refunds for paid orders will be processed within 3-5 business days according to our refund policy.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <label className="text-sm font-medium mb-2 block">Reason for cancellation</label>
          <Select value={reason} onValueChange={setReason}>
            <SelectTrigger>
              <SelectValue placeholder="Select a reason" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Changed mind">Changed mind</SelectItem>
              <SelectItem value="Found better price">Found better price</SelectItem>
              <SelectItem value="Delivery too slow">Delivery too slow</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Keep Order
          </Button>
          <Button variant="destructive" onClick={handleCancel} disabled={isSubmitting || !reason}>
            {isSubmitting ? 'Cancelling...' : 'Confirm Cancellation'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CancelOrderModal;