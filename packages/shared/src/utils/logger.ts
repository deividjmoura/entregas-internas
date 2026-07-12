/**
 * Logger estruturado (JSON) usado por todos os serviços.
 * Compatível com Cloud Logging: cada linha é um JSON com
 * severity, service, requestId e o payload da mensagem.
 * (Base para a Fase 4 - Observabilidade)
 */

type LogLevel = "DEBUG" | "INFO" | "WARNING" | "ERROR" | "CRITICAL";

interface LogContext {
  requestId?: string;
  traceId?: string;
  [key: string]: unknown;
}

function log(service: string, level: LogLevel, message: string, context: LogContext = {}) {
  const entry = {
    severity: level,
    service,
    message,
    timestamp: new Date().toISOString(),
    ...context,
  };
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(entry));
}

export function createLogger(service: string) {
  return {
    debug: (message: string, context?: LogContext) => log(service, "DEBUG", message, context),
    info: (message: string, context?: LogContext) => log(service, "INFO", message, context),
    warn: (message: string, context?: LogContext) => log(service, "WARNING", message, context),
    error: (message: string, context?: LogContext) => log(service, "ERROR", message, context),
    critical: (message: string, context?: LogContext) => log(service, "CRITICAL", message, context),
  };
}
