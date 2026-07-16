import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Loader2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import apiServerClient from '@/lib/apiServerClient';
import { useCart } from '@/hooks/useCart.jsx';

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference');
  console.log('Reference from URL:', reference);
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const { clearCart } = useCart();

  useEffect(() => {
    if (!reference) {
      setStatus('failed');
      return;
    }
    // Already verified during this session
    if (sessionStorage.getItem(`verified-${reference}`)) {
      setStatus('success');
      return;
    }  
    const verifyPayment = async () => {
      try {
        setStatus('verifying');

        const response = await apiServerClient.fetch('/paystack/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reference }),
        });

        const data = await response.json();

        console.log('Verify API response:', data);
        console.log('HTTP status:', response.status);
        console.log('Response OK:', response.ok);

        if (!response.ok) {
          throw new Error(
            data.error ||
            data.message ||
            'Payment verification failed'
          );
        }

        // Payment has been verified successfully
        setPaymentDetails(data);

        // Clear the customer's cart NOW
        clearCart();

        sessionStorage.setItem(`verified-${reference}`, 'true');

        // Remove temporary reference
        localStorage.removeItem('pendingOrderRef');

        // Show success message
        setStatus('success');
      } catch (error) {
        console.error('Verification error:', error);

        if (error.response) {
          console.log('Error response:', error.response);
        }

        setStatus('error');

        setErrorMessage(
          error.message +
          ' | Check browser console (F12) and backend terminal logs.'
        );
      }
    };

    verifyPayment();
  }, [reference, clearCart]);

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
          <XCircle className="w-10 h-10 text-destructive" />
        </div>
        <h2 className="text-3xl font-bold text-primary mb-4">Payment Verification Failed</h2>
        <p className="text-muted-foreground max-w-md mb-8">
          {errorMessage || "We couldn't verify your payment. If you were charged, please contact support."}
          <br /><br />
          Reference: <span className="font-mono text-primary">{reference}</span>
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild className="bg-primary text-primary-foreground">
            <Link to="/contact">Contact Support</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/order-tracking">Check Order Status</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Payment Successful - Euniq Sips</title>
      </Helmet>

      <div className="bg-background min-h-screen py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-lg text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-secondary" />
            
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">Payment Successful!</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Thank you for your purchase. Your order is now being processed.
            </p>

            <div className="bg-muted/50 rounded-2xl p-6 text-left mb-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Reference Number</p>
                  <p className="font-semibold text-primary font-mono text-sm">{paymentDetails?.reference}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Customer Email</p>
                  <p className="font-semibold text-primary truncate">{paymentDetails?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Amount Paid</p>
                  <p className="font-semibold text-primary">GHS {paymentDetails?.amount?.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Order Status</p>
                  <p className="font-semibold text-green-600">{paymentDetails?.orderStatus || 'Processing'}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to={`/order-tracking?id=${paymentDetails?.reference}`}>
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

export default SuccessPage;