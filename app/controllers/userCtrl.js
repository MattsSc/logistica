const express = require('express');
const router = express.Router();

const service = require('../services/userService.js');

router.post('/login', async function (req, res) {
    try{
        const userId = await service.loginUser(req.body);
        if(user == null)
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