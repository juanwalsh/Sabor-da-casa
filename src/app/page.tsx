'use client';

import Navbar from '@/components/shared/Navbar';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import ComoFunciona from '@/components/landing/ComoFunciona';
import PratoDoDia from '@/components/landing/PratoDoDia';
import Testimonials from '@/components/landing/Testimonials';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <Features />
      <ComoFunciona />
      <PratoDoDia />
      <Testimonials />
      <Footer />
    </main>
  );
}
