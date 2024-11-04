const sequelizeDb = require('../../models')
const Return = sequelizeDb.Return
const ReturnDetail = sequelizeDb.ReturnDetail
const Op = sequelizeDb.Sequelize.Op

exports.create = async (req, res) => {
  const t = await sequelizeDb.sequelize.transaction()

  try {
    const { saleId, customerId, reference, totalBasePrice, returnDetails } = req.body

    if (!saleId || !customerId || !reference || totalBasePrice === undefined || !Array.isArray(returnDetails) || returnDetails.length === 0) {
      return res.status(400).json({ message: 'Faltan datos requeridos para procesar la devolución.' })
    }

    const newReturn = await Return.create({
      saleId,
      customerId,
      reference,
      totalBasePrice,
      returnDate: new Date().toISOString().split('T')[0],
      returnTime: new Date().toLocaleTimeString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, { transaction: t })

    const returnDetailsToCreate = returnDetails.map(detail => {
      if (!detail.saleDetailId) {
        throw new Error(`El campo saleDetailId es obligatorio para el producto ${detail.productName}`)
      }

      return {
        returnId: newReturn.id,
        productName: detail.productName,
        productId: detail.productId,
        priceId: detail.priceId,
        quantity: detail.quantity,
        saledetailId: detail.saleDetailId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    })

    await ReturnDetail.bulkCreate(returnDetailsToCreate, { transaction: t })

    await t.commit()

    res.status(201).json({
      message: 'Devolución creada correctamente.',
      data: newReturn
    })
  } catch (error) {
    await t.rollback()
    res.status(500).json({ message: 'Error procesando la devolución.', details: error.message })
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

  Return.findAndCountAll({
    where: condition,
    attributes: ['id', 'saleId', 'customerId', 'reference', 'totalBasePrice', 'returnDate', 'returnTime', 'createdAt', 'updatedAt'],
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

  Return.findByPk(id)
    .then(data => {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(404).send({
          message: `No se puede encontrar la devolución con la id=${id}.`
        })
      }
    })
    .catch(_ => {
      res.status(500).send({
        message: 'Algún error ha surgido al recuperar la id=' + id
      })
    })
}
