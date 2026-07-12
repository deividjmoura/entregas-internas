<<<<<<< HEAD
# Sistema de Controle de Entregas Internas

Plataforma de coordenação entre solicitantes de componentes e entregadores,
substituindo o fluxo atual por rádio/WhatsApp por um sistema com visibilidade
em tempo real e prevenção de duplicidade de entregas.

## Status
🚧 Fase 1 em andamento — scaffolding do monorepo e `request-service` como
serviço de referência (template de Clean Architecture para os demais).

## Estrutura
```
apps/
  web/            → Next.js (PWA entregador + dashboard solicitante)
  api-gateway/     → ponto único de entrada da API
services/
  request/         → ✅ implementado (template de referência)
  delivery/        → 📋 escopo definido, aguardando Fase 2
  ai-assistant/     → 📋 escopo definido, aguardando Fase 3
  notification/    → 📋 escopo definido, aguardando Fase 2
  user/            → 📋 escopo definido, aguardando Fase 1/2
packages/
  shared/          → ✅ tipos, contratos de eventos e utils compartilhados
infra/
  terraform/       → ✅ setup inicial GCP (projeto, VPC, Artifact Registry)
```

## Como rodar localmente

1. Copie `.env.example` para `.env` e preencha as chaves necessárias
   (ver seção abaixo).
2. Suba a infra local:
   ```bash
   docker compose up -d postgres redis
   ```
3. Instale dependências:
   ```bash
   pnpm install
   ```
4. Gere o Prisma Client e rode as migrations do request-service:
   ```bash
   pnpm --filter @entregas/request-service prisma:generate
   pnpm --filter @entregas/request-service prisma:migrate
   ```
5. Suba os serviços em modo dev:
   ```bash
   pnpm dev
   ```

## Chaves e secrets a configurar (`.env`)
Todos os placeholders estão documentados em `.env.example`. Resumo do que
você precisa gerar/obter antes de rodar em produção:

| Variável | Onde obter |
|---|---|
| `GCP_PROJECT_ID` / service account key | Console GCP → IAM |
| `DATABASE_URL` | Cloud SQL (instância Postgres) |
| `FIREBASE_*` | Console Firebase → Configurações do projeto |
| `FCM_SERVER_KEY` | Firebase Cloud Messaging |
| `JWT_SECRET` | gerar valor aleatório forte (ex: `openssl rand -hex 32`) |
| `ANTHROPIC_API_KEY` | console.anthropic.com |
| `GEMINI_API_KEY` / `VERTEX_AI_PROJECT_ID` | Google AI Studio / Vertex AI |

## Padrão de arquitetura
Cada microserviço segue Clean Architecture em 4 camadas — use
`services/request` como referência ao implementar os demais:

```
src/
  domain/          → entidades e regras de negócio puras, sem dependências externas
  application/     → casos de uso, orquestram o domínio
  infrastructure/   → Prisma, Pub/Sub, repositórios concretos
  interface/       → controllers HTTP/WebSocket, DTOs (Zod)
```

## Commits
Este projeto segue [Conventional Commits](https://www.conventionalcommits.org/)
(formato Commitizen): `tipo(escopo): descrição`.
=======
# Entregas Internas — Demo

Versão simplificada para apresentação: **um único app Next.js**, sem
GCP, sem Firebase, sem microserviços. Zero custo. Pensado pra ir do zero
a um link público em ~15 minutos.

O que já funciona:
- Solicitante abre urgência (tipo, item, local, urgência)
- Entregador vê a fila ordenada por urgência e assume — com **lock
  otimista real** (dois entregadores não conseguem assumir a mesma
  urgência, mesmo clicando ao mesmo tempo)
- Confirmação de entrega
- Atualização quase em tempo real via polling (a cada 2,5–3s)

O que **não** está aqui ainda (fica pra proposta de evolução paga):
autenticação real, notificação push, IA de detecção de duplicatas,
observabilidade, microserviços, infraestrutura GCP.

---

## Deploy gratuito (Neon + Vercel) — passo a passo

### 1. Banco de dados gratuito (Neon)
1. Acesse [neon.tech](https://neon.tech) e crie uma conta grátis (não
   pede cartão)
2. Crie um projeto novo → copie a **Connection String** (algo como
   `postgresql://usuario:senha@ep-xxxx.neon.tech/neondb?sslmode=require`)

### 2. Subir o código pro GitHub
```bash
cd entregas-demo
git init
git add .
git commit -m "feat: primeira versão do demo de entregas internas"
git branch -M main
git remote add origin <URL_DO_SEU_REPO_NO_GITHUB>
git push -u origin main
```

### 3. Deploy gratuito (Vercel)
1. Acesse [vercel.com](https://vercel.com) → login com GitHub
2. "Add New Project" → selecione o repositório que você acabou de subir
3. Em **Environment Variables**, adicione:
   - `DATABASE_URL` = a connection string do Neon (passo 1)
4. Clique em Deploy

### 4. Criar as tabelas no banco (uma vez só)
Depois do primeiro deploy, rode localmente (com o `.env` apontando pro
Neon) ou via terminal da Vercel:
```bash
npx prisma db push
```
Isso cria a tabela `Solicitacao` no banco gratuito do Neon.

### 5. Pronto
A Vercel te dá uma URL tipo `https://seu-projeto.vercel.app` — esse é o
link que você usa na apresentação amanhã, acessível de qualquer lugar.

---

## Rodar local (antes de fazer deploy, pra testar)

```bash
cp .env.example .env
# edite o .env com a connection string do Neon
npm install
npx prisma db push
npm run dev
```
Abra `http://localhost:3000`.

---

## Roteiro sugerido pra apresentação

1. Abrir em duas abas: uma como **Solicitante**, outra como **Entregador**
2. Na aba Solicitante: abrir uma urgência crítica
3. Trocar pra aba Entregador: mostrar a urgência aparecendo na fila com
   destaque vermelho pulsante
4. Clicar "Assumir" → mostrar que o status muda em tempo real na aba do
   Solicitante também (sem dar refresh)
5. **Mostrar o ponto forte**: abrir duas abas de Entregador diferentes
   (nomes diferentes), tentar assumir a mesma urgência nas duas ao mesmo
   tempo → só uma consegue, a outra recebe o erro "já foi assumida" —
   isso prova o mecanismo central do sistema
6. Confirmar a entrega → status muda pra "Entregue"
7. Fechar com o roadmap: "isso aqui é o núcleo funcionando sem custo.
   A proposta de evolução adiciona autenticação real, notificação push,
   IA pra detectar duplicata automaticamente, e infraestrutura escalável
   — com investimento X."
>>>>>>> 8106aa9 (feat: primeira versão do demo de entregas internas)
