import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '@/hooks/useCart.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast.js';
import { ShieldCheck, ArrowRight, TrendingDown, Loader2 } from 'lucide-react';
import { calculatePrice } from '@/lib/pricingTiers.js';
import apiServerClient from '@/lib/apiServerClient.js';
import MixPackOrderSummary from '@/components/MixPackOrderSummary.jsx';

const CheckoutPage = () => {
  const { cartItems, clearCart, getCartTotalQuantity } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    region: '',
    city: '',
    deliveryAddress: '',
    landmark: '',
    deliveryNotes: ''
  });

  // Check for returning Paystack redirect and verify payment
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const reference = urlParams.get('reference');

    if (reference) {
      verifyPayment(reference);
    } else if (cartItems.length === 0) {
      navigate('/products');
    }
  }, [cartItems.length, navigate]);

  const verifyPayment = async (reference) => {
    setIsProcessing(true);
    try {
      const response = await apiServerClient.fetch('/paystack/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment verification failed');
      }

      // On successful verification, clear the cart and redirect to success page
      clearCart();
      navigate(`/order-success?reference=${data.reference || reference}`, { replace: true });
      
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        variant: "destructive",
        title: "Payment Verification Failed",
        description: error.message || "We could not verify your payment. Please contact support.",
      });
      setIsProcessing(false);
    }
  };

  // Calculate totals separating mix packs and standard items
  const standardItems = cartItems.filter(item => item.product.type !== 'mix_pack');
  const mixPackItems = cartItems.filter(item => item.product.type === 'mix_pack');
  
  const standardQty = standardItems.reduce((sum, item) => sum + item.quantity, 0);
  const { tierName, unitPrice } = calculatePrice(standardQty);
  
  const standardSubtotal = standardQty * unitPrice;
  const mixPackSubtotal = mixPackItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  const retailPrice = 90;
  const savings = standardQty > 0 ? (standardQty * retailPrice - standardSubtotal) : 0;
  const hasSavings = savings > 0;

  const totalAmount = standardSubtotal + mixPackSubtotal;
  const totalQty = getCartTotalQuantity();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Validate phone to extract numeric value
    const numericPhone = formData.phone.replace(/\D/g, '');

    // Validation to ensure both phone and address are provided
    if (!numericPhone || numericPhone.length < 8) {
      toast({
        variant: "destructive",
        title: "Invalid Phone Number",
        description: "Please provide a valid numeric phone number (minimum 8 digits).",
      });
      setIsProcessing(false);
      return;
    }

    if (!formData.deliveryAddress?.trim()) {
      toast({
        variant: "destructive",
        title: "Required Field Missing",
        description: "Please provide a valid Delivery Address.",
      });
      setIsProcessing(false);
      return;
    }

    try {
      const fullShippingNotes = [
        formData.deliveryAddress,
        formData.landmark,
        formData.city,
        formData.region
      ].filter(Boolean).join(', ');

      const finalDeliveryAddress = formData.deliveryNotes 
        ? `${fullShippingNotes} (Notes: ${formData.deliveryNotes})` 
        : fullShippingNotes;

      // Extract mix pack data for the new database field
      const mixPackData = mixPackItems.length > 0 ? {
        packs: mixPackItems.flatMap(item => item.product.packs),
        totalPacks: mixPackItems.reduce((sum, item) => sum + item.product.totalPacks, 0)
      } : null;

      // 1. Create Order via API Server
      const orderPayload = {
        customerName: formData.customerName,
        customerEmail: formData.email,
        phoneNumber: formData.phone,
        customerNumber: parseInt(numericPhone, 10),
        deliveryAddress: finalDeliveryAddress,
        mixPackData: mixPackData,
        items: cartItems.map(item => ({
          productId: item.product.id,
          variantId: item.variant.id,
          title: item.product.title,
          variantName: item.variant.name,
          quantity: item.quantity,
          unitPrice: item.product.type === 'mix_pack' ? item.product.price : unitPrice,
          type: item.product.type
        })),
        totalAmount: totalAmount,
        status: 'pending',
        paymentStatus: 'Pending'
      };

      const orderRes = await apiServerClient.fetch('/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload)
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      // 2. Initialize Paystack Transaction via API Server
      const response = await apiServerClient.fetch('/paystack/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalAmount,
          email: formData.email,
          reference: orderData.orderId,
          customerName: formData.customerName
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Payment initialization failed.');
      }

      // 3. Redirect to Paystack checkout URL. 
      window.location.href = data.authorizationUrl;

    } catch (error) {
      console.error('Checkout initialization error:', error);
      toast({
        variant: "destructive",
        title: "Checkout Failed",
        description: error.message || "An error occurred during checkout. Please try again.",
      });
      setIsProcessing(false);
    }
  };

  // Prevent showing empty form if cart is empty (unless verifying payment)
  if (cartItems.length === 0 && !isProcessing) return null;

  return (
    <>
      <Helmet>
        <title>Secure Checkout - Euniq Sips</title>
      </Helmet>

      <div className="bg-background min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2 tracking-tight">Secure Checkout</h1>
            <p className="text-muted-foreground">Complete your order details below to finalize.</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7">
              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm transition-all">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-3 text-card-foreground">
                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">1</span>
                    Contact Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="customerName">Full Name</Label>
                      <Input 
                        id="customerName" 
                        name="customerName" 
                        required 
                        value={formData.customerName}
                        onChange={handleInputChange}
                        placeholder="Kwame Osei"
                        disabled={isProcessing}
                        className="bg-background text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        required 
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="kwame@example.com"
                        disabled={isProcessing}
                        className="bg-background text-foreground"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="phone">Phone Number <span className="text-destructive">*</span></Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        type="tel" 
                        required 
                        value={formData.phone}
                        onChange={(e) => {
                          // Allow numbers, spaces, and plus sign during input
                          const val = e.target.value.replace(/[^\d\s+]/g, '');
                          setFormData(prev => ({ ...prev, phone: val }));
                        }}
                        placeholder="+233 20 123 4567"
                        disabled={isProcessing}
                        className="bg-background text-foreground"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Please enter a valid numeric phone number.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm transition-all">
                  <h2 className="text-xl font-semibold mb-6 flex items-center gap-3 text-card-foreground">
                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">2</span>
                    Delivery Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="region">Region</Label>
                      <Input 
                        id="region" 
                        name="region" 
                        required 
                        value={formData.region}
                        onChange={handleInputChange}
                        placeholder="Greater Accra"
                        disabled={isProcessing}
                        className="bg-background text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City/Town</Label>
                      <Input 
                        id="city" 
                        name="city" 
                        required 
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="East Legon"
                        disabled={isProcessing}
                        className="bg-background text-foreground"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="deliveryAddress">Delivery Address <span className="text-destructive">*</span></Label>
                      <Input 
                        id="deliveryAddress" 
                        name="deliveryAddress" 
                        required 
                        value={formData.deliveryAddress}
                        onChange={handleInputChange}
                        placeholder="15 Lagos Avenue"
                        disabled={isProcessing}
                        className="bg-background text-foreground"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="landmark">Landmark</Label>
                      <Input 
                        id="landmark" 
                        name="landmark" 
                        required 
                        value={formData.landmark}
                        onChange={handleInputChange}
                        placeholder="Opposite A&C Mall"
                        disabled={isProcessing}
                        className="bg-background text-foreground"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="deliveryNotes">Additional Delivery Notes (Optional)</Label>
                      <Input 
                        id="deliveryNotes" 
                        name="deliveryNotes" 
                        value={formData.deliveryNotes}
                        onChange={handleInputChange}
                        placeholder="call upon arrival"
                        disabled={isProcessing}
                        className="bg-background text-foreground"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-card border border-border rounded-2xl p-6 shadow-sm sticky top-28">
                <h2 className="text-xl font-semibold mb-6 text-card-foreground">Order Summary</h2>
                
                <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                  {cartItems.map((item, index) => {
                    const isMixPack = item.product.type === 'mix_pack';
                    const itemPrice = isMixPack ? item.product.price : unitPrice;
                    
                    return (
                      <div key={index} className="flex gap-4 py-3 border-b border-border/50 last:border-0">
                        <div className="w-16 h-16 bg-white border border-border rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                          <img 
                            src={item.product.image || item.product.images?.[0]} 
                            alt={item.product.title}
                            className="w-full h-full object-contain p-2"
                          />
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-medium text-sm text-foreground">{item.product.title}</h4>
                          {isMixPack ? (
                            <MixPackOrderSummary item={item} />
                          ) : (
                            <p className="text-xs text-muted-foreground">{item.variant.name}</p>
                          )}
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-sm text-muted-foreground">Qty: {item.quantity}</span>
                            <span className="font-semibold text-sm">GH₵{(item.quantity * itemPrice).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-3 border-t border-border pt-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal ({totalQty} packs)</span>
                    <span className="font-medium">GH₵{(standardSubtotal + mixPackSubtotal).toFixed(2)}</span>
                  </div>
                  
                  {hasSavings && (
                    <div className="flex justify-between text-sm bg-emerald-50/50 p-2 -mx-2 rounded-lg text-emerald-700">
                      <span className="flex items-center gap-1.5 font-medium">
                        <TrendingDown className="w-4 h-4" />
                        {tierName} applied (Standard items)
                      </span>
                      <span className="font-bold">- GH₵{savings.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-lg font-bold pt-4 border-t border-border mt-2">
                    <span className="text-foreground">Total</span>
                    <span className="text-primary">GH₵{totalAmount.toFixed(2)}</span>
                  </div>
                  {hasSavings && (
                    <p className="text-xs text-right text-emerald-600 font-medium">
                      You're saving GH₵{(retailPrice - unitPrice).toFixed(2)} per standard pack!
                    </p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  form="checkout-form" 
                  className="w-full h-14 text-lg font-semibold rounded-xl shadow-md transition-all active:scale-[0.98]"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Confirm & Pay <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>

                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Secure payment processed via Paystack</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;