# Efata Prime Elevadores 🛡️

> Sistema de gerenciamento para manutenção e vistorias de elevadores

![Logo Efata Prime](assets/images/logo.png)

## 📋 Sobre o Projeto

O sistema da Efata Prime Elevadores é uma solução completa para gerenciamento de manutenções, vistorias, ordens de serviço e relacionamento com clientes no setor de elevadores. Desenvolvido com foco em usabilidade, segurança e eficiência, o sistema permite o controle total das operações da empresa.

## 🚀 Funcionalidades

- **Gerenciamento de Vistorias**: Cadastro, agendamento e acompanhamento de vistorias técnicas
- **Ordens de Serviço**: Criação, atribuição e monitoramento de ordens de serviço
- **Upload de Fotos**: Sistema de upload e organização de imagens para documentação
- **Gestão de Clientes**: Cadastro completo de clientes com histórico de atendimentos
- **Dashboard Administrativo**: Visão geral das operações com gráficos e estatísticas
- **Níveis de Acesso**: Permissões diferenciadas para administradores, técnicos e clientes
- **Relatórios**: Geração de relatórios detalhados para análise e tomada de decisão

## 🔧 Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript
- **Bibliotecas**: Chart.js (gráficos), Font Awesome (ícones)
- **Fontes**: Google Fonts (Montserrat)
- **Responsividade**: Design adaptável para dispositivos móveis e desktop

## 🏗️ Estrutura do Projeto

```
efata_prime/
├── assets/
│   ├── css/
│   │   ├── style.css       (estilos globais)
│   │   ├── login.css       (estilos da página de login)
│   │   └── dashboard.css   (estilos do painel administrativo)
│   ├── js/
│   │   ├── main.js         (funções globais)
│   │   ├── login.js        (funcionalidades de login)
│   │   └── dashboard.js    (funcionalidades do dashboard)
│   └── images/             (imagens e recursos visuais)
├── pages/
│   ├── login.html          (página de login)
│   ├── sobre.html          (página sobre a empresa)
│   ├── servicos.html       (página de serviços)
│   ├── portfolio.html      (portfólio de projetos)
│   └── contato.html        (página de contato)
├── dashboard/
│   ├── index.html          (dashboard principal)
│   ├── vistorias.html      (gerenciamento de vistorias)
│   ├── ordens-servico.html (gerenciamento de ordens de serviço)
│   ├── fotos.html          (gerenciamento de fotos)
│   ├── clientes.html       (gerenciamento de clientes)
│   └── relatorios.html     (relatórios e análises)
└── index.html              (página inicial do site)
```

## 📥 Instalação e Uso

### Requisitos

- Servidor web (Apache, Nginx, etc.)
- Navegador moderno (Chrome, Firefox, Safari, Edge)

### Passos para Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/weltongoncalves/siteefata.git
   ```

2. Faça upload dos arquivos para seu servidor web ou hospedagem

3. Acesse o site através do navegador

### Credenciais de Demonstração

Para testar o sistema, utilize as seguintes credenciais:

- **Administrador**: admin@efataprime.com.br / admin123
- **Técnico**: tecnico@efataprime.com.br / tecnico123
- **Cliente**: cliente@exemplo.com.br / cliente123

## 🔒 Segurança

O sistema implementa várias camadas de segurança:

- Autenticação de usuários com diferentes níveis de acesso
- Validação de formulários no cliente e servidor
- Proteção contra ataques comuns (XSS, CSRF)
- Sessões seguras com expiração automática

## 🖥️ Compatibilidade

O sistema é compatível com:

- Google Chrome (versão 90+)
- Mozilla Firefox (versão 88+)
- Safari (versão 14+)
- Microsoft Edge (versão 90+)
- Dispositivos móveis Android e iOS

## 🔄 Fluxo de Trabalho

1. **Cadastro de Cliente**: Registro de novos clientes com informações de contato
2. **Agendamento de Vistoria**: Programação de vistorias técnicas
3. **Realização da Vistoria**: Execução e documentação da vistoria com fotos
4. **Criação de Ordem de Serviço**: Geração de OS com base na vistoria
5. **Execução do Serviço**: Realização do serviço pelos técnicos
6. **Fechamento e Relatório**: Finalização da OS e geração de relatório

## 📱 Responsividade

O sistema é totalmente responsivo, adaptando-se a diferentes tamanhos de tela:

- **Desktop**: Experiência completa com todas as funcionalidades
- **Tablet**: Layout adaptado para telas médias
- **Smartphone**: Interface otimizada para uso móvel

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o sistema:

- **Email**: suporte@efataprime.com.br
- **Telefone**: (11) 9999-9999
- **Horário**: Segunda a Sexta, 8h às 18h

## 📄 Licença

© 2025 Efata Prime Elevadores. Todos os direitos reservados.
