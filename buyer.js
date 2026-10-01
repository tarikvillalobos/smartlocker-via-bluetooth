(() => {
  const products = window.Demo.catalog.filter(product => product.showInBuyer);
  const state = { quantities: {}, category: 'Todos', payment: 'Pix', copied: false };
  const money = value => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const items = () => products.filter(product => state.quantities[product.id]);
  const count = () => items().reduce((sum, product) => sum + state.quantities[product.id], 0);
  const total = () => items().reduce((sum, product) => sum + product.price * state.quantities[product.id], 0);
  const link = page => `#/comprador/${page}`;
  const button = (label, target, extra = '') => `<a class="button ${extra}" href="${link(target)}">${label}</a>`;

  function layout(title, content, step = 0) {
    return `<div class="phone"><div class="phone__top"><span>Cubo <b>·</b> Armário 02</span><span class="signal">● ${step ? 'Conectado' : 'Demo'}</span></div><div class="phone__content">${content}</div><div class="phone__bottom"><span>Edifício Aurora</span><span>Protótipo interativo</span></div></div>`;
  }

  function render(root, page) {
    let content = '';
    switch (page) {
      case 'inicio':
        content = `<p class="overline">VOCÊ ESTÁ EM</p><h2>Lavanderia Edifício Aurora</h2><p class="muted">Térreo · Lavanderia compartilhada</p><div class="locker-illustration" aria-hidden="true">▦</div><h3>Conecte-se ao armário</h3><p class="muted">Nesta demonstração, a conexão Bluetooth é simulada. Em uma compra real, fique a até 2 metros do armário.</p><div class="steps"><span>1 Conectar</span><span>2 Escolher</span><span>3 Pagar</span><span>4 Retirar</span></div>${button('Simular conexão Bluetooth →', 'conectado')}`;
        break;
      case 'conectado':
        content = `<div class="success-icon">✓</div><p class="overline">CONEXÃO SIMULADA</p><h2>Armário conectado</h2><p class="muted">Tudo pronto. Agora é só escolher seus itens.</p><div class="info-card"><strong>ARM-02 · Edifício Aurora</strong><span>Sinal forte · aprox. 1 m</span></div><ul class="check-list"><li>Bluetooth ativado</li><li>Armário encontrado</li><li>Conexão segura estabelecida</li></ul>${button('Ver produtos →', 'produtos')}`;
        break;
      case 'produtos':
        content = `<p class="overline">EDIFÍCIO AURORA · ARMÁRIO 02</p><h2>O que você precisa?</h2><div class="chips">${['Todos', 'Lavanderia', 'Higiene', 'Limpeza'].map(category => `<button data-category="${category}" class="chip ${state.category === category ? 'active' : ''}">${category}</button>`).join('')}</div><div class="product-list">${products.filter(product => state.category === 'Todos' || product.category === state.category).map(product => `<article class="product"><div class="product__icon">${product.icon}</div><div class="product__details"><strong>${product.name}</strong><small>${product.stock ? `${product.stock} disponíveis` : 'Esgotado'}</small><b>${money(product.price)}</b></div>${product.stock ? `<div class="quantity"><button aria-label="Diminuir ${product.name}" data-product="${product.id}" data-delta="-1">−</button><span>${state.quantities[product.id] || 0}</span><button aria-label="Adicionar ${product.name}" data-product="${product.id}" data-delta="1">+</button></div>` : ''}</article>`).join('')}</div><div class="sticky-action"><span>${count()} ${count() === 1 ? 'item' : 'itens'} · <b>${money(total())}</b></span>${button('Ver carrinho →', 'carrinho', count() ? '' : 'disabled')}</div>`;
        break;
      case 'carrinho':
        content = `<a class="inline-back" href="${link('produtos')}">← Produtos</a><h2>Seu carrinho</h2>${items().length ? `<div class="product-list">${items().map(product => `<article class="product"><div class="product__icon">${product.icon}</div><div class="product__details"><strong>${product.name}</strong><small>${money(product.price)} cada</small><b>${money(product.price * state.quantities[product.id])}</b></div><div class="quantity"><button aria-label="Diminuir ${product.name}" data-product="${product.id}" data-delta="-1">−</button><span>${state.quantities[product.id]}</span><button aria-label="Adicionar ${product.name}" data-product="${product.id}" data-delta="1">+</button></div></article>`).join('')}</div><a class="text-link" href="${link('produtos')}">+ Adicionar mais itens</a><div class="totals"><div><span>Subtotal (${count()} itens)</span><b>${money(total())}</b></div><div><span>Taxa de serviço</span><b>Grátis</b></div><div class="totals__grand"><span>Total</span><strong>${money(total())}</strong></div></div><p class="notice">Os compartimentos dos itens abrem após a aprovação do pagamento.</p>${button(`Ir para pagamento · ${money(total())} →`, 'pagamento')}` : `<div class="empty-state">Seu carrinho está vazio.<br><a class="text-link" href="${link('produtos')}">Escolher produtos</a></div>`}`;
        break;
      case 'pagamento':
        if (!count()) { location.hash = link('produtos'); return; }
        content = `<a class="inline-back" href="${link('carrinho')}">← Carrinho</a><h2>Pagamento</h2><div class="payment-total"><span>Total a pagar</span><strong>${money(total())}</strong></div><div class="tabs"><button data-payment="Pix" class="${state.payment === 'Pix' ? 'active' : ''}">Pix</button><button data-payment="Cartão" class="${state.payment === 'Cartão' ? 'active' : ''}">Cartão</button></div>${state.payment === 'Pix' ? `<div class="qr-demo" aria-label="QR Code ilustrativo">▦<small>QR CODE ILUSTRATIVO</small></div><p class="muted centered">Pagamento de demonstração</p><div class="info-card"><span>Pix copia e cola (exemplo)</span><button data-copy="true">${state.copied ? 'Copiado!' : 'Copiar'}</button></div><ol class="instructions"><li>Abra o app do seu banco e escolha pagar com Pix.</li><li>Escaneie um QR real em uma compra de verdade.</li><li>Nesta demo, use o botão abaixo para continuar.</li></ol>` : `<div class="info-card"><strong>Cartão de demonstração</strong><span>Nenhum dado de cartão será solicitado ou cobrado.</span></div>`}${button('Simular pagamento aprovado →', 'retirada')}`;
        break;
      case 'retirada':
        if (!count()) { location.hash = link('produtos'); return; }
        content = `<div class="success-icon">✓</div><p class="overline">PAGAMENTO SIMULADO</p><h2>${count()} ${count() === 1 ? 'compartimento aberto' : 'compartimentos abertos'}</h2><p class="muted">Retire cada item e feche as portinhas ao terminar.</p><div class="info-card"><strong>Pedido de demonstração #A-1042</strong><span>30/09 · 14:32</span></div><div class="receipt">${items().map(product => `<div><span class="slot">${product.slot}</span><span>${product.name} × ${state.quantities[product.id]}</span><b>${money(product.price * state.quantities[product.id])}</b></div>`).join('')}</div><div class="totals"><div class="totals__grand"><span>Total simulado · ${state.payment}</span><strong>${money(total())}</strong></div></div><a class="button" id="close-buyer" href="#/">Concluir e sair</a><a class="button secondary follow-up-action" id="new-purchase" href="${link('produtos')}">Nova compra</a>`;
        break;
      default: location.hash = link('inicio'); return;
    }
    root.innerHTML = layout(page, content, page !== 'inicio');
    root.querySelectorAll('[data-product]').forEach(button => button.addEventListener('click', () => {
      const product = products.find(item => item.id === button.dataset.product);
      const next = Math.max(0, Math.min(product.stock, (state.quantities[product.id] || 0) + Number(button.dataset.delta)));
      state.quantities[product.id] = next;
      render(root, page);
    }));
    root.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => { state.category = button.dataset.category; render(root, page); }));
    root.querySelectorAll('[data-payment]').forEach(button => button.addEventListener('click', () => { state.payment = button.dataset.payment; render(root, page); }));
    root.querySelector('[data-copy]')?.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText('PIX-DEMONSTRACAO-SEM-VALOR'); state.copied = true; } catch { state.copied = false; }
      render(root, page);
    });
    root.querySelector('#new-purchase')?.addEventListener('click', () => { state.quantities = {}; state.category = 'Todos'; state.payment = 'Pix'; state.copied = false; });
    root.querySelector('#close-buyer')?.addEventListener('click', () => { state.quantities = {}; state.category = 'Todos'; state.payment = 'Pix'; state.copied = false; });
  }

  window.Demo.register('comprador', render);
})();
