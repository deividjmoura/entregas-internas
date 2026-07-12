# ai-assistant

> Gateway de IA — entra na Fase 3 do roadmap. Estrutura de pastas já criada
> seguindo o mesmo padrão de Clean Architecture dos demais serviços.

## Escopo (Fase 3)
- **Detecção de duplicatas**: embeddings + busca vetorial via pgvector
  (Cloud SQL) sobre `descricaoItem` das solicitações.
- **Assistente do entregador**: chat com function calling, consultando
  dados reais (`buscarSolicitacoesAbertas`, `verificarStatusCarrinho`,
  `listarEntregadoresAtivos`, `buscarHistoricoEntregas`).
- **Sugestão de sequência de entregas**: ranking de urgências por
  localização + prioridade.
- **Relatório semanal automatizado**: geração de texto + envio por email.

## Seleção de modelo
- Gemini via Vertex AI → tarefas de baixa latência (triagem, rota)
- Claude via Anthropic API → análise complexa (relatórios, padrões)
- Fallback automático entre os dois configurado no gateway

## Variáveis de ambiente necessárias
Ver `.env.example` na raiz: `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`,
`VERTEX_AI_PROJECT_ID`, `GOOGLE_AI_STUDIO_API_KEY`.
