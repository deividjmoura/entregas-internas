import type { FastifyInstance } from "fastify";
import { CriarSolicitacaoDto } from "../dtos/criar-solicitacao-dto.js";
import { CriarSolicitacao } from "../../application/use-cases/criar-solicitacao.js";
import { CancelarUrgencia } from "../../application/use-cases/cancelar-urgencia.js";
import type { SolicitacaoRepository } from "../../domain/repositories/solicitacao-repository.js";
import type { EventPublisher } from "../../infrastructure/events/event-publisher.js";

interface RouteDeps {
  repository: SolicitacaoRepository;
  eventPublisher: EventPublisher;
}

/**
 * Registro de rotas seguindo o padrão de controllers finos:
 * a rota só valida entrada, chama o use case e formata a saída.
 * Nenhuma regra de negócio vive aqui.
 */
export async function registerSolicitacaoRoutes(app: FastifyInstance, deps: RouteDeps) {
  const criarSolicitacao = new CriarSolicitacao(deps.repository, deps.eventPublisher);
  const cancelarUrgencia = new CancelarUrgencia(deps.repository);

  app.post("/solicitacoes", async (request, reply) => {
    const parseResult = CriarSolicitacaoDto.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({ erro: "Payload inválido", detalhes: parseResult.error.flatten() });
    }

    // TODO: extrair solicitanteId do JWT autenticado (Firebase Auth) em vez de confiar no body
    const solicitanteId = (request.body as { solicitanteId?: string }).solicitanteId;
    if (!solicitanteId) {
      return reply.status(401).send({ erro: "Usuário não autenticado" });
    }

    const solicitacao = await criarSolicitacao.executar({
      ...parseResult.data,
      solicitanteId,
    });

    return reply.status(201).send({
      id: solicitacao.id,
      status: solicitacao.status,
      criadaEm: solicitacao.criadaEm,
    });
  });

  app.get("/solicitacoes/pendentes", async (_request, reply) => {
    const pendentes = await deps.repository.listarPendentesOrdenadasPorUrgencia();
    return reply.send(pendentes);
  });

  app.delete("/solicitacoes/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      await cancelarUrgencia.executar(id);
      return reply.status(204).send();
    } catch (error) {
      return reply.status(409).send({ erro: (error as Error).message });
    }
  });

  app.get("/health", async (_request, reply) => {
    return reply.send({ status: "ok", service: "request-service" });
  });
}
