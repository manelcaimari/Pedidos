exports.findAll = (req, res) => {
  const routes = {
    '/admin/usuarios': 'users.html',
    '/admin/clientes': 'customers.html',
    '/admin/empresas': 'companies.html',
    '/admin/categorias': 'product-categories.html',
    '/admin/details': 'sales.html',
    '/admin/contacts': 'contacts.html',
    '/admin/productos': 'products.html',
    '/admin': 'indice.html'
  }

  res.status(200).send(routes)
}
