const movilService = require('../app/services/movilService.js');
const Movil = require('../app/models/movil');

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

async function saveMoviles(){
    let moviles = JSON.parse(fs.readFileSync('./test/resources/moviles.json', 'utf8'));
    await asyncForEach(moviles, async (movil) => {
        const mo = new Movil(movil);
        await mo.save();
    });
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
            saveMoviles().then(() => done());
            //done();
        });
    });

    after(() => {
        Movil.remove({}, function (err) {
            console.log('collection removed');
            mongoose.disconnect();
            mongoServer.stop();
        });
    });

    describe('Create Movil', function() {

        it('Create', async function() {
            const movil = {
                patente: "AAA123",
                nombre: "Test",
                peso:20
            };

            await movilService.createMovil(movil);
            const result = await Movil.findOne({patente: "AAA123"});

            expect(result.patente).to.be.equal("AAA123");
            expect(result.nombre).to.be.equal('Test');
            expect(result.peso).to.be.equal(20);
        });
    });

    describe('Update Movil', function() {

        it('Update', async function() {

            const movilToUpdate = await Movil.findOne({patente: "aaa975"});

            const movil = {
                patente: "aaa975",
                nombre: "Testing",
                peso: 65
            };

            await movilService.updateMovil(movilToUpdate._id.toString(), movil);
            const result = await Movil.findOne({patente: "aaa975"});

            expect(result.patente).to.be.equal("aaa975");
            expect(result.nombre).to.be.equal('Testing');
            expect(result.peso).to.be.equal(65);
        });
    });

});