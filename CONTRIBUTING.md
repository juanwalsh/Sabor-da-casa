# Contribuindo para EP LOPES

Obrigado por considerar contribuir para o EP LOPES! Este documento fornece diretrizes para contribuicoes.

## Como Contribuir

### Reportando Bugs

1. Verifique se o bug ja nao foi reportado nas Issues
2. Crie uma nova issue com:
   - Descricao clara do problema
   - Passos para reproduzir
   - Comportamento esperado vs atual
   - Screenshots (se aplicavel)
   - Ambiente (OS, browser, versao Node)

### Sugerindo Features

1. Verifique se a feature ja nao foi sugerida
2. Crie uma issue com tag `enhancement`
3. Descreva a feature em detalhes
4. Explique o problema que ela resolve

### Pull Requests

1. Fork o repositorio
2. Crie uma branch: `git checkout -b feature/nome-da-feature`
3. Faca commits seguindo as convencoes
4. Escreva/atualize testes
5. Garanta que todos os testes passam
6. Abra um PR com descricao detalhada

## Setup de Desenvolvimento

```bash
# Clone seu fork
git clone https://github.com/seu-usuario/restaurante.git
cd restaurante

# Instale dependencias
npm install

# Configure ambiente
cp .env.example .env.local

# Rode testes para verificar setup
npm test

# Inicie desenvolvimento
npm run dev
```

## Padroes de Codigo

### TypeScript
- Use types explicitos
- Evite `any`
- Prefira interfaces para objetos

### React
- Componentes funcionais
- Hooks para estado e efeitos
- Nomes descritivos para props

### Estilo
- Tailwind CSS para estilos
- Use `cn()` para classes condicionais
- Mobile-first

### Testes
- Testes unitarios para utils e stores
- Testes E2E para fluxos criticos
- Coverage minimo de 70%

## Estrutura de Commits

```
tipo(escopo): descricao curta

Corpo opcional com mais detalhes.

Footer opcional (breaking changes, issues fechadas)
```

### Tipos
- `feat`: Nova funcionalidade
- `fix`: Correcao de bug
- `docs`: Documentacao
- `style`: Formatacao (nao afeta logica)
- `refactor`: Refatoracao
- `test`: Testes
- `chore`: Manutencao

## Code Review

PRs serao revisados considerando:

1. **Funcionalidade**: Resolve o problema proposto?
2. **Testes**: Tem cobertura adequada?
3. **Codigo**: Segue os padroes do projeto?
4. **Performance**: Impacta negativamente?
5. **Seguranca**: Introduz vulnerabilidades?

## Duvidas?

Abra uma issue com tag `question` ou entre em contato.
