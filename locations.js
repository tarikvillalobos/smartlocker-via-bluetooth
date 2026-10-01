(() => {
  // Uma loja e um armário por ponto de venda nesta demonstração.
  window.Demo.locations = [
    { id: 'jardins', name: 'Condomínio Jardins', location: 'Térreo · São Paulo', lockerId: 'arm-01', locker: 'Armário 01', status: 'Ativo', sales: 98.90, emptySlots: ['A2', 'B3', 'D1', 'F4'] },
    { id: 'aurora', name: 'Edifício Aurora', location: 'Lavanderia · São Paulo', lockerId: 'arm-02', locker: 'Armário 02', status: 'Ativo', sales: 176.40, emptySlots: ['A1', 'A3', 'A4', 'B4', 'C2', 'D1', 'D2', 'D3', 'E2'] },
    { id: 'studio', name: 'Studio Central', location: 'Recepção · São Paulo', lockerId: 'arm-03', locker: 'Armário 03', status: 'Ativo', sales: 55.00, emptySlots: ['A4', 'E3'] },
    { id: 'horizonte', name: 'Residencial Horizonte', location: 'Hall · São Paulo', lockerId: 'arm-04', locker: 'Armário 04', status: 'Atenção', sales: 82.30, emptySlots: ['A2', 'B1', 'C3', 'D4', 'F2'] }
  ];
})();
