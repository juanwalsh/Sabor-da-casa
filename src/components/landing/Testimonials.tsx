'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { testimonials } from '@/data/mockData';
import { Button } from '@/components/ui/button';

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 150 : -150,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 150 : -150,
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <section id="depoimentos" className="py-10 md:py-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header - Compacto */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 md:mb-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-3"
          >
            <MessageCircle className="w-3 h-3 md:w-4 md:h-4 text-accent" />
            <span className="text-xs md:text-sm font-medium text-accent-foreground">Depoimentos</span>
          </motion.div>

          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
            O que nossos{' '}
            <span className="text-primary">clientes</span>{' '}
            dizem
          </h2>

          <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto">
            A satisfação dos nossos clientes é nosso maior prêmio.
          </p>
        </motion.div>

        {/* Testimonial Carousel - Compacto */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            {/* Main Testimonial Card */}
            <div className="relative h-[220px] md:h-[200px]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <div className="bg-card rounded-2xl p-4 md:p-6 border border-border shadow-lg h-full relative overflow-hidden">
                    {/* Quote Icon */}
                    <div className="absolute top-3 right-3 opacity-10">
                      <Quote className="w-10 md:w-14 h-10 md:h-14 text-primary" />
                    </div>

                    <div className="relative flex flex-col h-full">
                      {/* Stars */}
                      <div className="flex gap-0.5 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 md:w-4 md:h-4 ${
                              i < testimonials[currentIndex].rating
                                ? 'text-accent fill-accent'
                                : 'text-muted'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Comment */}
                      <p className="text-sm md:text-base text-foreground leading-relaxed mb-3 flex-1 line-clamp-3">
                        "{testimonials[currentIndex].comment}"
                      </p>

                      {/* Author */}
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 md:w-12 md:h-12">
                          <Image
                            src={testimonials[currentIndex].avatar}
                            alt={testimonials[currentIndex].name}
                            fill
                            sizes="48px"
                            className="rounded-full object-cover border-2 border-primary/20"
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-foreground">
                            {testimonials[currentIndex].name}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            Cliente verificado
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Buttons - Compacto */}
            <div className="flex items-center justify-center gap-3 mt-4">
              <Button
                variant="outline"
                size="icon"
                onClick={prevTestimonial}
                className="rounded-full w-9 h-9 md:w-10 md:h-10 border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              {/* Dots */}
              <div className="flex gap-1">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setDirection(index > currentIndex ? 1 : -1);
                      setCurrentIndex(index);
                    }}
                    className="w-8 h-8 flex items-center justify-center transition-all duration-300"
                    aria-label={`Ir para depoimento ${index + 1}`}
                  >
                    <div className={`rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'bg-primary w-5 h-2'
                        : 'bg-muted hover:bg-muted-foreground/30 w-2 h-2'
                    }`} />
                  </button>
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={nextTestimonial}
                className="rounded-full w-9 h-9 md:w-10 md:h-10 border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats - Compacto */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-4 gap-2 md:gap-4 mt-8 md:mt-12 max-w-xl mx-auto"
        >
          {[
            { value: '4.9', label: 'Nota', suffix: '/5' },
            { value: '2.5k', label: 'Avaliações', suffix: '+' },
            { value: '98', label: 'Satisfação', suffix: '%' },
            { value: '15', label: 'Anos', suffix: '+' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
              className="text-center"
            >
              <div className="text-xl md:text-2xl font-bold text-primary">
                {stat.value}
                <span className="text-xs md:text-sm text-muted-foreground">{stat.suffix}</span>
              </div>
              <p className="text-[10px] md:text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
