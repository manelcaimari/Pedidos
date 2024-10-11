const sequelizeDb = require('../../models')
const ReturnOrder = sequelizeDb.ReturnOrder
const Op = sequelizeDb.Sequelize.Op

exports.findAll = (req, res) => {
  const page = req.query.page || 1
  const limit = parseInt(req.query.size) || 10
  const offset = (page - 1) * limit
  const whereStatement = {}

  for (const key in req.query) {
    if (req.query[key] !== '' && req.query[key] !== 'null' && key !== 'page' && key !== 'size') {
      whereStatement[key] = { [Op.substring]: req.query[key] }
    }
  }

  const condition = Object.keys(whereStatement).length > 0 ? { [Op.and]: [whereStatement] } : {}

  ReturnOrder.findAndCountAll({
    where: condition,
    attributes: ['id', 'returnId', 'productName', 'basePrice', 'quantity', 'reference', 'returnDate', 'returnTime', 'createdAt', 'updatedAt'],
    limit,
    offset,
    order: [['createdAt', 'DESC']]
  })
    .then(result => {
      result.meta = {
        total: result.count,
        pages: Math.ceil(result.count / limit),
        currentPage: page,
        size: limit
      }

      res.status(200).send(result)
    })
    .catch(err => {
      res.status(500).send({
        message: err.errors || 'Algún error ha surgido al recuperar los datos.'
      })
    })
}

exports.findOne = (req, res) => {
  const id = req.params.id

  ReturnOrder.findByPk(id)
    .then(data => {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(404).send({
          message: `No se puede encontrar la orden de retorno con la id=${id}.`
        })
      }
    })
    .catch(_ => {
      res.status(500).send({
        message: 'Algún error ha surgido al recuperar la id=' + id
      })
    })
}

exports.create = (req, res) => {
  ReturnOrder.create(req.body)
    .then(data => {
      res.status(201).send(data)
    })
    .catch(err => {
      res.status(400).send({
        message: err.errors || 'Algún error ha surgido al crear la orden de retorno.'
      })
    })
}
