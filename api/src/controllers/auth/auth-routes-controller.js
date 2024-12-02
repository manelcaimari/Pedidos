exports.findAll = (req, res) => {
  const routes = {
    '/cuenta/activacion': 'activate.html'
  }

  res.status(200).send(routes)
}
