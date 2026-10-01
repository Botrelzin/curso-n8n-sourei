# Caderno de atividades

Use somente dados sintéticos e uma instância de treinamento.

## Atividade 1: ecoar e validar um webhook

Entregue o contrato de entrada, a política de resposta e quatro testes: válido, inválido, duplicado e timeout.

## Atividade 2: consultar um pedido por ID

Trate 200, 401, 404, 429 e 500. Explique quais respostas recebem retry e quais bloqueiam o fluxo.

## Atividade 3: normalizar itens

Converta um pedido com vários itens para um contrato canônico. Preserve zero, converta números recebidos como string e rejeite transaction_id ausente.

## Atividade 4: calcular compra

Calcule value, shipping e desconto. Compare o total contra a origem e registre divergência sem inventar valor.

## Atividade 5: identidade e fallback

Busque identidade pela chave principal e depois por transaction_id. Prove que os dois caminhos não rodam em paralelo.

## Atividade 6: deduplicar replay

Envie o mesmo pedido 20 vezes. Demonstre uma única conversão lógica e estado por destino.

## Atividade 7: montar Measurement Protocol

Monte um purchase sintético com client_id estável, timestamp, currency, value, items e debug_mode.

## Atividade 8: comparar dois caminhos de GA4

Confirme que os dois caminhos alternativos usam o mesmo destino e que apenas um executa por pedido.

## Atividade 9: enviar ao GTM server

Defina contrato, headers permitidos, event_name, event data e prova no Preview.

## Atividade 10: montar fan-out

Trate GA4, Meta e Ads como destinos independentes. Registre status e retry por ramo.

## Atividade 11: confirmar o Purchasecron

A confirmação só pode ocorrer após os critérios obrigatórios. Demonstre a sequência com uma falha e uma recuperação.

## Atividade 12: corrigir JSON Headers

Receba um objeto, transforme em string JSON válida e prove que o destino recebeu o formato correto.

## Atividade 13: corrigir webhook pendurado

Compare resposta imediata e Respond to Webhook. Remova a combinação incoerente.

## Atividade 14: publicar e provar a versão ativa

Edite em rascunho, teste, publique em sandbox e prove qual versão executou. Depois demonstre rollback.

## Atividade 15: investigar purchase duplicado

Monte a linha do tempo dos dois emissores, localize o primeiro desvio e proponha correção sem apagar evidência.

Para cada atividade, entregue hipótese, entrada sanitizada, evidência, resultado, limite do que foi provado e próximo passo.
