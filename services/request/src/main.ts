import Fastify from "fastify";
import { createLogger } from "@entregas/shared";
import { prisma } from "./infrastructure/prisma/client.js";
import { PrismaSolicitacaoRepository } from "./infrastructure/repositories/prisma-solicitacao-repository.js";
import { LogEventPublisher, PubSubEventPublisher } from "./infrastructure/events/event-publisher.js";
import { registerSolicitacaoRoutes } from "./interface/http/routes.js";

const logger = createLogger("request-service");
const PORT = Number(process.env.PORT ?? 3001);

async function bootstrap() {
  const app = Fastify({ logger: false });

  const repository = new PrismaSolicitacaoRepository(prisma);
  const eventPublisher =
    process.env.NODE_ENV === "production"
      ? new PubSubEventPublisher()
      : new LogEventPublisher();

  await registerSolicitacaoRoutes(app, { repository, eventPublisher });

  await app.listen({ port: PORT, host: "0.0.0.0" });
  logger.info(`request-service ouvindo na porta ${PORT}`);
}

bootstrap().catch((error) => {
  logger.critical("Falha ao iniciar request-service", { error: String(error) });
  process.exit(1);
});
