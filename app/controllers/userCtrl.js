const express = require('express');
const router = express.Router();
const service = require('../services/userService.js');

router.post('/', async function (req, res, next) {
    try{
        console.log("Crear usuario");
        await service.createUser(req.body);
        res.sendStatus(200);
    }catch (e) {
        if(e.name === 'ValidationError' || e.message === "400")
            res.status(400).send("user not valid or already exist (" + e.message + ")");
        next(e);
    }
});

router.post('/login', async function (req, res, next) {
    try{
        const userId = await service.loginUser(req.body);
        if(userId == null)
            res.status(404).send("user not found");

        console.log("agregando session");
        req.session.userId = userId;
        res.send(userId);

    }catch (e) {
        next(e);
    }
});


module.exports = router;