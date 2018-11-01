const express = require('express');
const router = express.Router();
const userService = require('../services/userService.js');
const orderService = require('../services/orderService.js');

router.post('/', async function (req, res, next) {
    try{
        console.log("Crear usuario");
        await userService.createUser(req.body);
        res.sendStatus(200);
    }catch (e) {
        if(e.name === 'ValidationError' || e.message === "400")
            res.status(400).send("user not valid or already exist (" + e.message + ")");
        next(e);
    }
});

router.post('/login', async function (req, res, next) {
    try{
        const userId = await userService.loginUser(req.body);
        if(userId == null)
            res.status(404).send("user not found");

        console.log("agregando session");
        req.session.userId = userId;
        res.send(userId);

    }catch (e) {
        next(e);
    }
});

router.get('/:userId/orders', async function(req, res, next){
    try{
        console.log(JSON.stringify(req.headers));
        console.log("obteniendo ordenes para usuario");
        const userId = req.params.userId;
        if(userId === req.headers['x-user']){
            const result = await orderService.getOrders(null,userId);
            res.send(result);
        }else{
            res.status(403).send("Permission Denied");
        }
    }catch (e) {
        next();
    }

});


module.exports = router;