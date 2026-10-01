const track = [
  {
    title: 'Contexto e diagnóstico',
    objectives: ['Mapear uma automação antes de editar', 'Distinguir gatilho, transformação e destino', 'Classificar risco e evidência'],
    sections: [
      'Comece pelo contrato operacional. Registre qual evento inicia o fluxo, quem envia, qual resultado confirma sucesso, qual prazo é aceitável e quem responde por falhas. No n8n, a tela mostra nós e conexões, mas não prova que o dado está correto. O diagnóstico combina execução, payload de entrada, transformação, resposta HTTP e efeito no destino. Desenhe o caminho fonte → gatilho → transformação → decisão → destino antes de alterar qualquer nó.',
      'Faça o inventário em três passagens. Primeiro, leia estado ativo, tipo de trigger, quantidade e nomes de nós. Depois, siga as conexões e marque bifurcações, dependências externas e pontos sem saída. Por fim, confira execuções recentes, volume esperado, taxa de erro e tempo de processamento. Um workflow grande não é automaticamente ruim; o risco cresce quando responsabilidades, condições e estados não estão explícitos.',
      'Use evidência reproduzível. Salve horário, entrada mascarada, nó em que o comportamento divergiu, código HTTP e saída observada. Não deduza causa pelo nome do nó. Antes de corrigir, formule uma hipótese verificável, por exemplo: “o ramo de duplicado recebe pedidos que já possuem transaction_id”. Uma mudança só está pronta quando a mesma evidência mostra o antes, o depois e a ausência de regressão.'
    ],
    example: ['workflow-inventory.safe.json', '[WA][SOUREI] The Hungry - V2', 'O inventário mostra 142 nós, 116 fontes de conexão e muitos nós IF, HTTP Request, Wait e Stop and Error. É um caso real para treinar leitura por responsabilidades e risco, sem expor parâmetros.'],
    lab: ['Produza um diagnóstico do exemplo separando entrada, transformação, destinos, estado persistido e três riscos. Termine com uma hipótese testável e a evidência necessária para confirmá-la.', ['Mapeia o trigger e pelo menos um destino', 'Aponta três riscos observáveis', 'Define hipótese e evidência de confirmação'], ['webhook', 'risco', 'evidência']],
    facts: [['Qual é a primeira entrega de um diagnóstico?', 'Um mapa do contrato e do fluxo', ['Editar o nó com erro', 'Reexecutar tudo em produção', 'Trocar todas as credenciais'], 'Mapear o contrato evita corrigir o sintoma sem entender entrada, saída e responsabilidade.'], ['O que o nome de um nó prova?', 'Apenas a intenção declarada pelo autor', ['A correção do payload', 'O sucesso no destino', 'A causa da falha'], 'Nomes ajudam a navegar, mas somente execução e saída observável comprovam comportamento.'], ['Qual evidência localiza melhor uma falha?', 'Entrada, nó divergente, saída e horário', ['Uma captura só do canvas', 'A cor do workflow', 'A quantidade total de nós'], 'A trilha completa permite reproduzir e comparar o antes e o depois.'], ['Quando uma correção está concluída?', 'Após validar efeito e ausência de regressão', ['Quando o nó salva', 'Quando o workflow ativa', 'Quando o editor fecha'], 'Salvar ou ativar não confirma o resultado operacional nem protege outros caminhos.']]
  },
  {
    title: 'Primeiros workflows',
    objectives: ['Construir um fluxo mínimo ponta a ponta', 'Executar nós manualmente com dados controlados', 'Nomear e documentar saídas'],
    sections: [
      'Um primeiro workflow útil deve ser pequeno e observável: Manual Trigger ou Webhook, Edit Fields, uma decisão simples e um destino controlado. Configure um nó por responsabilidade. Execute o gatilho, fixe dados de teste somente enquanto constrói e inspecione cada item que entra e sai. Evite adicionar integrações antes de conseguir explicar o formato produzido em cada etapa.',
      'O n8n transporta itens. Cada nó recebe uma coleção e pode manter, transformar, dividir ou agregar itens. Edit Fields é preferível para mapeamentos declarativos; Code serve quando a regra exige lógica que ficaria opaca em muitos campos. Nomeie nós com verbo e objeto, como “Normalizar pedido” e “Registrar resultado”, para que uma execução possa ser lida sem abrir cada configuração.',
      'Teste o caminho feliz e uma entrada incompleta. Defina o que acontece quando um campo falta, quando não há itens e quando o destino recusa a requisição. O fluxo mínimo deve responder de forma explícita e deixar rastros suficientes para o operador. Ativar é uma etapa separada: antes dela, remova dados fixados, revise credenciais por ambiente e documente como desativar com segurança.'
    ],
    example: ['workflow-examples.safe.json', 'fontesradiadores.com.br', 'O exemplo seguro possui a sequência Webhook → Code → Append row in sheet. Os parâmetros foram omitidos, mas a topologia ensina o fluxo mínimo de receber, transformar e persistir.'],
    lab: ['Descreva um workflow mínimo para receber um lead de teste, normalizar nome e origem e registrar o resultado. Inclua o comportamento para campo ausente e a checagem antes de ativar.', ['Usa trigger, transformação e destino distintos', 'Prevê entrada incompleta', 'Inclui checklist de ativação'], ['trigger', 'normalizar', 'ativar']],
    facts: [['O que trafega entre nós?', 'Uma coleção de itens', ['Uma tela HTML', 'Uma credencial aberta', 'Um log sem estrutura'], 'O modelo de itens explica por que um nó pode produzir zero, um ou muitos resultados.'], ['Quando preferir Edit Fields?', 'Em mapeamentos declarativos de campos', ['Em loops complexos', 'Para guardar segredos', 'Para publicar o workflow'], 'Edit Fields torna renomes e seleção de campos visíveis sem código.'], ['O que testar além do caminho feliz?', 'Campo ausente e coleção vazia', ['Apenas o tema escuro', 'A posição dos nós', 'O nome do navegador'], 'Entradas incompletas são uma fonte comum de falhas silenciosas.'], ['O que remover antes de ativar?', 'Dados de teste fixados', ['Nomes descritivos', 'Tratamento de erro', 'Documentação'], 'Dados fixados podem esconder a entrada real e produzir comportamento enganoso.']]
  },
  {
    title: 'Dados e expressions',
    objectives: ['Ler itens e JSON com segurança', 'Escrever expressions previsíveis', 'Normalizar tipos e ausências'],
    sections: [
      'Expressions são avaliadas no contexto da execução. Use $json para o item atual e referências explícitas a outros nós somente quando a dependência for intencional. Antes de escrever uma expression, abra a entrada e confirme caminho, tipo e cardinalidade. Um campo visualmente numérico pode chegar como texto; converter de forma explícita evita soma por concatenação e comparações incoerentes.',
      'Trate ausência como parte do contrato. Optional chaining e valores padrão ajudam, mas não devem esconder um campo obrigatório. Para opcionais, normalize com uma regra clara. Para obrigatórios, use IF ou Code para produzir erro operacional com contexto seguro. Diferencie null, string vazia, zero e campo inexistente, pois cada um pode representar uma condição distinta no negócio.',
      'Ao lidar com arrays, preserve a relação entre produto, quantidade e preço. Map, filter e reduce resolvem transformações, mas a saída deve continuar no formato de itens esperado pelo próximo nó. Evite buscar dados por posição quando existe uma chave estável. Revise expressions após renomear nós, porque referências por nome criam uma dependência que não aparece no valor final.'
    ],
    example: ['workflow-examples.safe.json', '[WA][GA4-META] Beautyin - Order Hook', 'Os nós “formatar itens para formato GA4”, “fix discounts” e “contents e content_ids” mostram responsabilidades reais de transformação antes dos destinos.'],
    lab: ['Escreva a especificação de uma transformação de pedido que converta value para número, preserve zero, normalize items e rejeite transaction_id ausente. Explique a saída para array vazio.', ['Distingue ausente de zero', 'Mantém a estrutura de items', 'Rejeita identificador obrigatório ausente'], ['transaction_id', 'items', 'número']],
    facts: [['O que deve preceder uma expression?', 'Inspeção do caminho, tipo e cardinalidade', ['Ativação do workflow', 'Criação de credencial', 'Publicação em produção'], 'A inspeção impede que a expression dependa de um formato apenas imaginado.'], ['Zero deve usar o mesmo fallback de string vazia?', 'Não, zero pode ser um valor válido', ['Sim, sempre', 'Somente em webhooks', 'Somente no modo manual'], 'Fallback por truthiness pode apagar o valor zero e alterar métricas.'], ['Qual chave é preferível ao índice de array?', 'Uma chave estável do objeto', ['A posição visual', 'O horário local', 'O nome do nó'], 'Índices mudam com ordenação e filtros; chaves estáveis preservam identidade.'], ['O que pode quebrar ao renomear um nó?', 'Expressions que o referenciam pelo nome', ['O JSON de entrada na origem', 'O protocolo HTTP', 'A existência do navegador'], 'Referências cruzadas por nome precisam ser revisadas após renomeações.']]
  },
  {
    title: 'HTTP e APIs',
    objectives: ['Montar requests com contrato explícito', 'Interpretar status, corpo e timeout', 'Paginar e limitar chamadas'],
    sections: [
      'No HTTP Request, declare método, URL por ambiente, headers, query e corpo conforme a documentação da API. Não misture autenticação com dados de negócio. Use credenciais do n8n ou variáveis protegidas, nunca tokens literais em nós, logs ou materiais de curso. Envie Content-Type coerente com o corpo e valide o JSON gerado antes da chamada.',
      'Sucesso não é apenas “não deu erro”. Defina os códigos aceitos, valide o corpo e confirme o efeito esperado no sistema de destino. Um 202 pode indicar processamento assíncrono; um 204 não tem corpo; um 429 exige respeitar limite. Configure timeout e trate erros por categoria: autenticação, validação, limite, indisponibilidade e erro permanente de negócio.',
      'Paginação precisa de condição de parada e proteção contra loops. Registre cursor ou página processada quando o volume não cabe em uma execução. Para lotes, escolha tamanho que respeite limites e permita retomada. Retries devem atuar em falhas transitórias com backoff e limite; repetir cegamente um POST sem idempotência pode duplicar conversões ou registros.'
    ],
    example: ['workflow-examples.safe.json', 'decorcolorsfranquia.com.br', 'O exemplo contém quatro HTTP Requests com campos de método, headers, corpo e URL omitidos. Três ramificações Filter → HTTP Request permitem discutir contratos e destinos distintos.'],
    lab: ['Projete uma chamada POST segura para uma API fictícia de eventos. Defina headers sem segredo literal, timeout, códigos aceitos, política para 429 e uma chave de idempotência.', ['Separa credencial do payload', 'Trata status e timeout', 'Evita duplicação no retry'], ['header', '429', 'idempotência']],
    facts: [['Onde guardar token de API?', 'Em credencial protegida do n8n', ['No nome do nó', 'No corpo do curso', 'Em uma Sticky Note pública'], 'Credenciais protegidas reduzem exposição em exportações, logs e revisões.'], ['O que significa HTTP 202?', 'A solicitação foi aceita, possivelmente assíncrona', ['O recurso foi necessariamente concluído', 'A credencial expirou', 'Não existe corpo em nenhuma API'], 'Aceite não equivale a efeito concluído; o contrato pode exigir consulta posterior.'], ['Qual falha costuma aceitar retry?', 'Indisponibilidade temporária', ['Payload inválido permanente', 'Credencial revogada', 'Regra de negócio recusada'], 'Retry é indicado para falhas transitórias, não para repetir entradas permanentemente inválidas.'], ['O que uma paginação exige?', 'Condição de parada verificável', ['Somente um nó Wait', 'Um segredo no cursor', 'A mesma página para sempre'], 'Sem parada, o workflow pode repetir chamadas e consumir o limite da API.']]
  },
  {
    title: 'Webhooks',
    objectives: ['Projetar ingestão confiável', 'Responder no tempo correto', 'Validar autenticidade e reenvios'],
    sections: [
      'Webhook é uma fronteira pública de entrada. Defina método, caminho não sensível, contrato de payload, autenticação ou assinatura, resposta e limite de tamanho. A URL de teste existe para execução manual; a URL de produção depende do workflow ativo. Nunca use uma URL interna real em documentação ou exemplos. Forneça placeholders e diga como o operador encontra o valor no ambiente correto.',
      'Decida entre responder imediatamente e responder após processar. O modo imediato reduz timeout do emissor, mas exige persistir o evento antes de confirmar. O modo síncrono permite devolver erro de validação, porém aumenta risco de reenvio se destinos externos demorarem. Em ambos, devolva status e corpo estáveis, sem detalhes de stack, credenciais ou dados pessoais.',
      'Considere que webhooks serão reenviados, chegarão fora de ordem e podem ser falsificados. Valide assinatura sobre o corpo bruto quando o provedor exigir, use timestamp contra replay e deduplique por identificador de evento ou transação. Registre apenas campos necessários e mascarados. Teste payload válido, assinatura inválida, duplicado e atraso do destino.'
    ],
    example: ['workflow-examples.safe.json', '[WA] - lojasimporium', 'O fluxo começa em webhook, consulta transaction_id e divide entre processamento e “webhook reenviado”. A topologia ilustra por que ingestão precisa ser idempotente.'],
    lab: ['Defina o contrato de um webhook de compra com resposta, validação de assinatura, deduplicação e quatro casos de teste. Não use URL, token ou dado real.', ['Explica resposta síncrona ou imediata', 'Valida autenticidade e replay', 'Cobre duplicado e timeout'], ['assinatura', 'duplicado', 'resposta']],
    facts: [['Qual URL usar em produção?', 'A URL de produção com workflow ativo', ['A URL de teste permanente', 'Uma URL interna do curso', 'Qualquer caminho local'], 'A URL de teste depende da escuta manual; produção exige o trigger ativo.'], ['Por que responder cedo?', 'Para reduzir timeout e reenvio do emissor', ['Para expor logs', 'Para ignorar persistência', 'Para desativar assinatura'], 'Uma confirmação rápida é útil quando o evento já foi aceito de forma durável.'], ['Por que verificar assinatura no corpo bruto?', 'A serialização pode alterar o valor assinado', ['Para aumentar o payload', 'Para revelar o segredo', 'Para renomear o trigger'], 'Muitos provedores assinam bytes exatos; reserializar JSON pode invalidar a comparação.'], ['O que testar em webhook?', 'Válido, assinatura inválida, duplicado e atraso', ['Somente a posição do nó', 'Somente o nome', 'Somente o tema'], 'Esses casos cobrem fronteira, segurança, idempotência e disponibilidade.']]
  },
  {
    title: 'Normalização de purchase',
    objectives: ['Criar um contrato canônico de compra', 'Normalizar valores, moeda e itens', 'Validar invariantes antes de enviar'],
    sections: [
      'A origem de uma compra varia, mas os destinos devem receber um contrato canônico. Normalize transaction_id como string estável, currency em código consistente, value como número e items como array. Cada item precisa de item_id ou chave equivalente, nome quando disponível, preço e quantidade numéricos. Não calcule valor total silenciosamente sem documentar frete, imposto e desconto.',
      'Separe extração da origem, normalização e adaptação por destino. O normalizador não deve conhecer URL nem credencial de GA4 ou Meta. Ele produz um objeto validado; adaptadores convertem esse objeto para Measurement Protocol, Event Data ou CAPI. Essa fronteira reduz duplicação e permite testar uma plataforma nova sem modificar a regra central da compra.',
      'Defina invariantes: transaction_id não vazio, value finito e não negativo conforme a política, currency presente e items com chaves válidas. Preserve o payload bruto somente quando permitido, por tempo limitado e com mascaramento. Em divergência de valor, interrompa ou sinalize de forma explícita, não “corrija” dados comerciais sem evidência.'
    ],
    example: ['workflow-examples.safe.json', '[WA][GA4-META] Beautyin - Order Hook', 'A sequência “formatar itens para formato GA4” → “fix discounts” → “Editar WebHook” → “Prepare GA4 Payload” mostra a separação real entre saneamento e adaptação.'],
    lab: ['Especifique a entrada e a saída de um normalizador de purchase. Inclua transaction_id, currency, value, items, desconto e três invariantes que bloqueiam envio incorreto.', ['Define contrato canônico completo', 'Separa normalização de destino', 'Bloqueia valores ou itens inválidos'], ['currency', 'value', 'items']],
    facts: [['Qual campo ancora a compra?', 'transaction_id estável', ['Nome do workflow', 'Posição do item', 'Cor da tag'], 'O identificador de transação sustenta deduplicação e reconciliação.'], ['Onde adaptar para cada destino?', 'Depois do contrato canônico validado', ['Dentro do trigger', 'Na credencial', 'No nome do cliente'], 'Adaptadores separados evitam acoplar a origem a cada plataforma.'], ['Como tratar value?', 'Converter e validar como número finito', ['Manter qualquer texto', 'Sempre substituir por zero', 'Usar a quantidade de nós'], 'Valores inválidos devem ser detectados antes de afetar receita.'], ['O que fazer com divergência comercial?', 'Sinalizar ou interromper conforme política', ['Adivinhar o valor', 'Excluir transaction_id', 'Enviar para todos mesmo assim'], 'Automação não deve inventar um valor de compra sem evidência.']]
  },
  {
    title: 'Identidade e deduplicação',
    objectives: ['Distinguir identificadores de usuário, evento e transação', 'Projetar idempotência durável', 'Minimizar dados pessoais'],
    sections: [
      'Identidade não é um único campo. transaction_id identifica a compra, event_id correlaciona envios do mesmo evento, client_id representa uma instância de navegador para GA4 e identificadores de usuário exigem base e tratamento adequados. Nunca substitua um pelo outro. Documente origem, estabilidade, escopo e destino de cada identificador.',
      'Deduplicação no workflow precisa de operação atômica quando execuções concorrentes podem receber o mesmo evento. O padrão consultar e depois gravar pode ter corrida. Prefira reserva única ou upsert por chave idempotente, registrando estados como recebido, GA4 enviado e Meta enviado. Um retry consulta o estado e executa somente destinos pendentes.',
      'Colete o mínimo necessário. Dados pessoais usados em matching devem ser normalizados e, quando exigido pelo destino, transformados segundo a documentação antes do envio. Hash não torna dado anônimo por si só. Limite logs, retenção e acesso. Para depurar, use identificadores sintéticos ou mascarados e nunca copie um payload real para o curso.'
    ],
    example: ['workflow-inventory.safe.json', '[WA][GA4-META] DecorColors - Order Hook V2', 'O inventário expõe nós de busca por transaction_id, geração de client_id e estados SW, SWF e SWG. Isso permite estudar identidade por finalidade sem mostrar valores.'],
    lab: ['Desenhe uma máquina de estados idempotente para compra enviada a GA4 e Meta. Explique chave única, concorrência, retry parcial, event_id e minimização de dados pessoais.', ['Usa transaction_id como chave de negócio', 'Trata concorrência e estado por destino', 'Distingue event_id de client_id'], ['transaction_id', 'event_id', 'idempotência']],
    facts: [['transaction_id identifica o quê?', 'A transação comercial', ['A credencial', 'O navegador sempre', 'A execução do editor'], 'A chave comercial permite reconciliar a mesma compra entre sistemas.'], ['Qual risco existe em consultar e depois inserir?', 'Duas execuções podem passar pela consulta', ['O tema pode mudar', 'O nome perde acento', 'O JSON vira HTML'], 'Sem operação atômica, concorrência pode produzir duplicatas.'], ['Hash torna dado pessoal anônimo?', 'Não necessariamente', ['Sim, em todos os casos', 'Somente no n8n', 'Somente em HTTP 200'], 'Hashes determinísticos ainda podem ser vinculáveis e continuam exigindo proteção.'], ['Como fazer retry parcial?', 'Enviar apenas destinos ainda pendentes', ['Reenviar todos sem consulta', 'Trocar transaction_id', 'Apagar o estado'], 'Estado por destino evita duplicar um canal que já confirmou sucesso.']]
  },
  {
    title: 'GA4 Measurement Protocol',
    objectives: ['Montar eventos GA4 válidos', 'Distinguir validação de coleta', 'Preservar identidade e tempo do evento'],
    sections: [
      'Measurement Protocol recebe eventos server-side, mas não corrige um modelo ruim. O payload inclui um identificador aceito, events e params. Para purchase, envie transaction_id, currency, value e items conforme o contrato do GA4. Use endpoint e credencial por ambiente sem materializar valores no workflow exportado ou no curso.',
      'Valide primeiro no endpoint de debug com dados sintéticos. Resposta de coleta não garante aparição imediata nem qualidade do relatório. Inspecione mensagens de validação, depois confirme em DebugView ou relatório apropriado respeitando latência. Mantenha timestamp_micros somente quando precisar representar o horário original e dentro das regras da plataforma.',
      'Escolha client_id ou user_id com base na arquitetura de identidade, não gere um valor novo a cada retry. Parâmetros personalizados precisam de governança e registro correspondente no GA4 quando aplicável. Evite enviar PII. Compare transaction_id, value, currency e quantidade de itens entre origem, payload e destino para detectar perda ou duplicação.'
    ],
    example: ['workflow-examples.safe.json', '[WA][GA4-META] Beautyin - Order Hook', 'Os nós “Prepare GA4 Payload” e “GA4 Order” representam preparação e envio por HTTP. O exemplo seguro lista campos configuráveis, mas omite endpoint e credenciais.'],
    lab: ['Monte um payload conceitual de purchase para o GA4 com valores sintéticos e um plano de validação. Inclua client_id estável, transaction_id, value, currency, items e debug.', ['Inclui campos essenciais de purchase', 'Explica validação e confirmação', 'Não usa PII ou credencial literal'], ['client_id', 'transaction_id', 'debug']],
    facts: [['O endpoint de debug serve para quê?', 'Validar o formato e regras do evento', ['Publicar GTM', 'Guardar segredo', 'Deduplicar banco automaticamente'], 'Ele retorna mensagens de validação antes do envio normal.'], ['HTTP de sucesso prova relatório correto?', 'Não, ainda é preciso validar o destino', ['Sim, sempre', 'Somente com dois itens', 'Somente sem moeda'], 'Aceitação técnica não prova processamento, atribuição ou qualidade analítica.'], ['client_id deve mudar no retry?', 'Não, deve preservar a identidade definida', ['Sim, para parecer novo', 'Somente em erro 500', 'Sempre após Wait'], 'Gerar nova identidade no retry fragmenta sessões e prejudica reconciliação.'], ['Pode enviar PII ao GA4?', 'Não', ['Sim, se estiver em texto', 'Sim, se o nome do nó avisar', 'Sempre no user_id'], 'As políticas do GA4 proíbem informação pessoal identificável nos eventos.']]
  },
  {
    title: 'GTM server, Meta e Ads',
    objectives: ['Separar transporte de roteamento server-side', 'Mapear eventos por destino', 'Validar deduplicação e consentimento'],
    sections: [
      'O n8n pode enviar um evento normalizado ao endpoint server-side, enquanto o container server recebe, transforma e roteia para GA4, Meta e Google Ads. Defina o contrato entre n8n e o cliente do container: nome do evento, cabeçalhos permitidos, event data, resposta e versão. O endpoint real é configuração de ambiente e não pertence ao conteúdo do curso.',
      'Cada destino tem semântica própria. Meta usa event_name, event_time, event_id, action_source, user_data e custom_data conforme o caso. Ads depende de ação de conversão e identificadores consentidos. Não reutilize cegamente um payload GA4. Faça adaptadores explícitos, preserve transaction_id e associe event_id quando browser e server representam o mesmo evento.',
      'Valide em camadas: request saindo do n8n, cliente reconhecido no preview server, tag acionada, resposta da API e diagnóstico do destino. Respeite consentimento e minimize user_data. Um retorno 200 do container não prova que todas as tags tiveram sucesso; exponha status por destino ou uma estratégia de observabilidade que permita reconciliação.'
    ],
    example: ['workflow-inventory.safe.json', '[WA][SOUREI] The Hungry - V2', 'O inventário lista envios separados para ga4_order, capi_order e gads, seguidos de verificações de status e atualizações de estado. É uma arquitetura real de fan-out observável.'],
    lab: ['Defina o contrato entre n8n e GTM server para uma compra sintética e uma matriz de validação para GA4, Meta e Ads. Inclua event_id, consentimento e status por destino.', ['Separa transporte e adaptadores', 'Valida cada destino em camadas', 'Inclui consentimento e deduplicação'], ['gtm server', 'event_id', 'consentimento']],
    facts: [['Um payload GA4 serve igual para Meta?', 'Não, cada destino possui contrato próprio', ['Sim, sem mudanças', 'Somente alterando o nome do nó', 'Sempre que há HTTP 200'], 'Eventos equivalentes exigem campos e semântica específicos por plataforma.'], ['O que event_id apoia na Meta?', 'Deduplicação entre browser e server', ['Autenticação da API', 'Tema do n8n', 'Paginação'], 'O mesmo event_id permite reconhecer duas cópias do mesmo evento.'], ['HTTP 200 do container prova todas as tags?', 'Não', ['Sim', 'Somente no claro', 'Somente para Ads'], 'O container pode aceitar a requisição mesmo quando um destino falha depois.'], ['Onde validar o cliente server?', 'No preview do container server', ['Somente no editor web', 'No localStorage do curso', 'No nome do workflow'], 'O preview mostra qual cliente reconheceu a requisição e quais tags executaram.']]
  },
  {
    title: 'Purchasecron, retry e backfill',
    objectives: ['Projetar recuperação sem duplicação', 'Aplicar retry com backoff', 'Executar backfill auditável'],
    sections: [
      'Purchasecron é a camada de recuperação que procura compras não processadas ou destinos pendentes. Use janelas com sobreposição controlada e uma chave idempotente. O cursor deve avançar somente após persistência segura. Separe coleta de pedidos, normalização, envio e atualização de estado para retomar uma etapa sem repetir tudo.',
      'Retry atende falhas transitórias. Aplique tentativas limitadas, backoff exponencial com jitter e classificação por status. Erros 429 e 5xx podem aguardar; payload inválido, credencial revogada ou regra de negócio geralmente exige correção e fila de erro. Toda tentativa precisa manter o identificador original e registrar destino, número da tentativa e causa sanitizada.',
      'Backfill reprocessa uma janela histórica de forma deliberada. Antes de executar, defina intervalo, volume, limites, modo dry-run, deduplicação e critério de parada. Marque eventos como backfill para observabilidade, não para mudar a identidade da compra. Compare contagens na origem, aceitos, duplicados, falhos e confirmados por destino antes de encerrar.'
    ],
    example: ['workflow-inventory.safe.json', '[WA][GA4] DecorColors - Backfill', 'O workflow real tem 46 nós, incluindo verificações de status, Stop and Error, payload formatter e envios separados. O desenho demonstra que backfill precisa de controle, não apenas de um loop.'],
    lab: ['Planeje um backfill de sete dias para compras pendentes. Defina cursor, lote, dry-run, retry, idempotência, métricas de reconciliação e critérios para interromper.', ['Delimita janela e volume', 'Classifica falhas transitórias e permanentes', 'Reconcilia contagens por destino'], ['backfill', 'retry', 'cursor']],
    facts: [['Quando avançar o cursor?', 'Após persistência segura do progresso', ['Antes de buscar dados', 'Sempre no início', 'Quando mudar o tema'], 'Avançar cedo pode perder eventos se a execução falhar no meio.'], ['O que adicionar ao backoff?', 'Jitter', ['PII', 'Novo transaction_id', 'Token no log'], 'Jitter reduz rajadas sincronizadas quando muitas execuções tentam novamente.'], ['Payload inválido deve repetir automaticamente?', 'Não, requer correção ou fila de erro', ['Sim, indefinidamente', 'Somente trocando ID', 'Sempre a cada segundo'], 'Retry não transforma erro permanente em sucesso e pode ampliar custo.'], ['O que reconciliar?', 'Origem, aceitos, duplicados, falhos e confirmados', ['Somente nós do canvas', 'Somente horário local', 'Somente cor do status'], 'Contagens por etapa provam cobertura e revelam perdas.']]
  },
  {
    title: 'Debugging e observabilidade',
    objectives: ['Depurar por hipótese e evidência', 'Definir logs e métricas úteis', 'Criar alertas acionáveis'],
    sections: [
      'Depuração começa por reproduzir com entrada segura e identificar o primeiro ponto de divergência. Compare a execução esperada com a real nó a nó. Leia entrada, saída, ramo escolhido, status e tempo. Não altere vários nós ao mesmo tempo. Escreva uma hipótese, faça a menor mudança, repita o caso e rode um caso de regressão.',
      'Observabilidade combina logs estruturados, métricas e alertas. Registre correlation_id ou transaction_id mascarado, workflow, etapa, destino, resultado, latência e categoria do erro. Métricas mínimas incluem recebidos, processados, duplicados, falhos, retries e pendentes. Nunca registre token, corpo completo com PII ou cabeçalho de autorização.',
      'Alertas devem informar impacto e ação: qual fluxo, desde quando, volume afetado, último erro seguro e link operacional permitido. Defina SLO ou faixa esperada para não alertar por qualquer oscilação. Tenha fila de erro, retenção e procedimento de replay. O painel mostra tendência; a execução fornece detalhe; a reconciliação confirma o efeito final.'
    ],
    example: ['workflow-inventory.safe.json', '[WA][GA4-META] Beautyin - Order Hook', 'O inventário inclui IF após os envios e nó “Send a message”, padrão real de checagem de resultado e alerta. O curso usa apenas nomes e tipos seguros.'],
    lab: ['Crie um runbook para queda de envios de purchase. Inclua hipótese, passos de isolamento, campos de log permitidos, cinco métricas, alerta e critério de recuperação.', ['Segue hipótese antes de mudança', 'Não registra segredo ou PII', 'Define alerta acionável e recuperação'], ['hipótese', 'métrica', 'alerta']],
    facts: [['Qual ponto investigar primeiro?', 'O primeiro ponto de divergência', ['O último nó sempre', 'A cor vermelha apenas', 'A maior posição X'], 'A primeira divergência reduz o espaço de busca e aponta a causa mais próxima.'], ['O que não deve entrar no log?', 'Cabeçalho de autorização', ['Categoria de erro', 'Latência', 'Nome da etapa'], 'Segredos em logs ampliam exposição e retenção indevida.'], ['O que torna alerta acionável?', 'Impacto, contexto seguro e próxima ação', ['Muitos emojis', 'Payload completo', 'Somente “falhou”'], 'O operador precisa avaliar urgência e saber o primeiro passo.'], ['Painel confirma destino final?', 'Não sozinho, reconciliação completa a prova', ['Sim, sempre', 'Somente em mobile', 'Somente com Wait'], 'Métricas internas podem indicar processamento sem confirmar o sistema externo.']]
  },
  {
    title: 'Segurança e publicação',
    objectives: ['Proteger credenciais e dados', 'Separar ambientes e permissões', 'Publicar com revisão e rollback'],
    sections: [
      'Use credenciais gerenciadas pelo n8n, com menor privilégio, dono definido e rotação. Separe desenvolvimento, homologação e produção. URLs, tokens e IDs internos entram como configuração do ambiente, nunca como texto em Code, Sticky Notes, exports públicos ou curso. Revise nós desabilitados e dados fixados, pois também podem reter informação sensível.',
      'Valide entrada na fronteira: autenticação, assinatura, tamanho, tipo e campos permitidos. Minimize dados pessoais, aplique retenção e restrinja acesso às execuções. Code nodes merecem revisão de segurança, especialmente construção de URLs, logs e uso de conteúdo não confiável. Falhas devem retornar mensagens úteis sem stack ou infraestrutura interna.',
      'Publicação exige checklist, revisão por outra pessoa quando possível, teste controlado e plano de rollback. Registre versão, responsável, motivo, evidência e janela. Ative observação reforçada após a mudança e saiba como desativar sem perder eventos, por exemplo mantendo fila ou origem recuperável. Publicar não é o último clique; é uma mudança acompanhada até estabilidade.'
    ],
    example: ['workflow-inventory.safe.json', '[SOUREI][GTM] Publicacao de container - Aviso Discord e WhatsApp', 'O inventário mostra um workflow acionado por Gmail que monta e distribui aviso de publicação. Ele ilustra trilha operacional sem revelar destinos ou credenciais.'],
    lab: ['Prepare um checklist de publicação de workflow com revisão de segredo, dados fixados, permissões, testes, rollback, comunicação e observação após ativar.', ['Cobre segredo, PII e menor privilégio', 'Define teste e rollback', 'Registra versão e acompanhamento'], ['credencial', 'rollback', 'revisão']],
    facts: [['Onde ficam URLs internas?', 'Na configuração protegida do ambiente', ['No material do curso', 'No nome do workflow', 'Em logs públicos'], 'Configuração por ambiente evita exposição e acoplamento.'], ['O que revisar em dados fixados?', 'Possível retenção de payload sensível', ['Somente a cor', 'Somente a posição', 'Somente o zoom'], 'Pinned data pode permanecer no workflow e aparecer em exportações.'], ['Qual permissão conceder?', 'A mínima necessária', ['Administrador para todos', 'A mesma em todo ambiente', 'Nenhuma revisão'], 'Menor privilégio limita impacto de erro ou comprometimento.'], ['Quando termina a publicação?', 'Após observar estabilidade e confirmar critérios', ['Ao clicar em ativar', 'Ao fechar o navegador', 'Ao mover um nó'], 'Acompanhamento e rollback fazem parte da entrega.']]
  },
  {
    title: 'Projeto final',
    objectives: ['Integrar ingestão, normalização e destinos', 'Demonstrar confiabilidade e segurança', 'Entregar evidência e operação'],
    sections: [
      'O projeto final é um pipeline de purchase completo com dados sintéticos: webhook autenticado, validação, normalização canônica, idempotência, envio para uma fronteira server-side simulada, estado por destino, retry e fila de erro. O canvas deve refletir responsabilidades, não apenas funcionar. Forneça diagrama, contrato de entrada e saída e tabela de estados.',
      'A avaliação considera comportamento. Demonstre compra válida, duplicada, campo obrigatório ausente, erro transitório, erro permanente e backfill. Em cada caso, mostre resposta, estado persistido, tentativa e resultado por destino. Use placeholders para toda configuração externa. Nenhum segredo, URL interna, ID interno ou dado pessoal pode aparecer no workflow, evidência ou documentação.',
      'A entrega inclui runbook de diagnóstico, checklist de publicação, estratégia de rollback e reconciliação. Critérios mínimos: nenhuma duplicação em reenvio, retry apenas em falha transitória, campos de purchase preservados, logs sanitizados e progresso recuperável. Faça uma revisão final como operador: outra pessoa deve conseguir identificar impacto, pausar, retomar e verificar o fluxo.'
    ],
    example: ['workflow-inventory.safe.json', '[WA][GA4-META] DecorColors - Order Hook V2', 'Com 86 nós e caminhos para GA4, CAPI e Ads, o exemplo reúne payload formatter, idempotência, status, waits, backfill e erros. Serve como referência de capacidades, não como modelo para copiar sem simplificar.'],
    lab: ['Escreva a proposta completa do projeto final, com arquitetura, contrato, estados, seis cenários de teste, segurança, publicação, rollback e reconciliação. Use somente placeholders.', ['Integra todas as camadas da trilha', 'Demonstra seis cenários e critérios mensuráveis', 'Permite operar e recuperar sem dados sensíveis'], ['webhook', 'idempotência', 'reconciliação']],
    facts: [['Qual dado usar na demonstração?', 'Dados sintéticos', ['Pedido real', 'Token real', 'URL interna'], 'Dados sintéticos permitem testar sem expor cliente, usuário ou infraestrutura.'], ['O que fazer com duplicado?', 'Reconhecer sem reenviar destinos concluídos', ['Criar novo transaction_id', 'Reenviar tudo', 'Apagar o histórico'], 'Idempotência preserva a identidade e impede conversões duplicadas.'], ['Quais erros recebem retry?', 'Somente os classificados como transitórios', ['Todos indefinidamente', 'Apenas validação', 'Somente credencial revogada'], 'Classificação e limite evitam loops e custos sem chance de sucesso.'], ['O que torna o projeto operável?', 'Runbook, estados, métricas e rollback', ['Somente um canvas bonito', 'Muitos nós', 'Um único teste feliz'], 'Operação exige entender, interromper, recuperar e provar o resultado.']]
  }
];

