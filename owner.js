(() => {
  const stores = window.Demo.locations;
  const catalog = window.Demo.catalog;
  const sales = [
    { id: '#A-1042', storeId: 'aurora', lockerId: 'arm-02', time: 'Hoje, 14:32', items: 4, total: 25.80, status: 'Pago' },
    { id: '#A-1041', storeId: 'jardins', lockerId: 'arm-01', time: 'Hoje, 13:18', items: 2, total: 13.40, status: 'Pago' },
    { id: '#A-1040', storeId: 'aurora', lockerId: 'arm-02', time: 'Hoje, 11:05', items: 3, total: 24.70, status: 'Pago' },
    { id: '#A-1039', storeId: 'horizonte', lockerId: 'arm-04', time: 'Hoje, 09:12', items: 1, total: 9.90, status: 'Estornado' },
    { id: '#A-1038', storeId: 'studio', lockerId: 'arm-03', time: 'Ontem, 18:20', items: 1, total: 5.90, status: 'Pago' },
    { id: '#A-1037', storeId: 'horizonte', lockerId: 'arm-04', time: 'Ontem, 16:04', items: 1, total: 7.90, status: 'Pago' }
  ];
  const storeFor = sale => stores.find(store => store.id === sale.storeId);
  const people = [
    { name: 'Tarik Villalobos', email: 'tarik@cubo.demo', role: 'Proprietário', status: 'Ativo' },
    { name: 'Marina Costa', email: 'marina@cubo.demo', role: 'Gerente', status: 'Ativo' },
    { name: 'Lucas Pereira', email: 'lucas@cubo.demo', role: 'Abastecedor', status: 'Ativo' },
    { name: 'Ana Martins', email: 'ana@cubo.demo', role: 'Abastecedor', status: 'Ativo' }
  ];
  const nav = [ ['inicio','Visão geral'], ['lojas','Lojas e armários'], ['produtos','Produtos e preços'], ['abastecimento','Abastecimento'], ['vendas','Vendas'], ['usuarios','Usuários'], ['configuracoes','Configurações'] ];
  const state = { search: '', currentPage: null, category: 'Todos', userTab: 'usuarios', saved: false, company: 'Cubo', alerts: true, editingProductId: null, priceMessage: '', restockStore: 'all', restockLocker: 'all', salesStore: 'all', salesLocker: 'all' };
  const money = amount => amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const badge = value => `<span class="badge ${value === 'Atenção' || value === 'Estornado' || value === 'Vazio' || value === 'Reposição' ? 'badge--warn' : ''}">${value}</span>`;
  const metric = (label, value, foot) => `<div class="metric"><span>${label}</span><strong>${value}</strong><small>${foot}</small></div>`;
  const panel = (title, content, action = '') => `<section class="owner-panel"><div class="owner-panel__head"><h3>${title}</h3>${action}</div>${content}</section>`;
  const table = (heads, rows) => `<div class="table-wrap"><table><thead><tr>${heads.map(head => `<th>${head}</th>`).join('')}</tr></thead><tbody>${rows.join('') || `<tr><td colspan="${heads.length}">Nenhum resultado encontrado.</td></tr>`}</tbody></table></div>`;
  const row = cells => `<tr>${cells.map(cell => `<td>${cell}</td>`).join('')}</tr>`;
  const heading = (eyebrow, title, text = '') => `<div class="owner-heading"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1>${text ? `<p>${text}</p>` : ''}</div></div>`;
  const search = placeholder => `<label class="search-field"><span class="sr-only">Buscar</span><input id="owner-search" type="search" value="${escape(state.search)}" placeholder="${placeholder}"></label>`;
  const emptySlots = store => store.id === 'aurora' ? (window.Demo.restock?.remaining() || store.emptySlots) : store.emptySlots;
  const totalEmptySlots = () => stores.reduce((sum, store) => sum + emptySlots(store).length, 0);

  const profit = product => product.price - product.cost;
  const margin = product => `${((profit(product) / product.price) * 100).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
  const productRow = product => row([
    `<div class="owner-product-cell"><strong>${escape(product.name)}</strong><button class="owner-edit" type="button" data-edit-product="${escape(product.id)}" aria-label="Editar preços de ${escape(product.name)}">Editar</button></div>`,
    money(product.cost),
    `<strong>${money(product.price)}</strong>`,
    `<span class="${profit(product) < 0 ? 'owner-profit--negative' : 'owner-profit'}">${money(profit(product))}</span>`,
    `<span class="${profit(product) < 0 ? 'owner-profit--negative' : 'owner-profit'}">${margin(product)}</span>`,
    escape(product.category),
    `${product.stock} unidades`,
    badge(product.stock ? 'Ativo' : 'Vazio')
  ]) + (state.editingProductId === product.id ? `<tr class="owner-edit-row"><td colspan="8"><form id="product-price-form" data-product-id="${escape(product.id)}"><strong>Editar preços · ${escape(product.name)}</strong><div class="owner-price-fields"><label class="form-label">Preço de custo (R$)<input name="cost" type="number" inputmode="decimal" min="0" step="0.01" value="${product.cost.toFixed(2)}" required></label><label class="form-label">Preço para o cliente (R$)<input name="price" type="number" inputmode="decimal" min="0.01" step="0.01" value="${product.price.toFixed(2)}" required></label></div><div class="owner-price-actions"><button class="owner-action" type="submit">Salvar preços</button><button class="owner-edit" type="button" id="cancel-product-edit">Cancelar</button></div></form></td></tr>` : '');

  function locationFilters(section) {
    const storeId = state[`${section}Store`];
    const lockerId = state[`${section}Locker`];
    const available = storeId === 'all' ? stores : stores.filter(store => store.id === storeId);
    return `<div class="owner-location-filters"><label>Loja<select data-location-filter="${section}-store" aria-label="Filtrar ${section === 'sales' ? 'vendas' : 'abastecimento'} por loja"><option value="all">Todas as lojas</option>${stores.map(store => `<option value="${store.id}" ${storeId === store.id ? 'selected' : ''}>${escape(store.name)}</option>`).join('')}</select></label><label>Armário<select data-location-filter="${section}-locker" aria-label="Filtrar ${section === 'sales' ? 'vendas' : 'abastecimento'} por armário"><option value="all">Todos os armários</option>${available.map(store => `<option value="${store.lockerId}" ${lockerId === store.lockerId ? 'selected' : ''}>${store.locker} · ${escape(store.name)}</option>`).join('')}</select></label></div>`;
  }
  const matchingStores = section => stores.filter(store =>
    (state[`${section}Store`] === 'all' || store.id === state[`${section}Store`]) &&
    (state[`${section}Locker`] === 'all' || store.lockerId === state[`${section}Locker`])
  );
  const matchingSales = () => sales.filter(sale => {
    const store = storeFor(sale);
    return (state.salesStore === 'all' || sale.storeId === state.salesStore) &&
      (state.salesLocker === 'all' || sale.lockerId === state.salesLocker) &&
      `${sale.id} ${store.name} ${store.locker}`.toLocaleLowerCase('pt-BR').includes(state.search.toLocaleLowerCase('pt-BR'));
  });
  const saleRow = sale => {
    const store = storeFor(sale);
    return row([sale.id, escape(store.name), store.locker, sale.time, String(sale.items), money(sale.total), badge(sale.status)]);
  };

  function restockContent() {
    const visible = matchingStores('restock');
    const selected = visible.length === 1 ? visible[0] : null;
    const filters = locationFilters('restock');
    if (!selected) return `${heading('4 LOJAS · 4 ARMÁRIOS','Abastecimento','Selecione uma loja ou armário para acompanhar os compartimentos.')}${filters}<div class="restock-overview-grid">${visible.map(store => `<article class="store-card restock-card"><div class="store-card__icon">▦</div><div><h3>${store.locker}</h3><p>${escape(store.name)} · ${escape(store.location)}</p></div>${badge(emptySlots(store).length ? 'Reposição' : 'Em dia')}<div class="store-card__stats"><span>24 compartimentos</span><strong>${emptySlots(store).length} vazios</strong></div><button type="button" data-select-locker="${store.lockerId}">Ver compartimentos →</button></article>`).join('')}</div>`;
    const empty = emptySlots(selected);
    const action = selected.id === 'aurora' ? '<a class="owner-action" href="#/abastecimento">Ir para app de abastecimento →</a>' : '<p class="owner-help">Visita interativa disponível no Armário 02 · Edifício Aurora.</p>';
    return `${heading('4 LOJAS · 4 ARMÁRIOS','Abastecimento','Acompanhe cada ponto de venda separadamente.')}${filters}${panel(`${selected.locker} · ${escape(selected.name)}`,`<p class="owner-price-note">${escape(selected.location)}</p><div class="metrics metrics--small">${metric('Compartimentos','24','capacidade total')}${metric('Com item',String(24-empty.length),'disponíveis para venda')}${metric('Vazios',String(empty.length),'reposição pendente')}</div>`)}${panel('Mapa de compartimentos',`<div class="locker-grid">${['A','B','C','D','E','F'].flatMap(letter => [1,2,3,4].map(number => { const id = `${letter}${number}`; const vacant = empty.includes(id); return `<div class="locker-slot ${vacant ? 'locker-slot--empty' : ''}"><strong>${id}</strong><small>${vacant ? 'Vazio' : 'Com item'}</small></div>`; })).join('')}</div>${action}`)}<button class="owner-edit" type="button" id="show-all-lockers">← Todos os armários</button>`;
  }

  function salesContent() {
    const filtered = matchingSales();
    const paid = filtered.filter(sale => sale.status === 'Pago');
    const total = paid.reduce((sum, sale) => sum + sale.total, 0);
    return `${heading('PEDIDOS E PAGAMENTOS','Vendas','Histórico ilustrativo por loja e armário.')}${locationFilters('sales')}${search('Buscar pedido, loja ou armário')}<div class="metrics metrics--small">${metric('Vendas pagas',money(total),'nos pedidos exibidos')}${metric('Pedidos pagos',String(paid.length),'na seleção atual')}${metric('Ticket médio',paid.length ? money(total / paid.length) : money(0),'por pedido pago')}</div>${panel('Pedidos recentes',table(['Pedido','Loja','Armário','Quando','Itens','Total','Status'],filtered.map(saleRow)),'<button class="owner-action" id="export-sales">Exportar CSV</button>')}`;
  }

  function content(page) {
    const query = state.search.toLocaleLowerCase('pt-BR');
    if (page === 'inicio') return `${heading('QUARTA, 30 DE SETEMBRO', 'Visão geral', 'Acompanhe a operação dos seus armários.')}<div class="metrics">${metric('Vendas hoje', 'R$ 412,60', '+7% vs. quarta passada')}${metric('Pedidos hoje', '38', '4 lojas em operação')}${metric('Armários ativos', '4 de 4', 'um por loja')}${metric('Compartimentos vazios', String(totalEmptySlots()), 'nos 4 armários')}</div><div class="owner-columns">${panel('Vendas dos últimos 7 dias', `<div class="bars" aria-label="Vendas ilustrativas dos últimos 7 dias">${[38,56,47,71,61,82,68].map((height, index) => `<div><span style="height:${height}%"></span><small>${['Qui','Sex','Sáb','Dom','Seg','Ter','Qua'][index]}</small></div>`).join('')}</div>`)}${panel('Precisa de atenção', `<div class="attention"><strong>Armário 02 · Edifício Aurora</strong><p>${emptySlots(stores.find(store => store.id === 'aurora')).length} compartimentos vazios aguardando reposição.</p><a href="#/gestao/abastecimento">Ver abastecimento →</a></div><div class="attention"><strong>Armário 04 · Residencial Horizonte</strong><p>Estoque de sabão em pó está baixo.</p><a href="#/gestao/lojas">Ver armários →</a></div>`)}</div>${panel('Vendas recentes', table(['Pedido','Loja','Armário','Quando','Total','Status'], sales.slice(0,3).map(sale => { const store = storeFor(sale); return row([sale.id,escape(store.name),store.locker,sale.time,money(sale.total),badge(sale.status)]); })), '<a href="#/gestao/vendas">Ver todas →</a>')}`;
    if (page === 'lojas') return `${heading('4 LOJAS · 4 ARMÁRIOS','Lojas e armários','Um armário por ponto de venda nesta demonstração.')}${search('Buscar loja')}<div class="store-grid">${stores.filter(store => store.name.toLowerCase().includes(query)).map(store => `<article class="store-card"><div class="store-card__icon">▦</div><div><h3>${escape(store.name)}</h3><p>${escape(store.location)} · ${store.locker}</p></div>${badge(store.status)}<div class="store-card__stats"><span>${store.locker}</span><strong>${money(store.sales)} hoje</strong></div><a href="#/gestao/abastecimento" data-store-link="${store.id}">Ver estoque →</a></article>`).join('') || '<p>Nenhuma loja encontrada.</p>'}</div>`;
    if (page === 'produtos') {
      const products = catalog.filter(product => (state.category === 'Todos' || product.category === state.category) && product.name.toLowerCase().includes(query));
      return `${heading('7 PRODUTOS NO CATÁLOGO','Produtos e preços','Acompanhe custo, preço ao cliente e resultado por produto.')}${search('Buscar produto')}<div class="filter-row">${['Todos','Lavanderia','Higiene','Limpeza'].map(category => `<button data-category="${category}" class="chip ${state.category === category ? 'active' : ''}">${category}</button>`).join('')}</div>${panel('Catálogo', `<p class="owner-price-note">Lucro por unidade = preço ao cliente − custo. Margem = lucro ÷ preço ao cliente.</p>${state.priceMessage ? `<p class="save-message" role="status">${escape(state.priceMessage)}</p>` : ''}<div class="catalog-table">${table(['Produto','Preço de custo','Preço para o cliente','Lucro/unidade','Margem','Categoria','No armário 02','Status'],products.map(productRow))}</div>`)}`;
    }
    if (page === 'abastecimento') return restockContent();
    if (page === 'vendas') return salesContent();
    if (page === 'usuarios') return `${heading('ACESSO À OPERAÇÃO','Usuários e perfis','Quem acessa a plataforma e o app de abastecimento.')}<div class="filter-row"><button data-user-tab="usuarios" class="chip ${state.userTab === 'usuarios' ? 'active' : ''}">Usuários (${people.length})</button><button data-user-tab="perfis" class="chip ${state.userTab === 'perfis' ? 'active' : ''}">Perfis de acesso (4)</button></div>${state.userTab === 'usuarios' ? panel('Pessoas',table(['Nome','E-mail','Perfil','Status'],people.map(person => row([`<strong>${person.name}</strong>`,person.email,person.role,badge(person.status)])))) : panel('Perfis de acesso',`<div class="role-list"><p><strong>Proprietário</strong><span>Controle total da operação.</span></p><p><strong>Gerente</strong><span>Gerencia lojas, produtos e vendas.</span></p><p><strong>Abastecedor</strong><span>Acessa armários e registra reposições.</span></p><p><strong>Leitura</strong><span>Consulta indicadores e relatórios.</span></p></div>`)}`;
    if (page === 'configuracoes') return `${heading('PREFERÊNCIAS DA OPERAÇÃO','Configurações','Ajustes de demonstração salvos nesta sessão.')}${panel('Empresa',`<form id="settings-form"><label class="form-label">Nome fantasia<input name="company" value="${escape(state.company)}" required></label><label class="form-label">E-mail de contato<input type="email" value="contato@cubo.demo" disabled></label><label class="toggle-label"><input type="checkbox" name="alerts" ${state.alerts ? 'checked' : ''}><span>Receber alertas de estoque baixo</span></label><button class="owner-action" type="submit">Salvar alterações</button>${state.saved ? '<span class="save-message" role="status">Alterações salvas nesta demonstração.</span>' : ''}</form>`)}`;
    location.hash = '#/gestao/inicio'; return '';
  }

  function render(root, page) {
    if (state.currentPage !== page) {
      state.search = '';
      state.currentPage = page;
    }
    root.innerHTML = `<div class="owner-shell"><aside class="owner-sidebar"><strong>Gestão</strong><nav aria-label="Páginas da plataforma">${nav.map(([key,label]) => `<a href="#/gestao/${key}" ${key === page ? 'aria-current="page"' : ''}>${label}</a>`).join('')}<a href="#/" class="owner-exit">Sair da gestão</a></nav><div class="owner-profile"><span>TV</span><div><strong>Tarik Villalobos</strong><small>Proprietário</small></div></div></aside><div class="owner-main">${content(page)}</div></div>`;
    const input = root.querySelector('#owner-search');
    input?.addEventListener('input', () => { const start = input.selectionStart; state.search = input.value; render(root,page); const next = root.querySelector('#owner-search'); next.focus(); next.setSelectionRange(start,start); });
    root.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => { state.category = button.dataset.category; render(root,page); }));
    root.querySelectorAll('[data-user-tab]').forEach(button => button.addEventListener('click', () => { state.userTab = button.dataset.userTab; render(root,page); }));
    root.querySelectorAll('[data-location-filter]').forEach(select => select.addEventListener('change', () => {
      const [section, kind] = select.dataset.locationFilter.split('-');
      state[`${section}${kind === 'store' ? 'Store' : 'Locker'}`] = select.value;
      if (kind === 'store') state[`${section}Locker`] = 'all';
      render(root, page);
    }));
    root.querySelectorAll('[data-select-locker]').forEach(button => button.addEventListener('click', () => {
      state.restockLocker = button.dataset.selectLocker;
      render(root, page);
    }));
    root.querySelector('#show-all-lockers')?.addEventListener('click', () => {
      state.restockStore = 'all';
      state.restockLocker = 'all';
      render(root, page);
    });
    root.querySelectorAll('[data-store-link]').forEach(link => link.addEventListener('click', () => {
      state.restockStore = link.dataset.storeLink;
      state.restockLocker = 'all';
    }));
    root.querySelectorAll('[data-edit-product]').forEach(button => button.addEventListener('click', () => {
      state.editingProductId = state.editingProductId === button.dataset.editProduct ? null : button.dataset.editProduct;
      state.priceMessage = '';
      render(root, page);
      root.querySelector('#product-price-form input')?.focus();
    }));
    root.querySelector('#cancel-product-edit')?.addEventListener('click', () => { state.editingProductId = null; render(root, page); });
    root.querySelector('#product-price-form')?.addEventListener('submit', event => {
      event.preventDefault();
      const product = catalog.find(item => item.id === event.currentTarget.dataset.productId);
      const cost = Number(event.currentTarget.elements.cost.value);
      const price = Number(event.currentTarget.elements.price.value);
      if (!product || !Number.isFinite(cost) || !Number.isFinite(price) || cost < 0 || price <= 0) return;
      product.cost = Math.round(cost * 100) / 100;
      product.price = Math.round(price * 100) / 100;
      state.editingProductId = null;
      state.priceMessage = `Preços de ${product.name} atualizados nesta sessão.`;
      render(root, page);
    });
    root.querySelector('#settings-form')?.addEventListener('submit', event => { event.preventDefault(); state.company = event.target.company.value; state.alerts = event.target.alerts.checked; state.saved = true; render(root,page); });
    root.querySelector('#export-sales')?.addEventListener('click', () => {
      const csv = ['Pedido,Loja,Armário,Quando,Itens,Total,Status',...matchingSales().map(sale => [sale.id,storeFor(sale).name,storeFor(sale).locker,sale.time,sale.items,sale.total.toFixed(2),sale.status].map(value => `"${String(value).replace(/"/g,'""')}"`).join(','))].join('\n');
      const url = URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}));
      const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'vendas-demo.csv'; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  }

  window.Demo.register('gestao', render);
})();
