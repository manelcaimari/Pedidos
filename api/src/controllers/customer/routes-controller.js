exports.findAll = (req, res) => {

    const routes = {
      '/cliente': 'home.html',
      '/cliente/nuevo-pedido': 'order.html',
      '/cliente/pedidos-anteriores': 'history.html',
    }
  
    res.status(200).send(routes)
  }