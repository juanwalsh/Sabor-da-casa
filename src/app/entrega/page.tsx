'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  MapPin,
  Clock,
  Truck,
  DollarSign,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RESTAURANT_INFO, DELIVERY_FEE, FREE_DELIVERY_MIN, formatPrice } from '@/data/mockData';

const deliveryZones = [
  { name: 'Centro', time: '25-35 min', available: true },
  { name: 'Consolacao', time: '30-40 min', available: true },
  { name: 'Pinheiros', time: '35-45 min', available: true },
  { name: 'Jardins', time: '30-40 min', available: true },
  { name: 'Vila Madalena', time: '35-50 min', available: true },
  { name: 'Bela Vista', time: '25-35 min', available: true },
  { name: 'Liberdade', time: '30-40 min', available: true },
  { name: 'Moema', time: '40-55 min', available: true },
  { name: 'Itaim Bibi', time: '35-50 min', available: true },
  { name: 'Vila Mariana', time: '35-45 min', available: true },
  { name: 'Perdizes', time: '40-55 min', available: true },
  { name: 'Santana', time: '45-60 min', available: false },
  { name: 'Tatuape', time: '50-65 min', available: false },
];

export default function EntregaPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full mr-4">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="font-sans text-xl font-semibold">Informacoes de Entrega</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"
          >
            <Truck className="w-10 h-10 text-primary" />
          </motion.div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">
            Entrega rapida e segura
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Levamos o sabor da comida caseira ate voce com todo carinho e cuidado
          </p>
        </div>

        {/* Key Info Cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-2xl p-6"
          >
            <Clock className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold mb-2">Tempo de Entrega</h3>
            <p className="text-2xl font-bold text-primary mb-1">{RESTAURANT_INFO.deliveryTime}</p>
            <p className="text-sm text-muted-foreground">
              Pode variar em horarios de pico
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-2xl p-6"
          >
            <DollarSign className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold mb-2">Taxa de Entrega</h3>
            <p className="text-2xl font-bold text-primary mb-1">{formatPrice(DELIVERY_FEE)}</p>
            <p className="text-sm text-muted-foreground">
              Gratis acima de {formatPrice(FREE_DELIVERY_MIN)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-2xl p-6"
          >
            <MapPin className="w-8 h-8 text-primary mb-3" />
            <h3 className="font-semibold mb-2">Area de Cobertura</h3>
            <p className="text-2xl font-bold text-primary mb-1">8 km</p>
            <p className="text-sm text-muted-foreground">
              Raio a partir do Centro de SP
            </p>
          </motion.div>
        </div>

        {/* Delivery Zones */}
        <section className="mb-12">
          <h3 className="font-serif text-2xl font-bold mb-6">Bairros Atendidos</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {deliveryZones.map((zone, index) => (
              <motion.div
                key={zone.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center justify-between p-4 rounded-xl border ${
                  zone.available
                    ? 'bg-card border-border'
                    : 'bg-muted/50 border-border opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  {zone.available ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-muted-foreground" />
                  )}
                  <span className={zone.available ? '' : 'text-muted-foreground'}>
                    {zone.name}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">{zone.time}</span>
              </motion.div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            * Bairros em cinza estao fora da nossa area de cobertura no momento.
          </p>
        </section>

        {/* Schedule */}
        <section className="mb-12">
          <h3 className="font-serif text-2xl font-bold mb-6">Horarios de Funcionamento</h3>
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Segunda a Sexta</h4>
                <p className="text-2xl font-bold text-primary">
                  {RESTAURANT_INFO.hours.weekdays}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Sabados, Domingos e Feriados</h4>
                <p className="text-2xl font-bold text-primary">
                  {RESTAURANT_INFO.hours.weekends}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Peak Hours */}
        <section className="mb-12">
          <h3 className="font-serif text-2xl font-bold mb-6">Horarios de Pico</h3>
          <div className="bg-accent/10 border border-accent/20 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-accent shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-2">
                  Nos horarios de pico, o tempo de entrega pode ser maior:
                </p>
                <ul className="text-muted-foreground space-y-1">
                  <li>Almoco: <strong>12h as 14h</strong> (+15 min em media)</li>
                  <li>Jantar: <strong>19h as 21h</strong> (+15 min em media)</li>
                </ul>
                <p className="text-sm text-muted-foreground mt-3">
                  Dica: Agende seu pedido com antecedencia para evitar esperas!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tips */}
        <section className="mb-12">
          <h3 className="font-serif text-2xl font-bold mb-6">Dicas para uma Entrega Perfeita</h3>
          <div className="space-y-4">
            {[
              {
                title: 'Verifique seu endereco',
                description:
                  'Confira se o endereco esta completo, incluindo numero, complemento e ponto de referencia.',
              },
              {
                title: 'Mantenha o telefone por perto',
                description:
                  'Nosso entregador pode precisar entrar em contato para localizar o endereco.',
              },
              {
                title: 'Informe sobre troco',
                description:
                  'Se for pagar em dinheiro, informe o valor para troco no campo de observacoes.',
              },
              {
                title: 'Acompanhe seu pedido',
                description:
                  'Voce pode ver o status do seu pedido em tempo real apos a confirmacao.',
              },
            ].map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary font-bold">{index + 1}</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{tip.title}</h4>
                  <p className="text-sm text-muted-foreground">{tip.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center">
          <Button asChild size="lg" className="rounded-xl">
            <Link href="/cardapio">Fazer Pedido</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
