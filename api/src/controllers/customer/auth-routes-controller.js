exports.findAll = (req, res) => {
  const routes = {
    '/client/login': 'login.html',
    '/client/login/reset': 'reset.html'
  }

  res.status(200).send(routes)
}
