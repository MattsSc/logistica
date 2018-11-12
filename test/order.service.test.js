const orderService = require('../app/services/orderService.js');
const Order = require('../app/models/order');
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
    await asyncForEach(orders, async (order) => {
        const or = new Order(order);
        await or.save();
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
    };

    const user = new User(userSave);
    await user.save();

    const u = await User.findOne({email: "carlos@uade.com"});

    return u._id;
}

describe('Orders', function() {
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
            console.log('collection removed');
            mongoose.disconnect();
            mongoServer.stop();
        });
    });

    describe('Get Orders by status', function() {

        it('Check mapping response', async function() {
            const result = await orderService.getOrders('DELIVERED', null);

            expect(result.length).to.be.equal(2);
            expect(result[0].origen.id).to.be.equal('user2');
            expect(result[1].origen.id).to.be.equal('user1');
        });
    });

    describe('Get Order by Id', async function() {
        it('Get Order By Id 5', async function() {
            const result = await orderService.getOrderById(5);

            expect(result.orden_id).to.be.equal(5);
            expect(result.estado).to.be.equal('COMPLETED');
            expect(result.peso_total).to.be.equal(10);
            expect(result.origen.id).to.be.equal('user1');
        });
    });

    describe('Update Orders', function() {
        it('Actualiza orden a DELIVERED que no tiene queja', async function() {
            mock.mock(orderService, 'mandarMail').returnWith(true);
            mock.mock(orderService, 'notificarReclamos').returnWith(true);

            const orden = {
                estado:"DELIVERED"
            };

            await orderService.updateOrder(3, orden);
            const ordenUpdated = await orderService.getOrderById(3);

            expect(ordenUpdated.orden_id).to.be.equal(3);
            expect(ordenUpdated.estado).to.be.equal('DELIVERED');
            expect(ordenUpdated.queja).to.be.equal(false);
            expect(orderService.mandarMail.callCount).to.be.equal(1);
            expect(orderService.notificarReclamos.callCount).to.be.equal(0);
        });

        it('Actualiza orden a DELIVERED que tiene queja', async function() {
            mock.mock(orderService, 'mandarMail').returnWith(true);
            mock.mock(orderService, 'notificarReclamos').returnWith(true);

            const orden = {
                estado:"DELIVERED"
            };

            await orderService.updateOrder(2, orden);
            const ordenUpdated = await orderService.getOrderById(2);

            expect(ordenUpdated.orden_id).to.be.equal(2);
            expect(ordenUpdated.estado).to.be.equal('DELIVERED');
            expect(ordenUpdated.queja).to.be.equal(true);
            expect(orderService.mandarMail.callCount).to.be.equal(0);
            expect(orderService.notificarReclamos.callCount).to.be.equal(1);
        });

        it('Actualiza una orden NEW y cambia datos cliente', async function() {
            mock.mock(orderService, 'mandarMail').returnWith(true);

            const orden = {
                estado:"NEW",
                cliente: {
                    nombre:"Maria",
                    apellido  : "Marta",
                    email: "maria@marta.com",
                    direccion: "La rioja"
                }
            };

            await orderService.updateOrder(1, orden);
            const ordenUpdated = await orderService.getOrderById(1);

            expect(ordenUpdated.orden_id).to.be.equal(1);
            expect(ordenUpdated.estado).to.be.equal('NEW');
            expect(ordenUpdated.cliente.nombre).to.be.equal('Maria');
            expect(ordenUpdated.cliente.apellido).to.be.equal('Marta');
            expect(ordenUpdated.cliente.email).to.be.equal('maria@marta.com');
            expect(ordenUpdated.cliente.direccion).to.be.equal('La rioja');
            expect(orderService.mandarMail.callCount).to.be.equal(0);
        });
    });

    describe('Notifiy Orders', function() {
        it('Notificar queja', async function() {

            await orderService.informComplain(5);

            const order = await orderService.getOrderById(5);

            expect(order.orden_id).to.be.equal(5);
            expect(order.queja).to.be.equal(true);

        });
    });

    describe('Create Orders', function() {
        it('Crear orden sin usuario', async function() {

            const orden = {
                peso_total: 1,
                cliente:{
                    nombre:"Test",
                    apellido: "test2",
                    email: "test@test.com",
                    direccion: "test 123"
                }
            };

            await orderService.createOrder(orden, null);

            const result = await Order.findOne({peso_total: 1});

            console.log(JSON.stringify(result));
            expect(result.orden_id).to.not.be.null;
            expect(result.fecha_recibido).to.not.be.null;
            expect(result.origen.id).to.be.undefined;
            expect(result.queja).to.be.false;
            expect(result.estado).to.be.equal('NEW');

        });


        it('Crear orden con usuario', async function() {

            const orden = {
                peso_total: 2,
                cliente:{
                    nombre:"Test",
                    apellido: "test2",
                    email: "test@test.com",
                    direccion: "test 123"
                }
            };

            const userId = await createUser();
            await orderService.createOrder(orden, userId);
            const result = await Order.findOne({peso_total: 2});

            expect(result.orden_id).to.not.be.null;
            expect(result.fecha_recibido).to.not.be.null;
            expect(result.origen.id).to.be.equal(userId.toString());
            expect(result.origen.nombre).to.be.equal('carlos alberto');
            expect(result.origen.direccion).to.be.equal("dasjdasjda");
            expect(result.queja).to.be.false;
            expect(result.estado).to.be.equal('NEW');

        });
    });

    describe('Delete Orders', function() {
        it('Elimina orden en estando NEW', async function() {

            await orderService.deleteOrder(1);

            //expect(await orderService.getOrderById(1)).to.throw(new Error('404'));

        });

        it('Elimina orden en estado ON_WAY y no te deja', async function() {
            //expect(await orderService.deleteOrder(2)).to.throw(new Error('400'));
        });

    });
});