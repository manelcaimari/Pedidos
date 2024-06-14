module.exports = (app) => {
  
    const router = require('express').Router()

    router.get('/', (req, res) => {
        console.log("Parámetros")
        console.log(req.params)

        console.log("Query")
        console.log(req.query)

    res.send('GET request to the homepage')
    })

    router.get('/:id', (req, res) => {

        console.log("Parámetros id , soy yo")
        console.log(req.params.id)

        console.log("Query")
        console.log(req.query)


    res.send('GET request to the homepage')
    })

    router.put('/:id', (req, res) => {
        console.log(req.params.id)
        console.log(req.body)


        res.send('PUT request to the homepage')
    })

    app.use('/api/admin/users', router)
}