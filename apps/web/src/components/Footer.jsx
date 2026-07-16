import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Shield, Award, Truck, Phone, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const Footer = () => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Subscribed",
        description: "Thank you for subscribing to our newsletter.",
      });
      setEmail('');
    }
  };

  return (
    <footer className="bg-footer text-footer mt-20 border-t border-footer">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-4 mb-16">          {/* Brand Column */}
          <div className="lg:col-span-1 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-footer-accent rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
                <span className="text-xl font-bold text-footer-bg">ES</span>
              </div>
              <span className="text-2xl font-bold tracking-tight">Euniq Sips</span>
            </div>
            <p className="text-sm text-footer-muted leading-relaxed">
              Crafted for the discerning palate. Premium beverages delivered to your door with uncompromising quality.
            </p>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/products" className="footer-link">Products</Link></li>
              <li><Link to="/order-tracking" className="footer-link">Track Order</Link></li>
              <li><Link to="/order-tracking" className="footer-link">My Orders</Link></li>
              <li><Link to="/about" className="footer-link">About Us</Link></li>
              <li><Link to="/faq" className="footer-link">FAQ</Link></li>
            </ul>
          </div>

          {/* Trust & Quality Column */}
          <div>
            <h3 className="footer-heading">Trust & Quality</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 group">
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-yellow-500/10 transition-colors">
                  <Shield className="footer-icon !mt-0" />
                </div>
                <span className="text-sm text-footer-muted font-medium">Secure Payment</span>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-yellow-500/10 transition-colors">
                  <Award className="footer-icon !mt-0" />
                </div>
                <span className="text-sm text-footer-muted font-medium">Quality Certified</span>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-yellow-500/10 transition-colors">
                  <Truck className="footer-icon !mt-0" />
                </div>
                <span className="text-sm text-footer-muted font-medium">Fresh Delivery</span>
              </div>
            </div>
          </div>

          {/* Contact Us Column */}
          <div>
            <h3 className="footer-heading">Contact Us</h3>
            
            {/* Contact Details List */}
            <div className="flex flex-col mb-8">
              <div className="footer-contact-item">
                <Phone className="footer-icon" />
                <span className="text-sm text-footer-muted">+233 242 743 921</span>
              </div>
              <div className="footer-contact-item">
                <Mail className="footer-icon" />
                <span className="text-sm text-footer-muted break-all">euniqsips@gmail.com</span>
              </div>
              <div className="footer-contact-item">
                <MapPin className="footer-icon" />
                <span className="text-sm text-footer-muted leading-relaxed">
                  Tweneboa Kodua Street near Jerry J driving School, Sakaman, Accra
                </span>
              </div>
              <div className="footer-contact-item">
                <Clock className="footer-icon" />
                <span className="text-sm text-footer-muted leading-relaxed">
                  Orders can be made anytime of the day.
                </span>
              </div>
            </div>
          </div>
          {/* Follow Us Column */}
            <div>
              <h3 className="footer-heading">Follow Us</h3>

              <div className="flex flex-col gap-3">
                <a
                  href="https://chat.whatsapp.com/BiyaSEnXPps8wx14mLRVY9?s=cl&p=i&ilr=4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn"
                >
                  WhatsApp
                </a>

                <a
                  href="https://www.instagram.com/euniq_sips?igsh=MXBtM212aXBtd3R5aQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn"
                >
                  Instagram
                </a>

                <a
                  href="https://www.tiktok.com/@euniq_sips?_r=1&_t=ZS-97LOIjTzZ7F"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn"
                >
                  TikTok
                </a>

                <a
                  href="https://www.facebook.com/share/1CxJS8gjvS/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-btn"
                >
                  Facebook
                </a>
              </div>
            </div>
          {/* Newsletter Column */}
          <div className="lg:col-span-1">
            <h3 className="footer-heading">Newsletter</h3>
            <p className="text-sm text-footer-muted mb-5 leading-relaxed">
              Subscribe for exclusive offers, new arrivals, and premium tasting events.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3">
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border-footer text-footer placeholder:text-footer-muted h-12 focus-visible:ring-yellow-500"
                required
              />
              <Button type="submit" className="w-full bg-footer-accent text-footer-bg hover:bg-footer-accent/90 h-12 font-bold tracking-wide shadow-lg shadow-yellow-500/20">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-footer pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-footer-muted">
            © {new Date().getFullYear()} Euniq Sips. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link to="/privacy" className="text-sm text-footer-muted hover:text-footer-accent transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-sm text-footer-muted hover:text-footer-accent transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;