(function () {
  "use strict";
  var D = window.DATA;
  var KEY = "cmp-casa-forca-v1";
  var $ = function (s) { return document.querySelector(s); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; }); };

  /* ---------- estado salvo no navegador ---------- */
  function blank() { return { leituras: {}, etapas: {}, c4: {}, pecas: {} }; }
  function load() {
    try { var o = JSON.parse(localStorage.getItem(KEY) || "{}"); return Object.assign(blank(), o); }
    catch (e) { return blank(); }
  }
  var S = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }

  /* ---------- datas ---------- */
  function parse(s) { var p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function iso(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function addDays(d, n) { var x = new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); return x; }
  function diff(a, b) { return Math.round((a - b) / 86400000); }
  function br(d) { return String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0") + "/" + d.getFullYear(); }
  function brs(d) { return String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0"); }
  var today = (function () { var n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); })();
  var fmtN = function (n) { return Math.round(n).toLocaleString("pt-BR"); };

  /* ---------- leituras e projeção ---------- */
  function leituras(c) {
    var extra = S.leituras[c.id] || [];
    var all = c.leituras.concat(extra).slice().sort(function (a, b) { return a.data < b.data ? -1 : 1; });
    if (c.novo && S.c4.start && !all.length) all = [{ data: S.c4.start, horas: 0 }];
    return all;
  }
  function last(c) { var l = leituras(c); return l.length ? l[l.length - 1] : null; }
  function weekFor(d) {
    for (var i = 0; i < D.rodizio.length; i++) {
      var w = D.rodizio[i];
      if (d >= parse(w.ini) && d <= parse(w.fim)) return w;
    }
    return null;
  }
  function rate(c, d) {
    if (c.novo) return +(S.c4.horasDia || 0);
    var w = weekFor(d);
    if (!w) return d > parse(D.rodizio[D.rodizio.length - 1].fim) ? D.horasPorDia : 0;
    return w.on.indexOf(c.id) >= 0 ? D.horasPorDia : 0;
  }
  // devolve {horasHoje, data8000, curva:[{d,h}]}
  function simular(c) {
    var L = last(c);
    if (!L) return null;
    var d = parse(L.data), h = L.horas, curva = [{ d: new Date(d), h: h }], horasHoje = h, data8000 = null;
    if (today <= d) horasHoje = h;
    for (var i = 0; i < 900; i++) {
      d = addDays(d, 1);
      h += rate(c, d);
      curva.push({ d: new Date(d), h: h });
      if (d <= today) horasHoje = h;
      if (!data8000 && h >= D.metaHoras) { data8000 = new Date(d); if (d > today) break; }
    }
    if (L.horas >= D.metaHoras) data8000 = parse(L.data);
    return { horasHoje: Math.min(horasHoje, 99999), data8000: data8000, curva: curva, leitura: L, estimado: parse(L.data) < today };
  }
  function info() {
    return D.compressores.map(function (c) {
      var sim = simular(c);
      return { c: c, idx: D.compressores.indexOf(c), sim: sim };
    });
  }

  /* ---------- etapas e prazos ---------- */
  function etapaState(cid, eid) { return (S.etapas[cid] || {})[eid] || {}; }
  function setEtapa(cid, eid, patch) {
    S.etapas[cid] = S.etapas[cid] || {};
    S.etapas[cid][eid] = Object.assign({}, S.etapas[cid][eid], patch);
    save();
  }
  function prazos(inf) {
    if (!inf.sim || !inf.sim.data8000) return null;
    return D.etapas.map(function (e) {
      var st = etapaState(inf.c.id, e.id);
      var dl = addDays(inf.sim.data8000, -e.dias);
      var dd = diff(dl, today);
      var cls = st.done ? "done" : dd < 0 ? "bad" : dd <= 14 ? "warn" : "idle";
      return { e: e, st: st, dl: dl, dd: dd, cls: cls };
    });
  }
  function proxima(lista) { return lista.filter(function (x) { return !x.st.done; })[0] || null; }
  function dTxt(dd) {
    if (dd === 0) return "hoje";
    if (dd === 1) return "amanhã";
    if (dd === -1) return "venceu ontem";
    return dd < 0 ? "atrasada " + (-dd) + " dias" : "em " + dd + " dias";
  }

  /* ---------- render: resumo ---------- */
  var INF = [];
  function renderHoje() {
    var dias = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
    $("#hoje").textContent = dias[today.getDay()] + ", " + br(today);
  }

  function renderAlerta() {
    var itens = [];
    INF.forEach(function (inf) {
      var p = prazos(inf);
      if (!p) return;
      var n = proxima(p);
      if (n) itens.push({ tag: inf.c.tag, n: n });
    });
    var el = $("#alerta");
    var c4pend = D.c4.pendencias.filter(function (x) { return !c4St(x.id).done; });
    var c4Html = c4pend.length ? '<div class="alerta warn"><h3>CPS-14Q004 em stand-by</h3><ul><li><span>' + c4pend.length + ' pendências · mangueira de garantia prevista para ' + brs(parse(D.c4.previsao)) + '</span><span><a href="#c4">ver</a></span></li></ul></div>' : "";
    var venc = pecasVencidas();
    var pecasHtml = venc.length ? '<div class="alerta bad"><h3>Orçamentos de peças vencidos</h3><ul>' + venc.map(function (q) {
      var c = D.compressores.filter(function (x) { return x.id === q.cmp; })[0];
      return '<li><span><b>' + esc(c.tag) + '</b> · proposta ' + q.id + ' · ' + brl(q.itens.reduce(function (a, i) { return a + (i.garantia ? 0 : i.valor * i.qtd); }, 0)) + '</span><span>venceu há ' + (-diff(parse(q.validade), today)) + ' dias</span></li>';
    }).join("") + '</ul><p class="sw" style="margin-top:8px">Peçam revalidação ao fornecedor antes de aprovar. <a href="#pecas">Ver peças</a></p></div>' : "";
    if (!itens.length) {
      el.innerHTML = pecasHtml + c4Html + '<div class="alerta ok"><h3>Tudo em dia</h3><p>Nenhuma etapa pendente nos compressores em operação.</p></div>';
      return;
    }
    itens.sort(function (a, b) { return a.n.dl - b.n.dl; });
    var pior = itens[0].n.dd < 0 ? "bad" : itens[0].n.dd <= 14 ? "warn" : "";
    // junta compressores com a mesma etapa e prazo
    var grupos = {};
    itens.forEach(function (i) {
      var k = i.n.e.id + iso(i.n.dl);
      grupos[k] = grupos[k] || { n: i.n, tags: [] };
      grupos[k].tags.push(i.tag.replace("CPS-", ""));
    });
    var lis = Object.keys(grupos).map(function (k) { return grupos[k]; }).sort(function (a, b) { return a.n.dl - b.n.dl; }).slice(0, 4).map(function (g) {
      return '<li><span><b>' + esc(g.n.e.nome) + '</b> · ' + esc(g.tags.join(", ")) + '</span><span>até ' + brs(g.n.dl) + ' · ' + dTxt(g.n.dd) + '</span></li>';
    }).join("");
    var titulo = pior === "bad" ? "Prazo vencido" : pior === "warn" ? "Prazo chegando" : "Próximas ações";
    el.innerHTML = pecasHtml + c4Html + '<div class="alerta ' + pior + '"><h3>Revisão 8000 h · ' + titulo.toLowerCase() + '</h3><ul>' + lis + '</ul></div>';
  }

  function ring(pct, cor) {
    var r = 36, circ = 2 * Math.PI * r, v = Math.max(0, Math.min(1, pct)) * circ;
    return '<div class="ring" style="--cc:' + cor + '"><svg viewBox="0 0 84 84"><circle class="trk" cx="42" cy="42" r="' + r + '" fill="none" stroke-width="9"/><circle class="val" cx="42" cy="42" r="' + r + '" fill="none" stroke-width="9" stroke-linecap="round" stroke-dasharray="' + v.toFixed(1) + ' ' + circ.toFixed(1) + '"/></svg><b>' + Math.round(pct * 100) + '%</b></div>';
  }

  function renderCards() {
    var w = weekFor(today);
    $("#cards").innerHTML = INF.map(function (inf) {
      var c = inf.c, sim = inf.sim, cor = "var(--c" + (inf.idx + 1) + ")";
      if (c.novo) {
        var pend = D.c4.pendencias.filter(function (x) { return !((S.c4.itens || {})[x.id] || {}).done; }).length;
        return '<article class="card cmp" style="--cc:' + cor + '"><div class="cmp-top"><span class="badge"><i class="dot"></i><span class="tag">' + esc(c.tag) + '</span></span><span class="chip warn">STAND-BY</span></div>' +
          '<div class="hrs mono">' + (sim ? fmtN(sim.horasHoje) : '—') + ' <small>/ ' + fmtN(D.metaHoras) + ' h</small></div>' +
          '<p class="muted" style="margin:0">Novo, com start-up incompleto. Recomendado <b>não operar como principal</b> até trocar a mangueira de descarga (previsão de faturamento: ' + brs(parse(D.c4.previsao)) + ').</p>' +
          '<dl class="kv"><dt>Pendências</dt><dd>' + pend + ' de ' + D.c4.pendencias.length + '</dd><dt>Leitura do horímetro</dt><dd>' + (sim ? brs(parse(sim.leitura.data)) : 'não lançada') + '</dd></dl>' +
          '<a class="btn ghost" href="#c4">Ver pendências do C4</a></article>';
      }
      var h = sim.horasHoje, pct = h / D.metaHoras, falta = Math.max(0, D.metaHoras - h);
      var ligado = c.novo ? true : (w ? w.on.indexOf(c.id) >= 0 : true);
      var d = sim.data8000, dd = d ? diff(d, today) : null;
      var p = prazos(inf), prox = p ? proxima(p) : null;
      var st = ligado ? '<span class="chip on">LIGADO</span>' : '<span class="chip off">DESCANSANDO</span>';
      return '<article class="card cmp" style="--cc:' + cor + '">' +
        '<div class="cmp-top"><span class="badge"><i class="dot"></i><span class="tag">' + esc(c.tag) + '</span></span>' + st + '</div>' +
        '<div class="gauge">' + ring(pct, cor) +
        '<div><div class="hrs mono">' + fmtN(h) + ' <small>/ ' + fmtN(D.metaHoras) + ' h</small></div>' +
        '<div class="est">' + (sim.estimado ? 'estimado hoje · leitura de ' + brs(parse(sim.leitura.data)) + ': ' + fmtN(sim.leitura.horas) + ' h' : 'leitura de hoje') + '</div></div></div>' +
        '<dl class="kv"><dt>Faltam</dt><dd class="mono">' + fmtN(falta) + ' h</dd>' +
        '<dt>8000 h previsto</dt><dd>' + (d ? br(d) : '—') + '</dd>' +
        '<dt>Dias até a revisão</dt><dd>' + (dd == null ? '—' : dd + ' dias') + '</dd>' +
        '<dt>Próxima ação</dt><dd>' + (prox ? esc(prox.e.nome.split(" ")[0] + " " + (prox.e.nome.split(" ")[1] || "")) + ' · ' + brs(prox.dl) : 'Concluído') + '</dd></dl>' +
        '</article>';
    }).join("");
  }

  function renderSemana() {
    var w = weekFor(today), el = $("#semana");
    if (!w) { el.innerHTML = ""; return; }
    var base = D.compressores.filter(function (c) { return !c.novo; });
    var pills = base.map(function (c) {
      var on = w.on.indexOf(c.id) >= 0;
      return '<span class="chip ' + (on ? "on" : "off") + '">' + esc(c.tag.replace("CPS-", "")) + ' · ' + (on ? "LIGADO" : "DESCANSA") + '</span>';
    }).join("");
    var prox = D.rodizio.filter(function (x) { return parse(x.ini) > today && JSON.stringify(x.on) !== JSON.stringify(w.on); })[0];
    el.innerHTML = '<div class="card"><div><div class="sw">Rodízio · semana ' + w.n + ' de ' + D.rodizio.length + ' (' + brs(parse(w.ini)) + ' a ' + brs(parse(w.fim)) + ')</div><div style="font-weight:600;margin-top:2px">' + esc(w.obs) + '</div></div><div class="pills">' + pills + '</div>' +
      (prox ? '<div class="sw" style="flex-basis:100%">Próxima troca de configuração: ' + br(parse(prox.ini)) + ' (semana ' + prox.n + ')</div>' : '') + '</div>';
  }

  /* ---------- render: fluxo ---------- */
  var tabSel = null;
  var CAMPO = { orc: ["Empresa / contato", "text"], rec: ["Valor do orçamento (R$)", "text"], apr: ["Aprovado por", "text"], ped: ["Nº do pedido de compras", "text"], agd: ["Data confirmada", "date"], exe: ["Serviço realizado em", "date"], enc: ["Nº do laudo", "text"] };

  function renderTabs() {
    if (!tabSel) tabSel = INF[0].c.id;
    $("#tabs").innerHTML = INF.map(function (inf) {
      return '<button class="tab" role="tab" data-tab="' + inf.c.id + '" aria-selected="' + (inf.c.id === tabSel) + '"><i class="dot" style="--cc:var(--c' + (inf.idx + 1) + ')"></i>' + esc(inf.c.tag) + '</button>';
    }).join("");
  }
  function renderEtapas() {
    var inf = INF.filter(function (i) { return i.c.id === tabSel; })[0];
    var p = prazos(inf), el = $("#etapas");
    if (!p) {
      el.innerHTML = '<div class="card waiting"><b>' + esc(inf.c.tag) + ' ainda não tem projeção de 8000 h.</b><p class="muted">Está em stand-by, aguardando a mangueira de garantia. Quando for liberado, lance a leitura do horímetro e as horas por dia na seção do compressor 04, e o plano de prazos aparece aqui.</p><div class="btns"><a class="btn ghost" href="#c4">Ver pendências do C4</a></div></div>';
      return;
    }
    var prox = proxima(p);
    el.innerHTML = '<div class="steps">' + p.map(function (x) {
      var isNext = prox && prox.e.id === x.e.id && x.cls !== "bad" && x.cls !== "warn";
      var cls = isNext ? "next" : x.cls;
      var c = CAMPO[x.e.id], v = x.st.campo || "";
      var chip = x.st.done ? '<span class="chip on">FEITO ' + (x.st.date ? brs(parse(x.st.date)) : "") + '</span>' :
        x.cls === "bad" ? '<span class="chip bad">' + dTxt(x.dd).toUpperCase() + '</span>' :
        x.cls === "warn" ? '<span class="chip warn">' + dTxt(x.dd).toUpperCase() + '</span>' :
        '<span class="chip off">' + dTxt(x.dd) + '</span>';
      return '<div class="step ' + cls + '"><button class="chk" data-chk="' + x.e.id + '" aria-label="Marcar ' + esc(x.e.nome) + ' como feito" aria-pressed="' + !!x.st.done + '">✓</button>' +
        '<div><h4>' + esc(x.e.nome) + '</h4><div class="meta"><b>Prazo: ' + br(x.dl) + '</b> ' + chip + ' <span>' + esc(x.e.resp) + '</span></div>' +
        '<div class="dica">' + esc(x.e.dica) + '</div>' +
        '<div class="fields"><label>' + c[0] + '<input type="' + c[1] + '" data-campo="' + x.e.id + '" value="' + esc(v) + '"></label><label>Observação<input type="text" data-nota="' + x.e.id + '" value="' + esc(x.st.nota || "") + '" placeholder="opcional"></label></div></div></div>';
    }).join("") + '</div>';
  }

  /* ---------- peças pendentes ---------- */
  var brl = function (n) { return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); };
  function pecaSt(id, eid) { return ((S.pecas[id] || {})[eid]) || {}; }
  function setPeca(id, eid, patch) { S.pecas[id] = S.pecas[id] || {}; S.pecas[id][eid] = Object.assign({}, S.pecas[id][eid], patch); save(); }
  function pecasVencidas() {
    return D.pecas.filter(function (q) { return parse(q.validade) < today && !pecaSt(q.id, "ped").done && !pecaSt(q.id, "rev").done; });
  }
  function renderPecas() {
    var pagar = function (q) { return q.itens.reduce(function (a, i) { return a + (i.garantia ? 0 : i.valor * i.qtd); }, 0); };
    var tot = D.pecas.reduce(function (a, q) { return a + pagar(q); }, 0);
    var f = D.fornecedor;
    var topo = '<div class="card pecas-top"><div><div class="sw">A pagar nos 3 orçamentos (sem o item em garantia)</div><div class="hrs mono">' + brl(tot) + '</div></div>' +
      '<div class="sw">' + esc(f.nome) + '<br>Vendedor: ' + esc(f.vendedor) + '</div></div>';
    var cards = D.pecas.map(function (q) {
      var c = D.compressores.filter(function (x) { return x.id === q.cmp; })[0];
      var dv = diff(parse(q.validade), today);
      var vcls = pecaSt(q.id, "rev").done ? "on" : dv < 0 ? "bad" : dv <= 7 ? "warn" : "on";
      var vtxt = pecaSt(q.id, "rev").done ? "REVALIDADA" : dv < 0 ? "PROPOSTA VENCIDA HÁ " + (-dv) + " DIAS" : "VÁLIDA ATÉ " + brs(parse(q.validade));
      var itens = q.itens.map(function (i) {
        if (i.garantia) return '<div class="item gar"><span>' + esc(i.desc) + ' <small>cód. ' + esc(i.cod) + ' · ' + esc(i.nota) + '</small></span><span class="mono"><s>' + brl(i.valor * i.qtd) + '</s> <small>garantia</small></span></div>';
        return '<div class="item"><span>' + esc(i.desc) + ' <small>cód. ' + esc(i.cod) + ' · P/N ' + esc(i.pn) + '</small></span><span class="mono">' + brl(i.valor * i.qtd) + (i.entrega ? ' <small>· ' + i.entrega + ' dias</small>' : '') + '</span></div>';
      }).join("");
      var passos = D.etapasPeca.map(function (e) {
        var st = pecaSt(q.id, e.id);
        var extra = e.id === "ped" ? '<input type="text" placeholder="Nº do pedido" data-pcampo="' + q.id + ':ped" value="' + esc(st.campo || "") + '">' : "";
        return '<div class="pstep' + (st.done ? " done" : "") + '"><button class="chk" data-pchk="' + q.id + ':' + e.id + '" aria-pressed="' + !!st.done + '" aria-label="' + esc(e.nome) + '">✓</button><span>' + esc(e.nome) + (st.done && st.date ? ' <small>· ' + brs(parse(st.date)) + '</small>' : '') + '</span>' + extra + '</div>';
      }).join("");
      var fim = pecaSt(q.id, "ins").done;
      return '<article class="card"><div class="cmp-top"><span class="badge"><i class="dot" style="--cc:var(--c' + (D.compressores.indexOf(c) + 1) + ')"></i><span class="tag">' + esc(c.tag) + '</span></span>' +
        '<span class="chip ' + (fim ? "on" : vcls) + '">' + (fim ? "CONCLUÍDO" : vtxt) + '</span></div>' +
        '<div class="sw" style="margin:8px 0 4px">Proposta ' + q.id + ' · ' + esc(q.modelo) + ' · emitida em ' + br(parse(q.emissao)) + ', validade ' + br(parse(q.validade)) + '</div>' +
        '<div class="itens">' + itens + '<div class="item tot"><span>' + (pagar(q) !== q.total ? 'A pagar' : 'Total') + '</span><span class="mono">' + brl(pagar(q)) + '</span></div></div>' +
        (q.tecnico ? '<p class="muted" style="margin:0 0 10px">' + esc(q.tecnico) + '</p>' : '') +
        '<div class="psteps">' + passos + '</div></article>';
    }).join("");
    var rep = '<div class="note"><b>Atenção:</b> o técnico apontou em 14/08 filtro de ar saturado nos três compressores (no C3, recomendou não operar até a troca). As propostas estão vencidas e não há registro de aprovação. O dreno do C3 já foi trocado pela garantia em 21/09. Se for pedir tudo junto, vale negociar condição na revalidação.</div>';
    $("#pecasBox").innerHTML = topo + '<div class="cards pecas">' + cards + '</div>' + rep;
  }

  /* ---------- compressor 04 ---------- */
  function c4St(id) { return ((S.c4.itens || {})[id]) || {}; }
  function renderC4() {
    var c4 = D.c4;
    var lista = c4.pendencias.map(function (p) {
      var st = c4St(p.id);
      return '<div class="pstep' + (st.done ? " done" : "") + '"><button class="chk" data-c4chk="' + p.id + '" aria-pressed="' + !!st.done + '" aria-label="' + esc(p.nome) + '">✓</button><span><b>' + esc(p.nome) + '</b>' + (st.done && st.date ? ' <small>· feito ' + brs(parse(st.date)) + '</small>' : '') + '<small style="display:block;color:var(--muted)">' + esc(p.nota) + '</small></span></div>';
    }).join("");
    var hist = c4.historico.slice().reverse().map(function (h) {
      return '<div class="tl"><b>' + brs(parse(h.d)) + '</b><span>' + esc(h.t) + '</span></div>';
    }).join("");
    var dias = diff(parse(c4.previsao), today);
    var prev = dias >= 0 ? 'faltam ' + dias + ' dias' : 'passou há ' + (-dias) + ' dias, confirmar com o fornecedor';
    $("#c4Box").innerHTML = '<div class="grid2"><div class="card"><div class="cmp-top"><h3 style="margin:0">' + esc(D.compressores[3].tag) + '</h3><span class="chip warn">' + esc(c4.status.toUpperCase()) + '</span></div>' +
      '<p class="muted" style="margin-top:10px">' + esc(c4.resumo) + '</p>' +
      '<div class="note" style="margin:0 0 12px"><b>Mangueira original:</b> faturamento previsto em ' + br(parse(c4.previsao)) + ' (' + prev + ').</div>' +
      '<h3>Pendências para liberar</h3><div class="psteps">' + lista + '</div>' +
      '<label style="margin-top:14px">Horas por dia previstas (para projeção, depois de liberado)<input type="number" min="0" max="24" inputmode="numeric" value="' + (S.c4.horasDia || 0) + '" data-c4h></label>' +
      '<p class="muted" style="margin-top:6px">Lance a leitura do horímetro em Ferramentas. Sem leitura e sem horas/dia, não há projeção de 8000 h.</p></div>' +
      '<div class="card"><h3>Linha do tempo</h3><div class="tls">' + hist + '</div></div></div>';
  }

  /* ---------- gráfico ---------- */
  function renderChart() {
    var W = 760, H = 330, m = { t: 22, r: 16, b: 34, l: 48 };
    var x0 = parse("2026-10-14"), x1 = parse("2027-03-15"), y0 = 5000, y1 = 8400;
    var X = function (d) { return m.l + (d - x0) / (x1 - x0) * (W - m.l - m.r); };
    var Y = function (h) { return m.t + (1 - (Math.min(h, y1) - y0) / (y1 - y0)) * (H - m.t - m.b); };
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Projeção das horas dos compressores até 8000 h">';
    for (var y = y0; y <= y1; y += 500) {
      s += '<line x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + Y(y) + '" y2="' + Y(y) + '" stroke="var(--line)"/><text x="' + (m.l - 8) + '" y="' + (Y(y) + 4) + '" text-anchor="end">' + y + '</text>';
    }
    for (var t = new Date(x0.getFullYear(), x0.getMonth() + 1, 1); t < x1; t = new Date(t.getFullYear(), t.getMonth() + 1, 1)) {
      s += '<line x1="' + X(t) + '" x2="' + X(t) + '" y1="' + m.t + '" y2="' + (H - m.b) + '" stroke="var(--line)" stroke-dasharray="2 4"/><text x="' + X(t) + '" y="' + (H - 12) + '" text-anchor="middle">' + brs(t) + '</text>';
    }
    s += '<line x1="' + m.l + '" x2="' + (W - m.r) + '" y1="' + Y(D.metaHoras) + '" y2="' + Y(D.metaHoras) + '" stroke="var(--bad)" stroke-width="1.5" stroke-dasharray="6 4"/><text x="' + (m.l + 4) + '" y="' + (Y(D.metaHoras) - 6) + '" style="fill:var(--bad);font-weight:700">Revisão 8000 h</text>';
    s += '<line x1="' + X(today) + '" x2="' + X(today) + '" y1="' + m.t + '" y2="' + (H - m.b) + '" stroke="var(--brand)" stroke-width="1.5"/><text x="' + X(today) + '" y="' + (m.t - 6) + '" text-anchor="middle" style="fill:var(--brand);font-weight:700">hoje</text>';
    INF.forEach(function (inf) {
      if (!inf.sim) return;
      var cor = "var(--c" + (inf.idx + 1) + ")", L = inf.sim.leitura;
      var hist = leituras(inf.c).map(function (r) { return X(parse(r.data)).toFixed(1) + "," + Y(r.horas).toFixed(1); }).join(" ");
      var proj = inf.sim.curva.filter(function (_, i) { return i % 2 === 0; }).map(function (p) { return X(p.d).toFixed(1) + "," + Y(p.h).toFixed(1); }).join(" ");
      s += '<polyline points="' + proj + '" fill="none" stroke="' + cor + '" stroke-width="2" stroke-dasharray="5 4" opacity=".85"/>';
      if (hist) s += '<polyline points="' + hist + '" fill="none" stroke="' + cor + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>';
      leituras(inf.c).forEach(function (r) { s += '<circle cx="' + X(parse(r.data)) + '" cy="' + Y(r.horas) + '" r="3.5" fill="' + cor + '"/>'; });
      if (inf.sim.data8000) s += '<circle cx="' + X(inf.sim.data8000) + '" cy="' + Y(D.metaHoras) + '" r="5" fill="var(--card)" stroke="' + cor + '" stroke-width="2.5"/>';
    });
    $("#chart").innerHTML = s + "</svg>";
    $("#legenda").innerHTML = INF.filter(function (i) { return i.sim; }).map(function (i) {
      return '<span><i class="dot" style="--cc:var(--c' + (i.idx + 1) + ')"></i>' + esc(i.c.tag) + (i.sim.data8000 ? ' · ' + br(i.sim.data8000) : '') + '</span>';
    }).join("");
    var ativos = INF.filter(function (i) { return i.sim && !i.c.novo && i.sim.data8000; });
    var datas = ativos.map(function (i) { return diff(i.sim.data8000, ativos[0].sim.data8000); });
    var span = Math.max.apply(null, datas) - Math.min.apply(null, datas);
    var ord = ativos.slice().sort(function (a, b) { return a.sim.data8000 - b.sim.data8000; });
    var txt = span <= 7
      ? 'o rodízio leva os três compressores às 8000 h na mesma semana (diferença de ' + span + ' dia' + (span === 1 ? '' : 's') + ').'
      : 'com o rodízio escrito, os três chegam às 8000 h em datas diferentes (' + span + ' dias de diferença; ' + ord[0].c.tag + ' primeiro, em ' + br(ord[0].sim.data8000) + '). O plano de equalização precisa de ajuste, ou as revisões saem escalonadas.';
    $("#dica").innerHTML = '<b>Atenção:</b> ' + txt + ' Revisão dos três quase juntos deixa o sistema sem reserva. Com o CPS-14Q004 em operação, vale <b>escalonar as revisões</b> e manter sempre uma máquina de reserva. Posso reajustar o rodízio quando o C4 for startado.';
  }

  /* ---------- rodízio ---------- */
  var mostrarPassadas = false;
  function renderRod() {
    var base = D.compressores.filter(function (c) { return !c.novo; });
    $("#rod").innerHTML = D.rodizio.map(function (w) {
      var past = parse(w.fim) < today, now = today >= parse(w.ini) && today <= parse(w.fim);
      var pills = base.map(function (c) {
        var on = w.on.indexOf(c.id) >= 0;
        return '<span class="chip ' + (on ? "on" : "off") + '">' + esc(c.tag.slice(-4)) + (on ? " ON" : " OFF") + '</span>';
      }).join("");
      return '<div class="wk ' + (past ? "past " : "") + (now ? "now " : "") + (past && !mostrarPassadas ? "hide" : "") + '"><div class="n">' + w.n + '</div><div class="per">' + brs(parse(w.ini)) + ' → ' + brs(parse(w.fim)) + (now ? ' · esta semana' : '') + '</div><div class="pills">' + pills + '</div><div class="obs">' + esc(w.obs) + '</div></div>';
    }).join("");
    $("#btnPassadas").textContent = mostrarPassadas ? "Ocultar semanas passadas" : "Mostrar semanas passadas";
  }

  /* ---------- ferramentas ---------- */
  function renderForm() {
    $("#lCmp").innerHTML = D.compressores.map(function (c) { return '<option value="' + c.id + '">' + esc(c.tag) + '</option>'; }).join("");
    if (!$("#lData").value) $("#lData").value = iso(today);
    renderLista();
  }
  function renderLista() {
    var out = [];
    Object.keys(S.leituras).forEach(function (id) {
      var c = D.compressores.filter(function (x) { return x.id === id; })[0];
      (S.leituras[id] || []).forEach(function (r, i) { out.push({ id: id, tag: c ? c.tag : id, r: r, i: i }); });
    });
    out.sort(function (a, b) { return a.r.data < b.r.data ? 1 : -1; });
    $("#listaLeituras").innerHTML = out.length ? '<div class="lst">' + out.slice(0, 8).map(function (o) {
      return '<div><span>' + esc(o.tag.replace("CPS-", "")) + ' · ' + br(parse(o.r.data)) + ' · <b>' + fmtN(o.r.horas) + ' h</b></span><button data-del="' + o.id + ':' + o.i + '" aria-label="Remover leitura">remover</button></div>';
    }).join("") + '</div>' : '';
  }
  function textoOrcamento() {
    var ativos = INF.filter(function (i) { return i.sim && i.sim.data8000; });
    var linhas = ativos.map(function (i) {
      return '• ' + i.c.tag + ' — ' + fmtN(i.sim.horasHoje) + ' h' + (i.sim.estimado ? ' (est. hoje)' : '') + ' — 8000 h previstas em ' + br(i.sim.data8000);
    }).join("\n");
    var primeira = ativos.length ? ativos.map(function (i) { return i.sim.data8000; }).sort(function (a, b) { return a - b; })[0] : null;
    var prazoResp = primeira ? br(addDays(primeira, -60)) : "—";
    return "Prezados, bom dia.\n\nSolicitamos orçamento para a REVISÃO PREVENTIVA DE 8000 HORAS dos compressores da Casa de Força:\n\n" + linhas +
      (INF.some(function (i) { return i.c.novo && !(i.sim && i.sim.data8000); }) ? "\n• CPS-14Q004 — equipamento novo em stand-by (aguardando peças de garantia); incluir no plano após liberação\n" : "\n") +
      "\nPor favor informar: escopo detalhado, peças e consumíveis, mão de obra, prazo de mobilização, validade da proposta e condições de pagamento.\n\nResposta até " + prazoResp + ".\n\nObrigado.";
  }
  function renderMsg() {
    var t = textoOrcamento();
    $("#msg").value = t;
    $("#btnZap").href = "https://wa.me/?text=" + encodeURIComponent(t);
  }
  function ics() {
    var L = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Compressores Casa de Forca//PT", "CALSCALE:GREGORIAN"];
    INF.forEach(function (inf) {
      var p = prazos(inf);
      if (!p) return;
      p.forEach(function (x) {
        if (x.st.done) return;
        var d = x.dl, e = addDays(d, 1), f = function (z) { return iso(z).replace(/-/g, ""); };
        L.push("BEGIN:VEVENT", "UID:" + inf.c.id + "-" + x.e.id + "@compressores-cf", "DTSTAMP:" + f(today) + "T000000Z",
          "DTSTART;VALUE=DATE:" + f(d), "DTEND;VALUE=DATE:" + f(e),
          "SUMMARY:[" + inf.c.tag + "] " + x.e.nome, "DESCRIPTION:" + x.e.dica.replace(/[,;]/g, " ") + " Responsável: " + x.e.resp,
          "BEGIN:VALARM", "ACTION:DISPLAY", "DESCRIPTION:Prazo em 3 dias", "TRIGGER:-P3D", "END:VALARM", "END:VEVENT");
      });
    });
    L.push("END:VCALENDAR");
    return L.join("\r\n");
  }
  function baixar(nome, texto, tipo) {
    var a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([texto], { type: tipo }));
    a.download = nome; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  /* ---------- eventos ---------- */
  function renderAll() {
    INF = info();
    renderHoje(); renderAlerta(); renderCards(); renderSemana(); renderPecas(); renderC4();
    renderTabs(); renderEtapas(); renderChart(); renderRod(); renderForm(); renderMsg();
  }

  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-tab],[data-chk],[data-del],[data-pchk],[data-c4chk]");
    if (!t) return;
    if (t.dataset.c4chk) {
      S.c4.itens = S.c4.itens || {};
      var cur4 = S.c4.itens[t.dataset.c4chk] || {};
      S.c4.itens[t.dataset.c4chk] = { done: !cur4.done, date: !cur4.done ? iso(today) : null }; save();
      renderC4(); renderAlerta(); renderCards();
    } else if (t.dataset.pchk) {
      var pp = t.dataset.pchk.split(":"), pc = pecaSt(pp[0], pp[1]);
      setPeca(pp[0], pp[1], { done: !pc.done, date: !pc.done ? iso(today) : null });
      renderPecas(); renderAlerta();
    } else if (t.dataset.tab) { tabSel = t.dataset.tab; renderTabs(); renderEtapas(); }
    else if (t.dataset.chk) {
      var cur = etapaState(tabSel, t.dataset.chk);
      setEtapa(tabSel, t.dataset.chk, { done: !cur.done, date: !cur.done ? iso(today) : null });
      renderAlerta(); renderEtapas(); renderMsg();
    } else if (t.dataset.del) {
      var p = t.dataset.del.split(":");
      (S.leituras[p[0]] || []).splice(+p[1], 1); save(); renderAll();
    }
  });
  document.addEventListener("change", function (e) {
    var t = e.target;
    if (t.dataset.pcampo) { var q = t.dataset.pcampo.split(":"); setPeca(q[0], q[1], { campo: t.value }); }
    else if (t.dataset.campo) setEtapa(tabSel, t.dataset.campo, { campo: t.value });
    else if (t.dataset.nota) setEtapa(tabSel, t.dataset.nota, { nota: t.value });
    else if (t.dataset.c4h !== undefined) { S.c4.horasDia = Math.max(0, Math.min(24, +t.value || 0)); save(); renderAll(); }
  });
  document.addEventListener("submit", function (e) {
    if (e.target.matches("[data-start]")) {
      e.preventDefault();
      S.c4.start = e.target.querySelector("input").value; save(); renderAll();
    }
  });
  $("#formLeitura").addEventListener("submit", function (e) {
    e.preventDefault();
    var id = $("#lCmp").value, data = $("#lData").value, h = +$("#lHoras").value, msg = $("#lMsg");
    var c = D.compressores.filter(function (x) { return x.id === id; })[0];
    var ant = leituras(c).filter(function (r) { return r.data <= data; }).pop();
    if (ant && h < ant.horas) { msg.className = "msg err"; msg.textContent = "Leitura menor que a anterior (" + fmtN(ant.horas) + " h em " + br(parse(ant.data)) + "). Confira o valor."; return; }
    var r = { data: data, horas: h };
    if ($("#lCarga").value) r.carga = +$("#lCarga").value;
    if ($("#lPart").value) r.partidas = +$("#lPart").value;
    (S.leituras[id] = S.leituras[id] || []).push(r); save();
    $("#lHoras").value = $("#lCarga").value = $("#lPart").value = "";
    renderAll();
    $("#lMsg").className = "msg okm"; $("#lMsg").textContent = "Leitura salva. Projeção atualizada.";
  });
  $("#btnPassadas").addEventListener("click", function () { mostrarPassadas = !mostrarPassadas; renderRod(); });
  $("#btnCopiar").addEventListener("click", function () {
    var b = $("#btnCopiar"), t = $("#msg").value;
    var ok = function () { b.textContent = "Copiado ✓"; setTimeout(function () { b.textContent = "Copiar texto"; }, 1800); };
    if (navigator.clipboard) navigator.clipboard.writeText(t).then(ok, function () { $("#msg").select(); document.execCommand("copy"); ok(); });
    else { $("#msg").select(); document.execCommand("copy"); ok(); }
  });
  $("#btnIcs").addEventListener("click", function () { baixar("manutencao-compressores.ics", ics(), "text/calendar"); });
  $("#btnExp").addEventListener("click", function () { baixar("backup-compressores-" + iso(today) + ".json", JSON.stringify(S, null, 2), "application/json"); });
  $("#fileImp").addEventListener("change", function (e) {
    var f = e.target.files[0]; if (!f) return;
    var r = new FileReader();
    r.onload = function () {
      try { var o = JSON.parse(r.result); if (typeof o !== "object" || !o) throw 0; S = Object.assign(blank(), o); save(); renderAll(); alert("Backup importado."); }
      catch (x) { alert("Arquivo inválido."); }
    };
    r.readAsText(f);
  });

  renderAll();
})();
