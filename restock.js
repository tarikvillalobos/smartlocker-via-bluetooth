(() => {
  const plan = [
    { slot: 'A1', product: 'Amaciante 500 ml', price: 8.90 },
    { slot: 'A3', product: 'Amaciante 500 ml', price: 8.90 },
    { slot: 'A4', product: 'Amaciante 500 ml', price: 8.90 },
    { slot: 'B4', product: 'Sabão líquido 500 ml', price: 9.90 },
    { slot: 'C2', product: 'Sabonete 90 g', price: 3.50 },
    { slot: 'D1', product: 'Sabão em pó 400 g', price: 7.90 },
    { slot: 'D2', product: 'Sabão em pó 400 g', price: 7.90 },
    { slot: 'D3', product: 'Sabão em pó 400 g', price: 7.90 },
    { slot: 'E2', product: 'Alvejante 500 ml', price: 6.90 }
  ];
  const state = { done: new Map(), problems: new Set(), current: 'A1', selected: 'Amaciante 500 ml' };
  const options = [...new Set(plan.map(item => item.product))];
  const money = value => value.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
  const remaining = () => plan.filter(item => !state.done.has(item.slot) && !state.problems.has(item.slot));
  const link = page => `#/abastecimento/${page}`;
  const action = (label,page,extra='') => `<a class="button ${extra}" href="${link(page)}">${label}</a>`;
  const screen = content => `<div class="phone operator"><div class="phone__top"><span>Cubo Operador</span><span class="signal">● Demo</span></div><div class="phone__content">${content}</div><div class="phone__bottom"><span>Armário 02 · Ed. Aurora</span><span>Abastecimento</span></div></div>`;

  function render(root,page) {
    let content = '';
    if (page === 'inicio') content = `<p class="overline">OLÁ, TARIK</p><h2>Pronto para abastecer?</h2><p class="muted">Logado pela plataforma como proprietário.</p><div class="operator-hero"><div class="operator-hero__icon">▦</div><span>PERTO DE VOCÊ · APROX. 2 M</span><h3>Armário 02</h3><p>Lavanderia Edifício Aurora</p><strong>${remaining().length} <small>de 9 pendentes</small></strong></div><p class="notice">A conexão Bluetooth e a abertura dos compartimentos são simuladas nesta demonstração.</p>${action('Simular conexão e abastecer →','compartimentos')}<div class="operator-other"><strong>Outros armários com reposição</strong><p>Armário 01 · Condomínio Jardins <span>4 vazios</span></p><p>Armário 03 · Studio Central <span>2 vazios</span></p></div>`;
    else if (page === 'compartimentos') content = `<a class="inline-back" href="${link('inicio')}">← Início</a><p class="overline">CONECTADO · ARMÁRIO 02</p><h2>Compartimentos</h2><p class="muted">Toque num compartimento pendente para simular a abertura.</p><div class="progress-head"><strong>${state.done.size} de 9 repostos</strong><span>${remaining().length} restantes</span></div><div class="progress-bar"><span style="width:${state.done.size/9*100}%"></span></div><div class="operator-grid">${plan.map(item => `<button class="operator-slot ${state.done.has(item.slot) ? 'operator-slot--done' : state.problems.has(item.slot) ? 'operator-slot--problem' : ''}" data-open="${item.slot}" ${state.done.has(item.slot) || state.problems.has(item.slot) ? 'disabled' : ''}><strong>${item.slot}</strong><small>${state.done.has(item.slot) ? 'Reposto' : state.problems.has(item.slot) ? 'Problema' : 'Vazio'}</small></button>`).join('')}</div>${remaining().length ? `<button class="button" id="next-slot">Abrir próximo: ${remaining()[0].slot} →</button>` : action('Finalizar abastecimento →','concluido')}<p class="operator-hint">${state.problems.size ? `${state.problems.size} problema(s) registrado(s). ` : ''}Itens repostos e ocorrências aparecem no resumo.</p>`;
    else if (page === 'aberto') {
      const item = plan.find(entry => entry.slot === state.current && !state.done.has(entry.slot) && !state.problems.has(entry.slot)) || remaining()[0];
      if (!item) { location.hash = link('concluido'); return; }
      state.current = item.slot;
      if (!options.includes(state.selected)) state.selected = item.product;
      content = `<a class="inline-back" href="${link('compartimentos')}">← Compartimentos</a><div class="open-slot-graphic"><span>${item.slot}</span><strong>ABERTO</strong></div><h2>Compartimento ${item.slot} aberto</h2><p class="muted">Coloque 1 unidade e feche a portinha.</p><div class="info-card restock-item"><span>Colocar 1×</span><select id="restock-product" aria-label="Produto para o compartimento">${options.map(product => `<option ${state.selected === product ? 'selected' : ''}>${product}</option>`).join('')}</select></div><button class="button" id="confirm-restock">Item colocado ✓</button><button class="operator-text-button" id="report-problem">Relatar problema neste compartimento</button>`;
    }
    else if (page === 'concluido') {
      if (remaining().length) { location.hash = link('compartimentos'); return; }
      const grouped = new Map();
      for (const [slot,product] of state.done) { const list = grouped.get(product) || []; list.push(slot); grouped.set(product,list); }
      content = `<div class="success-icon">✓</div><h2>Armário 02 abastecido</h2><p class="muted">Visita concluída nesta demonstração.</p><div class="summary-metrics"><div><strong>${state.done.size}</strong><span>itens repostos</span></div><div><strong>${state.problems.size}</strong><span>ocorrências</span></div></div><div class="receipt">${[...grouped].map(([product,slots]) => `<div><span>${slots.length}× ${product}</span><b>${slots.join(', ')}</b></div>`).join('')}</div>${state.problems.size ? `<p class="notice">Problemas registrados: ${[...state.problems].join(', ')}. A gestão poderá acompanhar a ocorrência.</p>` : '<p class="notice">Estoque atualizado na demonstração.</p>'}<button class="button" id="restart-restock">Iniciar nova visita</button><a class="operator-text-link" href="#/gestao/abastecimento">Ver na plataforma de gestão →</a>`;
    }
    else { location.hash = link('inicio'); return; }
    root.innerHTML = screen(content);
    root.querySelectorAll('[data-open]').forEach(button => button.addEventListener('click', () => { const item = plan.find(entry => entry.slot === button.dataset.open); state.current = item.slot; state.selected = item.product; location.hash = link('aberto'); }));
    root.querySelector('#next-slot')?.addEventListener('click', () => { const item = remaining()[0]; state.current = item.slot; state.selected = item.product; location.hash = link('aberto'); });
    root.querySelector('#restock-product')?.addEventListener('change', event => { state.selected = event.target.value; });
    root.querySelector('#confirm-restock')?.addEventListener('click', () => { state.done.set(state.current,state.selected); location.hash = link('compartimentos'); });
    root.querySelector('#report-problem')?.addEventListener('click', () => { state.problems.add(state.current); location.hash = link('compartimentos'); });
    root.querySelector('#restart-restock')?.addEventListener('click', () => { state.done.clear(); state.problems.clear(); state.current = 'A1'; state.selected = 'Amaciante 500 ml'; location.hash = link('inicio'); });
  }

  window.Demo.restock = { remaining: () => remaining().map(item => item.slot), completed: () => state.done.size };
  window.Demo.register('abastecimento',render);
})();
