const sequelizeDb = require('../../models')
const SaleDetail = sequelizeDb.SaleDetail

exports.create = async (req, res) => {
  try {
    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).send({
        message: 'Se requieren detalles de venta.'
      })
    }
    const saleDetails = []
    for (const detail of req.body) {
      const { saleId, productId, priceId, productName, basePrice, quantity } = detail

      if (!saleId || !productId || !priceId || !quantity) {
        return res.status(400).send({
          message: 'Faltan campos requeridos para crear un detalle de venta.'
        })
      }
      const saleDetailData = {
        saleId,
        productId,
        priceId,
        productName,
        basePrice: parseFloat(basePrice),
        quantity
      }
      const saleDetail = await SaleDetail.create(saleDetailData)
      saleDetails.push(saleDetail)
    }
    console.log('Detalles de venta creados:', saleDetails)
    res.status(201).send(saleDetails)
  } catch (err) {
    console.error('Error al crear el detalle de la venta:', err)
    if (err.errors) {
      res.status(422).send({
        message: err.errors
      })
    } else {
      res.status(500).send({
        message: 'Algún error ha surgido al insertar los datos del detalle de venta.'
      })
    }
  }
}
