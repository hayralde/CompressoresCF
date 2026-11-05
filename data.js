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
          garantia: true, nota: "Resolvido pela garantia da fábrica e instalado em 21/09/2026. Não entra no valor a pagar." } ] }
  ],
  etapasPeca: [
    { id: "rev", nome: "Revalidar proposta (preço e validade)", acao: "Pedir à Supertec a revalidação das propostas de peças", resp: "Manutenção" },
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
    // Serviços já feitos (informado pelo PCM em 05/11/2026). A data exata ainda não foi informada.
    feitos: ["A:C1", "A:C2", "A:C3"],
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
  // "dias" = periodicidade. A contagem começa em inicioPlano.
  // fonte "Manual" = vem do manual; "Plano" = definição do PCM (ajustável).
  inicioPlano: "2026-11-04",
  responsavelPlano: "PCM",
  tarefas: [
    { id: "dia", rastrear: false, nome: "Ronda diária", acao: "Conferir nível de óleo, leituras no visor e se o dreno de condensado descarrega", dias: 1, per: "Diária", resp: "Operação", reg: "Anotar anormalidades", fonte: "Manual 6.1" },
    { id: "leit", tipo: "leitura", nome: "Leitura do horímetro", acao: "Ler o horímetro e lançar no site", dias: 7, per: "Semanal", resp: "Operação", reg: "Horas, horas em carga e partidas", fonte: "Plano (base da projeção)" },
    { id: "secad", nome: "Secador: condensador e dreno", acao: "Limpar o condensador do secador (aspirador e ar em baixa pressão) e testar o dreno", dias: 30, per: "Mensal", resp: "Manutenção", reg: "Limpeza feita, dreno OK", fonte: "Manual 6.1" },
    { id: "tri", nome: "Resfriadores e filtros", acao: "Limpar resfriadores, inspecionar o elemento do filtro de ar e os filtros do compartimento elétrico", dias: 90, per: "Trimestral", resp: "Manutenção", reg: "Estado dos elementos (OK ou trocar)", fonte: "Manual 6.1 (mais frequente se houver poeira)" },
    { id: "ud", rastrear: false, nome: "Elementos do filtro UD+", acao: "Trocar a cada 4.000 h, 12 meses ou perda de carga de 350 mbar. O manômetro não serve de indicador", dias: 365, per: "4.000 h / 12 meses", resp: "Supertec", reg: "Troca registrada no serviço", fonte: "Manual 6.10" },
    { id: "nr13", rastrear: false, nome: "Válvula de segurança e vaso de pressão", acao: "Teste da válvula só por pessoal autorizado; inspeções conforme o prontuário NR-13 (periodicidade a confirmar)", dias: 365, per: "Conforme NR-13", resp: "Manutenção", reg: "Laudo de inspeção", fonte: "Manual 6.9 e cap. 9 (NR-13)" },
    { id: "laudo", nome: "Relatório técnico anual", acao: "Receber da Supertec o relatório técnico anual dos compressores", dias: 365, per: "Anual", resp: "Manutenção", reg: "Laudo arquivado", fonte: "Plano (PMOC)" }
  ],

  compressores: [
    { id: "C1", tag: "CPS-14Q001", cor: "#0f172a", modelo: "GA110VSD+", serie: "BQR144249",
      leituras: [
        { data: "2026-10-14", horas: 5406 },
        { data: "2026-11-04", horas: 5904, carga: 5900, partidas: 340 }
      ] },
    { id: "C2", tag: "CPS-14Q002", cor: "#2563eb", modelo: "GA110VSD+", serie: "BQR144248",
      leituras: [
        { data: "2026-10-14", horas: 5651 },
        { data: "2026-11-04", horas: 6149, carga: 6148, partidas: 449 }
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
    status: "Stand-by · não operar como principal",
    resumo: "Funciona com reparo provisório (testado a 100% em 29/10), mas não deve ser o principal até trocar a mangueira de descarga. A peça de garantia veio errada; a certa tem faturamento previsto em 13/11.",
    previsao: "2026-11-13",
    pendencias: [
      { id: "mang",  nome: "Receber a mangueira de descarga original (garantia)", resp: "Fábrica / Supertec", nota: "Faturamento previsto em 13/11. A primeira enviada pela fábrica veio errada." },
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
      { d: "2026-11-03", t: "Mangueira enviada pela fábrica era a errada. Nova previsão de faturamento: 13/11." }
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
