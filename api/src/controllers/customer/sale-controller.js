const sequelizeDb = require('../../models')
const Sale = sequelizeDb.Sale
const Op = sequelizeDb.Sequelize.Op

exports.create = async (req, res) => {
  try {
    const items = req.body.items || []

    const totalBasePrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)

    const lastSale = await Sale.findOne({
      order: [['reference', 'DESC']],
      attributes: ['reference']
    })

    const newReference = lastSale ? parseInt(lastSale.reference, 10) + 1 : 1

    const saleDate = new Date().toISOString().split('T')[0]
    const saleTime = new Date().toISOString().split('T')[1].split('.')[0]

    const newSaleData = {
      ...req.body,
      reference: newReference,
      totalBasePrice,
      saleDate,
      saleTime
    }

    const sale = await Sale.create(newSaleData)
    res.status(200).send(sale)
  } catch (err) {
    if (err.errors) {
      res.status(422).send({
        message: err.errors
      })
    } else {
      res.status(500).send({
        message: 'Algún error ha surgido al insertar el dato.'
      })
    }
  }
}

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

  Sale.findAndCountAll({
    where: condition,
    attributes: ['id', 'customerId', 'reference', 'totalBasePrice', 'saleDate', 'saleTime', 'createdAt', 'updatedAt'],
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
    }).catch(err => {
      res.status(500).send({
        message: err.errors || 'Algún error ha surgido al recuperar los datos.'
      })
    })
}

exports.findOne = (req, res) => {
  const id = req.params.id

  Sale.findByPk(id).then(data => {
    if (data) {
      res.status(200).send(data)
    } else {
      res.status(404).send({
        message: `No se puede encontrar el elemento con la id=${id}.`
      })
    }
  }).catch(_ => {
    res.status(500).send({
      message: 'Algún error ha surgido al recuperar la id=' + id
    })
  })
}
exports.getLastReference = async (req, res) => {
  try {
    const lastSale = await Sale.findOne({
      order: [['reference', 'DESC']],
      attributes: ['reference']
    })
    const lastReference = lastSale ? lastSale.reference : 0
    res.status(200).send({ lastReference })
  } catch (err) {
    res.status(500).send({
      message: 'Error al obtener la última referencia.'
    })
  }
}
