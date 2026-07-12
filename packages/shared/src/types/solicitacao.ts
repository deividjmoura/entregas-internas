/**
 * Tipos de domínio compartilhados entre todos os microserviços.
 * Fonte única de verdade para os enums de negócio (evita divergência
 * entre request-service, delivery-service e ai-assistant).
 */

export const TipoEntrega = {
  COMPONENTE_FISICO: "COMPONENTE_FISICO",
  CIRCUITO_ELETRONICO: "CIRCUITO_ELETRONICO",
} as const;
export type TipoEntrega = (typeof TipoEntrega)[keyof typeof TipoEntrega];

export const NivelUrgencia = {
  BAIXA: "BAIXA",
  MEDIA: "MEDIA",
  CRITICA: "CRITICA",
} as const;
export type NivelUrgencia = (typeof NivelUrgencia)[keyof typeof NivelUrgencia];

export const StatusSolicitacao = {
  PENDENTE: "PENDENTE",
  EM_CURSO: "EM_CURSO",
  ENTREGUE: "ENTREGUE",
  CANCELADA: "CANCELADA",
} as const;
export type StatusSolicitacao =
  (typeof StatusSolicitacao)[keyof typeof StatusSolicitacao];

export const PerfilUsuario = {
  SOLICITANTE: "SOLICITANTE",
  ENTREGADOR: "ENTREGADOR",
} as const;
export type PerfilUsuario = (typeof PerfilUsuario)[keyof typeof PerfilUsuario];

export interface SolicitacaoResumo {
  id: string;
  tipo: TipoEntrega;
  descricaoItem: string;
  localDestino: string;
  urgencia: NivelUrgencia;
  status: StatusSolicitacao;
  solicitanteId: string;
  entregadorId?: string;
  criadaEm: string;
  atualizadaEm: string;
}
