const express = require('express')
const fs = require('fs')
const https = require('https')
const cors = require('cors')

const app = express()

app.use(cors({ origin: ['localhost:8080'], credentials: true }))
app.use(express.json({ limit: '10mb', extended: true }))

const key = fs.readFileSync('../certs/key_decrypted.pem')
const cert = fs.readFileSync('../certs/certificate.pem')

const credentials = {
  key,
  cert
}
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "frame-ancestors 'self' https://pay.google.com https://dev-pedidos.com")
  next()
})

fs.readdirSync('./src/routes/').forEach(file => {
  require(`./src/routes/${file}`)(app)
})

https.createServer(credentials, app).listen(8080, () => {
  console.log('Servidor HTTPS corriendo en https://localhost:8080')
})
