import type { Solicitacao } from "../entities/solicitacao.js";

/**
 * Porta (interface) do repositório. O domínio não sabe se por trás
 * disso existe Postgres, Firestore ou memória — isso é implementado
 * na camada de Infrastructure.
 */
export interface SolicitacaoRepository {
  salvar(solicitacao: Solicitacao): Promise<void>;
  buscarPorId(id: string): Promise<Solicitacao | null>;
  listarPendentesOrdenadasPorUrgencia(): Promise<Solicitacao[]>;
  listarPorSolicitante(solicitanteId: string): Promise<Solicitacao[]>;

  /**
   * Atualiza com lock otimista: só aplica a mudança se a versão/status
   * em banco ainda for a esperada. Retorna false se outro entregador
   * já assumiu a solicitação primeiro — este é o mecanismo central
   * contra duplicidade de entregas descrito no roadmap.
   */
  atualizarComLockOtimista(
    solicitacao: Solicitacao,
    statusEsperadoAntes: string,
  ): Promise<boolean>;
}
