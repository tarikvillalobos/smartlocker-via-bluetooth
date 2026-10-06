# Smart Locker — Demo

[English](README.md) | [Português (Brasil)](README.pt-BR.md)

Um protótipo HTML interativo com três experiências:

- **Aplicativo do comprador:** conexão simulada, catálogo, carrinho de compras, pagamento simulado e retirada.
- **Plataforma de gestão:** painel, quatro lojas com um locker cada, produtos com custo, preço ao cliente, lucro e margem, reposições e vendas filtradas por loja e locker, usuários e configurações.
- **Aplicativo de reposição:** visitas simuladas, reposição por compartimento e um resumo.

Abra `index.html` no navegador ou execute `python3 -m http.server 8000` neste diretório e acesse `http://localhost:8000`.

Tudo funciona localmente, sem dependências. Bluetooth, pagamentos, vendas e dados operacionais são simulados. Os preços editados na plataforma de gestão aparecem no aplicativo do comprador durante a mesma sessão. O aplicativo de reposição simula uma visita ao Locker 02; a plataforma de gestão mostra os quatro lockers. Os dados da sessão são reiniciados ao recarregar a página.