const MEDIA = {
  0: { diagram: 'diagrams/01-arquitetura-operacao.svg', video: 'public/videos/01-visao-da-operacao.mp4', poster: 'public/video-posters/01-visao-da-operacao.png', captions: 'public/videos/01-visao-da-operacao.pt-BR.vtt', transcript: 'public/videos/01-visao-da-operacao.txt' },
  1: { diagram: 'diagrams/02-anatomia-workflow.svg', video: 'public/videos/02-como-ler-um-workflow.mp4', poster: 'public/video-posters/02-como-ler-um-workflow.png', captions: 'public/videos/02-como-ler-um-workflow.pt-BR.vtt', transcript: 'public/videos/02-como-ler-um-workflow.txt' },
  2: { diagram: 'diagrams/04-normalizacao-pedido.svg' },
  3: { diagram: 'diagrams/03-lifecycle-webhook.svg' },
  4: { diagram: 'diagrams/03-lifecycle-webhook.svg', video: 'public/videos/03-webhooks-e-respostas.mp4', poster: 'public/video-posters/03-webhooks-e-respostas.png', captions: 'public/videos/03-webhooks-e-respostas.pt-BR.vtt', transcript: 'public/videos/03-webhooks-e-respostas.txt' },
  5: { diagram: 'diagrams/04-normalizacao-pedido.svg' },
  6: { diagram: 'diagrams/05-identidade-deduplicacao.svg' },
  7: { diagram: 'diagrams/06-measurement-protocol.svg', video: 'public/videos/04-rastrear-um-purchase.mp4', poster: 'public/video-posters/04-rastrear-um-purchase.png', captions: 'public/videos/04-rastrear-um-purchase.pt-BR.vtt', transcript: 'public/videos/04-rastrear-um-purchase.txt' },
  8: { diagram: 'diagrams/07-fanout-destinos.svg' },
  9: { diagram: 'diagrams/08-retry-backfill.svg' },
  10: { diagram: 'diagrams/09-metodo-debugging.svg', video: 'public/videos/05-debugging-e-publicacao-segura.mp4', poster: 'public/video-posters/05-debugging-e-publicacao-segura.png', captions: 'public/videos/05-debugging-e-publicacao-segura.pt-BR.vtt', transcript: 'public/videos/05-debugging-e-publicacao-segura.txt' },
  11: { diagram: 'diagrams/10-publicacao-rollback.svg' },
  12: { diagram: 'diagrams/01-arquitetura-operacao.svg' }
};

