const express = require('express')
const fs = require('fs')
const https = require('https')
const cors = require('cors')
const IORedis = require('ioredis')
const RedisStore = require('connect-redis').default
const app = express()

const redisClient = new IORedis(process.env.REDIS_URL)
const subscriberClient = new IORedis(process.env.REDIS_URL)
const eventsPath = './src/events/'

fs.readdirSync(eventsPath).forEach(function (file) {
  require(eventsPath + file).handleEvent(redisClient, subscriberClient)
})

app.use(cors({ origin: ['localhost:8080'], credentials: true }))
app.use(express.json({ limit: '10mb', extended: true }))

const key = fs.readFileSync('../certs/key_decrypted.pem')
const cert = fs.readFileSync('../certs/certificate.pem')

const credentials = {
  key,
  cert
}
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "frame-ancestors 'self' https://pay.google.com https://dev-pedidos.com")
  req.redisClient = redisClient
  next()
})

fs.readdirSync('./src/routes/').forEach(file => {
  require(`./src/routes/${file}`)(app)
})

https.createServer(credentials, app).listen(8080, () => {
  console.log('Servidor HTTPS corriendo en https://localhost:8080')
})
