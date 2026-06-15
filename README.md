# Palaz Portfólio

Este é o repositório do site [palaz.com.br](https://palaz.com.br), um portfólio desenvolvido com [Next.js 15](https://nextjs.org), [Tailwind CSS v4](https://tailwindcss.com) e [Framer Motion](https://www.framer.com/motion/).

## 🚀 Como rodar o projeto localmente

Primeiro, instale as dependências:

```bash
npm install
```

Em seguida, inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

## 📦 Como fazer o Deploy na Hostinger

Este projeto foi configurado para **não** utilizar a Vercel ou o GitHub Actions. O deploy será feito compilando os arquivos localmente e enviando para a [Hostinger](https://www.hostinger.com.br).

Siga os passos abaixo para gerar a build e publicar:

1. **Gerar a build de produção local:**
   No terminal, execute o script customizado de deploy:
   ```bash
   npm run deploy
   ```
   *Nota: Este comando utiliza o export estático do Next.js, trata rotas dinâmicas temporariamente e reúne os arquivos finais (junto com arquivos soltos como `.htaccess`) na pasta `dist`.*

2. **Fazer o upload para a Hostinger:**
   - Acesse o painel da sua conta na Hostinger.
   - Vá em **Gerenciador de Arquivos**.
   - Navegue até a pasta `public_html` associada ao domínio `palaz.com.br`.
   - Limpe o conteúdo antigo (se houver e não for mais necessário).
   - Faça o upload de **todo o conteúdo** que foi gerado *dentro* da pasta `dist` do seu computador.

3. **Pronto!** O site já deve estar atualizado em produção.

## 🛠️ Tecnologias Principais

- **[Next.js 15](https://nextjs.org/)** - Framework React com App Router
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Estilização
- **[Framer Motion](https://www.framer.com/motion/)** - Animações fluidas
- **[next-intl](https://next-intl-docs.vercel.app/)** - Internacionalização
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Gerenciamento de estado global
