(() => {
  const root = document.getElementById('app');
  const home = root.innerHTML;
  const sections = {
    comprador: { label: 'App do comprador', description: 'Conexão, produtos, carrinho e pagamento.' },
    gestao: { label: 'Plataforma de gestão do proprietário', description: 'Armários, produtos, abastecimento e vendas.' },
    abastecimento: { label: 'App de abastecimento', description: 'Visitas, compartimentos e reposição.' }
  };
  const views = {};

  function render() {
    const [section, page = 'inicio'] = location.hash.replace(/^#\/?/, '').split('/');
    if (!sections[section]) {
      root.className = 'welcome';
      root.innerHTML = home;
      document.title = 'Armário Inteligente · Demonstração';
      return;
    }

    const current = sections[section];
    root.className = 'demo';
    root.innerHTML = `
      <header class="demo-header">
        <a class="brand" href="#/" aria-label="Voltar à tela inicial"><span class="brand__mark">▦</span> Armário Inteligente</a>
        <nav class="demo-header__nav" aria-label="Experiências">
          ${Object.entries(sections).map(([key, value]) => `<a href="#/${key}" ${section === key ? 'aria-current="page"' : ''}>${value.label}</a>`).join('')}
        </nav>
      </header>
      <div class="demo-body" id="demo-body"></div>`;
    document.title = `${current.label} · Armário Inteligente`;
    const body = document.getElementById('demo-body');
    if (views[section]) {
      views[section](body, page);
    } else {
      body.innerHTML = `<section class="demo-placeholder"><p class="eyebrow">DEMONSTRAÇÃO</p><h1>${current.label}</h1><p>${current.description}</p><a class="back-link" href="#/">← Voltar à tela inicial</a></section>`;
    }
  }

  window.Demo = { register(section, view) { views[section] = view; render(); }, render };
  window.addEventListener('hashchange', render);
  render();
})();
