import apiServerClient from '@/lib/apiServerClient';

export const initializePayment = async (amount, email, reference, customerName) => {
  const response = await apiServerClient.fetch('/paystack/initialize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, email, reference, customerName })
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to initialize payment');
  }
  
  return await response.json();
};

export const verifyPayment = async (reference) => {
  const response = await apiServerClient.fetch('/paystack/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reference })
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to verify payment');
  }
  
  return await response.json();
};