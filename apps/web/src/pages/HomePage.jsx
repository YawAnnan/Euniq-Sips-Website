import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Shield, Award, Truck, Star, ArrowRight, CheckCircle2 } from 'lucide-react';
import ProductsList from '@/components/ProductsList';
import VideoCarousel from '@/components/VideoCarousel.jsx';

const HomePage = () => {
  const testimonials = [
    {
      name: 'Kwame Osei',
      role: 'Cafe Owner',
      content: 'The Viva Milk Mixes have become a bestseller in our shop. Premium quality that our customers love.',
      rating: 5,
    },
    {
      name: 'Sarah Mensah',
      role: 'Event Planner',
      content: 'Wholesale pricing is unbeatable for the quality. The Mango Nectar is always a crowd favourite.',
      rating: 5,
    },
    {
      name: 'David Annan',
      role: 'Retail Partner',
      content: 'Euniq Sips delivers consistently. The 27-piece packs are perfect for our shelf displays.',
      rating: 5,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Euniq Sips x Viva - Premium Beverages</title>
        <meta name="description" content="Discover the premium Viva Sips collection. High-quality Nectars, Juices, and Milk Mixes available for retail and wholesale." />
      </Helmet>

      <section className="relative min-h-[90dvh] flex items-center justify-center overflow-hidden hero-bg-lifestyle">
        {/* Dark Overlay for Text Contrast */}
        <div className="absolute inset-0 bg-black/50 md:bg-black/40 z-10" />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white mb-6 backdrop-blur-sm">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-semibold tracking-wide">EUNIQ SIPS × VIVA</span>
              </div>
              <h1 className="text-white mb-6 drop-shadow-md">
                Experience Pure <br/><span className="text-yellow-400">Viva</span> Vitality
              </h1>
              <p className="text-lg text-white/90 mb-8 max-w-xl leading-relaxed drop-shadow-sm">
                Indulge in our premium collection of 10 exquisite varieties. From sun-ripened fruit nectars to creamy milk mixes, crafted for the discerning palate.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-yellow-400 text-black hover:bg-yellow-300 px-8 py-6 text-lg font-bold shadow-lg">
                  <Link to="/products">
                    Shop Retail
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/20 px-8 py-6 text-lg backdrop-blur-sm bg-black/20">
                  <Link to="/products?wholesale=true">View Wholesale</Link>
                </Button>
              </div>
              
              <div className="mt-10 flex items-center gap-6 text-sm text-white/90 drop-shadow-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-yellow-400" />
                  <span className="font-medium">200ml Portions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-yellow-400" />
                  <span className="font-medium">27 pcs per pack</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Video Carousel Section Inserted Before Featured Collection */}
      <VideoCarousel />

      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6"
          >
            <div>
              <h2 className="mb-4">Featured Collection</h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Discover our most loved Viva selections
              </p>
            </div>
            <Button asChild variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
              <Link to="/products">View Full Catalogue</Link>
            </Button>
          </motion.div>

          <ProductsList limit={4} />
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Premium Quality</h3>
              <p className="text-primary-foreground/70 leading-relaxed">
                Crafted with the finest ingredients, real fruit purees, and farm-fresh milk.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Wholesale Value</h3>
              <p className="text-primary-foreground/70 leading-relaxed">
                Take advantage of our tiered wholesale pricing: GHS 88 per pack (50–199 packs), GHS 87 (200–499 packs), GHS 85 (500–999 packs), and GHS 83 per pack for orders of 1,000 packs or more.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Truck className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Reliable Supply</h3>
              <p className="text-primary-foreground/70 leading-relaxed">
                Consistent availability of our 27-piece packs for your business needs.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="mb-4">Partner Testimonials</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Trusted by retailers and loved by consumers across the region
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl p-8 shadow-sm"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-card-foreground text-lg mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-bold text-card-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;