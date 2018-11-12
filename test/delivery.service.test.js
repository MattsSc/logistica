const deliveryService = require('../app/services/deliveryService.js');
const Order = require('../app/models/order');
const Movil = require('../app/models/movil');
const User = require('../app/models/user');

const mongoose = require('mongoose');
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;

const expect = require('chai').expect;
const mock = require('simple-mock');
const fs = require('fs');

let mongoServer;

async function asyncForEach(array, callback) {
    for(let index = 0; index < array.length; index ++){
        await callback(array[index], index, array);
    }
}

async function saveOrders(){
    let orders = JSON.parse(fs.readFileSync('./test/resources/ordenes.json', 'utf8'));
    let moviles = JSON.parse(fs.readFileSync('./test/resources/moviles.json', 'utf8'));
    await asyncForEach(orders, async (order) => {
        const or = new Order(order);
        await or.save();
    });
    await asyncForEach(moviles, async (movil) => {
        const mo = new Movil(movil);
        await mo.save();
    });
}

async function createUser (){
    const userSave = {
        email: "carlos@uade.com",
        nombre: "carlos alberto",
        dni: 23232323,
        direccion: "dasjdasjda",
        localidad: "sadhak",
        password: "12345",
        prefix_file: 'ordenes'
    };

    const user = new User(userSave);
    await user.save();
}

describe('Delivery', function() {
    this.timeout(60000);

    before((done) => {
        mongoServer = new MongoMemoryServer();
        mongoServer.getConnectionString().then((mongoUri) => {
            return mongoose.connect(mongoUri, {}, (err) => {
                if (err) done(err);
            });
        }).then(() => {
            saveOrders().then(() => done());
            //done();
        });
    });

    after(() => {
        Order.remove({}, function(err) {
            Movil.remove({}, function(err){
                console.log('collection removed');
                mongoose.disconnect();
                mongoServer.stop();
            });
        });
    });


    it('Obtener ordenes entregadas', async function() {
        mock.mock(deliveryService, 'saveFileInFTP').returnWith(true);
        const result = await deliveryService.getDeliveredOrders();

        expect(result.length).to.be.equal(2);
        expect(result[0].ordenId).to.be.equal(0);
        expect(result[1].ordenId).to.be.equal(2);
        expect(deliveryService.saveFileInFTP.callCount).to.be.equal(1);

    });

    it('Crear hoja de ruta', async function() {
        mock.mock(deliveryService, 'getFileFromFTP').returnWith([
            {
                "orden_id": 10000,
                "cliente": {
                    "nombre": "Nadia",
                    "apellido": "Gross",
                    "direccion": "846 Temple Court, Shaft, Maine, 5302",
                    "dni": 37683370,
                    "email": "user@user.com"
                },
                "peso_total": 14
            },
            {
                "orden_id":10001,
                "cliente": {
                    "nombre": "Nadia",
                    "apellido": "Gross",
                    "direccion": "846 Temple Court, Shaft, Maine, 5302",
                    "dni": 37683370,
                    "email": "user@user.com"
                },
                "peso_total": 14
            }
        ]);

        await createUser();
        const result = await deliveryService.getFtpOrdersAndCreateDeliveryOrders('ordenes');

        console.log(JSON.stringify(result));

        expect(result.length).to.be.equal(6);
        expect(result[0].ordenes.length).to.be.equal(4);
        result[0].ordenes.forEach(ord =>{
            expect(ord.origen).to.be.not.undefined;
        })
    });

});