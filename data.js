/* ============================================================
   DADOS BASE – Compressores Casa de Força
   Edite aqui para mudar metas, prazos e rodízio.
   As leituras novas também podem ser lançadas direto no site
   (ficam salvas no navegador; use "Backup" para levar a outro aparelho).
   ============================================================ */
window.DATA = {
  metaHoras: 8000,          // revisão por horas de funcionamento
  horasPorDia: 24,          // ritmo de um compressor ligado direto
  ultimaAtualizacao: "2026-11-04",

  // Fluxo da manutenção com empresa externa.
  // "dias" = quantos dias ANTES da data prevista de 8000 h cada etapa deve estar concluída.
  etapas: [
    { id: "orc", nome: "Pedir orçamento do Serviço B",      dias: 75, resp: "Manutenção",
      dica: "Enviar horas atuais e tag. Escopo: Serviço B do manual (óleo, filtros, separador, válvulas). Pedir validade e prazo de peças." },
    { id: "rec", nome: "Receber e comparar orçamentos",      dias: 60, resp: "Manutenção",
      dica: "Conferir escopo, peças, mão de obra e prazo de mobilização." },
    { id: "apr", nome: "Aprovar o orçamento",                dias: 45, resp: "Gestor",
      dica: "Aprovação formal (alçada) antes de abrir o pedido." },
    { id: "ped", nome: "Gerar pedido no Compras",            dias: 35, resp: "Compras",
      dica: "Anotar o nº do pedido. Sem pedido liberado a empresa não mobiliza." },
    { id: "agd", nome: "Confirmar agenda com a empresa",     dias: 21, resp: "Manutenção",
      dica: "Alinhar data, equipe, permissão de trabalho e janela de parada do compressor." },
    { id: "exe", nome: "Execução do Serviço B (8000 h)",    dias: 0,  resp: "Supertec",
      dica: "Acompanhar serviço, registrar peças trocadas e leitura do contador." },
    { id: "enc", nome: "Encerrar: laudo e novo ciclo",       dias: -5, resp: "Manutenção",
      dica: "Anexar relatório de serviço, dar baixa no pedido e reiniciar o plano do próximo ciclo." }
  ],

  // Orçamentos de PEÇAS levantadas na última visita do técnico (não são da revisão de 8000 h).
  pecasValidas: true,   // PCM confirmou em 05/11/2026: as propostas seguem válidas, sem precisar revalidar
  fornecedor: { nome: "Supertec Comércio e Imp Ltda (distribuidor Atlas Copco) · Sinop/MT", vendedor: "Jeovani" },
  pecas: [
    { id: "962997", cmp: "C1", modelo: "GA110VSD+ BQR144249", emissao: "2026-08-17", validade: "2026-09-16", total: 18443.65,
      tecnico: "Técnico (14/08): filtro de ar deve ser trocado o mais breve possível; dreno automático do secador danificado; Smartbox queimada.",
      itens: [
        { cod: "43738", desc: "Dreno automático LD202", pn: "1649800418", qtd: 1, valor: 11581.54, entrega: 0 },
        { cod: "99999", desc: "Kit Smartbox Pro", pn: "1837048118", qtd: 1, valor: 3978.00, entrega: 0 },
        { cod: "41027", desc: "Packed filter element", pn: "2901990096", qtd: 1, valor: 2884.11, entrega: 0 } ] },
    { id: "962998", cmp: "C2", modelo: "GA110VSD+ BQR144248", emissao: "2026-08-17", validade: "2026-09-16", total: 2884.11,
      tecnico: "Técnico (14/08): filtro de ar saturado, substituir o mais breve possível.",
      itens: [
        { cod: "41027", desc: "Packed filter element", pn: "2901990096", qtd: 1, valor: 2884.11, entrega: 0 } ] },
    { id: "962489", cmp: "C3", modelo: "GA110VSD+ BQR145196", emissao: "2026-08-13", validade: "2026-09-12", total: 31873.65,
      tecnico: "Técnico (14/08): filtro de ar deve ser trocado (recomendado não operar até a troca); filtro coalescente saturado; dreno do secador em garantia.",
      itens: [
        { cod: "41027", desc: "Packed filter element", pn: "2901990096", qtd: 1, valor: 2884.11, entrega: 0 },
        { cod: "45827", desc: "Kit de filtro UD430+", pn: "2901207964", qtd: 1, valor: 17408.00, entrega: 15 },
        { cod: "43738", desc: "Dreno automático LD202", pn: "1649800418", qtd: 1, valor: 11581.54, entrega: 15,
          garantia: true, nota: "Resolvido pela garantia da fábrica e instalado em 21/09/2026. Não entra no valor a pagar." } ] },
    { id: "980739", cmp: "C2", modelo: "GA110VSD+ BQR144248", emissao: "2026-11-13", validade: "2026-12-13", total: 55130.00,
      tecnico: "Ventilador do C2 com bobinas abertas (OS 5878, 11/11). O compressor fica bloqueado até a troca.",
      itens: [
        { cod: "44721", desc: "Ventilador 380V/460V 60Hz", pn: "1028908421", qtd: 1, valor: 53330.00, entrega: 10 },
        { cod: "18579", desc: "Mão de obra, hora técnica Atlas Copco", pn: "18579", qtd: 1, valor: 1800.00, entrega: 0 } ] }
  ],
  etapasPeca: [
    { id: "apr", nome: "Aprovar orçamento", acao: "Aprovar as propostas de peças", resp: "Gestor" },
    { id: "ped", nome: "Gerar pedido no Compras", acao: "Gerar o pedido das peças no Compras", resp: "Compras" },
    { id: "rec", nome: "Receber as peças", acao: "Receber as peças da Supertec", resp: "Supertec" },
    { id: "ins", nome: "Instalar / aplicar no compressor", acao: "Instalar as peças nos compressores", resp: "Supertec" }
  ],

  // ============ CRONOGRAMA DO FABRICANTE (Atlas Copco) ============
  // Fonte: Manual de instruções GA 75L / 90 / 110 VSD+, seção 6.1 "Programa de manutenção preventiva"
  // (págs. 75 a 78 do manual) e seção 6.10 (filtros UD+).
  // Cada serviço vale pelo que ocorrer primeiro: horas de funcionamento OU tempo.
  manual: {
    fonte: "Manual Atlas Copco GA 75L/90/110 VSD+, seção 6.1 (págs. 75–78) e 6.10",
    // Serviços já feitos dentro do prazo (informado pelo PCM em 05/11/2026). A data exata é opcional.
    feitos: ["A:C1", "A:C2"],
    // C3: PCM informou em 13/11/2026 que a visita de junho foi apenas corretiva (problemas levantados antes), não o Serviço A.
    soCorretiva: { "A:C3": "2026-06-19" },
    // Fonte: relatórios Supertec "4 mil horas" (OS de campo 5223, 5224 e 5276), visita de 17 a 19/06/2026.
    // Horas totais no dia da visita. O relatório marca "zerar horas do módulo" como realizado, mas o PCM confirmou em 13/11/2026 que o contador NÃO zerou e segue correndo (o Serviço B continua em 8000 h totais).
    datas: { "A:C1": "2026-06-19", "A:C2": "2026-06-19" },
    horasNoServico: { C1: 2635, C2: 3335, C3: 5755 },
    servicos: [
      { id: "A", horas: 4000,  tempo: "1 ano" },
      { id: "B", horas: 8000,  tempo: "2 anos" },
      { id: "D", horas: 24000, tempo: "" }
    ],
    // A, B, D: 1 = faz parte do serviço. nota = rodapé do manual.
    itens: [
      { nome: "Verificar vazamentos de água",                       A: 1, B: 1, D: 1 },
      { nome: "Trocar o filtro de ar",                              A: 1, B: 1, D: 1 },
      { nome: "Trocar o material filtrante do compartimento elétrico", A: 1, B: 1, D: 1 },
      { nome: "Trocar a rede do filtro dos drenos",                 A: 1, B: 1, D: 1 },
      { nome: "Trocar o óleo",                                      A: 1, B: 1, D: 1, nota: "Com óleo Roto Xtend Duty, óleo e filtro de óleo passam a fazer parte só do serviço B." },
      { nome: "Trocar o filtro de óleo",                            A: 1, B: 1, D: 1, nota: "Com óleo Roto Xtend Duty, óleo e filtro de óleo passam a fazer parte só do serviço B." },
      { nome: "Trocar o elemento separador de óleo",                A: 0, B: 1, D: 1 },
      { nome: "Inspecionar a válvula anti-retorno da linha de retorno", A: 0, B: 1, D: 1 },
      { nome: "Inspecionar a válvula de pressão mínima",            A: 0, B: 1, D: 1 },
      { nome: "Inspecionar a válvula termostática",                 A: 0, B: 1, D: 1 },
      { nome: "Inspecionar os drenos de condensado",                A: 0, B: 1, D: 1 },
      { nome: "Trocar o rolamento superior do motor",               A: 0, B: 0, D: 1, nota: "Se a pressão de trabalho for até 10 bar, a inspeção pode ir para 32.000 h." },
      { nome: "Válvula de admissão",                                A: 0, B: 0, D: 1, nota: "Acima de 300.000 partidas/paradas, recomenda-se revisar a válvula de admissão e o bloco de solenoide." }
    ]
  },

  // ============ PMOC: rotinas de operação e controle ============
  // "dias" = periodicidade. A contagem começa na primeira execução marcada como "Feito" (sem registro = sem data).
  // fonte "Manual" = vem do manual; "Plano" = definição do PCM (ajustável).
  inicioPlano: "2026-11-04",
  // Execuções comprovadas pelos relatórios de 4000 h (limpeza dos resfriadores: "Realizado" em 19/06/2026 nos 3 compressores).
  execInicial: { "tri:C1": "2026-06-19", "tri:C2": "2026-06-19", "tri:C3": "2026-06-19" },

  // Linha do tempo: o que foi executado, por compressor. k: serv = serviço preventivo, corr = corretiva, os = OS/inspeção, peca = proposta de peças, obs = observação.
  historico: {
    C1: [
      { d: "2026-06-19", k: "serv", t: "Serviço A (4000 h) feito pela Supertec a 2.635 h: filtros de ar e de óleo, limpeza dos resfriadores. Corretiva: contatos do dreno do secador limpos e voltou a operar; dreno do trocador de calor queimado e Smartbox queimada apontados", f: "Relatório OS 5224" },
      { d: "2026-08-17", k: "peca", t: "Proposta 962997 emitida: dreno automático, kit Smartbox e filtro de ar", f: "Proposta 962997" },
      { d: "2026-11-05", k: "obs", t: "Desarme por temperatura do elemento", f: "Relatório OS 5880" },
      { d: "2026-11-06", k: "obs", t: "Radiador muito sujo", f: "Chat Casa de Força" },
      { d: "2026-11-11", k: "corr", t: "Trocados filtro de ar, dreno automático do trocador de calor e Smartbox; antena conectada à rede. Deixado em operação, a 108 °C com ambiente de 40 °C", f: "OS 5880" }
    ],
    C2: [
      { d: "2026-06-19", k: "serv", t: "Serviço A (4000 h) feito pela Supertec a 3.335 h: filtros de ar e de óleo, limpeza dos resfriadores. Corretiva: disjuntor geral desarmava acima de 95%, então a rotação máxima foi limitada a 90%; O-ring da mangueira de descarga vedado com silicone", f: "Relatório OS 5276" },
      { d: "2026-08-17", k: "peca", t: "Proposta 962998 emitida: filtro de ar", f: "Proposta 962998" },
      { d: "2026-11-05", k: "obs", t: "Desarmes por temperatura do elemento; saiu do sistema para esfriar", f: "Chat Casa de Força" },
      { d: "2026-11-06", k: "obs", t: "Radiador muito sujo; limpeza geral feita e óleo completado, mas continuou desarmando. Filtro de ar encharcado de óleo (puxou óleo por causa dos desarmes)", f: "Chat Casa de Força" },
      { d: "2026-11-09", k: "obs", t: "Mais de 12 desarmes por temperatura no dia, vistos no monitoramento da Supertec", f: "Chat Casa de Força" },
      { d: "2026-11-10", k: "corr", t: "Desarme por temperatura do elemento (120 °C). Ventilador com bobinas abertas, mangueira de descarga retirada e instalada no C4. Deixado bloqueado e fora de operação. Filtro de ar trocado", f: "OS 5878" }
    ],
    C3: [
      { d: "2026-06-19", k: "corr", t: "Visita corretiva (não foi o Serviço A): defletor de óleo solto e trincado, chapa de inox solta no reservatório, arraste de óleo. Defletor soldado pelo cliente; Supertec recomendou trocar separador e defletor. Filtro coalescente saturado e dreno queimado apontados", f: "Relatório OS 5223" },
      { d: "2026-08-13", k: "peca", t: "Proposta 962489 emitida: filtro de ar, kit UD430+ e dreno (garantia)", f: "Proposta 962489" },
      { d: "2026-08-14", k: "os", t: "Inspeção: filtro de ar saturado por desarme; recomendado não operar até a troca", f: "OS 2026/2789" },
      { d: "2026-09-21", k: "corr", t: "Dreno automático do secador trocado (garantia)", f: "OS 2026/3689" },
      { d: "2026-11-11", k: "corr", t: "Trocados filtro de ar e filtro coalescente. Deixado em operação", f: "OS 5881" }
    ],
    C4: []   // o histórico do C4 vem de c4.historico
  },
  // Eventos que valem para todos os compressores em operação (Casa de Força, turno B)
  historicoGeral: [
    { d: "2026-11-05", k: "obs", t: "Por causa da fase 2, o set point subiu de 5,8 para 7,0 bar e passou a ser necessário ligar três compressores", f: "Chat Casa de Força" },
    { d: "2026-11-10", k: "obs", t: "Set point deixado em 6,5 bar, com os compressores 1, 3 e 4 no sistema", f: "Relatório do turno B" }
  ],

  // Achados do relatório de 4000 h (jun/2026) e das OS 2026/2789 e 2026/3689.
  // sit: "peca" = já está numa proposta de peças · "cotar" = falta pedir cotação · "cliente" = ação da RRP · "feito" = resolvido
  // Visita de 10 e 11/11/2026 (OS Supertec 5878 C2, 5880 C1, 5881 C3): filtros de ar trocados nos três.
  bloqueioDesde: "2026-11-10",   // desde a visita, C2 parado: a projeção põe C1 e C3 ligados direto
  pecasExec: { "962997": "2026-11-11", "962998": "2026-11-11", "962489": "2026-11-11" },
  achados: [
    { id: "c2vt", cmp: "C2", urg: true, t: "Ventilador principal com bobinas abertas; o compressor desarmou por temperatura (120 °C) e está BLOQUEADO e fora de operação desde 11/11 (OS 5878)", sit: "peca", pecaId: "980739", ref: "proposta 980739: R$ 55.130, entrega em 10 dias, válida até 13/12/2026. Aguarda aprovação, pedido e instalação" },
    { id: "c2mg", cmp: "C2", t: "A mangueira de descarga do C2 foi retirada e instalada no compressor 04. O C2 está sem ela", sit: "cotar", resp: "Supertec", acao: "Mangueira do C2 está no C4. A da garantia (fábrica) ainda não tem data; definir com a Supertec se o C2 recebe mangueira nova ou a devolvida, e trocar o O-ring" },
    { id: "q15", cmp: "C4", t: "O C4 desarmou por sobrecarga do ventilador (11/11). O ajuste do relé Q15 estava em 5 A e foi para 6 A; o manual pede 8,0 A", sit: "feito", ref: "disjuntor motor ajustado conforme o manual (8,0 A), informado pelo PCM; resolve o problema. Data do ajuste não informada" },
    { id: "tmp",  cmp: "C1,C2", t: "Desarmes por temperatura do elemento: C1 em 05/11 (trabalhando a 108 °C com ambiente de 40 °C) e C2 em 10/11 (120 °C). Resfriadores e ar sujos", sit: "feito", ref: "limpeza executada pela Climavolts (informado pelo PCM; data não informada). Em 06/11 o radiador do C1 e do C2 estava muito sujo" },
    { id: "c1sb", cmp: "C1", t: "Smartbox queimada e dreno automático do trocador de calor queimado", sit: "feito", ref: "trocados em 11/11/2026 (OS 5880); antena Smartbox conectada à rede" },
    { id: "c2dj", cmp: "C2", t: "Disjuntor geral desarmava acima de 95% de rotação. A Supertec limitou a rotação máxima a 90% e recomendou trocar o disjuntor imediatamente", sit: "feito", ref: "disjuntor de alimentação substituído e problema resolvido (informado pelo PCM; data não informada). Falta confirmar se a rotação máxima voltou a 100%" },
    { id: "c3sp", cmp: "C3", t: "Defletor de óleo com emenda solta e trincas; chapa de inox solta dentro do reservatório pode ter danificado o filtro separador. Houve arraste de óleo. O defletor foi soldado pelo cliente. A Supertec recomendou trocar defletor e separador e usar o C3 em stand-by até a troca", sit: "cotar", resp: "Supertec", acao: "Pedir cotação do filtro separador e do defletor de óleo do C3" },
    { id: "c3co", cmp: "C3", t: "Filtro coalescente saturado por causa do arraste de óleo", sit: "feito", ref: "filtro coalescente trocado em 11/11/2026 (OS 5881). Confirmar com a Supertec se é o kit UD430+ da proposta" },
    { id: "c3dr", cmp: "C3", t: "Dreno automático do secador queimado", sit: "feito", ref: "trocado em 21/09/2026 (OS 2026/3689, garantia)" },
    { id: "ar",   cmp: "C1,C2,C3", t: "Filtro de ar saturado (14/08 o técnico recomendou não operar o C3 até a troca)", sit: "feito", ref: "trocado nos três em 11/11/2026 (OS 5878, 5880 e 5881)" },
    { id: "cub",  cmp: "C1,C2,C3", t: "Filtro do compartimento elétrico saturado em junho. O relatório não registra a troca", sit: "cotar", resp: "Supertec", acao: "Confirmar a troca do filtro do compartimento elétrico (item do Serviço A)" },
    { id: "pod",  cmp: "C1,C2,C3", t: "Qualidade do ar aspirado: poluído, em todos. O manual manda encurtar as limpezas em ambiente com poeira", sit: "cliente", resp: "Manutenção" }
  ],
  responsavelPlano: "PCM",
  tarefas: [
    { id: "dia", rastrear: false, nome: "Ronda diária", acao: "Conferir nível de óleo, leituras no visor e se o dreno de condensado descarrega", dias: 1, per: "Diária", resp: "Operação", reg: "Anotar anormalidades", fonte: "Manual 6.1" },
    { id: "leit", tipo: "leitura", nome: "Leitura do horímetro", acao: "Ler o horímetro e lançar no site", dias: 7, per: "Semanal", resp: "Operação", reg: "Horas, horas em carga e partidas", fonte: "Plano (base da projeção)" },
    { id: "secad", nome: "Secador: condensador e dreno", acao: "Limpar o condensador do secador (aspirador e ar em baixa pressão) e testar o dreno", dias: 30, per: "Mensal", resp: "Manutenção", reg: "Limpeza feita, dreno OK", fonte: "Manual 6.1" },
    { id: "tri", nome: "Resfriadores e filtros", acao: "Limpar resfriadores, inspecionar o elemento do filtro de ar e os filtros do compartimento elétrico", dias: 90, per: "Trimestral", resp: "Manutenção", reg: "Estado dos elementos (OK ou trocar)", fonte: "Manual 6.1 (mais frequente se houver poeira)" },
    { id: "ud", rastrear: false, nome: "Elementos do filtro UD+", acao: "Trocar a cada 4.000 h, 12 meses ou perda de carga de 350 mbar. O manômetro não serve de indicador", dias: 365, per: "4.000 h / 12 meses", resp: "Supertec", reg: "Troca registrada no serviço", fonte: "Manual 6.10" },
    { id: "nr13", rastrear: false, nome: "Válvula de segurança e vaso de pressão", acao: "Teste da válvula só por pessoal autorizado; inspeções conforme o prontuário NR-13 (periodicidade a confirmar)", dias: 365, per: "Conforme NR-13", resp: "Manutenção", reg: "Laudo de inspeção", fonte: "Manual 6.9 e cap. 9 (NR-13)" },
    { id: "laudo", rastrear: false, nome: "Relatório técnico anual", acao: "Receber da Supertec o relatório técnico anual dos compressores", dias: 365, per: "Anual", resp: "Manutenção", reg: "Laudo arquivado", fonte: "Plano (PMOC)" }
  ],

  compressores: [
    { id: "C1", tag: "CPS-14Q001", cor: "#0f172a", modelo: "GA110VSD+", serie: "BQR144249",
      leituras: [
        { data: "2026-10-14", horas: 5406 },
        { data: "2026-11-04", horas: 5904, carga: 5900, partidas: 340 },
        { data: "2026-11-10", horas: 6052 }   // OS 5880
      ] },
    { id: "C2", tag: "CPS-14Q002", cor: "#2563eb", modelo: "GA110VSD+", serie: "BQR144248",
      bloqueio: { motivo: "Ventilador com bobinas abertas; sem mangueira de descarga", ate: ["c2vt", "c2mg"] },
      leituras: [
        { data: "2026-10-14", horas: 5651 },
        { data: "2026-11-04", horas: 6149, carga: 6148, partidas: 449 },
        { data: "2026-11-10", horas: 6181 }   // OS 5878
      ] },
    { id: "C3", tag: "CPS-14Q003", cor: "#16a34a", modelo: "GA110VSD+", serie: "BQR145196",
      leituras: [
        { data: "2026-10-14", horas: 6557 },
        { data: "2026-11-04", horas: 6579, carga: 6575, partidas: 713 }
      ] },
    { id: "C4", tag: "CPS-14Q004", cor: "#d97706", novo: true, modelo: "a confirmar", serie: "—",
      leituras: [] }   // equipamento novo: start-up incompleto, em stand-by (ver "c4" abaixo)
  ],

  // Situação do compressor 04 (fonte: grupo com o fornecedor, até 03/11/2026)
  c4: {
    status: "Em operação com mangueira provisória",
    resumo: "Colocado no sistema depois de 05/11, com a mangueira de descarga provisória (a Supertec confirmou que pode operar com acompanhamento constante). Em 11/11 a Supertec instalou nele a mangueira de descarga do C2. A mangueira original da garantia será entregue pela fábrica, ainda sem data.",
    previsao: "",   // sem data: a fábrica enviará a mangueira por garantia, ainda sem prazo (informado pelo PCM)
    inicio: "2026-11-06",   // entrada em operação, informada pelo PCM
    feitos: { lib: { done: true, date: "2026-11-06" } },
    pendencias: [
      { id: "mang",  nome: "Receber a mangueira de descarga original (garantia)", resp: "Fábrica / Supertec", nota: "Entrega por garantia, ainda sem data. A primeira enviada pela fábrica veio errada. Enquanto não chega, o C4 usa a mangueira que era do C2." },
      { id: "supo",  nome: "Receber o suporte do motor e elemento definitivo (garantia)", resp: "Fábrica / Supertec", nota: "Hoje está com reparo paliativo (soldado)." },
      { id: "inst",  nome: "Instalar a mangueira original e prender o motor ao chassi", resp: "Supertec", nota: "Com a mangueira provisória não foi possível fixar o motor." },
      { id: "oleo",  nome: "Repor o óleo / lubrificação", resp: "Supertec", nota: "Era o que faltava após o teste de 29/10." },
      { id: "vlv",   nome: "Fazer o teste de válvulas para a Fase II", resp: "Supertec", nota: "Pedido da coordenação." },
      { id: "chk",   nome: "Entregar o checklist de start-up à Engenharia", resp: "Supertec", nota: "Exigência da coordenação para o compressor novo." },
      { id: "lib",   nome: "Liberar para operação (retirar bloqueio) e lançar leitura", resp: "Operação", nota: "Chave do bloqueio está com a operação da casa de força." }
    ],
    historico: [
      { d: "2026-09-21", t: "Dreno do secador do C3 trocado (garantia). C2 e C3 operando a 100%." },
      { d: "2026-09-22", t: "Start-up do C4 interrompido: pés do suporte danificados e vazamento na mangueira de descarga. Equipamento desenergizado." },
      { d: "2026-10-21", t: "Fábrica aprova a garantia das peças do C4." },
      { d: "2026-10-27", t: "Reparo por solda da mangueira não resolveu; vai usar a peça de garantia." },
      { d: "2026-10-29", t: "Montado com mangueira prensada. Teste a 100% de carga sem falhas. Fica em stand-by e bloqueado." },
      { d: "2026-11-03", t: "Mangueira enviada pela fábrica era a errada. Nova previsão de faturamento: 13/11." },
      { d: "2026-11-05", t: "Supertec: pode colocar no sistema, mas com acompanhamento constante. Por causa da fase 2 foi preciso ligar os três compressores" },
      { d: "2026-11-10", t: "Em operação: o filtro de ar dele foi emprestado ao C2 para teste" },
      { d: "2026-11-11", t: "Desarmou por sobrecarga do ventilador; relé Q15 estava em 5 A (manual: 8,0 A) e foi ajustado para 6 A" },
      { d: "2026-11-11", t: "A Supertec retirou a mangueira de descarga do C2 e a instalou no C4 (OS 5878). Confirmar com a Supertec se o C4 já pode operar e o que falta." }
    ]
  },

  // Rodízio ativo (herdado do plano anterior). on = ligados, off = descansando.
  rodizio: [
    { n: 1,  ini: "2026-10-14", fim: "2026-10-20", on: ["C1","C2"], obs: "C3 em descanso estratégico para equalização" },
    { n: 2,  ini: "2026-10-21", fim: "2026-10-27", on: ["C1","C2"], obs: "Acúmulo de horas C1 e C2" },
    { n: 3,  ini: "2026-10-28", fim: "2026-11-03", on: ["C1","C2"], obs: "C3 preservado – 21 dias parado" },
    { n: 4,  ini: "2026-11-04", fim: "2026-11-10", on: ["C1","C2"], obs: "Diferencial C1–C3 caindo" },
    { n: 5,  ini: "2026-11-11", fim: "2026-11-17", on: ["C1","C2"], obs: "Manter C3 frio" },
    { n: 6,  ini: "2026-11-18", fim: "2026-11-24", on: ["C1","C2"], obs: "C3 economizando horas" },
    { n: 7,  ini: "2026-11-25", fim: "2026-12-01", on: ["C1","C2"], obs: "Penúltima semana da fase 1" },
    { n: 8,  ini: "2026-12-02", fim: "2026-12-08", on: ["C1","C2"], obs: "Fim da fase de equalização" },
    { n: 9,  ini: "2026-12-09", fim: "2026-12-15", on: ["C1","C3"], obs: "Início do rodízio ativo – C2 descansa" },
    { n: 10, ini: "2026-12-16", fim: "2026-12-22", on: ["C2","C3"], obs: "C1 folga curta" },
    { n: 11, ini: "2026-12-23", fim: "2026-12-29", on: ["C1","C3"], obs: "Semana de Natal – C3 assume carga" },
    { n: 12, ini: "2026-12-30", fim: "2027-01-05", on: ["C1","C2"], obs: "Virada do ano – C1 e C2 juntos" },
    { n: 13, ini: "2027-01-06", fim: "2027-01-12", on: ["C2","C3"], obs: "C1 descanso do 2º ciclo" },
    { n: 14, ini: "2027-01-13", fim: "2027-01-19", on: ["C1","C3"], obs: "C2 descansa" },
    { n: 15, ini: "2027-01-20", fim: "2027-01-26", on: ["C1","C2"], obs: "C3 descansa" },
    { n: 16, ini: "2027-01-27", fim: "2027-02-02", on: ["C2","C3"], obs: "Aproximação final – diferenças < 200 h" },
    { n: 17, ini: "2027-02-03", fim: "2027-02-09", on: ["C1","C3"], obs: "Convergência – todos perto de 7700 h" },
    { n: 18, ini: "2027-02-10", fim: "2027-02-16", on: ["C2","C3"], obs: "Pré-revisão – checklist" },
    { n: 19, ini: "2027-02-17", fim: "2027-02-24", on: ["C1","C2"], obs: "Semana final – todos próximos de 8000 h" }
  ]
};
