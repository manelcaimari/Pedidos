exports.findAll = (req, res) => {
  const routes = {
    '/cliente': 'menu.html',
    '/cliente/nuevo-pedido': 'new-orders.html',
    '/cliente/pedidos-anteriores': 'previous-orders.html',
    '/cliente/compra': 'summary-orders.html',
    '/cliente/reference': 'reference.html'
  }

  res.status(200).send(routes)
}
