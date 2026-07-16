import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import { Search, Package, Truck, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import apiServerClient from '@/lib/apiServerClient';
import CancelOrderModal from '@/components/CancelOrderModal';

const OrderTrackingPage = () => {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialId);
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (initialId) {
      handleSearch(initialId);
    }
  }, [initialId]);

  const handleSearch = async (query = searchQuery) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setOrder(null);
    
    try {
      // Try searching by ID first
      let response = await apiServerClient.fetch(`/orders/${query}`);
      
      if (!response.ok) {
        // If not found by ID, try searching by email
        response = await apiServerClient.fetch(`/orders/search?email=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Order not found');
        
        const data = await response.json();
        if (data.length === 0) throw new Error('No orders found for this email');
        setOrder(data[0]); // Show most recent order
      } else {
        const data = await response.json();
        setOrder(data);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Search Failed",
        description: "Could not find an order with that ID or email.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock className="w-6 h-6 text-yellow-500" />;
      case 'Processing': return <Package className="w-6 h-6 text-blue-500" />;
      case 'Shipped': return <Truck className="w-6 h-6 text-purple-500" />;
      case 'Delivered': return <CheckCircle2 className="w-6 h-6 text-green-500" />;
      case 'Cancelled': return <XCircle className="w-6 h-6 text-destructive" />;
      default: return <Clock className="w-6 h-6 text-muted-foreground" />;
    }
  };

  const canCancel = order && (order.status === 'Pending' || order.status === 'Processing');

  return (
    <>
      <Helmet>
        <title>Track Order - Euniq Sips</title>
      </Helmet>

      <div className="bg-background min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">Track Your Order</h1>
            <p className="text-muted-foreground">Enter your Order ID or Email Address to check the status.</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm mb-8">
            <div className="flex gap-4">
              <Input
                type="text"
                placeholder="e.g. ORD-1234567890 or email@example.com"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 text-lg"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button 
                onClick={() => handleSearch()} 
                disabled={isLoading || !searchQuery.trim()}
                className="h-12 px-8 bg-secondary text-secondary-foreground hover:bg-secondary/90"
              >
                {isLoading ? 'Searching...' : <><Search className="mr-2 h-5 w-5" /> Track</>}
              </Button>
            </div>
          </div>

          {order && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Status Banner */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    {getStatusIcon(order.status)}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Status</p>
                    <h2 className="text-2xl font-bold text-primary">{order.status}</h2>
                  </div>
                </div>
                
                {canCancel && (
                  <Button 
                    variant="outline" 
                    className="border-destructive text-destructive hover:bg-destructive/10"
                    onClick={() => setIsCancelModalOpen(true)}
                  >
                    Cancel Order
                  </Button>
                )}
              </div>

              {/* Order Details Grid */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                  <h3 className="font-semibold text-lg mb-4 border-b border-border pb-2">Order Information</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order ID</span>
                      <span className="font-medium">{order.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date Placed</span>
                      <span className="font-medium">{new Date(order.orderDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Status</span>
                      <span className={`font-medium ${order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Est. Delivery</span>
                      <span className="font-medium">  {order.estimatedDeliveryDate ? new Date(order.estimatedDeliveryDate).toLocaleDateString() : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                  <h3 className="font-semibold text-lg mb-4 border-b border-border pb-2">Delivery Details</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-muted-foreground block mb-1">Customer</span>
                      <span className="font-medium block">{order.customerName}</span>
                      <span className="text-muted-foreground block">{order.email}</span>
                      <span className="text-muted-foreground block">{order.phone}</span>
                    </div>
                    <div className="pt-2">
                      <span className="text-muted-foreground block mb-1">Address</span>
                      <span className="font-medium block">{order.deliveryAddress}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg mb-4 border-b border-border pb-2">Items Ordered</h3>
                <div className="space-y-4 mb-6">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.variantName} x {item.quantity}</p>
                      </div>
                      <p className="font-semibold">GHS {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2 text-sm border-t border-border pt-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>  GHS {(order.totalAmount - (order.shippingCost || 0) - (order.taxAmount || 0)).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>GHS {(order.shippingCost || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>GHS {(order.taxAmount || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-border mt-2">
                    <span>Total</span>
                    <span className="text-primary">GHS {order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {order && (
        <CancelOrderModal 
          isOpen={isCancelModalOpen} 
          onClose={() => setIsCancelModalOpen(false)} 
          orderId={order.orderId}
          onCancelSuccess={() => handleSearch(order.orderId)}
        />
      )}
    </>
  );
};

export default OrderTrackingPage;