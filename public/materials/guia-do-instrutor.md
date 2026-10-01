# Guia do instrutor

## Resultado esperado

Ao concluir a trilha, o aluno deve explicar e operar o caminho loja → Purchasecron → n8n → GTM server → destinos → confirmação. A aprovação não depende só de responder quizzes. Ela exige que o aluno demonstre segurança, idempotência, debugging e publicação reversível.

## Carga horária sugerida

| Módulo | Tema | Horas |
|---|---|---:|
| 0 | Contexto e diagnóstico | 2 |
| 1 | Primeiros workflows | 4 |
| 2 | Dados e expressions | 5 |
| 3 | HTTP e APIs | 5 |
| 4 | Webhooks | 5 |
| 5 | Normalização de purchase | 6 |
| 6 | Identidade e deduplicação | 6 |
| 7 | GA4 Measurement Protocol | 6 |
| 8 | GTM server, Meta e Ads | 5 |
| 9 | Purchasecron, retry e backfill | 5 |
| 10 | Debugging e observabilidade | 6 |
| 11 | Segurança e publicação | 4 |
| 12 | Projeto final | 8 |
|  | Total | 67 |

## Método de aula

1. Comece por um pedido ou incidente concreto.
2. Mostre o diagrama e o microvídeo quando houver.
3. Abra o exemplo real sanitizado no Raio-X.
4. Faça o aluno explicar o fluxo antes de abrir detalhes.
5. Execute o laboratório em sandbox, nunca em produção.
6. Corrija pelo critério de aceite e pela rubrica, não apenas pelas palavras-chave automáticas.
7. Registre o limite do que foi provado.

## Avaliação

| Componente | Peso |
|---|---:|
| Quizzes | 10% |
| Laboratórios guiados | 20% |
| Checkpoints práticos | 20% |
| Incidente de debugging | 15% |
| Projeto final | 35% |

Nota geral mínima: 75%. Projeto final: mínimo de 70%.

## Gates críticos

O aluno não é aprovado enquanto houver qualquer um destes pontos:

- credencial ou dado pessoal exposto;
- duplicação de purchase em replay;
- confirmação antes dos destinos obrigatórios;
- retry infinito ou sem limite;
- confusão entre rascunho e versão ativa;
- afirmação de atribuição baseada apenas em resposta HTTP;
- ausência de rollback;
- uso de dados reais fora do ambiente autorizado.

## Rubrica dos laboratórios

Pontue cada dimensão de 0 a 4:

- contrato de dados;
- correção técnica;
- confiabilidade;
- observabilidade;
- segurança;
- clareza operacional.

Nível 0 significa ausente ou inseguro. Nível 2 funciona apenas no caso feliz. Nível 3 cobre os casos previstos. Nível 4 prova idempotência, recuperação, segurança e operação por outra pessoa.

## Projeto final

O aluno recebe uma loja fictícia, uma API simulada, um Purchasecron de treinamento e destinos simulados. O workflow precisa validar, buscar o pedido, normalizar, deduplicar, enviar, tratar falhas, confirmar, alertar, bloquear replay e permitir rollback.

Testes secretos recomendados:

1. o mesmo pedido chega cinco vezes;
2. a API responde 429 e depois 200;
3. a API responde 401;
4. há produto sem variante;
5. há dois itens e desconto;
6. o token de checkout não é localizado;
7. Meta falha e GA4 conclui;
8. não existe gclid;
9. o workflow foi editado, mas a versão ativa não mudou;
10. um secret foi inserido por engano na URL;
11. campo financeiro chega como string;
12. a ingestão aceita, mas o painel não confirma efeito.

## Progressão de autonomia

- Observador: lê workflows e execuções sanitizadas.
- Construtor em sandbox: monta, testa e corrige fluxos simulados.
- Operador supervisionado: prepara mudanças reais para revisão.
- Operador Sourei: publica com autorização, monitora e executa rollback.

A promoção para Operador Sourei exige o projeto final e uma operação real acompanhada.
