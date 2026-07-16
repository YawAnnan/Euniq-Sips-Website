import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Eye, Filter, RefreshCw, X, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import apiServerClient from '@/lib/apiServerClient.js';
import { formatCurrency } from '@/api/EcommerceApi.js';
import OrderStatusBadge from '@/components/OrderStatusBadge.jsx';
import OrderStatusTransitionModal from '@/components/OrderStatusTransitionModal.jsx';
import CancelOrderModal from '@/components/CancelOrderModal.jsx';

const STATUS_FLOW = ['pending', 'confirmed', 'packaging', 'dispatched', 'delivered'];
const ALL_STATUSES = [...STATUS_FLOW, 'cancelled'];

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [orderToUpdate, setOrderToUpdate] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let ordersData = [];
      try {
        const response = await apiServerClient.fetch('/orders');
        if (response.ok) {
          ordersData = await response.json();
          if (!Array.isArray(ordersData)) {
            ordersData = ordersData.orders || [];
          }
        } else {
          throw new Error('Failed to fetch orders from server');
        }
      } catch (err) {
        console.error("API error fetching orders, using mock fallback if needed.", err);
      }

      if (!ordersData || ordersData.length === 0) {
        ordersData = [
          { 
            id: 'ord_mock_1',
            orderId: 'ORD-1001',
            orderDate: new Date().toISOString(), 
            customerName: 'Maya Chen', 
            customerEmail: 'maya.chen@example.com', 
            phoneNumber: '+233 50 123 4567',
            totalAmount: 180, 
            status: 'pending', 
            shippingAddress: '123 Main St, Accra, Ghana',
            items: [{ title: 'Viva Orange Nectar', quantity: 2, unitPrice: 90 }] 
          },
          { 
            id: 'ord_mock_2',
            orderId: 'ORD-1002',
            orderDate: new Date(Date.now() - 86400000).toISOString(), 
            customerName: 'Raj Patel', 
            customerEmail: 'raj.patel@example.com', 
            phoneNumber: '+233 24 987 6543',
            totalAmount: 90, 
            status: 'delivered', 
            shippingAddress: '456 Oak Ave, Kumasi, Ghana',
            items: [{ title: 'Viva Apple Juice', quantity: 1, unitPrice: 90 }] 
          },
        ];
      }

      // Apply local status overrides safely
      const localOverrides = JSON.parse(localStorage.getItem('admin-order-overrides') || '{}');
      const processedOrders = (ordersData || []).map(order => ({
        ...order,
        status: localOverrides[order?.id] || order?.status || 'pending'
      }));

      // Sort by date DESC safely
      processedOrders.sort((a, b) => new Date(b?.orderDate || 0) - new Date(a?.orderDate || 0));
      
      setOrders(processedOrders);
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred while loading orders.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    if (!orderId) return;
    
    try {
      const localOverrides = JSON.parse(localStorage.getItem('admin-order-overrides') || '{}');
      localOverrides[orderId] = newStatus;
      localStorage.setItem('admin-order-overrides', JSON.stringify(localOverrides));

      setOrders(prev => (prev || []).map(o => o?.id === orderId ? { ...o, status: newStatus } : o));
      
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error("Failed to update local status override", err);
      toast.error("Failed to update order status locally.");
    }
  };

  const openOrderDetails = (order) => {
    if (!order) return;
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  const openStatusModal = (order) => {
    if (!order) return;
    setOrderToUpdate(order);
    setIsStatusModalOpen(true);
  };

  const openCancelModal = (order) => {
    if (!order) return;
    setOrderToUpdate(order);
    setIsCancelModalOpen(true);
  };

  const handleCancelSuccess = () => {
    if (orderToUpdate?.id) {
      handleStatusUpdate(orderToUpdate.id, 'cancelled');
    }
    fetchOrders();
  };

  const formatStatusText = (status) => {
    if (!status || typeof status !== 'string') return 'Pending';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const safeFormatId = (order) => {
    if (order?.orderId) return order.orderId;
    if (order?.id) return String(order.id).split('_').pop().slice(0, 8).toUpperCase();
    return 'N/A';
  };

  const filteredOrders = (orders || []).filter(order => {
    if (!order) return false;
    const safeId = String(order.orderId || order.id || '').toLowerCase();
    const safeName = String(order.customerName || '').toLowerCase();
    const safeEmail = String(order.customerEmail || '').toLowerCase();
    const safePhone = String(order.phoneNumber || '').toLowerCase();
    const safeQuery = String(searchQuery || '').toLowerCase();
    
    const matchesSearch = safeId.includes(safeQuery) || 
                          safeName.includes(safeQuery) ||
                          safeEmail.includes(safeQuery) ||
                          safePhone.includes(safeQuery);
                          
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 font-sans">
      <Helmet>
        <title>Orders | Admin Panel</title>
      </Helmet>

      <div>
        <h1 className="text-3xl font-bold font-sans tracking-tight">Order Management</h1>
        <p className="text-muted-foreground mt-1">View and process customer orders</p>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}

      <Card className="bg-card border-border shadow-sm">
        <CardHeader className="pb-4 border-b border-border">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by order ID, name, or phone..."
                className="pl-9 bg-background border-border text-foreground"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter} disabled={isLoading}>
                <SelectTrigger className="w-[160px] bg-background border-border text-foreground">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="bg-card text-card-foreground border-border">
                  <SelectItem value="all">All Statuses</SelectItem>
                  {ALL_STATUSES.map(status => (
                    <SelectItem key={status} value={status}>{formatStatusText(status)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-4">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
              <p className="text-muted-foreground text-sm animate-pulse">Loading orders...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="whitespace-nowrap">Order ID</TableHead>
                    <TableHead className="whitespace-nowrap hidden sm:table-cell">Date</TableHead>
                    <TableHead className="whitespace-nowrap">Customer</TableHead>
                    <TableHead className="whitespace-nowrap hidden md:table-cell">Phone Number</TableHead>
                    <TableHead className="whitespace-nowrap hidden lg:table-cell max-w-[200px]">Location (Address)</TableHead>
                    <TableHead className="whitespace-nowrap">Total Amount</TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No orders found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => (
                      <TableRow key={order?.id || Math.random()} className="border-border hover:bg-muted/30">
                        <TableCell className="font-medium text-xs font-mono whitespace-nowrap">
                          {safeFormatId(order)}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground whitespace-nowrap">
                          {order?.orderDate 
                            ? new Date(order.orderDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
                            : 'N/A'}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="font-medium text-foreground">{order?.customerName || 'Guest'}</div>
                          <div className="text-xs text-muted-foreground">{order?.customerEmail || 'No email'}</div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground whitespace-nowrap">
                          {order?.phoneNumber || 'N/A'}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-muted-foreground truncate max-w-[200px]" title={order?.shippingAddress || 'N/A'}>
                          {order?.shippingAddress || 'N/A'}
                        </TableCell>
                        <TableCell className="font-medium text-foreground whitespace-nowrap">
                          {formatCurrency(order?.totalAmount || 0, { symbol: 'GHS ' })}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <OrderStatusBadge status={order?.status || 'pending'} />
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-foreground hover:bg-muted gap-2 transition-all duration-200"
                              onClick={() => openOrderDetails(order)}
                            >
                              <Eye className="h-4 w-4" /> View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="gap-2 transition-all duration-200 active:scale-95"
                              onClick={() => openStatusModal(order)}
                              disabled={order?.status === 'delivered' || order?.status === 'cancelled'}
                            >
                              <RefreshCw className="h-4 w-4" /> Update
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              className="gap-2 transition-all duration-200 active:scale-95"
                              onClick={() => openCancelModal(order)}
                              disabled={order?.status === 'delivered' || order?.status === 'cancelled'}
                            >
                              <X className="h-4 w-4" /> Cancel
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="bg-card text-card-foreground border-border font-sans sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Order ID: <span className="font-mono text-foreground">{safeFormatId(selectedOrder)}</span>
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-muted/30 p-4 rounded-xl border border-border">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Customer Info</div>
                  <div className="font-medium text-foreground">{selectedOrder?.customerName || 'Guest'}</div>
                  <div className="text-sm text-muted-foreground">{selectedOrder?.customerEmail || 'No email provided'}</div>
                  <div className="text-sm text-foreground mt-2 font-medium">{selectedOrder?.phoneNumber || 'No phone number'}</div>
                  <div className="text-sm text-muted-foreground mt-1">{selectedOrder?.shippingAddress || 'No delivery address'}</div>
                </div>
                <div className="bg-muted/30 p-4 rounded-xl border border-border flex flex-col justify-center items-start">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Order Status</div>
                  <OrderStatusBadge status={selectedOrder?.status || 'pending'} />
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg border-b border-border pb-2 mb-4">Order Items</h3>
                <div className="space-y-3">
                  {Array.isArray(selectedOrder?.items) && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-muted/20 p-3 rounded-lg border border-border/50">
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{item?.title || 'Unknown Item'}</span>
                          <span className="text-sm text-muted-foreground">Qty: {item?.quantity || 0}</span>
                        </div>
                        <span className="font-medium text-foreground">
                          {formatCurrency((item?.unitPrice || item?.price || 0) * (item?.quantity || 0), { symbol: 'GHS ' })}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground italic">No detailed item breakdown available</div>
                  )}
                </div>
                
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-border">
                  <span className="font-bold text-lg text-foreground">Total</span>
                  <span className="font-bold text-xl text-primary-foreground bg-primary px-3 py-1 rounded-lg">
                    {formatCurrency(selectedOrder?.totalAmount || 0, { symbol: 'GHS ' })}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Status Update Modal */}
      <OrderStatusTransitionModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        currentStatus={orderToUpdate?.status || 'pending'}
        orderId={orderToUpdate?.id}
        onStatusUpdate={(newStatus) => handleStatusUpdate(orderToUpdate?.id, newStatus)}
      />

      {/* Cancel Order Modal */}
      <CancelOrderModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        orderId={orderToUpdate?.id}
        onCancelSuccess={handleCancelSuccess}
      />
    </div>
  );
};

export default AdminOrdersPage;