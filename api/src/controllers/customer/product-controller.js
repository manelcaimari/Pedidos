const sequelizeDb = require('../../models')
const Product = sequelizeDb.Product
const Price = sequelizeDb.Price
const Op = sequelizeDb.Sequelize.Op

exports.findAllForCustomer = (req, res) => {
  const page = req.query.page || 1
  const limit = parseInt(req.query.size) || 10
  const offset = (page - 1) * limit
  const whereStatement = {}

  for (const key in req.query) {
    if (req.query[key] && key !== 'page' && key !== 'size') {
      whereStatement[key] = { [Op.substring]: req.query[key] }
    }
  }

  Product.findAndCountAll({
    where: Object.keys(whereStatement).length > 0 ? { [Op.and]: [whereStatement] } : {},
    attributes: ['id', 'name', 'reference', 'units', 'measurementUnit', 'measurement', 'visible'],
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: Price,
        as: 'prices',
        where: { current: true },
        attributes: ['basePrice']
      }
    ]
  }).then(result => {
    const products = result.rows.map(product => {
      return {
        id: product.id,
        name: product.name,
        reference: product.reference,
        units: product.units,
        measurementUnit: product.measurementUnit,
        measurement: product.measurement,
        basePrice: product.prices[0].basePrice
      }
    })

    res.status(200).send({
      products,
      meta: {
        total: result.count,
        pages: Math.ceil(result.count / limit),
        currentPage: page,
        size: limit
      }
    })
  }).catch(err => {
    console.log(err)
    res.status(500).send({
      message: err.errors || 'Algún error ha surgido al recuperar los datos.'
    })
  })
}
