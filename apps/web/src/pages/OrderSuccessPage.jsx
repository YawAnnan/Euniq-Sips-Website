import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { CheckCircle2, ArrowRight, Home, MapPin, Calendar, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import pb from '@/lib/pocketbaseClient.js';

const OrderSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference');
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!reference) {
      setError('No order reference provided.');
      setIsLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const result = await pb.collection('orders').getList(1, 1, {
          filter: `orderId="${reference}"`,
          $autoCancel: false
        });

        if (result.items.length > 0) {
          setOrder(result.items[0]);
        } else {
          setError('Order not found.');
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [reference]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Helmet>
          <title>Order Not Found - Euniq Sips</title>
        </Helmet>
        <div className="bg-card border border-border rounded-2xl p-8 max-w-md w-full text-center shadow-sm">
          <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold mb-2 text-foreground">Order Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || 'We could not locate your order details.'}</p>
          <Button asChild className="w-full">
            <Link to="/">Return Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6">
      <Helmet>
        <title>Order Successful - Euniq Sips</title>
      </Helmet>

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3 font-sans">
            Payment Successful!
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Thank you, <span className="font-medium text-foreground">{order.customerName}</span>. Your order has been confirmed and is being processed.
          </p>
        </div>

        <div className="bg-card border border-border shadow-sm rounded-2xl overflow-hidden mb-8">
          <div className="bg-muted/30 px-6 py-4 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Order Reference</p>
              <p className="font-mono font-medium text-foreground">{order.orderId}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground sm:text-right">Date</p>
              <p className="font-medium text-foreground">
                {new Date(order.orderDate).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </p>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-foreground">Order Items</h3>
            <div className="space-y-4">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-3 border-b border-border/50 last:border-0">
                  <div>
                    <p className="font-medium text-foreground">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.variantName} x {item.quantity}</p>
                  </div>
                  <p className="font-medium text-foreground">GH₵{(item.unitPrice * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border flex justify-between items-center text-lg font-bold">
              <span className="text-foreground">Total Amount</span>
              <span className="text-primary">GH₵{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 font-semibold mb-3 text-foreground">
              <MapPin className="w-5 h-5 text-primary" />
              Delivery Address
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {order.shippingAddress || 'No address provided'}
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 font-semibold mb-3 text-foreground">
              <Calendar className="w-5 h-5 text-primary" />
              Estimated Delivery
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Usually within 2-3 business days. We will contact you at <span className="font-medium text-foreground">{order.customerEmail}</span> with updates.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild variant="outline" className="h-12 px-8 text-base">
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <Button asChild className="h-12 px-8 text-base">
            <Link to="/products">
              Continue Shopping
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;