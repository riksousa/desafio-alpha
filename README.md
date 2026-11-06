# Alpha Log Transportes — Landing Page B2B

Landing page original desenvolvida para o desafio técnico da marca-conceito **Alpha Log Transportes**. Objetivo principal: gerar solicitações de cotação de clientes B2B.

## Executar

**Opção 1 — mais simples:** abra `index.html` no navegador. Não precisa de `npm install`, framework, banco de dados nem backend.

**Opção 2 — servidor local (recomendado para desenvolvimento):**

```bash
cd alpha-log-landing
python -m http.server 5500
```

Abra `http://localhost:5500`. No VS Code, também é possível usar a extensão Live Server.

## Configurar o WhatsApp para captação real

No arquivo `scripts/config.js`, altere:

```js
whatsappNumber: "5531987092350", // EXEMPLO: substitua pelo número comercial real , coloquei meu numero de celular afim de testes para que vocês não precisarem de alterar nada.
```

Use **somente números** no formato `DDI + DDD + telefone`.

**Importante:** o briefing não informa o WhatsApp da Alpha Log. Por isso, a versão entregue mantém `whatsappNumber: ""`. Os botões abrem a interface de compartilhamento do WhatsApp, e o formulário prepara uma mensagem preenchida com os dados da cotação. **O formulário não envia leads para CRM, e-mail nem banco de dados sem um destinatário ou endpoint real**. Para habilitar a captação comercial real, informe o número da empresa ou integre um backend autorizado.

## Estrutura do projeto

```text
alpha-log-landing/
├── index.html            # Página e conteúdo semântico
├── assets/
│   └── favicon.svg       # Identidade gráfica original
├── styles/
│   └── main.css          # Estilos e breakpoints responsivos
├── scripts/
│   ├── config.js         # Configuração de contato
│   └── app.js            # Navegação, formulário e integração WhatsApp
├── docs/
│   ├── CHECKLIST.md      # Matriz de atendimento ao desafio
│   └── DECISOES.md       # Critérios técnicos / comerciais e melhorias
└── README.md
```

## Por que não adicionei React / Node / banco de dados?

O enunciado exige **uma landing page de conversão**, não uma aplicação que necessite de estado complexo ou operações de servidor. HTML, CSS e JavaScript nativos fornecem menor sobrecarga, carregamento leve, fácil implantação e boa manutenção para este escopo. O código separa conteúdo, apresentação, comportamento e configuração. Uma integração com CRM pode ser incluída como evolução orientada a requisitos.

## Segurança, privacidade e acessibilidade

- Validação de campos obrigatórios e telefone brasileiro (10 ou 11 dígitos com DDD).
- Mensagem dinâmica para WhatsApp com `encodeURIComponent`, sem manipulação insegura de HTML.
- Nenhum dado pessoal é armazenado no navegador ou enviado a servidores próprios no protótipo.
- Elementos semânticos (`header`, `nav`, `main`, `section`, `form`, `footer`), labels, foco visível, feedback de erro e suporte a teclado.
- Menu responsivo com `aria-expanded`, escape para fechar e link de pular conteúdo.
- `loading="lazy"` na foto não prioritária; `fetchpriority="high"` na foto principal.
- Meta description, Open Graph e estrutura básica de SEO.
- Design adaptável e preferência por movimento reduzido.

## Fotos

As fotos são carregadas remotamente do banco **Unsplash**, como exige o briefing. Dependem de conexão com internet; para publicação, recomenda-se baixar as fotos escolhidas, validar suas licenças e serví-las otimizadas como WebP/AVIF no próprio projeto. A licença da Unsplash admite uso gratuito, inclusive comercial: https://unsplash.com/license. Não há imagens de clientes reais nem marcas de transportadoras exibidas como parceiras.

## Conteúdo fictício

O texto operacional usa informações do briefing. As estatísticas de `+300 empresas`, `+5.000 entregas` e `98% no prazo` são exemplos **fictícios**, claramente sinalizados na interface. Evitamos inventar CNPJ, telefone, endereços completos, certificações, selos e depoimentos.

## Publicar

Hospede todo o conteúdo da pasta numa hospedagem estática (Netlify, Cloudflare Pages, Vercel ou GitHub Pages). Não é necessário build; a publicação usa `index.html` como ponto de entrada. Antes de publicar, substitua os dados fictícios, defina o WhatsApp comercial e revise a política de privacidade de uma eventual captura real de dados.

