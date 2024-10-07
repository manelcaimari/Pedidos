const sequelizeDb = require('../../models')
const SaleDetail = sequelizeDb.SaleDetail

exports.create = async (req, res) => {
  console.log('Datos recibidos:', req.body)
  try {
    const { saleId, productId, priceId, productName, basePrice, quantity } = req.body

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
    console.log('Detalle de venta creado:', saleDetail)

    res.status(201).send(saleDetail)
  } catch (err) {
    console.error('Error al crear el detalle de la venta:', err)

    if (err.errors) {
      res.status(422).send({
        message: err.errors
      })
    } else {
      res.status(500).send({
        message: 'Algún error ha surgido al insertar el dato del detalle de venta.'
      })
    }
  }
}
