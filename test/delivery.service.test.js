const assert = require('assert');
const deliveryService = require('../app/services/deliveryService.js');
const orderService = require('../app/services/orderService.js');
const simple = require('simple-mock');
const fs = require('fs');


describe('Delivery', function() {

    it('Crear hoja de ruta de 2 moviles con 1 orden cada uno,ver que la de ayer se asigna primero', async function() {
        let orders = JSON.parse(fs.readFileSync('./test/resources/2_orders_to_deliver.json', 'utf8'));

        const moviles = [
            {
                "patente": "aaa975",
                "nombre": "Lesa Russell",
                "peso": 15
            },
            {
                "patente": "aaa622",
                "nombre": "Bethany Pennington",
                "peso": 20
            }
        ];

        const oldOrden = [{
            "orden_id": 200,
            "estado":"NEW",
            "cliente": {
                "nombre": "Soy viejo",
                "direccion": "Calle falsa 123",
                "dni": 37683370,
                "email": "user@user.com"
            },
            "peso_total": 14,
        }];

        simple.mock(orderService,'getOrdersByStatus').returnWith(oldOrden);
        simple.mock(deliveryService,'guardarOrdenNueva').returnWith(true);
        simple.mock(deliveryService, 'guardarOrdenParaEntrega').returnWith(true);
        simple.mock(deliveryService, 'getAllMoviles').returnWith(moviles);

        const result = await deliveryService.createDeliveryOrders(orders);

        assert.equal(result.length, 2);

        assert.equal(result[0].ordenes[0].orden_id, 200);
        assert.equal(result[0].ordenes[0].nombre, 'Soy viejo');
        assert.equal(result[0].ordenes[0].direccion, "Calle falsa 123");

        assert.equal(result[1].ordenes[0].orden_id, 0);
        assert.equal(result[1].ordenes[0].nombre, 'Nadia Gross');
        assert.equal(result[1].ordenes[0].direccion, "846 Temple Court, Shaft, Maine, 5302");

        assert.equal(deliveryService.guardarOrdenParaEntrega.callCount, 2);
    });

    it('Crear hoja de ruta de 2 moviles con 1 orden cada uno', async function() {
        let orders = JSON.parse(fs.readFileSync('./test/resources/2_orders_to_deliver.json', 'utf8'));

        const moviles = [
            {
                "patente": "aaa975",
                "nombre": "Lesa Russell",
                "peso": 15
            },
            {
                "patente": "aaa622",
                "nombre": "Bethany Pennington",
                "peso": 20
            }
            ];

        simple.mock(orderService,'getOrdersByStatus').returnWith([]);
        simple.mock(deliveryService,'guardarOrdenNueva').returnWith(true);
        simple.mock(deliveryService, 'guardarOrdenParaEntrega').returnWith(true);
        simple.mock(deliveryService, 'getAllMoviles').returnWith(moviles);

        const result = await deliveryService.createDeliveryOrders(orders);

        assert.equal(result.length, 2);

        assert.equal(result[0].ordenes[0].orden_id, 0);
        assert.equal(result[0].ordenes[0].nombre, 'Nadia Gross');
        assert.equal(result[0].ordenes[0].direccion, "846 Temple Court, Shaft, Maine, 5302");

        assert.equal(result[1].ordenes[0].orden_id, 1);
        assert.equal(result[1].ordenes[0].nombre, "Jeri Nguyen");
        assert.equal(result[1].ordenes[0].direccion, "832 Kingsway Place, Lynn, Guam, 9293");

        assert.equal(deliveryService.guardarOrdenParaEntrega.callCount, 2);
    });

    it('Crear hoja de ruta de 2 moviles con 1 orden cada uno y una se guarda para mañana', async function() {
        let orders = JSON.parse(fs.readFileSync('./test/resources/3_orders_to_deliver.json', 'utf8'));

        const moviles = [
            {
                "patente": "aaa975",
                "nombre": "Lesa Russell",
                "peso": 15
            },
            {
                "patente": "aaa622",
                "nombre": "Bethany Pennington",
                "peso": 20
            }
        ];

        simple.mock(orderService,'getOrdersByStatus').returnWith([]);
        simple.mock(deliveryService,'guardarOrdenNueva').returnWith(true);
        simple.mock(deliveryService, 'guardarOrdenParaEntrega').returnWith(true);
        simple.mock(deliveryService, 'getAllMoviles').returnWith(moviles);

        const result = await deliveryService.createDeliveryOrders(orders);

        assert.equal(result.length, 2);

        assert.equal(result[0].ordenes[0].orden_id, 0);
        assert.equal(result[0].ordenes[0].nombre, 'Nadia Gross');
        assert.equal(result[0].ordenes[0].direccion, "846 Temple Court, Shaft, Maine, 5302");

        assert.equal(result[1].ordenes[0].orden_id, 1);
        assert.equal(result[1].ordenes[0].nombre, "Jeri Nguyen");
        assert.equal(result[1].ordenes[0].direccion, "832 Kingsway Place, Lynn, Guam, 9293");

        assert.equal(deliveryService.guardarOrdenParaEntrega.callCount, 2);
        assert.equal(deliveryService.guardarOrdenNueva.callCount, 1);
    });

});