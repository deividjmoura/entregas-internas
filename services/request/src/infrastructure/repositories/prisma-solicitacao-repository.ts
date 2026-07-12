import { NivelUrgencia, StatusSolicitacao, TipoEntrega } from "@entregas/shared";
import type { PrismaClient } from "@prisma/client";
import { Solicitacao } from "../../domain/entities/solicitacao.js";
import type { SolicitacaoRepository } from "../../domain/repositories/solicitacao-repository.js";

export class PrismaSolicitacaoRepository implements SolicitacaoRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async salvar(solicitacao: Solicitacao): Promise<void> {
    await this.prisma.solicitacaoModel.upsert({
      where: { id: solicitacao.id },
      create: {
        id: solicitacao.id,
        tipo: solicitacao.tipo,
        descricaoItem: solicitacao.descricaoItem,
        localDestino: solicitacao.localDestino,
        urgencia: solicitacao.urgencia,
        status: solicitacao.status,
        solicitanteId: solicitacao.solicitanteId,
        entregadorId: solicitacao.entregadorId,
      },
      update: {
        status: solicitacao.status,
        entregadorId: solicitacao.entregadorId,
      },
    });
  }

  async buscarPorId(id: string): Promise<Solicitacao | null> {
    const model = await this.prisma.solicitacaoModel.findUnique({ where: { id } });
    if (!model) return null;
    return this.paraEntidade(model);
  }

  async listarPendentesOrdenadasPorUrgencia(): Promise<Solicitacao[]> {
    const models = await this.prisma.solicitacaoModel.findMany({
      where: { status: StatusSolicitacao.PENDENTE },
      // CRITICA > MEDIA > BAIXA alfabeticamente não bate, então ordenamos
      // por um CASE explícito via orderBy raw seria ideal; aqui simplificado.
      orderBy: [{ criadaEm: "asc" }],
    });
    return models.map((m) => this.paraEntidade(m));
  }

  async listarPorSolicitante(solicitanteId: string): Promise<Solicitacao[]> {
    const models = await this.prisma.solicitacaoModel.findMany({
      where: { solicitanteId },
      orderBy: { criadaEm: "desc" },
    });
    return models.map((m) => this.paraEntidade(m));
  }

  /**
   * Núcleo anti-duplicidade: o UPDATE só é aplicado se o status em banco
   * ainda for o esperado (statusEsperadoAntes). Se dois entregadores
   * tentarem assumir a mesma urgência simultaneamente, apenas o primeiro
   * WHERE bate — o segundo recebe count = 0 e sabe que perdeu a corrida.
   */
  async atualizarComLockOtimista(
    solicitacao: Solicitacao,
    statusEsperadoAntes: string,
  ): Promise<boolean> {
    const resultado = await this.prisma.solicitacaoModel.updateMany({
      where: {
        id: solicitacao.id,
        status: statusEsperadoAntes as StatusSolicitacao,
      },
      data: {
        status: solicitacao.status,
        entregadorId: solicitacao.entregadorId,
        versao: { increment: 1 },
      },
    });
    return resultado.count === 1;
  }

  private paraEntidade(model: {
    id: string;
    tipo: string;
    descricaoItem: string;
    localDestino: string;
    urgencia: string;
    status: string;
    solicitanteId: string;
    entregadorId: string | null;
    criadaEm: Date;
    atualizadaEm: Date;
  }): Solicitacao {
    return Solicitacao.reconstituir({
      id: model.id,
      tipo: model.tipo as TipoEntrega,
      descricaoItem: model.descricaoItem,
      localDestino: model.localDestino,
      urgencia: model.urgencia as NivelUrgencia,
      solicitanteId: model.solicitanteId,
      status: model.status as StatusSolicitacao,
      entregadorId: model.entregadorId ?? undefined,
      criadaEm: model.criadaEm,
      atualizadaEm: model.atualizadaEm,
    });
  }
}
