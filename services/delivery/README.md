# delivery-service

> Segue exatamente o mesmo padrão de `services/request` (Clean Architecture:
> domain → application → infrastructure → interface). Ainda não implementado —
> entra na Fase 2 do roadmap.

## Escopo (Fase 2)
- **Assumir urgência**: use case `AssumirEntrega`, usando
  `atualizarComLockOtimista` do repositório (mesmo mecanismo do
  `request-service`) para garantir que só um entregador consiga assumir.
- **Confirmar entrega**: use case `ConfirmarEntrega`, com upload de foto de
  evidência (Cloud Storage) e timestamp.
- **Notificações push**: publica evento `entrega.assumida` /
  `entrega.confirmada` no Pub/Sub para o `notification-service` consumir.

## Entidades de domínio esperadas
- `Entrega` (id, solicitacaoId, entregadorId, status, fotoEvidenciaUrl, confirmadaEm)

## Pastas já criadas
```
src/domain/entities
src/domain/repositories
src/application/use-cases
src/infrastructure
src/interface/http
```
