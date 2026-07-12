import type { SolicitacaoRepository } from "../../domain/repositories/solicitacao-repository.js";

export class CancelarUrgencia {
  constructor(private readonly repository: SolicitacaoRepository) {}

  async executar(solicitacaoId: string): Promise<void> {
    const solicitacao = await this.repository.buscarPorId(solicitacaoId);
    if (!solicitacao) {
      throw new Error("Solicitação não encontrada");
    }
    solicitacao.cancelar();
    await this.repository.salvar(solicitacao);
  }
}
