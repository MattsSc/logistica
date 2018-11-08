const express = require('express');
const router = express.Router();
const logic = require('./logic/userLogic.js');

router.post('/', logic.createUser);

router.get('/', logic.getUsers);

router.get('/:userId', logic.getUser);

router.put('/:userId', logic.updateUser);

router.post('/login', logic.loginUser);

router.get('/:userId/orders', logic.getOrdersByUser);

module.exports = router;