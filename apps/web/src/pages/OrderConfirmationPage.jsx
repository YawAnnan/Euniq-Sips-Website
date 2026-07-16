import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { verifyPayment } from '@/api/PaymentService';
import apiServerClient from '@/lib/apiServerClient';
import MixPackOrderSummary from '@/components/MixPackOrderSummary.jsx';

const OrderConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference');
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const verifyAndFetchOrder = async () => {
      if (!reference) {
        setStatus('error');
        return;
      }

      try {
        // Verify payment
        await verifyPayment(reference);
        
        // Fetch order details
        const response = await apiServerClient.fetch(`/orders/${reference}`);
        if (!response.ok) throw new Error('Order not found');
        
        const data = await response.json();
        setOrderDetails(data);
        setStatus('success');
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
      }
    };

    verifyAndFetchOrder();
  }, [reference]);

  if (status === 'verifying') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 text-secondary animate-spin mb-4" />
        <h2 className="text-2xl font-semibold text-primary">Verifying your payment...</h2>
        <p className="text-muted-foreground mt-2">Please do not close this window.</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-background px-4 text-center">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
          <span className="text-destructive text-2xl font-bold">!</span>
        </div>
        <h2 className="text-3xl font-bold text-primary mb-4">Payment Verification Failed</h2>
        <p className="text-muted-foreground max-w-md mb-8">
          We couldn't verify your payment. If you were charged, please contact support with your reference number: {reference}
        </p>
        <Button asChild className="bg-primary text-primary-foreground">
          <Link to="/contact">Contact Support</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Order Confirmed - Euniq Sips</title>
      </Helmet>

      <div className="bg-background min-h-screen py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-lg text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-secondary" />
            
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">Thank You for Your Order!</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Your payment was successful and your order is now being processed.
            </p>

            <div className="bg-muted/50 rounded-2xl p-6 text-left mb-8">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Order Number</p>
                  <p className="font-semibold text-primary">{orderDetails?.orderId}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Date</p>
                  <p className="font-semibold text-primary">
                    {new Date(orderDetails?.orderDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Paid</p>
                  <p className="font-semibold text-primary">GHS {orderDetails?.totalAmount?.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                  <p className="font-semibold text-primary">Paystack</p>
                </div>
              </div>

              {orderDetails?.items && orderDetails.items.length > 0 && (
                <div className="border-t border-border pt-6 mt-6">
                  <h3 className="font-semibold text-primary mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {orderDetails.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">{item.title}</p>
                          {item.type === 'mix_pack' && orderDetails.mixPackData ? (
                            <MixPackOrderSummary item={{ product: { type: 'mix_pack', packs: orderDetails.mixPackData.packs } }} />
                          ) : (
                            <p className="text-xs text-muted-foreground">{item.variantName}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">Qty: {item.quantity}</p>
                          <p className="text-xs text-muted-foreground">GHS {(item.unitPrice * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to={`/order-tracking?id=${orderDetails?.orderId}`}>
                  <Package className="mr-2 h-5 w-5" />
                  Track Order
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5">
                <Link to="/products">
                  Continue Shopping
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmationPage;