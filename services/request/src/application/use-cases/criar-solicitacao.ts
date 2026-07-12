import { randomUUID } from "node:crypto";
import type { NivelUrgencia, TipoEntrega } from "@entregas/shared";
import { Solicitacao } from "../../domain/entities/solicitacao.js";
import type { SolicitacaoRepository } from "../../domain/repositories/solicitacao-repository.js";
import type { EventPublisher } from "../../infrastructure/events/event-publisher.js";

export interface CriarSolicitacaoInput {
  tipo: TipoEntrega;
  descricaoItem: string;
  localDestino: string;
  urgencia: NivelUrgencia;
  solicitanteId: string;
}

/**
 * Caso de uso orquestra domínio + infraestrutura, mas não contém
 * regra de negócio em si (a regra vive na entidade Solicitacao).
 */
export class CriarSolicitacao {
  constructor(
    private readonly repository: SolicitacaoRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async executar(input: CriarSolicitacaoInput): Promise<Solicitacao> {
    const solicitacao = Solicitacao.criar({
      id: randomUUID(),
      ...input,
    });

    await this.repository.salvar(solicitacao);

    await this.eventPublisher.publicar("solicitacao.criada", {
      eventType: "solicitacao.criada",
      solicitacaoId: solicitacao.id,
      tipo: solicitacao.tipo,
      descricaoItem: solicitacao.descricaoItem,
      localDestino: solicitacao.localDestino,
      urgencia: solicitacao.urgencia,
      solicitanteId: solicitacao.solicitanteId,
      criadaEm: solicitacao.criadaEm.toISOString(),
    });

    return solicitacao;
  }
}
