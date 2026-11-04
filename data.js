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
    { id: "orc", nome: "Solicitar orçamento à empresa",      dias: 75, resp: "Manutenção",
      dica: "Enviar horas atuais, tag e escopo da revisão de 8000 h. Pedir prazo de validade e de entrega de peças." },
    { id: "rec", nome: "Receber e comparar orçamentos",      dias: 60, resp: "Manutenção",
      dica: "Conferir escopo, peças, mão de obra e prazo de mobilização." },
    { id: "apr", nome: "Aprovar o orçamento",                dias: 45, resp: "Gestor",
      dica: "Aprovação formal (alçada) antes de abrir o pedido." },
    { id: "ped", nome: "Gerar pedido no Compras",            dias: 35, resp: "Compras",
      dica: "Anotar o nº do pedido. Sem pedido liberado a empresa não mobiliza." },
    { id: "agd", nome: "Confirmar agenda com a empresa",     dias: 21, resp: "Manutenção",
      dica: "Alinhar data, equipe, permissão de trabalho e janela de parada do compressor." },
    { id: "exe", nome: "Execução da manutenção (8000 h)",    dias: 0,  resp: "Empresa externa",
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
    { id: "rev", nome: "Revalidar proposta (preço e validade)" },
    { id: "apr", nome: "Aprovar orçamento" },
    { id: "ped", nome: "Gerar pedido no Compras" },
    { id: "rec", nome: "Receber as peças" },
    { id: "ins", nome: "Instalar / aplicar no compressor" }
  ],

  compressores: [
    { id: "C1", tag: "CPS-14Q001", cor: "#0f172a",
      leituras: [
        { data: "2026-10-14", horas: 5406 },
        { data: "2026-11-04", horas: 5904, carga: 5900, partidas: 340 }
      ] },
    { id: "C2", tag: "CPS-14Q002", cor: "#2563eb",
      leituras: [
        { data: "2026-10-14", horas: 5651 },
        { data: "2026-11-04", horas: 6149, carga: 6148, partidas: 449 }
      ] },
    { id: "C3", tag: "CPS-14Q003", cor: "#16a34a",
      leituras: [
        { data: "2026-10-14", horas: 6557 },
        { data: "2026-11-04", horas: 6579, carga: 6575, partidas: 713 }
      ] },
    { id: "C4", tag: "CPS-14Q004", cor: "#d97706", novo: true,
      leituras: [] }   // equipamento novo: start-up incompleto, em stand-by (ver "c4" abaixo)
  ],

  // Situação do compressor 04 (fonte: grupo com o fornecedor, até 03/11/2026)
  c4: {
    status: "Stand-by · não operar como principal",
    resumo: "Start-up em 22/09 parou: suporte do motor/elemento com 3 pés danificados e vazamento na mangueira de descarga. Garantia aprovada em 21/10. Em 29/10 foi montado com reparo paliativo e testado a 100% de carga sem falhas, mas o técnico recomendou NÃO usar como principal até trocar a mangueira original. A mangueira que a fábrica mandou veio errada; faturamento da correta previsto para 13/11. Fase II entra em operação no início de novembro.",
    previsao: "2026-11-13",
    pendencias: [
      { id: "mang",  nome: "Mangueira de descarga original (garantia)", nota: "Faturamento previsto em 13/11. A primeira enviada pela fábrica veio errada." },
      { id: "supo",  nome: "Suporte do motor e elemento definitivo (garantia)", nota: "Hoje está com reparo paliativo (soldado)." },
      { id: "inst",  nome: "Instalar mangueira original e prender o motor ao chassi", nota: "Com a mangueira provisória não foi possível fixar o motor." },
      { id: "oleo",  nome: "Repor o óleo / lubrificação", nota: "Era o que faltava após o teste de 29/10." },
      { id: "vlv",   nome: "Teste de válvulas para a Fase II", nota: "Pedido da coordenação." },
      { id: "chk",   nome: "Checklist de start-up entregue à Engenharia", nota: "Exigência da coordenação para o compressor novo." },
      { id: "lib",   nome: "Liberar para operação (retirar bloqueio) e lançar leitura", nota: "Chave do bloqueio está com a operação da casa de força." }
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
