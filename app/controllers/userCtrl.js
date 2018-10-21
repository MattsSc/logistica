const express = require('express');
const router = express.Router();

const service = require('../services/userService.js');
const validator = require('../../utils/validators.js');

router.post('/', async function (req, res) {
    try{
        const user = req.body;

        if(validator.validateUser(user)){
            console.log("Crear usuario");
            await service.createUser(user);
            res.sendStatus(201);
        }else{
            res.status(400).send("user not valid");
        }
    }catch (e) {
        console.log(e.message);
        if(e.message === "400")
            res.status(400).send("user not valid or already exist");
        res.sendStatus(500);
    }
});

router.post('/login', async function (req, res) {
    try{
        const userId = await service.loginUser(req.body);
        if(userId == null)
            res.status(404).send("user not found");

        console.log("agregando session");
        req.session.userId = userId;
        res.send(userId);

    }catch (e) {
        console.log("Hubo un error validando usuario : " + e.toString());
        res.sendStatus(500);
    }
});

module.exports = router;