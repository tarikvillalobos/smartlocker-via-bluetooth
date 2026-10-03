(() => {
  const root = document.getElementById('app');
  const home = root.innerHTML;
  const sections = {
    comprador: { label: 'App do comprador', description: 'Conexão, produtos, carrinho e pagamento.' },
    gestao: { label: 'Plataforma de gestão do proprietário', description: 'Armários, produtos, abastecimento e vendas.' },
    abastecimento: { label: 'App de abastecimento', description: 'Visitas, compartimentos e reposição.' }
  };
  const views = {};
  const themeMedia = window.matchMedia('(prefers-color-scheme: dark)');
  let themePreference = null;
  try { themePreference = localStorage.getItem('smartlocker-theme'); } catch {}
  const themeLabel = () => document.documentElement.dataset.theme === 'dark' ? 'claro' : 'escuro';
  const themeButton = () => `<button class="theme-toggle" type="button" data-theme-toggle aria-label="Ativar tema ${themeLabel()}"><span>Tema ${themeLabel()}</span></button>`;
  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#181818' : '#f7f8f5');
    document.querySelectorAll('[data-theme-toggle]').forEach(button => { button.setAttribute('aria-label', `Ativar tema ${themeLabel()}`); button.querySelector('span').textContent = `Tema ${themeLabel()}`; });
  }
  applyTheme(['light','dark'].includes(themePreference) ? themePreference : themeMedia.matches ? 'dark' : 'light');
  document.addEventListener('click', event => { if (!event.target.closest('[data-theme-toggle]')) return; themePreference = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; applyTheme(themePreference); try { localStorage.setItem('smartlocker-theme',themePreference); } catch {} });
  themeMedia.addEventListener('change', event => { if (!['light','dark'].includes(themePreference)) applyTheme(event.matches ? 'dark' : 'light'); });

  function render() {
    const [section, page = 'inicio'] = location.hash.replace(/^#\/?/, '').split('/');
    if (!sections[section]) {
      root.className = 'welcome';
      root.innerHTML = themeButton() + home;
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
        ${themeButton()}
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
