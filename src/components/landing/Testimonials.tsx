'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import { testimonials } from '@/data/mockData';
import { Button } from '@/components/ui/button';

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
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
      x: direction > 0 ? 200 : -200,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 200 : -200,
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <section id="depoimentos" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-4"
          >
            <MessageCircle className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent-foreground">Depoimentos</span>
          </motion.div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            O que nossos{' '}
            <span className="text-primary">clientes</span>{' '}
            dizem
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A satisfação de quem prova nossa comida é nosso maior prêmio.
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Main Testimonial Card */}
            <div className="relative h-[320px] sm:h-[280px]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <div className="bg-card rounded-3xl p-8 sm:p-10 border border-border shadow-xl h-full relative overflow-hidden">
                    {/* Quote Icon */}
                    <div className="absolute top-6 right-6 opacity-10">
                      <Quote className="w-20 h-20 text-primary" />
                    </div>

                    <div className="relative flex flex-col h-full">
                      {/* Stars */}
                      <div className="flex gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < testimonials[currentIndex].rating
                                ? 'text-accent fill-accent'
                                : 'text-muted'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Comment */}
                      <p className="font-serif text-lg sm:text-xl text-foreground leading-relaxed mb-6 flex-1">
                        "{testimonials[currentIndex].comment}"
                      </p>

                      {/* Author */}
                      <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14">
                          <Image
                            src={testimonials[currentIndex].avatar}
                            alt={testimonials[currentIndex].name}
                            fill
                            sizes="56px"
                            className="rounded-full object-cover border-2 border-primary/20"
                          />
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                            <span className="text-xs">✓</span>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">
                            {testimonials[currentIndex].name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Cliente verificado
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={prevTestimonial}
                className="rounded-full w-12 h-12 border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
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
                    className="w-11 h-11 flex items-center justify-center transition-all duration-300"
                    aria-label={`Ir para depoimento ${index + 1}`}
                  >
                    <div className={`rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'bg-primary w-6 h-2.5'
                        : 'bg-muted hover:bg-muted-foreground/30 w-2.5 h-2.5'
                    }`} />
                  </button>
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={nextTestimonial}
                className="rounded-full w-12 h-12 border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto"
        >
          {[
            { value: '4.9', label: 'Avaliação média', suffix: '/5' },
            { value: '2.5k', label: 'Avaliações', suffix: '+' },
            { value: '98', label: 'Satisfação', suffix: '%' },
            { value: '15', label: 'Anos de tradição', suffix: '+' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl font-bold text-primary font-serif">
                {stat.value}
                <span className="text-lg text-muted-foreground">{stat.suffix}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
