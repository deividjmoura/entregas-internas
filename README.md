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


---

<p align="center">
  <a href="https://wa.me/55SEUNUMERO?text=Ol%C3%A1%20Deivid!%20Quero%20falar%20sobre%20parceria%20/%20projeto.">
    <img src="https://raw.githubusercontent.com/deividjmoura/deividjmoura/main/assets/logo-deivid-moura-dev.svg" alt="Deivid Moura DEV" width="140"/>
  </a><br/>
  <sub><b>Deivid Moura DEV</b> · parcerias e sistemas sob medida</sub>
</p>

