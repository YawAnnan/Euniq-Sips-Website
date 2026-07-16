import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const carouselSlides = [
  { id: 'mango', name: 'Viva Mango', url: 'https://horizons-cdn.hostinger.com/dc68c472-4435-426a-a4de-b6452139a002/964c89c77d150f96144cfaf829f8bd4a.webp' },
  { id: 'chocolate-milk', name: 'Viva Chocolate Milk Mix', url: 'https://horizons-cdn.hostinger.com/dc68c472-4435-426a-a4de-b6452139a002/cab36ffcb81648753e81e27f6914d72a.webp' },
  { id: 'banana-milk', name: 'Viva Banana Milk Mix', url: 'https://horizons-cdn.hostinger.com/dc68c472-4435-426a-a4de-b6452139a002/fa8bf1ad310b4c1f256c73083188d04f.webp' },
  { id: 'apple', name: 'Viva Apple', url: 'https://horizons-cdn.hostinger.com/dc68c472-4435-426a-a4de-b6452139a002/3e2b5d4d7a7173f6ec03258a2c23ecdd.webp' },
  { id: 'pineapple', name: 'Viva Pineapple', url: 'https://horizons-cdn.hostinger.com/dc68c472-4435-426a-a4de-b6452139a002/03a1e7cb7a4f96e69e63bff2d7b45d05.webp' },
  { id: 'grape', name: 'Viva Grape', url: 'https://horizons-cdn.hostinger.com/dc68c472-4435-426a-a4de-b6452139a002/8199f6adfce121c6112a70fad46ad76c.webp' },
  { id: 'cocktail', name: 'Viva Cocktail', url: 'https://horizons-cdn.hostinger.com/dc68c472-4435-426a-a4de-b6452139a002/3f18167c9ea25e9ed4a6279f07c80648.webp' },
  { id: 'strawberry-milk', name: 'Viva Strawberry Milk Mix', url: 'https://horizons-cdn.hostinger.com/dc68c472-4435-426a-a4de-b6452139a002/07c62f8ca631663c121baebecaab1005.webp' },
  { id: 'orange', name: 'Viva Orange', url: 'https://horizons-cdn.hostinger.com/dc68c472-4435-426a-a4de-b6452139a002/cc3bba24cadb042af8140078af749af9.webp' },
  { id: 'guava', name: 'Viva Guava', url: 'https://horizons-cdn.hostinger.com/dc68c472-4435-426a-a4de-b6452139a002/86934ea71cb5b23a198a0a355f9ae8c2.webp' },
];

const VideoCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselSlides.length);
    }, 8000);

    return () => clearInterval(timer);
  }, [isHovered]);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <section 
      className="carousel-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Viva Flavors Showcase"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="absolute inset-0 flex items-center justify-center w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* We use img since the provided files are animated WebP images, functioning perfectly as lightweight auto-playing videos */}
          <img
            src={carouselSlides[currentIndex].url}
            alt={carouselSlides[currentIndex].name}
            className="carousel-media"
            loading={currentIndex === 0 ? "eager" : "lazy"}
          />
          
          <div className="carousel-overlay" />
          
          <motion.div 
            className="carousel-label"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h2 className="carousel-label-text">
              {carouselSlides[currentIndex].name}
            </h2>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <div className="carousel-nav" role="tablist">
        {carouselSlides.map((slide, index) => (
          <button
            key={slide.id}
            role="tab"
            aria-selected={currentIndex === index}
            aria-label={`Go to ${slide.name}`}
            className={`carousel-dot ${currentIndex === index ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
      
      {/* Invisible preload for next image to ensure smooth transitions */}
      <div className="hidden">
        <img 
          src={carouselSlides[(currentIndex + 1) % carouselSlides.length].url} 
          alt="preload next" 
          aria-hidden="true" 
        />
      </div>
    </section>
  );
};

export default VideoCarousel;