function rotateQuestion(fact, seed) {
  const [question, correct, wrong, explanation] = fact;
  const answer = seed % 4;
  const options = [...wrong];
  options.splice(answer, 0, correct);
  return { question, options, answer, explanation };
}

export const modules = track.map((item, id) => ({
  id,
  title: item.title,
  objectives: item.objectives,
  sections: item.sections,
  realExample: { source: item.example[0], workflow: item.example[1], analysis: item.example[2] },
  media: MEDIA[id],
  quiz: item.facts.map((fact, index) => rotateQuestion(fact, id + index)),
  lab: { prompt: item.lab[0], criteria: item.lab[1], expectedKeywords: item.lab[2] }
}));

export const glossary = [
  ['Backfill', 'Reprocessamento controlado de eventos históricos, com janela, idempotência e reconciliação.'],
  ['Client ID', 'Identificador de uma instância de navegador usado na arquitetura de identidade do GA4.'],
  ['Correlation ID', 'Chave segura que conecta logs e etapas da mesma jornada operacional.'],
  ['Credencial', 'Segredo gerenciado fora do conteúdo do workflow e limitado ao menor privilégio.'],
  ['Deduplicação', 'Reconhecimento de duas entregas que representam o mesmo evento.'],
  ['Event Data', 'Estrutura normalizada que um cliente do GTM server disponibiliza às tags.'],
  ['Event ID', 'Identificador do evento usado, entre outros fins, para deduplicação browser e server.'],
  ['Expression', 'Trecho dinâmico avaliado pelo n8n no contexto dos dados de uma execução.'],
  ['Idempotência', 'Propriedade que permite repetir uma operação sem repetir seu efeito.'],
  ['Item', 'Unidade de dados que trafega entre nós em uma execução do n8n.'],
  ['Jitter', 'Variação aleatória no backoff que evita retries simultâneos em massa.'],
  ['Measurement Protocol', 'Protocolo HTTP para envio de eventos ao Google Analytics 4.'],
  ['Node', 'Unidade de trigger, transformação, controle ou integração em um workflow.'],
  ['Payload', 'Corpo estruturado transportado em uma requisição ou entre etapas.'],
  ['PII', 'Informação capaz de identificar uma pessoa e que exige minimização e proteção.'],
  ['Purchase', 'Evento de compra com identificador, moeda, valor e itens validados.'],
  ['Rate limit', 'Limite de requisições aceitas por uma API em determinado período.'],
  ['Reconciliação', 'Comparação de contagens e identificadores entre origem, processamento e destinos.'],
  ['Retry', 'Nova tentativa limitada para uma falha classificada como transitória.'],
  ['SLO', 'Meta mensurável de confiabilidade, como taxa de sucesso ou latência.'],
  ['Trigger', 'Nó que inicia uma execução por ação manual, agenda, webhook ou outro evento.'],
  ['Transaction ID', 'Identificador estável da transação comercial, usado para reconciliação.'],
  ['Webhook', 'Endpoint HTTP acionado por outro sistema para entregar um evento.'],
  ['Workflow', 'Grafo de nós e conexões que implementa uma automação no n8n.']
].map(([term, definition]) => ({ term, definition }));

