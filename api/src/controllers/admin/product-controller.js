const sequelizeDb = require('../../models')
const Product = sequelizeDb.Product
const Price = sequelizeDb.Price
const Op = sequelizeDb.Sequelize.Op

exports.create = (req, res) => {
  console.log(req.body)
  Product.create(req.body).then(async product => {
    await Price.create({
      productId: product.id,
      basePrice: req.body.basePrice,
      current: 1
    })

    res.status(200).send(product)
  }).catch(err => {
    console.log(err)
    res.status(err.errors ? 422 : 500).send({
      message: err.errors || 'Algún error ha surgido al insertar el dato.'
    })
  })
}

exports.findAll = (req, res) => {
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
    attributes: ['id', 'productCategoryId', 'name', 'reference', 'units', 'measurementUnit', 'measurement', 'visible', 'createdAt', 'updatedAt'],
    limit,
    offset,
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: sequelizeDb.ProductCategory,
        as: 'productCategory',
        attributes: ['id', 'name']
      }
    ]
  }).then(result => {
    result.meta = {
      total: result.count,
      pages: Math.ceil(result.count / limit),
      currentPage: page,
      size: limit
    }
    res.status(200).send(result)
  }).catch(err => {
    console.log(err)
    res.status(500).send({
      message: err.errors || 'Algún error ha surgido al recuperar los datos.'
    })
  })
}

exports.findOne = (req, res) => {
  const id = req.params.id

  Product.findByPk(id, {
    include: [
      {
        model: Price,
        as: 'prices',
        where: { current: true },
        attributes: ['basePrice']
      }
    ]
  }).then(data => {
    if (data) {
      data.dataValues.basePrice = data.prices[0].dataValues.basePrice
      res.status(200).send(data)
    } else {
      res.status(404).send({
        message: `No se puede encontrar el elemento con la id=${id}.`
      })
    }
  }).catch(err => {
    console.log(err)
    res.status(500).send({
      message: 'Algún error ha surgido al recuperar la id=' + id
    })
  })
}

exports.update = (req, res) => {
  const id = req.params.id

  Product.update(req.body, { where: { id } }).then(async ([rowsAffected]) => {
    if (rowsAffected === 1) {
      await Price.update({ current: false }, { where: { productId: id, current: true } })

      await Price.create({
        productId: id,
        basePrice: req.body.basePrice,
        current: 1
      })

      res.status(200).send({
        message: 'El elemento ha sido actualizado correctamente.'
      })
    } else {
      res.status(404).send({
        message: `No se puede actualizar el elemento con la id=${id}.`
      })
    }
  }).catch(err => {
    console.log(err)
    res.status(500).send({
      message: 'Algún error ha surgido al actualizar la id=' + id
    })
  })
}

exports.delete = (req, res) => {
  const id = req.params.id

  Product.destroy({ where: { id } }).then(rowsAffected => {
    if (rowsAffected === 1) {
      res.status(200).send({
        message: 'El elemento ha sido borrado correctamente'
      })
    } else {
      res.status(404).send({
        message: `No se puede borrar el elemento con la id=${id}.`
      })
    }
  }).catch(err => {
    console.log(err)
    res.status(500).send({
      message: 'Algún error ha surgido al borrar la id=' + id
    })
  })
}
