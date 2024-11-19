exports.findAll = (req, res) => {
  const routes = {
    '/auth/activate': 'activate.html'
  }

  res.status(200).send(routes)
}
