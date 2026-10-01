# Checklist de publicação e rollback

## Antes da publicação

- [ ] Escopo da mudança está definido.
- [ ] Workflow correto e versão ativa foram identificados.
- [ ] Dados fixados foram removidos ou revisados.
- [ ] Nenhum segredo está em nó, URL, código, nota ou export.
- [ ] Credenciais pertencem ao cliente e ao ambiente corretos.
- [ ] Caminho feliz foi testado com dados sintéticos.
- [ ] Campo ausente, duplicado, 401, 429 e 500 foram tratados.
- [ ] Retry tem limite, espera e chave idempotente.
- [ ] Confirmação ocorre depois dos destinos obrigatórios.
- [ ] Logs não guardam PII nem Authorization headers.
- [ ] Revisão cruzada foi concluída.

## Plano de mudança

- Versão anterior:
- Versão candidata:
- Motivo:
- Evidências:
- Janela:
- Responsável:
- Aprovador:

## Sinais de sucesso

- Volume esperado:
- Taxa de erro máxima:
- Latência esperada:
- Pedido controlado:
- Confirmação por destino:

## Sinais de rollback

- Duplicação de purchase.
- Queda material de processamento.
- Erro permanente não previsto.
- Exposição de dado ou credencial.
- Confirmação indevida.

## Após publicar

- [ ] Foi provado qual versão executou.
- [ ] Uma execução controlada foi acompanhada ponta a ponta.
- [ ] Resultados foram verificados por destino.
- [ ] A janela de observação terminou sem regressão.
- [ ] O resultado e os limites foram documentados.

## Rollback

1. Pare a expansão da mudança.
2. Preserve as evidências e a fila pendente.
3. Restaure a versão anterior conhecida.
4. Prove a versão ativa.
5. Reprocesse somente o que estiver pendente, com deduplicação.
6. Reabra a investigação pela primeira divergência.
