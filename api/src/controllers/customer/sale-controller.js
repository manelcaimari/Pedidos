const sequelizeDb = require('../../models')
const Sale = sequelizeDb.Sale
const SaleDetail = sequelizeDb.SaleDetail
const Op = sequelizeDb.Sequelize.Op
const Customer = sequelizeDb.Customer

exports.create = async (req, res) => {
  try {
    const items = req.body.items || []
    const { customerId } = req.body

    const customer = await Customer.findByPk(customerId)
    if (!customer) {
      return res.status(404).send({ message: `Cliente no encontrado con id=${customerId}` })
    }

    if (!customer.id) {
      return res.status(400).send({ message: 'Cliente no tiene un ID válido.' })
    }
    const totalBasePrice = items.reduce((acc, item) => acc + item.basePrice * item.quantity, 0).toFixed(2)

    const now = new Date()
    const formattedDate = now.toISOString().split('T')[0].replace(/-/g, '')
    const formattedTime = now.toTimeString().split(' ')[0].replace(/:/g, '')

    const newReference = `${formattedDate}${formattedTime}`

    const saleDate = now.toISOString().split('T')[0]
    const saleTime = now.toISOString().split('T')[1].split('.')[0]

    const newSaleData = {
      customerId,
      reference: newReference,
      totalBasePrice,
      saleDate,
      saleTime
    }

    const sale = await Sale.create(newSaleData)

    const saleDetails = items.map(item => ({
      saleId: sale.id,
      productId: item.productId,
      priceId: item.priceId,
      quantity: item.quantity,
      basePrice: item.basePrice,
      productName: item.productName
    }))

    await SaleDetail.bulkCreate(saleDetails)

    const data = {
      customerId,
      email: customer.email,
      customerName: customer.name,
      reference: sale.reference,
      totalBasePrice: sale.totalBasePrice,
      saleDate: sale.saleDate,
      saleTime: sale.saleTime,
      saleDetails
    }

    data.id = data.customerId

    req.redisClient.publish('new-sale', JSON.stringify(data))
    res.render('venta-completa', { data })
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