## Atualização — fotografias e prova operacional

- `assets/images/hero-operacao-rodoviaria.webp`: vista aérea de caminhões em operação rodoviária (foto de banco, Pexels).
- `assets/images/servico-movimentacao-cargas.webp`: armazém com empilhadeira, foto de banco ilustrativa.
- `assets/images/servico-docas-distribuicao.webp`: docas de distribuição, foto de banco ilustrativa.
- `assets/images/cta-centro-logistico.webp`: visão noturna de pátio logístico, foto de banco ilustrativa.
- As imagens foram convertidas em WebP e armazenadas localmente (sem depender de CDN de fotografia).
- A seção **Prova operacional** usa `IntersectionObserver` e `requestAnimationFrame` para animar 300+, 5.000+ e 98% quando visível. O ano de fundação 2012 permanece estático. Movimento reduzido e ausência de JavaScript exibem o resultado final.
- Os indicadores são fictícios e estão rotulados como tal; as fotografias não representam ativos da empresa fictícia.
- A cobertura passou a apresentar dois exemplos de rotas; clicá-los preenche origem/destino do formulário para uma **simulação de solicitação**, sem alegar que a rota foi aprovada.
- Créditos originais: imagens fornecidas no teste pelo usuário, provenientes do Pexels. Verifique os termos de licença aplicáveis antes de publicar comercialmente.

## Seção de cobertura (versão com mapa)
Mapa SVG inline dos estados do Brasil, baseado em limites estaduais GeoJSON originados de dados do IBGE (projeto de referência: https://github.com/henriquemalvar/br-geojson). Os contornos foram simplificados para uma visualização editorial leve, não para navegação ou precisão cartográfica. A classificação das cores foi definida exclusivamente pelo briefing fictício. A disponibilidade de cada rota requer confirmação comercial.

## Mapa explorável — demonstração comercial

- O mapa SVG agora permite passar o mouse sobre uma UF para ler um **volume mensal de transportes ilustrativo**, além do perfil operacional do estado. Clicar ou tocar fixa a seleção.
- Alternativa acessível: seletor de estado, navegação por teclado (setas, Home/End, Enter/Espaço), rótulos e indicadores do estado selecionado.
- O CTA direciona ao formulário de cotação e coloca foco no campo de origem (para SP, MG, GO, PR) ou destino (demais estados). Não assume disponibilidade da rota.
- **Todos os valores por UF são inteiramente fictícios e não representam volume real, transporte em andamento, disponibilidade confirmada ou dados em tempo real.** Os valores servem apenas para demonstrar o recurso visual interativo solicitado como extensão do desafio.
- A frase sobre fotografias de banco foi removida da página conforme pedido. A procedência das imagens segue descrita neste README; não há atribuição indevida às instalações ou à frota da empresa fictícia.


## Atualização do banco de imagens (novembro/2026)

Duas fotografias enviadas para personalização desta entrega foram colocadas na galeria de serviços:
- `servico-docas-distribuicao.webp` — caminhão e carga paletizada na doca, enviada como `istockphoto-1521289911-612x612.jpg`.
- `servico-movimentacao-cargas.webp` — armazém com movimentação de cargas, enviada como `istockphoto-2160696510-612x612.jpg`.

**Licença das imagens:** os arquivos de origem têm nomenclatura iStock. Antes de disponibilizar o site publicamente, confirme que há licença válida de uso para cada uma dessas duas fotos. O fato de ter uma miniatura ou visualização não garante licença comercial. As fotos de banco não comprovam frota, sede ou instalações próprias.

## Transparência dos dados

A seção de prova operacional e os volumes mensais apresentados no mapa utilizam valores de exemplo, sem fonte operacional. A interface apresenta essa condição de maneira discreta. **Não use esses valores como resultados reais da transportadora.** Para publicação comercial, substitua-os por informações verificadas. A marca descrita no briefing é hipotética e os elementos de contato só funcionam de ponta a ponta depois de configurar o número comercial verdadeiro.

Para evitar indexar a empresa hipotética como entidade real, o projeto entregue utiliza `robots=noindex,nofollow`. Alterar apenas após publicação legítima com dados comerciais verificados.
