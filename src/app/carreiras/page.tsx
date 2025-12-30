'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Heart,
  Users,
  Utensils,
  Truck,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RESTAURANT_INFO } from '@/data/mockData';
import { toast } from 'sonner';

interface JobPosition {
  id: string;
  title: string;
  department: string;
  type: string;
  location: string;
  salary?: string;
  description: string;
  requirements: string[];
  benefits: string[];
  icon: React.ElementType;
}

const jobPositions: JobPosition[] = [
  {
    id: '1',
    title: 'Cozinheiro(a)',
    department: 'Cozinha',
    type: 'CLT',
    location: 'Centro - SP',
    salary: 'R$ 2.500 - R$ 3.500',
    description:
      'Buscamos cozinheiro(a) com experiencia em comida caseira brasileira para integrar nossa equipe.',
    requirements: [
      'Experiencia minima de 2 anos em cozinha',
      'Conhecimento em culinaria brasileira tradicional',
      'Disponibilidade para trabalhar em escala 6x1',
      'Ensino medio completo',
      'Curso de boas praticas em manipulacao de alimentos',
    ],
    benefits: [
      'Vale transporte',
      'Alimentacao no local',
      'Plano de saude apos 3 meses',
      'Folga no aniversario',
    ],
    icon: Utensils,
  },
  {
    id: '2',
    title: 'Auxiliar de Cozinha',
    department: 'Cozinha',
    type: 'CLT',
    location: 'Centro - SP',
    salary: 'R$ 1.800 - R$ 2.200',
    description:
      'Vaga para auxiliar de cozinha com vontade de aprender e crescer profissionalmente.',
    requirements: [
      'Nao e necessaria experiencia',
      'Ensino fundamental completo',
      'Proatividade e vontade de aprender',
      'Disponibilidade para trabalhar em escala 6x1',
    ],
    benefits: [
      'Vale transporte',
      'Alimentacao no local',
      'Treinamento interno',
      'Oportunidade de crescimento',
    ],
    icon: Utensils,
  },
  {
    id: '3',
    title: 'Entregador(a)',
    department: 'Logistica',
    type: 'PJ',
    location: 'Centro - SP e regiao',
    salary: 'R$ 150 - R$ 250/dia',
    description:
      'Procuramos entregadores com moto propria para fazer parte do nosso time de delivery.',
    requirements: [
      'Moto propria em boas condicoes',
      'CNH categoria A',
      'Conhecimento da regiao central de SP',
      'Smartphone com internet',
      'Bag termica (fornecemos se necessario)',
    ],
    benefits: [
      'Flexibilidade de horarios',
      'Pagamento semanal',
      'Bonus por entregas',
      'Suporte para manutencao da moto',
    ],
    icon: Truck,
  },
  {
    id: '4',
    title: 'Atendente',
    department: 'Atendimento',
    type: 'CLT',
    location: 'Centro - SP',
    salary: 'R$ 1.600 - R$ 2.000',
    description:
      'Vaga para atendimento ao cliente via WhatsApp e telefone, gestao de pedidos e suporte.',
    requirements: [
      'Experiencia com atendimento ao cliente',
      'Boa comunicacao escrita e verbal',
      'Conhecimento basico em informatica',
      'Ensino medio completo',
      'Paciencia e empatia',
    ],
    benefits: [
      'Vale transporte',
      'Alimentacao no local',
      'Plano de saude apos 3 meses',
      'Ambiente de trabalho agradavel',
    ],
    icon: Users,
  },
];

const benefits = [
  {
    icon: Heart,
    title: 'Ambiente Familiar',
    description: 'Trabalhamos como uma familia, com respeito e colaboracao',
  },
  {
    icon: Utensils,
    title: 'Alimentacao',
    description: 'Refeicoes deliciosas todos os dias, feitas com carinho',
  },
  {
    icon: Users,
    title: 'Crescimento',
    description: 'Oportunidades reais de crescimento profissional',
  },
  {
    icon: DollarSign,
    title: 'Salario Justo',
    description: 'Remuneracao compativel com o mercado e bonificacoes',
  },
];

export default function CarreirasPage() {
  const [openJob, setOpenJob] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Candidatura enviada com sucesso!', {
      description: 'Entraremos em contato em breve.',
    });
    setFormData({ name: '', email: '', phone: '', position: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full mr-4">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="font-sans text-xl font-semibold">Trabalhe Conosco</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"
          >
            <Briefcase className="w-10 h-10 text-primary" />
          </motion.div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">
            Faca parte da nossa familia
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ha mais de 15 anos levando sabor e carinho para milhares de familias. Venha crescer
            conosco!
          </p>
        </div>

        {/* Benefits */}
        <section className="mb-16">
          <h3 className="font-serif text-2xl font-bold text-center mb-8">
            Por que trabalhar conosco?
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 text-center"
              >
                <benefit.icon className="w-10 h-10 text-primary mx-auto mb-4" />
                <h4 className="font-semibold mb-2">{benefit.title}</h4>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Job Listings */}
        <section className="mb-16">
          <h3 className="font-serif text-2xl font-bold mb-8">Vagas Abertas</h3>
          <div className="space-y-4">
            {jobPositions.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-border rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenJob(openJob === job.id ? null : job.id)}
                  className="w-full p-5 flex items-center justify-between hover:bg-muted/50 transition-colors"
                  aria-expanded={openJob === job.id}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <job.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold">{job.title}</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {job.location}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {job.type}
                        </span>
                        {job.salary && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {job.salary}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground transition-transform ${
                      openJob === job.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {openJob === job.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="border-t border-border"
                  >
                    <div className="p-5 space-y-4">
                      <p className="text-muted-foreground">{job.description}</p>

                      <div>
                        <h5 className="font-semibold mb-2">Requisitos:</h5>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                          {job.requirements.map((req, i) => (
                            <li key={i}>{req}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-semibold mb-2">Beneficios:</h5>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                          {job.benefits.map((ben, i) => (
                            <li key={i}>{ben}</li>
                          ))}
                        </ul>
                      </div>

                      <Button
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, position: job.title }));
                          document.getElementById('application-form')?.scrollIntoView({
                            behavior: 'smooth',
                          });
                        }}
                        className="rounded-xl"
                      >
                        Candidatar-se
                      </Button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Application Form */}
        <section id="application-form" className="scroll-mt-20">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-10">
            <h3 className="font-serif text-2xl font-bold mb-2">Envie seu curriculo</h3>
            <p className="text-muted-foreground mb-8">
              Preencha o formulario abaixo ou envie seu curriculo para{' '}
              <a href={`mailto:${RESTAURANT_INFO.email}`} className="text-primary">
                {RESTAURANT_INFO.email}
              </a>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Nome completo</label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Seu nome"
                    className="h-12 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">E-mail</label>
                  <Input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="seu@email.com"
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Telefone</label>
                  <Input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(11) 99999-9999"
                    className="h-12 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Vaga de interesse</label>
                  <Input
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="Ex: Cozinheiro(a)"
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Conte um pouco sobre voce
                </label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Sua experiencia, por que quer trabalhar conosco..."
                  className="min-h-[120px] rounded-xl resize-none"
                />
              </div>

              <Button type="submit" size="lg" className="w-full sm:w-auto rounded-xl">
                Enviar candidatura
              </Button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
