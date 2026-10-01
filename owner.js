(() => {
  const stores = [
    { name: 'Edifício Aurora', location: 'Lavanderia · São Paulo', lockers: 2, status: 'Ativo', sales: 176.40 },
    { name: 'Condomínio Jardins', location: 'Térreo · São Paulo', lockers: 1, status: 'Ativo', sales: 98.90 },
    { name: 'Residencial Horizonte', location: 'Hall · São Paulo', lockers: 1, status: 'Atenção', sales: 82.30 },
    { name: 'Studio Central', location: 'Recepção · São Paulo', lockers: 1, status: 'Ativo', sales: 55.00 }
  ];
  const catalog = [
    { name: 'Amaciante 500 ml', category: 'Lavanderia', price: 8.90, stock: 4 },
    { name: 'Sabão líquido 500 ml', category: 'Lavanderia', price: 9.90, stock: 3 },
    { name: 'Sabonete 90 g', category: 'Higiene', price: 3.50, stock: 6 },
    { name: 'Sabão em pó 400 g', category: 'Lavanderia', price: 7.90, stock: 2 },
    { name: 'Alvejante 500 ml', category: 'Limpeza', price: 6.90, stock: 2 },
    { name: 'Limpador multiuso', category: 'Limpeza', price: 5.90, stock: 0 },
    { name: 'Detergente 500 ml', category: 'Limpeza', price: 4.90, stock: 5 }
  ];
  const sales = [
    { id: '#A-1042', store: 'Edifício Aurora', time: 'Hoje, 14:32', items: 4, total: 25.80, status: 'Pago' },
    { id: '#A-1041', store: 'Condomínio Jardins', time: 'Hoje, 13:18', items: 2, total: 13.40, status: 'Pago' },
    { id: '#A-1040', store: 'Edifício Aurora', time: 'Hoje, 11:05', items: 3, total: 24.70, status: 'Pago' },
    { id: '#A-1039', store: 'Residencial Horizonte', time: 'Hoje, 09:12', items: 1, total: 9.90, status: 'Estornado' }
  ];
  const people = [
    { name: 'Tarik Villalobos', email: 'tarik@cubo.demo', role: 'Proprietário', status: 'Ativo' },
    { name: 'Marina Costa', email: 'marina@cubo.demo', role: 'Gerente', status: 'Ativo' },
    { name: 'Lucas Pereira', email: 'lucas@cubo.demo', role: 'Abastecedor', status: 'Ativo' },
    { name: 'Ana Martins', email: 'ana@cubo.demo', role: 'Abastecedor', status: 'Ativo' }
  ];
  const nav = [ ['inicio','Visão geral'], ['lojas','Lojas e armários'], ['produtos','Produtos e preços'], ['abastecimento','Abastecimento'], ['vendas','Vendas'], ['usuarios','Usuários'], ['configuracoes','Configurações'] ];
  const state = { search: '', category: 'Todos', userTab: 'usuarios', saved: false, company: 'Cubo', alerts: true };
  const money = amount => amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const badge = value => `<span class="badge ${value === 'Atenção' || value === 'Estornado' || value === 'Vazio' ? 'badge--warn' : ''}">${value}</span>`;
  const metric = (label, value, foot) => `<div class="metric"><span>${label}</span><strong>${value}</strong><small>${foot}</small></div>`;
  const panel = (title, content, action = '') => `<section class="owner-panel"><div class="owner-panel__head"><h3>${title}</h3>${action}</div>${content}</section>`;
  const table = (heads, rows) => `<div class="table-wrap"><table><thead><tr>${heads.map(head => `<th>${head}</th>`).join('')}</tr></thead><tbody>${rows.join('') || `<tr><td colspan="${heads.length}">Nenhum resultado encontrado.</td></tr>`}</tbody></table></div>`;
  const row = cells => `<tr>${cells.map(cell => `<td>${cell}</td>`).join('')}</tr>`;
  const heading = (eyebrow, title, text = '') => `<div class="owner-heading"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1>${text ? `<p>${text}</p>` : ''}</div></div>`;
  const search = placeholder => `<label class="search-field"><span class="sr-only">Buscar</span><input id="owner-search" type="search" value="${escape(state.search)}" placeholder="${placeholder}"></label>`;
  const emptySlots = () => window.Demo.restock?.remaining() || ['A1','A3','A4','B4','C2','D1','D2','D3','E2'];

  function content(page) {
    const query = state.search.toLocaleLowerCase('pt-BR');
    if (page === 'inicio') return `${heading('QUARTA, 30 DE SETEMBRO', 'Visão geral', 'Acompanhe a operação dos seus armários.')}<div class="metrics">${metric('Vendas hoje', 'R$ 412,60', '+7% vs. quarta passada')}${metric('Pedidos hoje', '38', '4 lojas em operação')}${metric('Armários ativos', '5 de 5', emptySlots().length ? '1 precisa de reposição' : 'Nenhuma reposição pendente')}${metric('Compartimentos vazios', String(emptySlots().length), 'no Armário 02')}</div><div class="owner-columns">${panel('Vendas dos últimos 7 dias', `<div class="bars" aria-label="Vendas ilustrativas dos últimos 7 dias">${[38,56,47,71,61,82,68].map((height, index) => `<div><span style="height:${height}%"></span><small>${['Qui','Sex','Sáb','Dom','Seg','Ter','Qua'][index]}</small></div>`).join('')}</div>`)}${panel('Precisa de atenção', `<div class="attention"><strong>Armário 02 · Edifício Aurora</strong><p>${emptySlots().length ? `${emptySlots().length} compartimentos vazios aguardando reposição.` : 'Abastecimento concluído nesta sessão.'}</p><a href="#/gestao/abastecimento">Ver abastecimento →</a></div><div class="attention"><strong>Residencial Horizonte</strong><p>Estoque de sabão em pó está baixo.</p><a href="#/gestao/lojas">Ver armários →</a></div>`)}</div>${panel('Vendas recentes', table(['Pedido','Loja','Quando','Total','Status'], sales.slice(0,3).map(sale => row([sale.id,sale.store,sale.time,money(sale.total),badge(sale.status)]))), '<a href="#/gestao/vendas">Ver todas →</a>')}`;
    if (page === 'lojas') return `${heading('4 LOJAS · 5 ARMÁRIOS','Lojas e armários','Acompanhe os pontos de venda e o estado de cada armário.')}${search('Buscar loja')}<div class="store-grid">${stores.filter(store => store.name.toLowerCase().includes(query)).map(store => `<article class="store-card"><div class="store-card__icon">▦</div><div><h3>${store.name}</h3><p>${store.location}</p></div>${badge(store.status)}<div class="store-card__stats"><span>${store.lockers} ${store.lockers === 1 ? 'armário' : 'armários'}</span><strong>${money(store.sales)} hoje</strong></div><a href="#/gestao/abastecimento">Ver estoque →</a></article>`).join('') || '<p>Nenhuma loja encontrada.</p>'}</div>`;
    if (page === 'produtos') return `${heading('7 PRODUTOS NO CATÁLOGO','Produtos e preços','Preços e disponibilidade exibidos no app do comprador.')}${search('Buscar produto')}<div class="filter-row">${['Todos','Lavanderia','Higiene','Limpeza'].map(category => `<button data-category="${category}" class="chip ${state.category === category ? 'active' : ''}">${category}</button>`).join('')}</div>${panel('Catálogo',table(['Produto','Categoria','Preço','No armário 02','Status'],catalog.filter(product => (state.category === 'Todos' || product.category === state.category) && product.name.toLowerCase().includes(query)).map(product => row([`<strong>${product.name}</strong>`,product.category,money(product.price),`${product.stock} unidades`,badge(product.stock ? 'Ativo' : 'Vazio')]))))}`;
    if (page === 'abastecimento') return `${heading('ARMÁRIO 02 · EDIFÍCIO AURORA','Abastecimento','1 item por compartimento · estoque atualizado nesta sessão')}${panel('Resumo do armário',`<div class="metrics metrics--small">${metric('Compartimentos','24','capacidade total')}${metric('Com item',String(24-emptySlots().length),'disponíveis para venda')}${metric('Vazios',String(emptySlots().length),'reposição pendente')}</div>`)}${panel('Mapa de compartimentos',`<div class="locker-grid">${['A','B','C','D','E','F'].flatMap(letter => [1,2,3,4].map(number => { const id = `${letter}${number}`; const empty = emptySlots().includes(id); return `<div class="locker-slot ${empty ? 'locker-slot--empty' : ''}"><strong>${id}</strong><small>${empty ? 'Vazio' : 'Com item'}</small></div>`; })).join('')}</div><p class="owner-help">Abra o app de abastecimento para simular uma visita e atualizar os compartimentos.</p><a class="owner-action" href="#/abastecimento">Ir para app de abastecimento →</a>`)}`;
    if (page === 'vendas') return `${heading('PEDIDOS E PAGAMENTOS','Vendas','Histórico ilustrativo de transações.')}${search('Buscar pedido ou loja')}<div class="metrics metrics--small">${metric('Faturamento no mês','R$ 8.762,40','setembro de 2026')}${metric('Pedidos','806','neste mês')}${metric('Ticket médio','R$ 10,87','neste mês')}</div>${panel('Pedidos recentes',table(['Pedido','Loja','Quando','Itens','Total','Status'],sales.filter(sale => `${sale.id} ${sale.store}`.toLowerCase().includes(query)).map(sale => row([sale.id,sale.store,sale.time,String(sale.items),money(sale.total),badge(sale.status)]))),'<button class="owner-action" id="export-sales">Exportar CSV</button>')}`;
    if (page === 'usuarios') return `${heading('ACESSO À OPERAÇÃO','Usuários e perfis','Quem acessa a plataforma e o app de abastecimento.')}<div class="filter-row"><button data-user-tab="usuarios" class="chip ${state.userTab === 'usuarios' ? 'active' : ''}">Usuários (${people.length})</button><button data-user-tab="perfis" class="chip ${state.userTab === 'perfis' ? 'active' : ''}">Perfis de acesso (4)</button></div>${state.userTab === 'usuarios' ? panel('Pessoas',table(['Nome','E-mail','Perfil','Status'],people.map(person => row([`<strong>${person.name}</strong>`,person.email,person.role,badge(person.status)])))) : panel('Perfis de acesso',`<div class="role-list"><p><strong>Proprietário</strong><span>Controle total da operação.</span></p><p><strong>Gerente</strong><span>Gerencia lojas, produtos e vendas.</span></p><p><strong>Abastecedor</strong><span>Acessa armários e registra reposições.</span></p><p><strong>Leitura</strong><span>Consulta indicadores e relatórios.</span></p></div>`)}`;
    if (page === 'configuracoes') return `${heading('PREFERÊNCIAS DA OPERAÇÃO','Configurações','Ajustes de demonstração salvos nesta sessão.')}${panel('Empresa',`<form id="settings-form"><label class="form-label">Nome fantasia<input name="company" value="${escape(state.company)}" required></label><label class="form-label">E-mail de contato<input type="email" value="contato@cubo.demo" disabled></label><label class="toggle-label"><input type="checkbox" name="alerts" ${state.alerts ? 'checked' : ''}><span>Receber alertas de estoque baixo</span></label><button class="owner-action" type="submit">Salvar alterações</button>${state.saved ? '<span class="save-message" role="status">Alterações salvas nesta demonstração.</span>' : ''}</form>`)}`;
    location.hash = '#/gestao/inicio'; return '';
  }

  function render(root, page) {
    root.innerHTML = `<div class="owner-shell"><aside class="owner-sidebar"><strong>Gestão</strong><nav aria-label="Páginas da plataforma">${nav.map(([key,label]) => `<a href="#/gestao/${key}" ${key === page ? 'aria-current="page"' : ''}>${label}</a>`).join('')}</nav><div class="owner-profile"><span>TV</span><div><strong>Tarik Villalobos</strong><small>Proprietário</small></div></div></aside><div class="owner-main">${content(page)}</div></div>`;
    const input = root.querySelector('#owner-search');
    input?.addEventListener('input', () => { const start = input.selectionStart; state.search = input.value; render(root,page); const next = root.querySelector('#owner-search'); next.focus(); next.setSelectionRange(start,start); });
    root.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => { state.category = button.dataset.category; render(root,page); }));
    root.querySelectorAll('[data-user-tab]').forEach(button => button.addEventListener('click', () => { state.userTab = button.dataset.userTab; render(root,page); }));
    root.querySelector('#settings-form')?.addEventListener('submit', event => { event.preventDefault(); state.company = event.target.company.value; state.alerts = event.target.alerts.checked; state.saved = true; render(root,page); });
    root.querySelector('#export-sales')?.addEventListener('click', () => {
      const csv = ['Pedido,Loja,Quando,Itens,Total,Status',...sales.map(sale => [sale.id,sale.store,sale.time,sale.items,sale.total.toFixed(2),sale.status].map(value => `"${String(value).replace(/"/g,'""')}"`).join(','))].join('\n');
      const url = URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}));
      const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'vendas-demo.csv'; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  }

  window.Demo.register('gestao', render);
})();
