import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminSidebar from './AdminSidebar.jsx';

const AdminLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="admin-theme min-h-screen bg-background text-foreground flex font-sans">
      <AdminSidebar 
        isMobileOpen={isMobileSidebarOpen} 
        setIsMobileOpen={setIsMobileSidebarOpen} 
      />
      
      <main className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden h-20 border-b border-border bg-card flex items-center px-4 sticky top-0 z-30">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMobileSidebarOpen(true)}
            className="text-foreground hover:bg-muted"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="ml-4 font-bold text-lg text-foreground">Admin Panel</div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-4 sm:p-8 overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;