import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Pencil, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { vivaProducts } from '@/lib/vivaData.js';
import { formatCurrency } from '@/api/EcommerceApi.js';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({ price: '', stock: '' });

  useEffect(() => {
    // Load local overrides
    const localOverrides = JSON.parse(localStorage.getItem('admin-product-overrides') || '{}');
    
    const mergedProducts = vivaProducts.map(p => {
      const overrides = localOverrides[p.id] || {};
      const activeVariant = p.variants[0];
      
      return {
        ...p,
        currentPrice: overrides.price_in_cents || activeVariant.price_in_cents,
        currentStock: overrides.inventory_quantity !== undefined ? overrides.inventory_quantity : activeVariant.inventory_quantity,
        isActive: overrides.isActive !== undefined ? overrides.isActive : true
      };
    });
    
    setProducts(mergedProducts);
  }, []);

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setEditForm({
      price: (product.currentPrice / 100).toString(),
      stock: product.currentStock.toString()
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    const newPriceCents = Math.round(parseFloat(editForm.price) * 100);
    const newStock = parseInt(editForm.stock, 10);
    
    if (isNaN(newPriceCents) || isNaN(newStock)) {
      toast.error('Please enter valid numbers');
      return;
    }

    const localOverrides = JSON.parse(localStorage.getItem('admin-product-overrides') || '{}');
    localOverrides[editingProduct.id] = {
      ...localOverrides[editingProduct.id],
      price_in_cents: newPriceCents,
      inventory_quantity: newStock
    };
    
    localStorage.setItem('admin-product-overrides', JSON.stringify(localOverrides));
    
    setProducts(prev => prev.map(p => 
      p.id === editingProduct.id 
        ? { ...p, currentPrice: newPriceCents, currentStock: newStock }
        : p
    ));
    
    setIsEditModalOpen(false);
    toast.success('Product updated successfully');
  };

  const handleToggleActive = (productId, currentStatus) => {
    const localOverrides = JSON.parse(localStorage.getItem('admin-product-overrides') || '{}');
    localOverrides[productId] = {
      ...localOverrides[productId],
      isActive: !currentStatus
    };
    
    localStorage.setItem('admin-product-overrides', JSON.stringify(localOverrides));
    
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, isActive: !currentStatus } : p
    ));
    
    toast.success(`Product marked as ${!currentStatus ? 'Active' : 'Inactive'}`);
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 font-sans">
      <Helmet>
        <title>Products | Admin Panel</title>
      </Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-sans tracking-tight">Products Catalog</h1>
          <p className="text-muted-foreground mt-1">Manage pricing and inventory levels.</p>
        </div>
        <Button onClick={() => toast.info('Adding new products is disabled in demo mode.')} className="font-medium">
          Add New Product
        </Button>
      </div>

      <Card className="bg-card border-border shadow-sm">
        <CardHeader className="pb-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-9 bg-background border-border text-foreground"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No products found matching your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id} className="border-border hover:bg-muted/30">
                      <TableCell>
                        <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center p-1 border border-border">
                          <img src={product.image} alt={product.title} className="w-full h-full object-contain" />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{product.title}</TableCell>
                      <TableCell><Badge variant="outline" className="border-border text-muted-foreground">{product.category}</Badge></TableCell>
                      <TableCell className="font-medium">{formatCurrency(product.currentPrice, { symbol: 'GHS ' })}</TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          product.currentStock < 100 
                            ? 'bg-destructive/10 text-destructive' 
                            : 'bg-primary/10 text-primary-foreground'
                        }`}>
                          {product.currentStock} units
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`border-0 ${product.isActive ? 'bg-[hsl(var(--status-completed))] text-white' : 'bg-muted text-muted-foreground'}`}>
                          {product.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-foreground hover:bg-muted hover:text-primary-foreground h-8 w-8"
                            onClick={() => handleEditClick(product)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className={`${product.isActive ? 'text-destructive hover:bg-destructive/10 text-destructive' : 'text-[hsl(var(--status-completed))] hover:bg-[hsl(var(--status-completed))]/10'} h-8 w-8`}
                            onClick={() => handleToggleActive(product.id, product.isActive)}
                            title={product.isActive ? "Deactivate" : "Activate"}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="bg-card text-card-foreground border-border font-sans sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Update pricing and inventory for {editingProduct?.title}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">Price (GHS)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                className="col-span-3 bg-background border-border text-foreground"
                value={editForm.price}
                onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock" className="text-right">Stock Level</Label>
              <Input
                id="stock"
                type="number"
                className="col-span-3 bg-background border-border text-foreground"
                value={editForm.stock}
                onChange={(e) => setEditForm(prev => ({ ...prev, stock: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)} className="border-border text-foreground hover:bg-muted">
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProductsPage;