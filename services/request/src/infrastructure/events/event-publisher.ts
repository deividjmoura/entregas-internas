import { PubSub } from "@google-cloud/pubsub";
import { createLogger } from "@entregas/shared";

const logger = createLogger("request-service");

export interface EventPublisher {
  publicar(topico: string, payload: Record<string, unknown>): Promise<void>;
}

/**
 * Publisher real via Cloud Pub/Sub. Requer GCP_PROJECT_ID e credenciais
 * configuradas (GOOGLE_APPLICATION_CREDENTIALS) — ver .env.example.
 */
export class PubSubEventPublisher implements EventPublisher {
  private readonly pubsub: PubSub;

  constructor(projectId = process.env.GCP_PROJECT_ID) {
    this.pubsub = new PubSub({ projectId });
  }

  async publicar(topico: string, payload: Record<string, unknown>): Promise<void> {
    try {
      const dataBuffer = Buffer.from(JSON.stringify(payload));
      const messageId = await this.pubsub.topic(topico).publishMessage({ data: dataBuffer });
      logger.info("Evento publicado", { topico, messageId });
    } catch (error) {
      logger.error("Falha ao publicar evento", { topico, error: String(error) });
      throw error;
    }
  }
}

/**
 * Publisher em memória/log — usado em desenvolvimento local ou testes,
 * quando ainda não há Pub/Sub configurado.
 */
export class LogEventPublisher implements EventPublisher {
  async publicar(topico: string, payload: Record<string, unknown>): Promise<void> {
    logger.info("[dev] Evento (não publicado de fato)", { topico, payload });
  }
}
