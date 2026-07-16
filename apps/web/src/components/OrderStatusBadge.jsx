import React from 'react';

const OrderStatusBadge = ({ status }) => {
  const statusConfig = {
    pending: { emoji: '🟠', label: 'Pending', className: 'status-pending' },
    confirmed: { emoji: '🔵', label: 'Confirmed', className: 'status-confirmed' },
    packaging: { emoji: '🟣', label: 'Packaging', className: 'status-packaging' },
    dispatched: { emoji: '🟡', label: 'Dispatched', className: 'status-dispatched' },
    delivered: { emoji: '🟢', label: 'Delivered', className: 'status-delivered' },
    cancelled: { emoji: '🔴', label: 'Cancelled', className: 'status-cancelled' }
  };

  const normalizedStatus = status?.toLowerCase() || 'pending';
  const config = statusConfig[normalizedStatus] || statusConfig.pending;

  return (
    <span className={`status-badge ${config.className}`}>
      <span>{config.emoji}</span>
      <span>{config.label}</span>
    </span>
  );
};

export default OrderStatusBadge;