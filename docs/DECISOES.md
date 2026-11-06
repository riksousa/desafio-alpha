# Decisões de produto e arquitetura

## Problema de negócio

Embarcadores que chegam de busca ou anúncio já podem ter intenção de cotar. A landing page precisa confirmar aderência operacional e reduzir atrito até o contato comercial.

## Fluxo da conversão

1. **Entender em segundos:** título orientado a benefício, tipos de operação e prazo comercial já na primeira dobra.
2. **Qualificar sem fricção excessiva:** formulário com exatamente os campos de cotação pedidos no briefing, marcação clara de obrigatórios e mensagem opcional.
3. **Apoiar decisão:** serviços, diferenciais, regiões, FAQ e prova operacional fictícia explicitamente sinalizada.
4. **Repetir CTA em pontos de decisão:** primeira dobra, cards de serviço, seção de diferenciais, cobertura, FAQ e final da página.
5. **Preencher mensagem de WhatsApp:** cria requisição estruturada em linguagem comercial sem capturar dados num servidor inexistente.

## Critérios de engenharia

- **Simplicidade intencional:** HTML/CSS/JS sem build (baixa manutenção e excelente time-to-interactive).
- **Separação de responsabilidades:** HTML semântico, CSS independente, JS com escopo encapsulado e `config.js` para dados externos.
- **Proteção contra XSS na interface:** não usa `innerHTML` para mostrar entradas do usuário; os dados são apenas codificados como componente de URL.
- **Acessibilidade:** labels corretos, mensagens de campo, foco no primeiro erro, menu mobile com teclado, `details/summary` nativos.
- **Estados honestos:** sem números inventados de contatos e sem fingir um backend ou envio de leads.
- **Sem dependências desnecessárias:** facilita auditoria, hospedagem e evolução.

## Evoluções após aprovação do protótipo

- Integrar com CRM / n8n através de endpoint no servidor com validação e autenticação, evitando expor segredos de API no front-end.
- Implementar LGPD com política de privacidade real, informação de finalidade, retenção e bases legais adequadas.
- Métricas de conversão (cliques CTA, início/envio de formulário) com consentimento/configuração adequada, por exemplo Google Tag Manager.
- Testes end-to-end no pipeline, lint e CI conforme a stack selecionada pelo time.
- Substituir imagens remotas por imagens locais WebP/AVIF, com dimensões explícitas e otimização de carga.
- Testar variações de título, CTA e posição de formulário por experimentos A/B, medindo taxas de conversão sem prometer resultados antecipadamente.
