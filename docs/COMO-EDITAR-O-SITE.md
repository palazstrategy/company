# Como Editar o Seu Portfólio (Sanity Studio)

Nesta arquitetura moderna (Next.js + Sanity CMS), a *Landing Page* que você vê em `http://localhost:4000/` puxa os dados **diretamente do banco de dados** do seu Painel Administrativo. 

Como nós acabamos de criar o banco do zero, é natural que a sessão de "Obras/Cases" da Landing Page esteja vazia no momento inicial, porque você ainda não inseriu os seus projetos reais lá!

## Passo a Passo para Inserir Conteúdo

A maior vantagem do Sanity Studio integrado é que ele roda na mesma URL do seu site, sem precisar de senhas extras em painéis complexos como o WordPress.

### 1. Acesse o seu Painel (Studio)
Abra no navegador: [http://localhost:4000/studio](http://localhost:4000/studio).

*Observação da primeira vez: Se aparecer uma tela amarela pedindo para adicionar `http://localhost:4000` em um botão verde "Add CORS Origin", clique nesse botão. É uma medida de segurança local. Ele vai pedir seu login da Sanity (use o mesmo Github/Google).*

### 2. A Interface do Studio
Você verá algo como um "App" onde no lado esquerdo terão os **Schemas** que nós criamos:
- **Projects (Projetos)**: É aqui que você adicionará os seus cases.
- *Settings (Se programado futuramente para rodapés e redes sociais).*

### 3. Criando o seu Primeiro Projeto
1. Clique na aba **Projects** no painel lateral.
2. No canto superior direito, clique num ícone de **Caneta** ou **Novo Documento** para começar um projeto em branco.
3. Preencha as informações:
   - **Title**: O nome da sua obra/site/design (ex: "Site de Portfólio Arpeggio").
   - **Slug**: Clique em "Generate". Isso cria o link amigável (ex: `/cases/site-portifolio-arpeggio`).
   - **Client Name**: Para quem você fez o trabalho.
   - **Main Image**: Suba a foto de capa super profissional do seu case. É ela que vai brilhar com os efeitos de *Hover* (quando passar o mouse) na Landing Page.
   - **Body**: Um editor completo (estilo Notion) onde você pode adicionar textos, explicar a sua Estratégia, o Processo de UX/UI e colocar imagens estendidas dentro do conteúdo do artigo do case.

### 4. Publique e Veja a Mágica
Após preencher, basta clicar no botão verde gigante **PUBLISH** (Publicar) no canto inferior direito.

Feito isso, abra uma aba e volte para `http://localhost:4000/`. A sua página inicial automaticamente irá até o banco de dados do Sanity em tempo real, buscará aquele projeto novo que você publicou, e construirá a Grade Dinâmica (`Projects Grid`) magicamente na home!

Quanto mais projetos você adicionar no `/studio`, mais a página inicial cresce organicamente sem você nunca mais ter que escrever 1 linha de código de front-end.
