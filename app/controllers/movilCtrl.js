const express = require('express');
const router = express.Router();
const logic = require('./logic/movilLogic.js');

router.post('/', logic.createMovil);

router.get('/', logic.getMoviles);

router.get('/:movilId', logic.getMovilById);

router.put('/:movilId', logic.updateMovil);

router.delete('/:movilId', logic.deleteMovil);

module.exports = router;