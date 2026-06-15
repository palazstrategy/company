# PLAN - Ajustes na Home (Hero e Cases)

## Meta
Padronizar a exibição dos projetos (Cases) na página inicial para que fiquem idênticos ao formato da página de `/cases`. E também "destravar" (remover o *sticky*) da seção Hero na página inicial, permitindo a rolagem natural do fluxo da página.

## Agentes Envolvidos (Orquestração Phase 2)
1. **`frontend-specialist`**: Focará em alterar a estrutura HTML/React da Home (`page.tsx`), removendo o `StickyProjectCard` e inserindo o grid de `ProjectCard`. Também cuidará de remover a classe `sticky top-0` do header para permitir o fluxo natural de scroll.
2. **`performance-optimizer`**: Avaliará o impacto destas alterações de componentes (como a quantia de imagens carregadas ao mesmo tempo via `ProjectCard` ao invés de em formato sticky) para garantir que as Core Web Vitals permaneçam intactas.
3. **`test-engineer`**: (Obrigatório para orquestração) Vai rodar os scripts de linting necessários para garantir a sanidade técnica do código e consistência nas tipagens/build após a alteração.

## Plano de Ação

### Fase 1: Planejamento (Atual)
- [x] Coleta de requisitos e compreensão inicial dos componentes (`page.tsx` vs `cases/page.tsx`).
- [x] Criação deste documento de planejamento.
- [ ] Obter aprovação do usuário para execução da Fase 2.

### Fase 2: Implementação
- **Passo 1 (Frontend): Modificar o Hero**  
  No arquivo `src/app/[locale]/page.tsx`:
  - Encontrar a `<section className="sticky top-0 w-full h-[100vh] ... bg-black z-0">`.
  - Trocar o `sticky top-0` por `relative`.
  - Reajustar o agrupamento de layout com o Spline/Video se necessário, para que a subida acompanhe o container e não fique fixa cobrindo fundo.
  
- **Passo 2 (Frontend): Padronizar Seção de Cases**
  - Remover a importação de `StickyProjectCard`.
  - Adicionar a importação de `ProjectCard`.
  - Substituir o wrapper atual dentro da div `<section className="w-full bg-black relative z-10">` para usar o mesmo Grid CSS encontrado em `cases/page.tsx`:
    ```tsx
    <div className="w-full px-6 md:px-10 lg:px-[50px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {selectedProjects.map((project, idx) => (
                <ProjectCard key={project.slug} {...project} index={idx} />
            ))}
        </div>
    </div>
    ```

- **Passo 3 (Performance & Verificação)**
  - Rodar o dev server local para análise visual.
  - O **`test-engineer`** rodará o script `lint_runner.py` (ou comando `npm run lint`) no final para auditar.

## Questões em Aberto / Check de Aprovação
> [!NOTE] Verificação do Usuário
> Gostaria de limitar a quantidade de *cases* listados na Home a apenas 4 projetos ou deseja exibir todos?

---
✅ **Aguardando aprovação do usuário para prosseguir para a Fase 2 (Implementação Simultânea).**
