'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RESTAURANT_INFO } from '@/data/mockData';

export default function TermosPage() {
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
            <h1 className="font-sans text-xl font-semibold">Termos de Uso</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-sm text-muted-foreground mb-8">
            Ultima atualizacao: {new Date().toLocaleDateString('pt-BR')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Aceitacao dos Termos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Ao acessar e usar o site {RESTAURANT_INFO.name}, voce concorda em cumprir e estar
              vinculado a estes Termos de Uso. Se voce nao concordar com qualquer parte destes
              termos, nao deve usar nosso site ou servicos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. Servicos</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              O {RESTAURANT_INFO.name} oferece servicos de delivery de comida caseira. Nossos
              servicos incluem:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Venda de refeicoes prontas para consumo</li>
              <li>Servico de entrega em domicilio</li>
              <li>Opcao de agendamento de pedidos</li>
              <li>Programa de fidelidade com acumulo de pontos</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. Pedidos e Pagamentos</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Ao realizar um pedido, voce concorda com as seguintes condicoes:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Os precos exibidos incluem todos os impostos aplicaveis</li>
              <li>A taxa de entrega sera informada antes da confirmacao do pedido</li>
              <li>
                O pagamento deve ser realizado no momento do pedido (PIX/cartao) ou na entrega
                (dinheiro/cartao)
              </li>
              <li>
                Cancelamentos sao permitidos ate 5 minutos apos a confirmacao do pedido
              </li>
              <li>Em caso de problemas com o pedido, entre em contato em ate 24 horas</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Entrega</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Sobre nosso servico de entrega:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>O tempo estimado de entrega e informativo e pode variar</li>
              <li>
                Atendemos uma area especifica de entrega; verifique se seu endereco esta coberto
              </li>
              <li>Pedidos acima de R$ 80,00 tem frete gratis</li>
              <li>
                O cliente deve estar disponivel no endereco informado para receber o pedido
              </li>
              <li>
                Nao nos responsabilizamos por atrasos causados por informacoes incorretas de
                endereco
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Qualidade e Seguranca Alimentar</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nos comprometemos a fornecer alimentos preparados seguindo rigorosos padroes de
              higiene e qualidade. Todos os nossos produtos sao frescos e preparados no dia.
              Informacoes sobre alergenicos estao disponiveis mediante solicitacao.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Programa de Fidelidade</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Nosso programa de fidelidade funciona da seguinte forma:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>A cada R$ 1,00 gasto, voce acumula 1 ponto</li>
              <li>100 pontos podem ser trocados por R$ 10,00 de desconto</li>
              <li>Os pontos expiram apos 6 meses de inatividade</li>
              <li>Pontos nao sao transferiveis entre contas</li>
              <li>
                Reservamo-nos o direito de modificar as regras do programa com aviso previo
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Propriedade Intelectual</h2>
            <p className="text-muted-foreground leading-relaxed">
              Todo o conteudo deste site, incluindo textos, imagens, logotipos e design, e
              propriedade do {RESTAURANT_INFO.name} e protegido por leis de direitos autorais. E
              proibida a reproducao sem autorizacao expressa.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. Limitacao de Responsabilidade</h2>
            <p className="text-muted-foreground leading-relaxed">
              O {RESTAURANT_INFO.name} nao sera responsavel por danos indiretos, incidentais ou
              consequentes resultantes do uso de nossos servicos. Nossa responsabilidade maxima
              esta limitada ao valor do pedido em questao.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">9. Alteracoes nos Termos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Reservamo-nos o direito de modificar estes termos a qualquer momento. Alteracoes
              significativas serao comunicadas atraves do site. O uso continuado dos servicos apos
              as alteracoes constitui aceitacao dos novos termos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">10. Contato</h2>
            <p className="text-muted-foreground leading-relaxed">
              Para duvidas sobre estes termos, entre em contato:
            </p>
            <ul className="list-none mt-4 text-muted-foreground space-y-2">
              <li>
                <strong>E-mail:</strong> {RESTAURANT_INFO.email}
              </li>
              <li>
                <strong>Telefone:</strong> {RESTAURANT_INFO.phone}
              </li>
              <li>
                <strong>Endereco:</strong> {RESTAURANT_INFO.address}
              </li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}
