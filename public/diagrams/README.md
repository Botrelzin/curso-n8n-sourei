# Diagramas do curso

Conjunto de SVGs originais para aulas, slides e materiais de apoio. Todos usam `viewBox`, largura responsiva, título e descrição acessíveis. A paleta segue o visual Sourei: azul, teal, superfícies claras e estados sem depender apenas de cor.

| Ordem | Arquivo | Uso principal |
|---|---|---|
| 1 | [Arquitetura da operação](01-arquitetura-operacao.svg) | Caminho loja, Purchasecron, n8n, GTM server, destinos e confirmação |
| 2 | [Anatomia de workflow](02-anatomia-workflow.svg) | Leitura de gatilho, validação, transformação, roteamento e saída |
| 3 | [Lifecycle de webhook](03-lifecycle-webhook.svg) | Diferença entre receber, responder, persistir e processar |
| 4 | [Normalização de pedido](04-normalizacao-pedido.svg) | Conversão do pedido bruto em evento canônico |
| 5 | [Identidade e deduplicação](05-identidade-deduplicacao.svg) | Matching, privacidade e prevenção de contagem repetida |
| 6 | [Measurement Protocol](06-measurement-protocol.svg) | Montagem, envio e registro de payload server-side |
| 7 | [Fan-out para destinos](07-fanout-destinos.svg) | Saídas independentes a partir de uma fonte confiável |
| 8 | [Retry e backfill](08-retry-backfill.svg) | Recuperação controlada de falhas |
| 9 | [Método de debugging](09-metodo-debugging.svg) | Diagnóstico orientado por evidências |
| 10 | [Publicação e rollback](10-publicacao-rollback.svg) | Versionamento, portão humano, observação e retorno |

## Diretrizes de uso

- Manter a proporção original de 16:9.
- Em vídeo, revelar as etapas na ordem indicada pela numeração.
- Em slides, preservar o rodapé para manter contexto e autoria visual.
- Ao narrar, mencionar o nome e a função de cada etapa. Cor sozinha não comunica estado.
- Não inserir credenciais, identificadores de contas, dados pessoais ou endereços internos nas artes.
