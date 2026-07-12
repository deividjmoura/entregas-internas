import { NivelUrgencia, StatusSolicitacao, TipoEntrega } from "@entregas/shared";

/**
 * Entidade de domínio. Sem dependência de framework, banco ou HTTP —
 * apenas regras de negócio puras (Clean Architecture / Domain layer).
 */
export class Solicitacao {
  private constructor(
    public readonly id: string,
    public readonly tipo: TipoEntrega,
    public readonly descricaoItem: string,
    public readonly localDestino: string,
    public readonly urgencia: NivelUrgencia,
    public readonly solicitanteId: string,
    private _status: StatusSolicitacao,
    private _entregadorId: string | undefined,
    public readonly criadaEm: Date,
    private _atualizadaEm: Date,
  ) {}

  static criar(params: {
    id: string;
    tipo: TipoEntrega;
    descricaoItem: string;
    localDestino: string;
    urgencia: NivelUrgencia;
    solicitanteId: string;
  }): Solicitacao {
    if (params.descricaoItem.trim().length === 0) {
      throw new Error("Descrição do item não pode ser vazia");
    }
    if (params.localDestino.trim().length === 0) {
      throw new Error("Local de destino é obrigatório");
    }

    const agora = new Date();
    return new Solicitacao(
      params.id,
      params.tipo,
      params.descricaoItem.trim(),
      params.localDestino.trim(),
      params.urgencia,
      params.solicitanteId,
      StatusSolicitacao.PENDENTE,
      undefined,
      agora,
      agora,
    );
  }

  static reconstituir(params: {
    id: string;
    tipo: TipoEntrega;
    descricaoItem: string;
    localDestino: string;
    urgencia: NivelUrgencia;
    solicitanteId: string;
    status: StatusSolicitacao;
    entregadorId?: string;
    criadaEm: Date;
    atualizadaEm: Date;
  }): Solicitacao {
    return new Solicitacao(
      params.id,
      params.tipo,
      params.descricaoItem,
      params.localDestino,
      params.urgencia,
      params.solicitanteId,
      params.status,
      params.entregadorId,
      params.criadaEm,
      params.atualizadaEm,
    );
  }

  get status(): StatusSolicitacao {
    return this._status;
  }

  get entregadorId(): string | undefined {
    return this._entregadorId;
  }

  get atualizadaEm(): Date {
    return this._atualizadaEm;
  }

  /** Regra: só pode ser cancelada se ainda não foi entregue. */
  cancelar(): void {
    if (this._status === StatusSolicitacao.ENTREGUE) {
      throw new Error("Não é possível cancelar uma solicitação já entregue");
    }
    this._status = StatusSolicitacao.CANCELADA;
    this._atualizadaEm = new Date();
  }

  /**
   * Transição para EM_CURSO. A garantia de que apenas um entregador
   * consegue fazer essa transição (lock otimista) é responsabilidade
   * da infraestrutura (repository), não do domínio — aqui só validamos
   * a regra de negócio da transição de estado.
   */
  marcarEmCurso(entregadorId: string): void {
    if (this._status !== StatusSolicitacao.PENDENTE) {
      throw new Error(
        `Não é possível assumir uma solicitação com status ${this._status}`,
      );
    }
    this._status = StatusSolicitacao.EM_CURSO;
    this._entregadorId = entregadorId;
    this._atualizadaEm = new Date();
  }

  marcarEntregue(): void {
    if (this._status !== StatusSolicitacao.EM_CURSO) {
      throw new Error("Só é possível confirmar entrega de uma solicitação em curso");
    }
    this._status = StatusSolicitacao.ENTREGUE;
    this._atualizadaEm = new Date();
  }
}
