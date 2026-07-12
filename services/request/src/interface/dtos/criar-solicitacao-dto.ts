import { z } from "zod";
import { NivelUrgencia, TipoEntrega } from "@entregas/shared";

export const CriarSolicitacaoDto = z.object({
  tipo: z.nativeEnum(TipoEntrega),
  descricaoItem: z.string().min(2, "Descrição muito curta").max(200),
  localDestino: z.string().min(2, "Local de destino é obrigatório").max(120),
  urgencia: z.nativeEnum(NivelUrgencia),
});

export type CriarSolicitacaoDto = z.infer<typeof CriarSolicitacaoDto>;
