'use client';

import Navbar from '@/components/shared/Navbar';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import MenuHighlights from '@/components/landing/MenuHighlights';
import Testimonials from '@/components/landing/Testimonials';
import Footer from '@/components/landing/Footer';
import CartSidebar from '@/components/menu/CartSidebar';

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <Features />
      <MenuHighlights />
      <Testimonials />
      <Footer />
      <CartSidebar />
    </main>
  );
}
