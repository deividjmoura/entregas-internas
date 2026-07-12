# notification-service

> Consumidor de eventos Pub/Sub — dispara push (FCM), WebSocket ou email
> conforme o tipo de evento. Entra na Fase 2 (push) e Fase 3 (relatório
> semanal por email).

## Escopo
- Consumir `solicitacao.criada` → notificar entregadores disponíveis via FCM
- Consumir `entrega.assumida` / `entrega.confirmada` → atualizar
  solicitantes via WebSocket
- Job semanal → relatório de padrões (Fase 3) por email

## Observação de stack
O roadmap indica Python para este serviço especificamente (stack
tecnológica completa), diferente dos demais que são Node.js/TypeScript.
Avaliar se mantém em Python (ex: FastAPI) ou padroniza em Node — decisão
de arquitetura a ser tomada pelo Tech Lead antes de iniciar a Fase 2.
