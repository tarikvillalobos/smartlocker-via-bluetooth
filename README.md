# Armário Inteligente — demonstração

Protótipo HTML navegável com três experiências:

- **App do comprador:** conexão simulada, catálogo, carrinho, pagamento simulado e retirada.
- **Plataforma de gestão:** visão geral, quatro lojas com um armário cada, produtos com custo, preço ao cliente, lucro e margem, abastecimento e vendas filtráveis por loja e armário, usuários e configurações.
- **App de abastecimento:** visita simulada, reposição por compartimento e resumo.

Abra `index.html` no navegador ou rode `python3 -m http.server 8000` nesta pasta e acesse `http://localhost:8000`.

Tudo funciona localmente, sem dependências. Bluetooth, pagamentos, vendas e dados operacionais são ilustrativos. Os preços editados na gestão aparecem no app do comprador durante a mesma sessão. O app de abastecimento simula a visita ao Armário 02; a gestão exibe os quatro armários. As alterações da sessão são reiniciadas ao recarregar a página.