const fold = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export function evaluateQuiz(question, selected) {
  return { correct: selected === question.answer, explanation: question.explanation, correctAnswer: question.options[question.answer] };
}

export function evaluateLab(lab, response) {
  const haystack = fold(response);
  const missing = lab.expectedKeywords.filter(keyword => !haystack.includes(fold(keyword)));
  return { passed: missing.length === 0, missing, matched: lab.expectedKeywords.length - missing.length };
}

export function defaultProgress() {
  return { version: 1, completed: [], quizScores: {}, labs: {}, theme: 'dark', current: 0 };
}

export function normalizeProgress(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Progresso inválido.');
  const completed = [...new Set((Array.isArray(value.completed) ? value.completed : []).filter(id => Number.isInteger(id) && id >= 0 && id <= 12))].sort((a, b) => a - b);
  const current = Number.isInteger(value.current) && value.current >= 0 && value.current <= 12 ? value.current : 0;
  const cleanMap = input => Object.fromEntries(Object.entries(input && typeof input === 'object' ? input : {}).filter(([key]) => /^([0-9]|1[0-2])$/.test(key)));
  return { version: 1, completed, quizScores: cleanMap(value.quizScores), labs: cleanMap(value.labs), theme: value.theme === 'light' ? 'light' : 'dark', current };
}

export function progressPercent(progress) {
  return Math.floor((normalizeProgress(progress).completed.length / modules.length) * 100);
}

export function searchCourse(query) {
  const needle = fold(query).trim();
  if (!needle) return [];
  const moduleResults = modules.filter(module => fold([module.title, ...module.objectives, ...module.sections].join(' ')).includes(needle)).map(module => ({ kind: 'Módulo', id: module.id, title: `${module.id}. ${module.title}` }));
  const glossaryResults = glossary.filter(entry => fold(`${entry.term} ${entry.definition}`).includes(needle)).map(entry => ({ kind: 'Glossário', title: entry.term, definition: entry.definition }));
  return [...moduleResults, ...glossaryResults];
}
