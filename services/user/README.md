# user-service

> Perfis de usuário, permissões e setores. Integração com Firebase Auth.
> Base necessária ainda na Fase 1 (autenticação), expandido na Fase 2.

## Escopo
- Cadastro/sincronização de usuário a partir do Firebase Auth (JWT)
- Perfis: `SOLICITANTE` / `ENTREGADOR`
- Setores da empresa (depende do levantamento de "Mapeamento dos setores"
  citado nas considerações do roadmap — pré-requisito antes da Fase 2)

## Entidades de domínio esperadas
- `Usuario` (id, nome, email, perfil, setorId)
- `Setor` (id, nome, localizacao)
