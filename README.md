# Bate-papo Ual

Um aplicativo de chat em tempo real inspirado no antigo "Bate papo da UOL". Permite que usuários entrem com um nickname, criem novas salas de chat ou entrem em salas existentes. Inclui notificações de entrada/saída de usuários e indicadores de digitação.

## 🚀 Demonstração

Acesse a aplicação em produção: [https://bate-papo-ual.onrender.com/](https://bate-papo-ual.onrender.com/)

## ✨ Funcionalidades

- **Entrar com nickname**: Usuários podem escolher um nickname temporário para a sessão.
- **Criar ou entrar em salas**: Salas são públicas e qualquer um pode criar uma nova ou entrar em uma existente.
- **Chat em tempo real**: Mensagens são enviadas instantaneamente usando WebSockets.
- **Notificações de entrada/saída**: Todos na sala são notificados quando alguém entra ou sai.
- **Indicadores de digitação**: Mostra quando outros usuários estão digitando.
- **Persistência de mensagens**: Mensagens são salvas por sala e carregadas ao entrar.
- **Lista de salas ativas**: Visualize salas com usuários ativos na página inicial.
- **Interface responsiva**: Construída com Material-UI para uma experiência moderna.

## 🛠️ Tecnologias Utilizadas

### Frontend

- **Next.js 15.5.4**: Framework React para renderização do lado do servidor e geração de sites estáticos.
- **React 19.1.0**: Biblioteca para construção de interfaces de usuário.
- **TypeScript**: Superset do JavaScript com tipagem estática.
- **Material-UI (@mui/material)**: Biblioteca de componentes React para uma UI consistente e moderna.
- **Socket.IO Client**: Para comunicação em tempo real com o servidor.

### Backend

- **Node.js**: Ambiente de execução JavaScript no servidor.
- **Socket.IO**: Biblioteca para comunicação bidirecional em tempo real.
- **Next.js Custom Server**: Servidor personalizado integrado ao Next.js para lidar com WebSockets e APIs.

### Outros

- **ESLint**: Ferramenta de linting para manter a qualidade do código.
- **JSON**: Persistência simples de mensagens em arquivo JSON (apenas para demonstração).

## 📦 Instalação e Execução Local

### Pré-requisitos

- Node.js (versão recomendada no `.nvmrc`)
- npm ou yarn

### Passos

1. Clone o repositório:

   ```bash
   git clone https://github.com/profhdeivisson/bate-papo-ual
   cd bate-papo-ual
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Execute o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

4. Abra [http://localhost:3000](http://localhost:3000) no navegador.

### Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Constrói a aplicação para produção.
- `npm run start`: Inicia o servidor em modo produção.
- `npm run lint`: Executa o linter ESLint.

## 🚀 Deploy

A aplicação está hospedada no [Render](https://render.com/) e pode ser acessada em [https://bate-papo-ual.onrender.com/](https://bate-papo-ual.onrender.com/).

Para fazer deploy em outros serviços:

1. Construa a aplicação: `npm run build`
2. Configure o servidor para executar `node server.js` em produção.
3. Certifique-se de que o serviço suporta WebSockets (Socket.IO).

## 📖 Como Usar

1. **Página Inicial**:

   - Digite seu nickname.
   - Digite o nome da sala ou selecione uma sala ativa.
   - Clique em "Entrar" para acessar o chat.

2. **Sala de Chat**:
   - Digite mensagens no campo de texto e pressione Enter ou clique em "Enviar".
   - Veja notificações quando usuários entram ou saem.
   - Observe os indicadores de digitação de outros usuários.
   - Clique no ícone de saída para deixar a sala.

## 🏗️ Estrutura do Projeto

```
bate-papo-ual/
├── public/                 # Arquivos estáticos
├── src/
│   ├── components/         # Componentes React reutilizáveis
│   │   ├── ActiveRoomsList.tsx
│   │   └── HomeForm.tsx
│   ├── pages/              # Páginas Next.js
│   │   ├── index.tsx       # Página inicial
│   │   └── chat/[room].tsx # Página da sala de chat
│   ├── services/           # Serviços (ex: API para salas)
│   ├── themes/             # Configuração de temas MUI
│   ├── types/              # Definições de tipos TypeScript
│   └── utils/              # Utilitários (ex: gerenciamento de sessão)
├── server.js               # Servidor personalizado com Socket.IO
├── messages.json           # Persistência de mensagens (demo)
├── package.json
├── tsconfig.json
└── README.md
```

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

1. Fork o projeto.
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`).
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`).
4. Push para a branch (`git push origin feature/nova-feature`).
5. Abra um Pull Request.

## 📄 Licença

Este projeto é de código aberto e está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Contato

Para dúvidas ou sugestões, entre em contato através das issues do GitHub.
