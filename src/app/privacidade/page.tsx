'use client';

import Link from 'next/link';
import { ChevronLeft, Shield, Lock, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RESTAURANT_INFO } from '@/data/mockData';

export default function PrivacidadePage() {
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
            <h1 className="font-sans text-xl font-semibold">Politica de Privacidade</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">
            Sua privacidade e importante para nos
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Saiba como coletamos, usamos e protegemos suas informacoes pessoais
          </p>
        </div>

        {/* Quick Overview */}
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          <div className="bg-card border border-border rounded-2xl p-6 text-center">
            <Lock className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Dados Seguros</h3>
            <p className="text-sm text-muted-foreground">
              Suas informacoes sao protegidas com criptografia
            </p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 text-center">
            <Eye className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Transparencia</h3>
            <p className="text-sm text-muted-foreground">
              Voce sabe exatamente como usamos seus dados
            </p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-6 text-center">
            <Trash2 className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Seu Controle</h3>
            <p className="text-sm text-muted-foreground">
              Voce pode solicitar exclusao dos seus dados
            </p>
          </div>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-sm text-muted-foreground mb-8">
            Ultima atualizacao: {new Date().toLocaleDateString('pt-BR')}
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Informacoes que Coletamos</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Coletamos as seguintes informacoes quando voce usa nosso servico:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>
                <strong>Dados de cadastro:</strong> nome, e-mail, telefone
              </li>
              <li>
                <strong>Endereco de entrega:</strong> rua, numero, complemento, bairro, CEP
              </li>
              <li>
                <strong>Historico de pedidos:</strong> itens pedidos, valores, datas
              </li>
              <li>
                <strong>Preferencias:</strong> favoritos, filtros salvos, observacoes recorrentes
              </li>
              <li>
                <strong>Dados de uso:</strong> paginas visitadas, tempo de navegacao
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. Como Usamos suas Informacoes</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Utilizamos seus dados para:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Processar e entregar seus pedidos</li>
              <li>Enviar atualizacoes sobre status do pedido</li>
              <li>Melhorar nossos produtos e servicos</li>
              <li>Enviar promocoes e novidades (com seu consentimento)</li>
              <li>Gerenciar seu programa de fidelidade</li>
              <li>Prevenir fraudes e garantir seguranca</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. Compartilhamento de Dados</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Nao vendemos suas informacoes. Compartilhamos dados apenas com:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>
                <strong>Entregadores:</strong> apenas nome e endereco para entrega
              </li>
              <li>
                <strong>Processadores de pagamento:</strong> para transacoes seguras
              </li>
              <li>
                <strong>Autoridades:</strong> quando exigido por lei
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Cookies e Tecnologias</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Usamos cookies para:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Manter voce logado</li>
              <li>Lembrar itens no seu carrinho</li>
              <li>Salvar suas preferencias</li>
              <li>Analisar uso do site para melhorias</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Voce pode desabilitar cookies no seu navegador, mas algumas funcionalidades podem
              nao funcionar corretamente.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Seguranca dos Dados</h2>
            <p className="text-muted-foreground leading-relaxed">
              Implementamos medidas de seguranca para proteger suas informacoes, incluindo
              criptografia de dados, acesso restrito a informacoes pessoais e monitoramento
              continuo de nossos sistemas. No entanto, nenhum metodo de transmissao pela internet
              e 100% seguro.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Seus Direitos</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              De acordo com a LGPD, voce tem direito a:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados incompletos ou incorretos</li>
              <li>Solicitar exclusao dos seus dados</li>
              <li>Revogar consentimento para marketing</li>
              <li>Solicitar portabilidade dos dados</li>
              <li>Obter informacoes sobre compartilhamento</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Retencao de Dados</h2>
            <p className="text-muted-foreground leading-relaxed">
              Mantemos seus dados pelo tempo necessario para fornecer nossos servicos e cumprir
              obrigacoes legais. Dados de pedidos sao mantidos por 5 anos para fins fiscais.
              Apos esse periodo, os dados sao anonimizados ou excluidos.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. Menores de Idade</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nossos servicos nao sao direcionados a menores de 18 anos. Nao coletamos
              intencionalmente dados de menores. Se tomarmos conhecimento de que coletamos dados
              de um menor, excluiremos essas informacoes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">9. Alteracoes nesta Politica</h2>
            <p className="text-muted-foreground leading-relaxed">
              Podemos atualizar esta politica periodicamente. Alteracoes significativas serao
              comunicadas por e-mail ou notificacao no site. Recomendamos revisar esta pagina
              regularmente.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">10. Contato</h2>
            <p className="text-muted-foreground leading-relaxed">
              Para exercer seus direitos ou esclarecer duvidas sobre privacidade:
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
