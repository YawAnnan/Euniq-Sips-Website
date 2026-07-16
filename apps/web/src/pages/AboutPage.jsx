import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Award, Leaf, Heart, ArrowRight, PackageCheck, Droplets } from 'lucide-react';

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>About Euniq Sips & Viva - Our Partnership</title>
        <meta name="description" content="Learn about Euniq Sips' exclusive partnership with Viva drinks, bringing you premium 10-variety nectars, juices, and milk mixes." />
      </Helmet>

      <section 
        className="relative min-h-[60dvh] flex items-center justify-center overflow-hidden py-24"
        style={{
          backgroundImage: 'url(https://horizons-cdn.hostinger.com/dc68c472-4435-426a-a4de-b6452139a002/5dbfab6b3cd50a3b3945b1a07175f2d1.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Dark Overlay for Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/40 to-black/35 md:from-black/40 md:via-black/35 md:to-black/30 z-10" />

        <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-yellow-400 font-semibold tracking-wider uppercase text-sm mb-4 block">Our Story</span>
            <h1 className="text-white mb-6">Elevating Every Sip</h1>
            <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
              Euniq Sips is proud to partner with Viva to bring the region's finest beverage collection to your doorstep, whether for retail indulgence or wholesale supply.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="prose prose-lg max-w-none"
          >
            <p className="text-lg leading-relaxed text-foreground mb-6">
              Founded on the belief that everyday moments deserve extraordinary flavors, Euniq Sips has established itself as a premier distributor of high-quality beverages. Our exclusive partnership with the Viva brand represents the pinnacle of this commitment.
            </p>
            <p className="text-lg leading-relaxed text-foreground mb-6">
              The Viva collection—comprising 10 meticulously crafted varieties across Nectars, Juices, and Milk Mixes—is renowned for its uncompromising quality. From the orchard-fresh crispness of Viva Apple Juice to the indulgent creaminess of Viva Chocolate Milk Mix, every 200ml pack is a testament to flavor perfection.
            </p>
            <p className="text-lg leading-relaxed text-foreground border-l-4 border-accent pl-6 italic">
              "Our mission is simple: deliver premium taste in a format that works for everyone. That's why we standardized the 27-piece pack format, ensuring consistency for our retail customers and exceptional value for our wholesale partners."
            </p>
          </motion.div>
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
            <h2 className="mb-4">The Viva Advantage</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Why our partnership delivers unparalleled value
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0 }}
              className="bg-card rounded-2xl p-8 border border-border text-center hover:border-accent transition-colors"
            >
              <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Droplets className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">10 Distinct Varieties</h3>
              <p className="text-muted-foreground leading-relaxed">
                A comprehensive portfolio of 10 flavors across three categories (Nectars, Juices, Milk Mixes) to satisfy every palate and demographic.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-card rounded-2xl p-8 border border-border text-center hover:border-accent transition-colors"
            >
              <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <PackageCheck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Optimized Packaging</h3>
              <p className="text-muted-foreground leading-relaxed">
                Standardized 27-piece packs of 200ml portions. Perfect for pantry stocking, retail shelving, and event distribution.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-card rounded-2xl p-8 border border-border text-center hover:border-accent transition-colors"
            >
              <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Wholesale Excellence</h3>
              <p className="text-muted-foreground leading-relaxed">
                Aggressive tiered pricing starting at GHS 88 per pack for orders of 50+ packs, with rates dropping to as low as GHS 83 per pack for orders of 1,000+ packs, empowering our B2B partners to maximize their margins.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-primary-foreground mb-6">
              Ready to stock Viva?
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
              Explore the full 10-flavor collection and discover the perfect fit for your retail space or wholesale needs.
            </p>
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/products">
                Browse Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;