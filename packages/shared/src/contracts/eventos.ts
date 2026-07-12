import { z } from "zod";
import { NivelUrgencia, StatusSolicitacao, TipoEntrega } from "../types/solicitacao.js";

/**
 * Contratos de eventos publicados no Pub/Sub.
 * Cada evento tem um schema Zod para validação em runtime
 * tanto no publisher quanto no consumer.
 */

export const SolicitacaoCriadaEvent = z.object({
  eventType: z.literal("solicitacao.criada"),
  solicitacaoId: z.string().uuid(),
  tipo: z.nativeEnum(TipoEntrega),
  descricaoItem: z.string().min(1),
  localDestino: z.string().min(1),
  urgencia: z.nativeEnum(NivelUrgencia),
  solicitanteId: z.string().uuid(),
  criadaEm: z.string().datetime(),
});
export type SolicitacaoCriadaEvent = z.infer<typeof SolicitacaoCriadaEvent>;

export const EntregaAssumidaEvent = z.object({
  eventType: z.literal("entrega.assumida"),
  solicitacaoId: z.string().uuid(),
  entregadorId: z.string().uuid(),
  assumidaEm: z.string().datetime(),
});
export type EntregaAssumidaEvent = z.infer<typeof EntregaAssumidaEvent>;

export const EntregaConfirmadaEvent = z.object({
  eventType: z.literal("entrega.confirmada"),
  solicitacaoId: z.string().uuid(),
  entregadorId: z.string().uuid(),
  fotoEvidenciaUrl: z.string().url().optional(),
  confirmadaEm: z.string().datetime(),
});
export type EntregaConfirmadaEvent = z.infer<typeof EntregaConfirmadaEvent>;

export const StatusAtualizadoEvent = z.object({
  eventType: z.literal("solicitacao.status_atualizado"),
  solicitacaoId: z.string().uuid(),
  statusAnterior: z.nativeEnum(StatusSolicitacao),
  statusNovo: z.nativeEnum(StatusSolicitacao),
  atualizadaEm: z.string().datetime(),
});
export type StatusAtualizadoEvent = z.infer<typeof StatusAtualizadoEvent>;

export type DomainEvent =
  | SolicitacaoCriadaEvent
  | EntregaAssumidaEvent
  | EntregaConfirmadaEvent
  | StatusAtualizadoEvent;
